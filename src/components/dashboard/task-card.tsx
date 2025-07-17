'use client'

import Link from 'next/link'
import { MoreVertical, Calendar, Trash2, Edit } from 'lucide-react'

import { Task } from '@/types'
import { cn } from '@/lib/utils'
import { Progress } from '../ui/progress'
import { taskStore } from '@/store/taskStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { deleteTask } = taskStore();

  const priorityClasses = {
    urgent: 'border-l-4 border-red-500',
    high: 'border-l-4 border-orange-500',
    medium: 'border-l-4 border-yellow-500',
    low: 'border-l-4 border-slate-400',
  }

  const statusClasses = {
    done: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
  }

  const completedMilestones = task.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = task.milestones?.length || 0;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : task.status === 'done' ? 100 : 0;

  return (
    <Card className={cn("flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2", priorityClasses[task.priority])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base pt-2 font-bold leading-tight line-clamp-2 pr-2">
          <Link href={`/dashboard/tasks/${task.id}`} className='hover:underline'>{task.title}</Link>
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 -mt-2 -mr-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/tasks/${task.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit / View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 py-2">
        <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3">
        {totalMilestones > 0 && (
          <div className='w-full space-y-1.5'>
            <p className='text-xs text-muted-foreground'>{completedMilestones} of {totalMilestones} milestones completed</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={cn('capitalize', statusClasses[task.status])}>
              {task.status.replace('-', ' ')}
            </Badge>
            {task.category && <Badge variant="outline">{task.category}</Badge>}
          </div>
        </div>
        {task.deadline && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
            {
              task.status !== 'done' && new Date(task.deadline).toLocaleDateString() < new Date().toLocaleDateString() &&
              <Badge variant='destructive' className='ml-5'>
                Overdue
              </Badge>
            }
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
