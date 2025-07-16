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
import { Loader2, CheckCircle, XCircle, Target, Sparkles } from "lucide-react";
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

  const isCorrect = citation === form.getValues("citation");
  const successMessages = [
    "Perfect Citation! 🎯", 
    "Nailed it! 🎉", 
    "You&apos;re a Citation Pro! 🌟", 
    "Flawless Work! 💫", 
    "Citation Perfection! 🏆",
    "Absolutely Brilliant! ✨",
    "Citation Master! 👑"
  ];
  const errorMessages = [
    "Incorrect! ❌", 
    "Not Quite! 😕", 
    "That&apos;s Not It! 🤔", 
    "Wrong Format! 📝",
    "Almost There! 🔄",
    "Try Again Tomorrow! 📚"
  ];

  return citation != "" ? (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </div>
          <CardTitle className={`text-xl md:text-2xl ${isCorrect ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'}`}>
            {isCorrect 
              ? successMessages[Math.floor(Math.random() * successMessages.length)]
              : errorMessages[Math.floor(Math.random() * errorMessages.length)]
            }
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {isCorrect ? (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">
              Keep it up! You&apos;re doing great! 👑
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <Target className="w-5 h-5 text-red-400" />
            <span className="text-red-300 font-medium">
              You can try again tomorrow at 12:00 AM.
            </span>
          </div>
        )}
        <hr className="border-gray-700" />
        <div className={`${jetbrainsMono.className} whitespace-pre-wrap text-base leading-relaxed p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm`}>
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
                    part.added ? "bg-emerald-500/20 text-emerald-400 px-0.5 rounded border border-emerald-800/50" :
                      part.removed ? "bg-red-500/20 text-red-400 px-0.5 rounded border border-red-800/50" :
                        "text-gray-300"
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
            <span className="w-3 h-3 rounded bg-red-500/20 border border-red-800/50"></span>
            <span className="text-gray-400">Removed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-800/50"></span>
            <span className="text-gray-400">Added</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg">
        <Target className="w-5 h-5 text-orange-400" />
        <div>
          <h3 className="font-semibold text-orange-300">Today&apos;s Challenge</h3>
          <p className="text-sm text-gray-300">Format the citation in APA style. Pay attention to punctuation, spacing, and italics!</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="citation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Textarea 
                      disabled={isLoading || isCompleted} 
                      placeholder={isCompleted ? "You&apos;ve already completed today&apos;s citation" : "Enter your citation here"} 
                      {...field} 
                      className={`resize-none h-44 md:h-40 text-base lg:text-lg bg-gray-800/50 border-gray-700/50 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-200 ${isCompleted ? 'opacity-50' : 'hover:border-gray-600/50'}`} 
                    />
                    {isCompleted && (
                      <div className="absolute inset-0 bg-green-500/10 border border-green-500/20 rounded-md flex items-center justify-center">
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Completed Today</span>
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="text-sm lg:text-base pt-2 text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Use *italics* for italics. Match case of the original citation.
                  </div>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full text-base bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
            size="lg" 
            disabled={isLoading || isCompleted}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                Checking Citation...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Target className="size-5" />
                Submit Citation
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
