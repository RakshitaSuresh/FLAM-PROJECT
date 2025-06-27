"use client"

import { format, isAfter, isBefore, startOfDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/types/event"
import { Trash2, Calendar, Clock, Repeat } from "lucide-react"

interface EventListProps {
  events: Event[]
  onEventClick: (event: Event) => void
  onEventDelete: (eventId: string) => void
}

export function EventList({ events, onEventClick, onEventDelete }: EventListProps) {
  const today = startOfDay(new Date())

  const upcomingEvents = events
    .filter(
      (event) =>
        isAfter(new Date(event.startDate), today) ||
        format(new Date(event.startDate), "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 10)

  const pastEvents = events
    .filter((event) => isBefore(new Date(event.startDate), today))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 10)

  const categoryEmojis = {
    work: "💼",
    personal: "🏠",
    health: "🏥",
    social: "👥",
    other: "📝",
  }

  const categoryColors = {
    work: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    personal: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    health: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    social: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
    other: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
  }

  const EventListItem = ({ event }: { event: Event }) => (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-l-4 border-purple-500 hover:border-pink-500"
      onClick={() => onEventClick(event)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{event.title}</h3>
              <Badge
                className={`${categoryColors[event.category as keyof typeof categoryColors] || categoryColors.other} shadow-md`}
              >
                {categoryEmojis[event.category as keyof typeof categoryEmojis]} {event.category}
              </Badge>
              {event.recurrence.type !== "none" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  {event.recurrence.type}
                </Badge>
              )}
            </div>

            {event.description && <p className="text-sm text-muted-foreground mb-2">{event.description}</p>}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(event.startDate), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {format(new Date(event.startTime), "HH:mm")} - {format(new Date(event.endTime), "HH:mm")}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEventDelete(event.id)
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">🚀 Upcoming Events</h2>
        </div>
        {upcomingEvents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">No upcoming events</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="bg-gradient-to-r from-gray-500 to-slate-500 text-white p-4 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">📚 Past Events</h2>
        </div>
        {pastEvents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">No past events</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
