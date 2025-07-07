'use client'

import * as React from 'react'
import { PieChart } from 'lucide-react'
import { Pie, PieChart as RechartsPieChart } from 'recharts'

import { EmptyState } from './empty-state'
import type { Task, TaskPriority } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface TaskPriorityChartProps {
  tasks: Task[]
}

const chartConfig = {
  tasks: {
    label: 'Tasks',
  },
  low: {
    label: 'Low',
    color: 'hsl(var(--chart-1))',
  },
  medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-2))',
  },
  high: {
    label: 'High',
    color: 'hsl(var(--chart-3))',
  },
  urgent: {
    label: 'Urgent',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig

export function TaskPriorityChart({ tasks }: TaskPriorityChartProps) {
  const data = React.useMemo(() => {
    const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent']
    return priorities.map(priority => ({
      priority: priority,
      count: tasks.filter(t => t.priority === priority).length,
      fill: `var(--color-${priority})`,
    })).filter(d => d.count > 0);
  }, [tasks])

  return (
    <Card className="flex flex-col h-full backdrop-blur-xl shadow-lg transition-all hover:shadow-2xl">
      <CardHeader>
        <CardTitle>Priority Distribution</CardTitle>
        <CardDescription>A breakdown of tasks by their priority level.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <RechartsPieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="priority"
                innerRadius={60}
                strokeWidth={5}
                stroke="hsl(var(--background))"
              >
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="priority" />}
                className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </RechartsPieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-full pb-8">
            <EmptyState
              icon={PieChart}
              title="No Data"
              description="No tasks found in this time frame."
              className="h-[300px] border-none shadow-none bg-transparent"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
