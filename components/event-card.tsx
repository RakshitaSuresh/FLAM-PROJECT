"use client"

import type React from "react"

import { format } from "date-fns"
import { Clock, Repeat } from "lucide-react"
import type { Event } from "@/types/event"
import { cn } from "@/lib/utils"
import { useDrag } from "react-dnd"

interface EventCardProps {
  event: Event
  onClick: (e: React.MouseEvent) => void
  isDraggable?: boolean
  showDate?: boolean
}

const categoryColors = {
  work: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
  personal: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
  health: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600",
  social: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600",
  other: "bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600",
}

export function EventCard({ event, onClick, isDraggable = false, showDate = false }: EventCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "event",
    item: { eventId: event.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable,
  })

  const categoryColor = categoryColors[event.category as keyof typeof categoryColors] || categoryColors.other

  return (
    <div
      ref={isDraggable ? drag : undefined}
      className={cn(
        "p-3 rounded-lg text-xs cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 transform",
        categoryColor,
        "text-white shadow-md border border-white/20",
        isDragging && "opacity-50 rotate-3 scale-110",
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold truncate text-sm">{event.title}</span>
        <div className="flex items-center gap-1 ml-2 opacity-80">
          {event.recurrence.type !== "none" && <Repeat className="w-3 h-3 animate-pulse" />}
          <Clock className="w-3 h-3" />
        </div>
      </div>
      {showDate && (
        <div className="text-xs opacity-90 mb-1 bg-white/20 rounded px-2 py-1 inline-block">
          {format(new Date(event.startDate), "MMM d, yyyy")}
        </div>
      )}
      <div className="text-xs opacity-90 bg-white/20 rounded px-2 py-1 inline-block">
        {format(new Date(event.startTime), "HH:mm")} - {format(new Date(event.endTime), "HH:mm")}
      </div>
    </div>
  )
}
