'use client'

import { Task } from '@/types'
import { TaskCard } from './task-card'

interface TaskGridProps {
  data: Task[]
}

export function TaskGrid({ data }: TaskGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
