'use client';

import { useEffect, useRef, useState } from "react"

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
import { Loader2, CheckCircle, XCircle, Target, Sparkles, ClipboardCopy, ClipboardPaste, Clock, Copy } from "lucide-react";
import { diffChars } from "diff";
import { JetBrains_Mono } from "next/font/google";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useCompletedStore, useStreakStore } from "@/app/_stores/streak";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

const citationSchema = z.object({
  citation: z.string().min(1, { message: "Citation is required" }),
});

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

function useCountdownToMidnightEST(isActive: boolean) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      // Convert to EST by using locale string and reconstructing
      const nowEST = new Date(new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' })));
      const nextMidnightEST = new Date(nowEST);
      nextMidnightEST.setHours(24, 0, 0, 0);
      const ms = nextMidnightEST.getTime() - nowEST.getTime();
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      setTimeLeft(`${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return timeLeft;
}

export default function CitationTextarea() {
  const form = useForm<z.infer<typeof citationSchema>>({
    resolver: zodResolver(citationSchema),
    defaultValues: {
      citation: "",
    },
  });

  const [isLoading, setLoading] = useState(false);
  const [citation, setAPACitation] = useState("");
  const [citationInfo, setCitationInfo] = useState<CitationInfo | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const streakStore = useStreakStore();
  const completedStore = useCompletedStore();

  const lastCompletedEST = new Date(completedStore.last_completed).toLocaleString("en-US", {
    timeZone: "America/New_York"
  });
  const nowEST = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York"
  });

  const isCompleted = new Date(lastCompletedEST).toDateString() === new Date(nowEST).toDateString();
  const countdown = useCountdownToMidnightEST(isCompleted);

  useEffect(() => {
    // Fetch citation info for hints
    async function loadInfo() {
      try {
        const res = await fetch('/api/citation', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCitationInfo(data);
        }
      } catch {
        // ignore
      }
    }
    loadInfo();
  }, []);

  async function fireConfetti(intensity: 'light' | 'full' = 'light') {
    try {
      const confetti = (await import('canvas-confetti')).default;
      const particleCount = intensity === 'full' ? 200 : 80;
      const spread = intensity === 'full' ? 90 : 60;
      confetti({ particleCount, spread, origin: { y: 0.6 } });
    } catch {
      // no-op if library not available
    }
  }

  async function onSubmit(data: z.infer<typeof citationSchema>) {
    setLoading(true);
    const citation = await getAPAFormatted();

    setLoading(false);
    setAPACitation(citation);
    completedStore.setLastCompleted(new Date());

    if (citation === data.citation) {
      streakStore.incrementStreak();
      const nextMilestones = [5, 10, 20, 30];
      const isMilestone = nextMilestones.includes(streakStore.streak + 1);
      fireConfetti(isMilestone ? 'full' : 'light');
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

  const citationValue = form.watch('citation');
  const charCount = citationValue.length;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && !isCompleted) {
        form.handleSubmit(onSubmit)();
      }
    }
  }

  async function handleCopyCurrent() {
    try {
      await navigator.clipboard.writeText(form.getValues('citation'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      form.setValue('citation', text);
      textareaRef.current?.focus();
    } catch {}
  }

  async function handleCopyAnswer() {
    if (!citation) return;
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

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
          <CardTitle className={`text-xl md:text-2xl ${isCorrect ? 'bg-gradient-to-r from-gray-100 via-gray-300 to-green-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-100 via-gray-300 to-red-300 bg-clip-text text-transparent'}`}>
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
          <div className="flex items-center justify-between gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">
                You can try again tomorrow at 12:00 AM.
              </span>
            </div>
            <span className="text-xs text-gray-400">Resets in {countdown}</span>
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
      <CardFooter className="flex flex-col gap-3">
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
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleCopyAnswer} className="bg-gray-800/70 border border-gray-700 text-gray-200 hover:bg-gray-800">
            <Copy className="w-4 h-4" /> Copy correct citation
          </Button>
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
            render={({ field }) => {
              const { ref: fieldRef, ...restField } = field;
              return (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Textarea 
                        ref={(el) => {
                          textareaRef.current = el;
                          if (typeof fieldRef === 'function') {
                            fieldRef(el);
                          } else if (fieldRef) {
                            // @ts-expect-error allow assigning element to RHF ref
                            fieldRef.current = el;
                          }
                        }}
                        disabled={isLoading || isCompleted} 
                        placeholder={isCompleted ? "You&apos;ve already completed today&apos;s citation" : "Enter your citation here"} 
                        {...restField} 
                        onKeyDown={handleKeyDown}
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
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {charCount} chars
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-sm lg:text-base pt-2 text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      Use *italics* for italics. Match case of the original citation. Press Ctrl/⌘+Enter to submit.
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            }
          />
          <div className="flex flex-wrap gap-2">
            <Button 
              type="submit" 
              className="flex-1 min-w-40 text-base bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
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
            <Button type="button" variant="secondary" onClick={handleCopyCurrent} disabled={isLoading || isCompleted} className="bg-gray-800/70 border border-gray-700 text-gray-200 hover:bg-gray-800">
              <ClipboardCopy className="w-4 h-4" /> Copy
            </Button>
            <Button type="button" variant="secondary" onClick={handlePaste} disabled={isLoading || isCompleted} className="bg-gray-800/70 border border-gray-700 text-gray-200 hover:bg-gray-800">
              <ClipboardPaste className="w-4 h-4" /> Paste
            </Button>
          </div>

          {copied && (
            <div className="text-xs text-green-300">Copied to clipboard</div>
          )}

          <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-3">
            <button type="button" onClick={() => setShowHints(v => !v)} className="w-full text-left text-sm text-gray-300 hover:text-gray-200">
              {showHints ? 'Hide hints' : 'Need a hint?'}
            </button>
            {showHints && (
              <div className="mt-3 text-sm text-gray-300 space-y-2">
                {citationInfo ? (
                  <>
                    <div>- {citationInfo.authors.length} author(s). Separate authors with commas, use & before the last author.</div>
                    <div>- Year: {citationInfo.publishedYear}. Year goes in parentheses after authors.</div>
                    <div>- Journal title is italicized. Volume {citationInfo.volume}({citationInfo.issue}), pages {citationInfo.pageStart}-{citationInfo.pageEnd}.</div>
                    {citationInfo.doi && <div>- Include DOI as https://doi.org/... at the end.</div>}
                  </>
                ) : (
                  <div className="text-gray-400">Loading hints...</div>
                )}
                <div className="text-gray-400">Remember: Only italicize the journal name and volume number. Title in sentence case.</div>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
