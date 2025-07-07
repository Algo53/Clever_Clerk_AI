'use client';

import * as z from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, BrainCircuit, CalendarIcon, Loader2, PlusCircle, Sparkles, Trash2, Wand2, Lightbulb, Save } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { taskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import type { Task, TaskPriority } from '@/types';
import { contextStore } from '@/store/contextStore';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { TaskService } from '@/services/taskService';
import { suggestDeadline } from '@/ai/flows/suggest-deadline';
import { suggestTaskMilestones } from '@/ai/flows/suggest-task-milestones';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTask } from '@/utils/getTask';

const milestoneSchema = z.object({
  title: z.string().min(1, 'Milestone title cannot be empty.'),
});

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(1, "Description is required for AI suggestions."),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.string().optional(),
  deadline: z.date().optional(),
  milestones: z.array(milestoneSchema).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface EditTaskFormProps {
  taskId: number;
}

export function EditTaskForm({ taskId }: EditTaskFormProps) {

  const task = getTask(taskId);

  const router = useRouter();
  const { updateTask } = taskStore();
  const { categories } = contextStore();
  const [isDeadlineLoading, setIsDeadlineLoading] = useState(false);
  const [isMilestonesLoading, setIsMilestonesLoading] = useState(false);
  const [suggestedDeadline, setSuggestedDeadline] = useState<{ date: string; reasoning: string } | null>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      category: task?.category,
      deadline: task?.deadline ? new Date(task.deadline) : undefined,
      milestones: task?.milestones?.map(m => ({ title: m.title })) || [],
    },
    mode: 'onChange',
  });

  const title = form.watch('title');
  const description = form.watch('description');
  const canSuggest = !!title && !!description;
  const isAiLoading = isMilestonesLoading || isDeadlineLoading;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  const handleSuggestMilestones = async () => {
    const { title, description } = form.getValues();
    if (!canSuggest) {
      form.setError('description', { type: 'manual', message: 'Please enter a title and description to get suggestions.' });
      return;
    }

    setIsMilestonesLoading(true);
    try {
      const result = await suggestTaskMilestones({ title, description });
      if (result.milestones) {
        // Clear existing milestones before appending new ones
        form.setValue('milestones', []);
        result.milestones.forEach(m => append({ title: m }));
      }
    } catch (error) {
      console.error('Failed to get milestone suggestions:', error);
    } finally {
      setIsMilestonesLoading(false);
    }
  };

  const handleSuggestDeadline = async () => {
    const { title, description } = form.getValues();
    if (!canSuggest) {
      form.setError('description', { type: 'manual', message: 'Please enter a title and description to get suggestions.' });
      return;
    }
    setIsDeadlineLoading(true);
    setSuggestedDeadline(null);
    try {
      const result = await suggestDeadline({ taskDescription: `${title} - ${description}` });
      if (result.suggestedDeadline) {
        setSuggestedDeadline({ date: result.suggestedDeadline, reasoning: result.reasoning });
      }
    } catch (error) {
      console.error('Failed to get deadline suggestion:', error);
    } finally {
      setIsDeadlineLoading(false);
    }
  }

  async function onSubmit(values: TaskFormValues) {
    if (task) {
      await updateTask(task.id, {
        ...values,
        status: task?.status,
        priority: values.priority as TaskPriority,
        deadline: values.deadline?.toISOString(),
        milestones: values.milestones?.map((m, index) => ({
          id: { index },
          title: m.title,
          completed: task?.milestones?.[index]?.completed || false,
          completedAt: task?.milestones?.[index]?.completedAt
        })) as any,
      });
      router.push(`/dashboard/tasks/${task.id}`);
    }
  }

  return (
    <Form {...form}>
      <div className="flex items-center justify-between mb-6">
        <div className='flex items-center gap-4'>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/tasks/${taskId}`}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Task</h1>
            <p className="text-muted-foreground">Make changes to your task below.</p>
          </div>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardContent className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Launch new marketing campaign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add more details about the task..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardHeader>
                <CardTitle>Milestones / Checkpoints</CardTitle>
                <CardDescription>Break down your task into smaller, manageable steps.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 animate-in fade-in duration-300">
                    <FormField
                      control={form.control}
                      name={`milestones.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder={`Milestone ${index + 1}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="transition-colors hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '' })} className="transition-transform hover:scale-105">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Milestone
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI and Details column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <BrainCircuit className="h-6 w-6" />
                  <CardTitle className="text-primary">AI Assistant</CardTitle>
                </div>
                <CardDescription>Let AI help you plan your task. Requires title and description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="button" variant="outline" className="w-full transition-transform hover:scale-105" onClick={handleSuggestMilestones} disabled={!canSuggest || isAiLoading}>
                  {isMilestonesLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Suggest Milestones
                </Button>
                <Button type="button" variant="outline" className="w-full transition-transform hover:scale-105" onClick={handleSuggestDeadline} disabled={!canSuggest || isAiLoading}>
                  {isDeadlineLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Suggest Deadline
                </Button>
                {suggestedDeadline && (
                  <div className="p-3 bg-primary/10 rounded-lg text-sm animate-in fade-in duration-500">
                    <p className="font-semibold text-primary flex items-center gap-1.5"><Lightbulb className="h-4 w-4" /> AI Suggestion:</p>
                    <p className="mt-2"><strong>Deadline:</strong> {format(new Date(suggestedDeadline.date), "PPP")}</p>
                    <p><strong>Reasoning:</strong> {suggestedDeadline.reasoning}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2 w-full"
                      onClick={() => {
                        form.setValue('deadline', new Date(suggestedDeadline.date));
                        setSuggestedDeadline(null);
                      }}
                    >
                      Use this deadline
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full lg:w-auto transition-transform hover:scale-105" disabled={!form.formState.isValid || isAiLoading}>
            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
