'use client'
import Link from 'next/link';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Loader2, List, LayoutGrid, ListX, PlusCircle, X, Upload, Download } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { taskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { contextStore } from '@/store/contextStore';
import { Card, CardContent } from '@/components/ui/card';
import { TaskGrid } from '@/components/dashboard/task-grid';
import { TaskTable } from '@/components/dashboard/task-table';
import type { TaskPriority, TaskStatus, Task } from '@/types';
import { EmptyState } from '@/components/dashboard/empty-state';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TasksPage() {
  const { tasks, getAllTask, importTasks } = taskStore();
  const { categories, getAllContext } = contextStore();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  // Filter states
  const [textFilter, setTextFilter] = useState('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchInitialData = async () => {
    setLoading(true);
    await getAllTask();
    await getAllContext();
    setLoading(false);
  }

  useEffect(() => {
    if (tasks?.length === 0) {
      fetchInitialData();
    }
  }, [tasks?.length]);

  const filteredTasks = useMemo(() => {
    return tasks?.filter(task => {
      const searchTerm = textFilter.toLowerCase();

      const textMatch = task?.title.toLowerCase().includes(searchTerm) ||
        (task?.description && task?.description.toLowerCase().includes(searchTerm));
      const statusMatch = statusFilter === 'all' || task?.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || task?.priority === priorityFilter;
      const categoryMatch = categoryFilter === 'all' || task?.category === categoryFilter;

      return textMatch && statusMatch && priorityMatch && categoryMatch;
    });
  }, [tasks, textFilter, statusFilter, priorityFilter, categoryFilter]);

  const handleClearFilters = () => {
    setTextFilter('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
  };

  const handleExport = () => {
    if (tasks?.length === 0) {
      toast({ variant: 'destructive', title: "No tasks to export." });
      return;
    }
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(tasks, null, 2))}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "tasks.json";
      link.click();
      toast({ title: "Success", description: "Tasks exported successfully." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to export tasks." });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const importedTasks: Task[] = JSON.parse(text);
            if (Array.isArray(importedTasks)) {
              await importTasks(importedTasks);
              toast({ title: "Success", description: "Tasks imported successfully." });
            } else {
              throw new Error("Invalid file format. Expected an array of tasks.");
            }
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Please check the file format.";
          toast({ variant: 'destructive', title: "Error", description: `Failed to import tasks. ${message}` });
        }
      };
      reader.readAsText(file);
      // Reset file input
      event.target.value = '';
    }
  };

  const isAnyFilterActive = textFilter || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-center gap-4">
        <div className='flex flex-col sm:w-1/2 w-full'>
          <h1 className="text-2xl md:text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage and organize all your tasks in one place.</p>
        </div>
        <div className="flex items-end gap-2 lg:flex-row sm:flex-col flex-row overflow-x-scroll sm:w-max w-full">
          <div className='flex gap-2 items-end'>
            <ToggleGroup type="single" variant="outline" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as 'list' | 'grid') }} aria-label="Task view mode">
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Button asChild className='lg:hidden sm:flex hidden'>
              <Link href="/dashboard/tasks/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Link>
            </Button>
          </div>
          <div className='flex gap-2'>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            <Button variant="outline" onClick={handleImportClick}><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button asChild className='lg:flex sm:hidden flex'>
              <Link href="/dashboard/tasks/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4 bg-gradient-to-tr dark:from-accent-foreground/20 from-accent-foreground/40 dark:via-destructive-foreground/15 dark:to-primary/40 to-destructive/20 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 space-y-1">
              <Label htmlFor="text-filter">Search</Label>
              <Input
                id="text-filter"
                placeholder="Filter by title or description..."
                value={textFilter}
                onChange={(event) => setTextFilter(event.target.value)}
                className="w-full"
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | 'all')}>
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1'>
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'all')}>
                <SelectTrigger id="priority-filter" className="w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1'>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                <SelectTrigger id="category-filter" className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isAnyFilterActive && (
            <div className='flex justify-end'>
              <Button variant="ghost" onClick={handleClearFilters} className="mt-2">
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>


      {isLoading && tasks?.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tasks?.length === 0 ? (
        <EmptyState
          icon={ListX}
          title="No tasks yet"
          description="Get started by adding a new task. It's the first step to organized bliss!"
          action={<Button asChild><Link href="/dashboard/tasks/new">Add Task</Link></Button>}
        />
      ) : filteredTasks?.length === 0 ? (
        <EmptyState
          icon={ListX}
          title="No tasks match your filters"
          description="Try a different search term or clear the filters to see all your tasks."
        />
      ) : viewMode === 'list' ? (
        <TaskTable data={filteredTasks} />
      ) : (
        <TaskGrid data={filteredTasks} />
      )}
    </div>
  );
}
