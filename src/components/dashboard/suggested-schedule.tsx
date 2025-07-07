'use client';

import { useState } from "react";
import { Loader2, CalendarClock, Lightbulb, Clock } from "lucide-react";

import { taskStore } from "@/store/taskStore";
import { Button } from "@/components/ui/button";
import { contextStore } from "@/store/contextStore";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestCalendarSlots, type SuggestCalendarSlotsOutput } from "@/ai/flows/suggest-calendar-slots";

export function SuggestedSchedule() {
    const { tasks } = taskStore();
    const { contextEntries } = contextStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<SuggestCalendarSlotsOutput | null>(null);

    const handleSuggestSchedule = async () => {
        setIsLoading(true);
        setSuggestions(null);
        setError(null);
        try {
            const result = await suggestCalendarSlots({
                tasks: tasks.filter(t => t.status !== 'done').map(t => t.title).join('\n'),
                context: contextEntries.map(e => e.content).join('\n'),
            });
            setSuggestions(result);
        } catch (err) {
            setError("Failed to get schedule suggestions. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="backdrop-blur-xl shadow-lg transition-all hover:shadow-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-6 w-6 text-primary" />
                    <span>AI Schedule Suggestions</span>
                </CardTitle>
                <CardDescription>Let AI analyze your tasks and context to suggest an optimal schedule.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={handleSuggestSchedule}
                    disabled={isLoading || tasks.filter(t => t.status !== 'done').length === 0}
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : 'Generate Schedule'}
                </Button>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {suggestions && (
                    <div className="p-4 bg-primary/10 rounded-lg animate-in fade-in-50 space-y-4">
                        <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>Suggestion Reasoning</AlertTitle>
                            <AlertDescription>{suggestions.reasoning}</AlertDescription>
                        </Alert>
                        <div>
                            <h4 className="font-semibold mb-2">Suggested Time Slots:</h4>
                            <div className="space-y-2">
                                {suggestions.suggestedSlots.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-3 text-sm p-2 rounded-md bg-background/50">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span>{new Date(slot).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
