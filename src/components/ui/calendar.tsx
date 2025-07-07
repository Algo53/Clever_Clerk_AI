"use client"

import * as React from "react"
import { DayFlag, DayPicker, SelectionState, UI } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        [UI.Month]: "space-y-4",
        [UI.MonthCaption]: "flex justify-center pt-1",
        [UI.Nav]: "flex items-center justify-between mb-2",
        [UI.PreviousMonthButton]:
          cn(buttonVariants({ variant: "default" }), "h-7 w-7 p-0"),
        [UI.NextMonthButton]:
          cn(buttonVariants({ variant: "default" }), "h-7 w-7 p-0"),
        [UI.MonthGrid]: "w-full border-collapse",
        [UI.Weekdays]: "flex",
        [UI.Weekday]: "text-muted-foreground w-9 text-center",
        [UI.Weeks]: "flex flex-col mt-2",
        [UI.Week]: "flex w-full",
        [UI.Day]: "h-9 w-9 p-0 relative",
        [UI.DayButton]: cn("h-9 w-9 rounded-sm font-normal", buttonVariants({ variant: "ghost" })),
        [SelectionState.selected]:
          "bg-accent-foreground/50 rounded-sm text-primary-foreground text-center",
        [SelectionState.range_start]:
          "rounded-l-md",
        [SelectionState.range_end]:
          "rounded-r-md",
        [DayFlag.today]: "bg-accent text-accent-foreground",
        [DayFlag.outside]: "text-muted-foreground",
        [DayFlag.disabled]: "opacity-50",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
