"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Event } from "@/types/event"
import { EventCard } from "@/components/event-card"
import { cn } from "@/lib/utils"
import { useDrop } from "react-dnd"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

interface CalendarProps {
  events: Event[]
  onEventClick: (event: Event) => void
  onDateClick: (date: Date) => void
  onEventDrop: (eventId: string, newDate: Date) => void
}

interface CalendarDayProps {
  date: Date
  events: Event[]
  isCurrentMonth: boolean
  onEventClick: (event: Event) => void
  onDateClick: (date: Date) => void
  onEventDrop: (eventId: string, newDate: Date) => void
}

function CalendarDay({ date, events, isCurrentMonth, onEventClick, onDateClick, onEventDrop }: CalendarDayProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "event",
    drop: (item: { eventId: string }) => {
      onEventDrop(item.eventId, date)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const dayEvents = events.filter((event) => isSameDay(new Date(event.startDate), date))

  return (
    <div
      ref={drop}
      className={cn(
        "min-h-[120px] p-3 border border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 relative",
        !isCurrentMonth && "bg-gray-100 dark:bg-gray-800 text-muted-foreground",
        isCurrentMonth &&
          "bg-white dark:bg-gray-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-500",
        isToday(date) &&
          "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 border-2 border-yellow-400 dark:border-yellow-600 shadow-lg",
        isOver &&
          "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-2 border-green-400 dark:border-green-600 shadow-lg transform scale-105",
      )}
      onClick={() => onDateClick(date)}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={cn(
            "text-sm font-bold px-2 py-1 rounded-full transition-all duration-200",
            isToday(date) && "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md",
            !isToday(date) && isCurrentMonth && "hover:bg-purple-100 dark:hover:bg-purple-800",
          )}
        >
          {format(date, "d")}
        </span>
      </div>
      <div className="space-y-1">
        {dayEvents.slice(0, 3).map((event) => (
          <EventCard
            key={`${event.id}-${date.toISOString()}`}
            event={event}
            onClick={(e) => {
              e.stopPropagation()
              onEventClick(event)
            }}
            isDraggable={true}
          />
        ))}
        {dayEvents.length > 3 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>}
      </div>
    </div>
  )
}

export function Calendar({ events, onEventClick, onDateClick, onEventDrop }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => (direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-0 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
          <h2 className="text-3xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-200 hover:scale-105"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-0">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-bold text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 border-b-2 border-purple-200 dark:border-purple-600"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((date) => (
              <CalendarDay
                key={date.toISOString()}
                date={date}
                events={events}
                isCurrentMonth={isSameMonth(date, currentDate)}
                onEventClick={onEventClick}
                onDateClick={onDateClick}
                onEventDrop={onEventDrop}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </DndProvider>
  )
}
