'use client';

import { useState } from "react"

import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { getAPAFormatted } from "@/lib/actions/get_citation";
import { Loader2 } from "lucide-react";
import { diffChars } from "diff";
import { JetBrains_Mono } from "next/font/google";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useCompletedStore, useStreakStore } from "@/app/_stores/streak";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

const citationSchema = z.object({
  citation: z.string().min(1, { message: "Citation is required" }),
});

export default function CitationTextarea() {
  const form = useForm<z.infer<typeof citationSchema>>({
    resolver: zodResolver(citationSchema),
    defaultValues: {
      citation: "",
    },
  });

  const [isLoading, setLoading] = useState(false);
  const [citation, setAPACitation] = useState("");
  const streakStore = useStreakStore();
  const completedStore = useCompletedStore();

  const lastCompletedEST = new Date(completedStore.last_completed).toLocaleString("en-US", {
    timeZone: "America/New_York"
  });
  const nowEST = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York"
  });

  const isCompleted = new Date(lastCompletedEST).toDateString() === new Date(nowEST).toDateString();

  async function onSubmit(data: z.infer<typeof citationSchema>) {
    setLoading(true);
    const citation = await getAPAFormatted();

    setLoading(false);
    setAPACitation(citation);
    completedStore.setLastCompleted(new Date());

    if (citation === data.citation) {
      streakStore.incrementStreak();
    } else {
      streakStore.resetStreak();
    }
  }

  return citation != "" ? (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl md:text-2xl">
          {citation === form.getValues("citation")
            ? ["Perfect Citation! 🎯", "Nailed it! 🎉", "You're a Citation Pro! 🌟", "Flawless Work! 💫", "Citation Perfection! 🏆"][Math.floor(Math.random() * 5)]
            : ["Incorrect! ❌", "Not Quite! 😕", "That's Not It! 🤔", "Wrong Format! 📝"][Math.floor(Math.random() * 5)]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-2">
        {citation === form.getValues("citation") ? (
          <span>
            Keep it up! You&apos;re doing great! 👑
          </span>
        ) : (
          <span>
            You can try again tomorrow at 12:00 AM.
          </span>
        )}
        <hr className="mt-4" />
        <div className={`${jetbrainsMono.className} whitespace-pre-wrap text-base leading-relaxed p-4 bg-muted rounded border border-border`}>
          <div className="indent-[-40px] pl-[40px] break-all">
            {diffChars(form.getValues("citation").trim(), citation.trim()).map((part, i) => {
              const processItalics = (text: string) => {
                return text.split(/(\*[^*]+\*)/).map((segment, index) => {
                  if (segment.startsWith('*') && segment.endsWith('*')) {
                    return <em key={`italic-${index}`}>{segment.slice(1, -1)}</em>;
                  }
                  return segment;
                });
              };

              return (
                <span
                  key={i}
                  className={
                    part.added ? "bg-emerald-500/20 text-emerald-400 px-0.5 rounded border border-emerald-800" :
                      part.removed ? "bg-red-500/20 text-red-400 px-0.5 rounded border border-red-800" :
                        "text-muted-foreground"
                  }
                >
                  {processItalics(part.value)}
                </span>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-500/20 border border-red-800"></span>
            <span className="text-muted-foreground">Removed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-800"></span>
            <span className="text-muted-foreground">Added</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="citation"
          render={({ field }) => (
            <FormItem>
              <FormControl className="mt-4">
                <Textarea disabled={isLoading || isCompleted} placeholder={isCompleted ? "You've already completed today's citation" : "Enter your citation here"} {...field} className="resize-none h-44 md:h-40 text-base lg:text-lg" />
              </FormControl>
              <FormDescription className="text-sm lg:text-base pt-1">
                Use *italics* for italics. Match case of the original citation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-base" size="lg" disabled={isLoading || isCompleted}>Submit {isLoading ? <Loader2 className="size-6 animate-spin" /> : null}</Button>
      </form>
    </Form>
  );
}
