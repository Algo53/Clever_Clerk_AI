'use client'

import { useMemo } from 'react'
import { BarChart } from 'lucide-react'

import type { Task } from '@/types'
import { EmptyState } from './empty-state'
import { Bar, BarChart as RechartsBarChart, Cell, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'


interface TaskStatusChartProps {
  tasks: Task[]
}

const chartConfig = {
  count: {
    label: 'Tasks',
  },
  todo: {
    label: 'To Do',
    color: 'hsl(var(--chart-1))',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'hsl(var(--chart-2))',
  },
  done: {
    label: 'Done',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export function TaskStatusChart({ tasks }: TaskStatusChartProps) {
  const data = useMemo(() => [
    { status: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length, fill: 'var(--color-todo)' },
    { status: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length, fill: 'var(--color-in-progress)' },
    { status: 'done', label: 'Done', count: tasks.filter(t => t.status === 'done').length, fill: 'var(--color-done)' },
  ], [tasks]);

  const totalTasksInChart = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="h-full backdrop-blur-xl shadow-lg transition-all hover:shadow-2xl">
      <CardHeader>
        <CardTitle>Tasks by Status</CardTitle>
        <CardDescription>An overview of your current task distribution.</CardDescription>
      </CardHeader>
      <CardContent>
        {totalTasksInChart > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <RechartsBarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{
                left: 0,
              }}
            >
              <YAxis
                dataKey="label"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
                fontSize={14}
                className='font-medium'
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="count" layout="vertical" radius={5}>
                {data.map((entry) => (
                  <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ChartContainer>
        ) : (
          <EmptyState
            icon={BarChart}
            title="No Data"
            description="No tasks found in this time frame."
            className="h-[250px] border-none shadow-none bg-transparent"
          />
        )}
      </CardContent>
    </Card>
  )
}
