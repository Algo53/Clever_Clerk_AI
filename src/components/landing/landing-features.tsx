import { BrainCircuit, CalendarClock, ListChecks, MessageSquare, ShieldCheck, BarChart2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 mb-4 text-primary" />,
    title: "Intelligent Task Prioritization",
    description: "Automatically ranks your tasks by urgency and importance using AI analysis of your schedule and context."
  },
  {
    icon: <CalendarClock className="w-8 h-8 mb-4 text-primary" />,
    title: "Dynamic Deadline Engine",
    description: "Receives personalized deadline recommendations based on your workload patterns and task complexity."
  },
  {
    icon: <ListChecks className="w-8 h-8 mb-4 text-primary" />,
    title: "Smart Auto-Categorization",
    description: "Tasks are intelligently tagged and organized into relevant categories without manual input."
  },
  {
    icon: <MessageSquare className="w-8 h-8 mb-4 text-primary" />,
    title: "Contextual Task Enhancement",
    description: "Automatically enriches tasks with relevant details extracted from your communications and notes."
  },
  {
    icon: <BarChart2 className="w-8 h-8 mb-4 text-primary" />,
    title: "Productivity Analytics",
    description: "Gain insights into your task completion patterns and productivity trends with visual reports."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 mb-4 text-primary" />,
    title: "Focus Protection",
    description: "AI identifies and safeguards your peak productivity periods from low-priority interruptions."
  }
]

const animationDelays = ["delay-100", "delay-200", "delay-300", "delay-400"]

export function LandingFeatures() {
  return (
    <section id="features" className="pb-20 md:pb-32 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-destructive-foreground">Why You'll Love Smart Todo</h2>
          <p className="text-lg text-muted-foreground mt-2 font-body">
            Go beyond a simple list. Experience a smarter way to manage your life.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={cn(
                "text-center flex flex-col items-center p-6 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 animate-in fade-in zoom-in-95",
                animationDelays[index % animationDelays.length]
              )}
              style={{ animationDuration: "1000ms" }}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                {feature.icon}
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription className="font-body text-base">
                {feature.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
