'use client'

import * as z from 'zod'
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MessageSquare, StickyNote, ListX, PlusCircle, BrainCircuit, Tags, Smile, Frown, Meh } from "lucide-react";

import type { ContextSource } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { contextStore } from '@/store/contextStore';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { extractContextKeywords, type ExtractContextKeywordsOutput } from "@/ai/flows/extract-context-keywords";
import { analyzeContextSentiment, type AnalyzeContextSentimentOutput } from "@/ai/flows/analyze-context-sentiment";

const contextSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  source: z.enum(['email', 'whatsapp', 'notes', 'other']),
})

const sourceIcons: { [key in ContextSource]: React.ReactNode } = {
  email: <Mail className="h-5 w-5" />,
  whatsapp: <MessageSquare className="h-5 w-5" />,
  notes: <StickyNote className="h-5 w-5" />,
  other: <div className="h-5 w-5" />,
}

const sentimentIcons: { [key: string]: React.ReactNode } = {
  positive: <Smile className="h-5 w-5 text-green-500" />,
  negative: <Frown className="h-5 w-5 text-red-500" />,
  neutral: <Meh className="h-5 w-5 text-yellow-500" />,
}

export default function ContextPage() {
  const { contextEntries, getAllContext, addContextEntry } = contextStore();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [sentimentResult, setSentimentResult] = useState<AnalyzeContextSentimentOutput | null>(null);
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);

  const [keywordsResult, setKeywordsResult] = useState<ExtractContextKeywordsOutput | null>(null);
  const [isExtractingKeywords, setIsExtractingKeywords] = useState(false);

  const form = useForm<z.infer<typeof contextSchema>>({
    resolver: zodResolver(contextSchema),
    defaultValues: { content: '', source: 'notes' },
  })

  const fetchInitialData = async () => {
    setLoading(true);
    await getAllContext();
    setLoading(false);
  }

  useEffect(() => {
      // fetchInitialData();
  }, []);

  const onSubmit = async (values: z.infer<typeof contextSchema>) => {
    setIsSubmitting(true);
    // await addContextEntry({
    //   content: values.content,
    //   source: values.source as ContextSource
    // });
    form.reset();
    setIsSubmitting(false);
  }

  const handleAnalyzeSentiment = async () => {
    setIsAnalyzingSentiment(true);
    setSentimentResult(null);
    try {
      const result = await analyzeContextSentiment({ contextEntries: contextEntries.map(e => e.content) });
      setSentimentResult(result);
    } catch (e) {
      console.error("Error analyzing sentiment", e)
    } finally {
      setIsAnalyzingSentiment(false);
    }
  }

  const handleExtractKeywords = async () => {
    setIsExtractingKeywords(true);
    setKeywordsResult(null);
    try {
      const result = await extractContextKeywords({ contextEntries: contextEntries.map(e => e.content) });
      setKeywordsResult(result);
    } catch (e) {
      console.error("Error extracting keywords", e)
    } finally {
      setIsExtractingKeywords(false);
    }
  }


  return (
    <div className="grid lg:grid-cols-3 gap-8 h-full">
      <div className="md:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Context Stream</h1>
            <p className="text-muted-foreground">Your daily brain dump. Add notes, emails, and more.</p>
          </div>
        </div>
        {isLoading && contextEntries.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : contextEntries.length === 0 ? (
          <EmptyState
            icon={ListX}
            title="No context entries yet"
            description="Add your first note, message or thought to start building context for your AI assistant."
          />
        ) : (
          <ScrollArea className="max:h-[calc(100vh-20rem)] h-min">
            <div className="space-y-4 lg:pr-4">
              {contextEntries.map(entry => (
                <Card key={entry.id} className="transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-in fade-in-50">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">{sourceIcons[entry.source]}</div>
                      <CardTitle className="text-sm font-medium capitalize">{entry.source}</CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="lg:col-span-1 md:col-span-2 col-span-1 space-y-6">
        <Card className="w-full transition-all duration-300 hover:shadow-lg hover:border-primary/20">
          <CardHeader>
            <CardTitle>Add Context</CardTitle>
            <CardDescription>Add a new piece of context to help your assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Paste an email, a note, or a thought..." {...field} rows={6} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="notes">Note</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Entry
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <BrainCircuit className="h-6 w-6" />
              <CardTitle className="text-primary">Context AI</CardTitle>
            </div>
            <CardDescription>Analyze your context stream for insights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={handleAnalyzeSentiment} disabled={isAnalyzingSentiment || contextEntries.length === 0} className="w-full">
                {isAnalyzingSentiment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze Sentiment'}
              </Button>
              {sentimentResult && (
                <div className="p-3 bg-primary/10 rounded-lg text-sm space-y-2 animate-in fade-in-50">
                  <p className="font-semibold text-primary">Overall Sentiment: {sentimentResult.overallSentiment}</p>
                  <div className="space-y-1">
                    {sentimentResult.sentimentBreakdown.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        {sentimentIcons[item.sentiment.toLowerCase()] || <Meh className="h-5 w-5" />}
                        <p className="text-muted-foreground truncate" title={item.entry}>
                          <span className="font-semibold text-foreground capitalize">{item.sentiment}: </span>
                          {item.entry}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Separator />
            <div className="space-y-2">
              <Button onClick={handleExtractKeywords} disabled={isExtractingKeywords || contextEntries.length === 0} className="w-full">
                {isExtractingKeywords ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Extract Keywords'}
              </Button>
              {keywordsResult && (
                <div className="p-3 bg-primary/10 rounded-lg text-sm space-y-2 animate-in fade-in-50">
                  <p className="font-semibold text-primary flex items-center gap-2"><Tags className="h-4 w-4" /> Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {keywordsResult.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
