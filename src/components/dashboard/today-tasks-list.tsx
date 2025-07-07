'use client';

import Link from "next/link";
import { useMemo } from "react";
import { isToday, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import type { Task } from "@/types";
import { EmptyState } from "./empty-state";
import { taskStore } from "@/store/taskStore";
import { CalendarCheck, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const priorityClasses = {
    urgent: 'border-destructive text-destructive',
    high: 'border-orange-500 text-orange-500',
    medium: 'border-yellow-500 text-yellow-500',
    low: 'border-slate-400 text-slate-400',
};

const TaskItem = ({ task }: { task: Task }) => (
    <Link href={`/dashboard/tasks/${task.id}`} className="block">
        <div className="flex items-center p-3 rounded-lg hover:bg-accent dark:hover:bg-black transition-colors w-full gap-10 overflow-x-scroll justify-between">
            <div className="flex items-center gap-5">
                <div className="flex-shrink-0">
                    {task.status === 'done' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className={cn("h-5 w-5", priorityClasses[task.priority])} />}
                </div>

                <div className="flex-1">
                    <p className={cn("font-medium truncate", task.status === 'done' && 'line-through text-muted-foreground')}>{task.title}</p>
                    {task.category && <Badge variant="outline" className="mt-1 border-2">{task.category}</Badge>}
                </div>
            </div>
            <Badge variant="outline" className={cn("capitalize border-2 ml-10", priorityClasses[task.priority])}>{task.priority}</Badge>
        </div>
    </Link>
)

export function TodayTasksList() {
    const { tasks } = taskStore();

    const todayTasks = useMemo(() => {
        return tasks.filter(task => task.deadline && isToday(parseISO(task.deadline)))
            .sort((a, b) => {
                const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
                return priorities[b.priority] - priorities[a.priority];
            });
    }, [tasks]);

    return (
        <Card className="bg-gradient-to-r dark:bg-gradient-to-br from-background dark:via-primary/20 via-destructive/10 to-background backdrop-blur-xl shadow-lg transition-all hover:shadow-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="h-6 w-6 text-primary" />
                    <span>Due Today</span>
                </CardTitle>
                <CardDescription>Tasks that need your attention today.</CardDescription>
            </CardHeader>

            <CardContent>
                {todayTasks.length > 0 ? (
                    <div className="space-y-2 w-full">
                        {todayTasks.map(task => <TaskItem key={task.id} task={task} />)}
                    </div>
                ) : (
                    <EmptyState
                        icon={CalendarCheck}
                        title="All clear for today!"
                        description="You have no tasks due today. Enjoy your day or get ahead on upcoming work."
                        className="h-auto min-h-[200px] border-none shadow-none p-0 bg-transparent"
                    />
                )}
            </CardContent>
        </Card>
    );
}
