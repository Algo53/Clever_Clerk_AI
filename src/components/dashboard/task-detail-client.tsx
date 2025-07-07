'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useMemo, useEffect } from 'react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Calendar, Tag, Flag, ArrowLeft, Trash2, Edit, CheckCircle2, Clock, Download } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Task } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { taskStore } from '@/store/taskStore';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { DeleteTaskDialog } from './delete-task-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TaskService } from '@/services/taskService';

interface TaskDetailClientProps {
  taskId: number;
}

export function TaskDetailClient({ taskId }: TaskDetailClientProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const updateTask = taskStore((state) => state.updateTask);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await TaskService.getSingleTaskDetail(taskId);
        if (response.status === 200) {
          setTask(response.data);
          toast({ title: "Success", description: "Task fetched successfully" });
        } else {
          toast({ variant: 'destructive', title: "Error", description: "Failed to fetch task. Enter a valid task ID." });
        }
      } catch (error) {
        toast({ variant: 'destructive', title: "Error", description: "Something went wrong. Please try again!" });
      }
    }
    fetchTask();
  }, [])

  const priorityClasses = {
    urgent: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-slate-500',
  };

  const statusClasses = {
    done: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  };

  const handleMilestoneToggle = (milestoneId: number, completed: boolean) => {
    if (task) {
      const updatedMilestones = task?.milestones?.map((m) =>
        m.id === milestoneId ? { ...m, completed, completedAt: completed ? new Date().toISOString() : undefined } : m
      );

      if (updatedMilestones) {
        const allCompleted = updatedMilestones.every(m => m.completed);
        const someCompleted = updatedMilestones.some(m => m.completed);
        let newStatus = task?.status;
        if (allCompleted) {
          newStatus = 'done';
        } else if (someCompleted) {
          newStatus = 'in-progress';
        } else {
          newStatus = 'todo';
        }

        const updatedTask = { ...task, milestones: updatedMilestones, status: newStatus };
        setTask(updatedTask);
        updateTask(task?.id, { milestones: updatedMilestones, status: newStatus });
      }
    }
  };

  const handleExport = () => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(task, null, 2))}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = `task-${task?.id}.json`;
      link.click();
      toast({ title: "Success", description: "Task exported successfully." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to export task." });
    }
  };

  const completedMilestones = useMemo(() => task?.milestones?.filter((m) => m.completed).length || 0, [task?.milestones]);
  const totalMilestones = useMemo(() => task?.milestones?.length || 0, [task?.milestones]);
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : (task?.status === 'done' ? 100 : 0);

  if (!task) {
    return (
      <>Loading...</>
    )
  }

  return (
    <>
      <DeleteTaskDialog
        taskId={task.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
      <div className="space-y-4 animate-in fade-in-50 duration-500">
        <div className="flex justify-between items-start sm:items-center gap-2 overflow-x-scroll">
          <Button variant="outline" asChild className="group">
            <Link href={`/dashboard/tasks/`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="ml-2 hidden group-hover:inline sm:inline">
                Back to Tasks
              </span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild className="group">
              <Link href={`/dashboard/tasks/${task.id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="ml-2 hidden group-hover:inline sm:inline">Edit</span>
              </Link>
            </Button>

            <Button variant="outline" onClick={handleExport} className="group">
              <Download className="h-4 w-4" />
              <span className="ml-2 hidden group-hover:inline sm:inline">Export</span>
            </Button>

            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="group">
              <Trash2 className="h-4 w-4" />
              <span className="ml-2 hidden group-hover:inline sm:inline">Delete</span>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden animate-in fade-in-50 duration-700">
          <CardHeader className='bg-muted/30'>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <Badge className={cn('capitalize mb-2', statusClasses[task.status])}>
                  {task.status.replace('-', ' ')}
                </Badge>
                <CardTitle className="text-2xl md:text-3xl">{task.title}</CardTitle>
                {task.description && (
                  <CardDescription className="mt-2 text-base max-w-prose">{task.description}</CardDescription>
                )}
              </div>
              <div className="flex-shrink-0 space-y-2 text-sm text-muted-foreground w-full sm:w-auto pt-1">
                {task.priority && (
                  <div className="flex items-center gap-2">
                    <Flag className={cn("h-4 w-4", priorityClasses[task.priority])} />
                    <span className='capitalize'>{task.priority} priority</span>
                  </div>
                )}
                {task.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{task.category}</span>
                  </div>
                )}
                {task.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Due by {format(parseISO(task.deadline), 'PPP')}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          {totalMilestones > 0 && (
            <>
              <Separator />
              <CardContent className="py-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold">Progress</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Progress value={progressPercentage} className="h-2 flex-1" />
                      <span className="text-sm font-semibold text-muted-foreground">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Milestones</h3>
                    <div className="space-y-3">
                      {task.milestones?.map((milestone) => (
                        <div key={milestone.id} className="flex items-start gap-4">
                          <Checkbox
                            id={`milestone-${milestone.id}`}
                            checked={milestone.completed}
                            onCheckedChange={(checked) => handleMilestoneToggle(milestone.id, !!checked)}
                            className="mt-1"
                          />
                          <div className='flex-1'>
                            <label
                              htmlFor={`milestone-${milestone.id}`}
                              className={cn(
                                "font-medium leading-none cursor-pointer",
                                milestone.completed ? 'line-through text-muted-foreground' : ''
                              )}
                            >
                              {milestone.title}
                            </label>
                            {milestone.completed && milestone.completedAt && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                Completed {formatDistanceToNow(parseISO(milestone.completedAt), { addSuffix: true })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}
          <Separator />
          <CardFooter className="bg-muted/30 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Created on {format(parseISO(task.createdAt), 'PPP p')}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
