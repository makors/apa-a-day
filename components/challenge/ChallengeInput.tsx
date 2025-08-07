'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { getAPAFormatted } from "@/lib/actions/get_citation";
import { CheckCircle, Clock, Copy, Loader2, Sparkles, Target, XCircle } from "lucide-react";
import { diffChars } from "diff";
import { JetBrains_Mono } from "next/font/google";
import { useCompletedStore, useStreakStore } from "@/app/_stores/streak";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

const schema = z.object({ citation: z.string().min(1, { message: "Citation is required" }) });

type CitationInfo = {
  authors: string[];
  publishedYear: number;
  title: string;
  periodical: string;
  volume: string;
  issue: string;
  pageStart: string;
  pageEnd: string;
  doi: string | null;
};

function useCountdownEST(active: boolean) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      const nowEST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const nextMidnight = new Date(nowEST);
      nextMidnight.setHours(24, 0, 0, 0);
      const ms = nextMidnight.getTime() - nowEST.getTime();
      const h = Math.floor(ms / 3600000).toString().padStart(2,'0');
      const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2,'0');
      const s = Math.floor((ms % 60000) / 1000).toString().padStart(2,'0');
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(t);
  }, [active]);
  return timeLeft;
}

export default function ChallengeInput({ citation }: { citation: CitationInfo }) {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { citation: "" } });
  const [isLoading, setIsLoading] = useState(false);
  const [officialCitation, setOfficialCitation] = useState<string>("");
  const [showHints, setShowHints] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const streakStore = useStreakStore();
  const completedStore = useCompletedStore();

  const lastCompletedEST = new Date(completedStore.last_completed).toLocaleString("en-US", { timeZone: "America/New_York" });
  const nowEST = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const isCompleted = new Date(lastCompletedEST).toDateString() === new Date(nowEST).toDateString();
  const countdown = useCountdownEST(isCompleted);

  const successText = useMemo(() => [
    "Perfect Citation! 🎯",
    "Nailed it! 🎉",
    "You&apos;re a Citation Pro! 🌟",
    "Flawless Work! 💫",
    "Citation Perfection! 🏆",
    "Absolutely Brilliant! ✨",
    "Citation Master! 👑",
  ], []);

  const errorText = useMemo(() => [
    "Incorrect! ❌",
    "Not Quite! 😕",
    "That&apos;s Not It! 🤔",
    "Wrong Format! 📝",
    "Almost There! 🔄",
    "Try Again Tomorrow! 📚",
  ], []);

  async function fireConfetti(intensity: 'light' | 'full' = 'light') {
    try {
      const confetti = (await import('canvas-confetti')).default;
      const particleCount = intensity === 'full' ? 200 : 80;
      const spread = intensity === 'full' ? 90 : 60;
      confetti({ particleCount, spread, origin: { y: 0.6 } });
    } catch {}
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true);
    const apa = await getAPAFormatted();
    setIsLoading(false);
    setOfficialCitation(apa);
    completedStore.setLastCompleted(new Date());

    if (apa === values.citation) {
      const upcoming = [5, 10, 20, 30];
      const isMilestone = upcoming.includes(streakStore.streak + 1);
      streakStore.incrementStreak();
      fireConfetti(isMilestone ? 'full' : 'light');
    } else {
      streakStore.resetStreak();
    }
  }

  const userCitation = form.watch('citation');
  const charCount = userCitation.length;
  const isCorrect = officialCitation === userCitation;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && !isCompleted) form.handleSubmit(onSubmit)();
    }
  }

  async function copyText(text: string) {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  }

  return officialCitation ? (
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
          <CardTitle className={`text-xl md:text-2xl ${isCorrect ? 'bg-gradient-to-r from-gray-100 via-gray-300 to-green-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-100 via-gray-300 to-red-300 bg-clip-text text-transparent'}`}>
            {isCorrect ? successText[Math.floor(Math.random() * successText.length)] : errorText[Math.floor(Math.random() * errorText.length)]}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {isCorrect ? (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">Keep it up! You&apos;re doing great! 👑</span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">You can try again tomorrow at 12:00 AM.</span>
            </div>
            <span className="text-xs text-gray-400">Resets in {countdown}</span>
          </div>
        )}
        <hr className="border-gray-700" />
        <div className={`${jetbrainsMono.className} whitespace-pre-wrap text-base leading-relaxed p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm`}>
          <div className="indent-[-40px] pl-[40px] break-all">
            {diffChars(userCitation.trim(), officialCitation.trim()).map((part, i) => (
              <span
                key={i}
                className={part.added ? "bg-emerald-500/20 text-emerald-400 px-0.5 rounded border border-emerald-800/50" : part.removed ? "bg-red-500/20 text-red-400 px-0.5 rounded border border-red-800/50" : "text-gray-300"}
              >
                {part.value}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500/20 border border-red-800/50" /><span className="text-gray-400">Removed</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-800/50" /><span className="text-gray-400">Added</span></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => copyText(officialCitation)} className="bg-gray-800/70 border border-gray-700 text-gray-200 hover:bg-gray-800">
            <Copy className="w-4 h-4" /> Copy correct citation
          </Button>
        </div>
        {copied && <div className="text-xs text-green-300">Copied to clipboard</div>}
      </CardFooter>
    </Card>
  ) : (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-gray-100 via-gray-300 to-orange-300 bg-clip-text text-transparent">Format today&apos;s citation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="citation"
              render={({ field }) => {
                const { ref: fieldRef, ...rest } = field;
                return (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          ref={(el) => {
                            textareaRef.current = el;
                            if (typeof fieldRef === 'function') fieldRef(el);
                            else if (fieldRef && 'current' in (fieldRef as unknown as { current: unknown })) {
                              (fieldRef as unknown as { current: unknown }).current = el as unknown;
                            }
                          }}
                          disabled={isLoading || isCompleted}
                          placeholder={isCompleted ? "You&apos;ve already completed today&apos;s citation" : "Enter your citation here"}
                          {...rest}
                          onKeyDown={handleKeyDown}
                          className={`resize-none h-48 md:h-44 text-base lg:text-lg bg-gray-800/50 border-gray-700/50 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-200 ${isCompleted ? 'opacity-50' : 'hover:border-gray-600/50'}`}
                        />
                        {isCompleted && (
                          <div className="absolute inset-0 bg-green-500/10 border border-green-500/20 rounded-md flex items-center justify-center">
                            <div className="flex items-center gap-2 text-green-400"><CheckCircle className="w-5 h-5" /><span className="font-medium">Completed Today</span></div>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">{charCount} chars</div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm lg:text-base pt-2 text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-400 rounded-full" />
                        Use *italics* for italics. Match case. Press Ctrl/⌘+Enter to submit.
                      </div>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" className="flex-1 min-w-40 text-base bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" size="lg" disabled={isLoading || isCompleted}>
                {isLoading ? (<div className="flex items-center gap-2"><Loader2 className="size-5 animate-spin" /> Checking Citation...</div>) : (<div className="flex items-center gap-2"><Target className="size-5" /> Submit Citation</div>)}
              </Button>
              <Button type="button" variant="secondary" onClick={() => copyText(form.getValues('citation'))} disabled={isLoading || isCompleted} className="bg-gray-800/70 border border-gray-700 text-gray-200 hover:bg-gray-800">
                <Copy className="w-4 h-4" /> Copy
              </Button>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3">
              <button type="button" onClick={() => setShowHints(v => !v)} className="w-full text-left text-sm text-gray-300 hover:text-gray-200">
                {showHints ? 'Hide hints' : 'Need a hint?'}
              </button>
              {showHints && (
                <div className="mt-3 text-sm text-gray-300 space-y-2">
                  <div>- {citation.authors.length} author(s). Separate authors with commas; use & before the last author.</div>
                  <div>- Year: {citation.publishedYear}. Year goes in parentheses after authors.</div>
                  <div>- Journal title is italicized. Volume {citation.volume}({citation.issue}), pages {citation.pageStart}-{citation.pageEnd}.</div>
                  {citation.doi && <div>- Include DOI as https://doi.org/... at the end.</div>}
                  <div className="text-gray-400">Remember: Only italicize the journal name and volume number. Title in sentence case.</div>
                </div>
              )}
            </div>
            {copied && <div className="text-xs text-green-300">Copied to clipboard</div>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}