'use client';

import { useEffect, useState, useMemo } from 'react';
import { startOfWeek, startOfMonth, isAfter } from 'date-fns';
import { AlertCircle, CheckCircle2, ListTodo, Loader2, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';
import { taskStore } from '@/store/taskStore';
import { contextStore } from '@/store/contextStore';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodayTasksList } from '@/components/dashboard/today-tasks-list';
import { TaskStatusChart } from '@/components/dashboard/task-status-chart';
import { SuggestedSchedule } from '@/components/dashboard/suggested-schedule';
import { TaskPriorityChart } from '@/components/dashboard/task-priority-chart';

type TimeFrame = 'week' | 'month' | 'all';

export default function DashboardPage() {
  const { getAllContext } = contextStore();
  const { tasks, getAllTask } = taskStore();

  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState<string>("Good Morning");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formattedTime = useMemo(() => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [time]);

  const fetchInitialData = async () => {
    const response_A = await getAllTask();
    const response_B = await getAllContext();
  }

  useEffect(() => {
    if (tasks?.length === 0) {
      fetchInitialData();
    }
  }, [tasks?.length]);

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes();

      let text: string;
      if (hrs >= 5 && (hrs > 5 || mins >= 0) && hrs < 12) {
        text = 'Good Morning';
      } else if (hrs >= 12 && hrs < 18) {
        text = 'Good Afternoon';
      } else if (hrs >= 18 && hrs < 21) {
        text = 'Good Evening';
      } else {
        text = 'Good Night';
      }

      setGreeting(text);
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 30 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredTasks = useMemo(() => {
    const now = new Date();
    if (timeFrame === 'week') {
      const startOfThisWeek = startOfWeek(now);
      return tasks?.filter(task => isAfter(new Date(task.createdAt), startOfThisWeek)) || [];
    }
    if (timeFrame === 'month') {
      const startOfThisMonth = startOfMonth(now);
      return tasks?.filter(task => isAfter(new Date(task.createdAt), startOfThisMonth)) || [];
    }
    return tasks;
  }, [tasks, timeFrame]);


  if (isLoading && tasks?.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const urgentTasks = tasks?.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
  const inProgressTasks = tasks?.filter(t => t.status === 'in-progress').length;
  const completedToday = tasks?.filter(t => {
    const today = new Date();
    return t.status === 'done' && new Date(t.deadline || '').toDateString() === today.toDateString();
  }).length;
  const totalTasks = tasks?.length;

  const statCardContent = "flex flex-col items-center justify-center text-center p-4";
  const statCardBaseClasses = "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2";


  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center mb-6 space-x-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground/90">
          {
            greeting
          }!
        </h1>
        <p className="text-3xl sm:text-6xl md:text-7xl font-bold text-foreground/80 tracking-tighter">{formattedTime}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={cn("bg-gradient-to-br from-primary/20 to-accent/20", statCardBaseClasses)}>
          <CardContent className={statCardContent}>
            <ListTodo className="h-8 w-8 text-card-foreground/80 mb-2" />
            <div className="text-3xl font-bold text-card-foreground">{totalTasks}</div>
            <p className="text-sm text-card-foreground/90">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className={cn("bg-gradient-to-br from-destructive/20 to-rose-400/20 dark:to-rose-600/20", statCardBaseClasses)}>
          <CardContent className={statCardContent}>
            <AlertCircle className="h-8 w-8 text-card-foreground/80 mb-2" />
            <div className="text-3xl font-bold text-card-foreground">{urgentTasks}</div>
            <p className="text-sm text-card-foreground/90">Urgent Tasks</p>
          </CardContent>
        </Card>
        <Card className={cn("bg-gradient-to-br from-chart-4/20 to-chart-5/20", statCardBaseClasses)}>
          <CardContent className={statCardContent}>
            <Zap className="h-8 w-8 text-card-foreground/80 mb-2" />
            <div className="text-3xl font-bold text-card-foreground">{inProgressTasks}</div>
            <p className="text-sm text-card-foreground/90">In Progress</p>
          </CardContent>
        </Card>
        <Card className={cn("bg-gradient-to-br from-chart-2/20 to-green-500/10", statCardBaseClasses)}>
          <CardContent className={statCardContent}>
            <CheckCircle2 className="h-8 w-8 text-card-foreground/80 mb-2" />
            <div className="text-3xl font-bold text-card-foreground">+{completedToday}</div>
            <p className="text-sm text-card-foreground/90">Completed Today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TodayTasksList />
        <SuggestedSchedule />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-start">
          <Tabs defaultValue="all" onValueChange={(value) => setTimeFrame(value as TimeFrame)} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="week" className='flex-1 sm:flex-initial'>This Week</TabsTrigger>
              <TabsTrigger value="month" className='flex-1 sm:flex-initial'>This Month</TabsTrigger>
              <TabsTrigger value="all" className='flex-1 sm:flex-initial'>All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-4 w-full overflow-x-hidden rounded-md hover:shadow-2xl">
            <TaskStatusChart tasks={filteredTasks} />
          </div>
          <div className="lg:col-span-3">
            <TaskPriorityChart tasks={filteredTasks} />
          </div>
        </div>
      </div>

    </div>
  );
}
