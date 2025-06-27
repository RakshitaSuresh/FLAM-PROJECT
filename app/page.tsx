"use client"

import { useState } from "react"
import { Calendar } from "@/components/calendar"
import { EventForm } from "@/components/event-form"
import { EventList } from "@/components/event-list"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, List, Plus } from "lucide-react"
import type { Event, EventFormData } from "@/types/event"
import { useEventStorage } from "@/hooks/use-event-storage"
import { generateRecurringEvents, checkEventConflicts } from "@/lib/event-utils"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function EventCalendarApp() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const { events, addEvent, updateEvent, deleteEvent } = useEventStorage()
  const { toast } = useToast()

  // Generate all events including recurring ones
  const allEvents = generateRecurringEvents(events)

  // Filter events based on search and category
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || event.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddEvent = (eventData: EventFormData) => {
    const conflicts = checkEventConflicts(eventData, allEvents)

    if (conflicts.length > 0) {
      toast({
        title: "Event Conflict Detected",
        description: `This event conflicts with: ${conflicts.map((e) => e.title).join(", ")}`,
        variant: "destructive",
      })
      return false
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addEvent(newEvent)
    setShowEventForm(false)
    toast({
      title: "Event Added",
      description: "Your event has been successfully created.",
    })
    return true
  }

  const handleUpdateEvent = (eventData: EventFormData) => {
    if (!editingEvent) return false

    const conflicts = checkEventConflicts(
      eventData,
      allEvents.filter((e) => e.id !== editingEvent.id),
    )

    if (conflicts.length > 0) {
      toast({
        title: "Event Conflict Detected",
        description: `This event conflicts with: ${conflicts.map((e) => e.title).join(", ")}`,
        variant: "destructive",
      })
      return false
    }

    const updatedEvent: Event = {
      ...editingEvent,
      ...eventData,
      updatedAt: new Date(),
    }

    updateEvent(updatedEvent)
    setEditingEvent(null)
    toast({
      title: "Event Updated",
      description: "Your event has been successfully updated.",
    })
    return true
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
    setEditingEvent(null)
    toast({
      title: "Event Deleted",
      description: "Your event has been successfully deleted.",
    })
  }

  const handleEventClick = (event: Event) => {
    setEditingEvent(event)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventForm(true)
  }

  const handleEventDrop = (eventId: string, newDate: Date) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    const updatedEvent = {
      ...event,
      startDate: newDate,
      endDate: newDate,
    }

    const conflicts = checkEventConflicts(
      updatedEvent,
      allEvents.filter((e) => e.id !== eventId),
    )

    if (conflicts.length > 0) {
      toast({
        title: "Cannot Move Event",
        description: `This would conflict with: ${conflicts.map((e) => e.title).join(", ")}`,
        variant: "destructive",
      })
      return
    }

    updateEvent(updatedEvent)
    toast({
      title: "Event Moved",
      description: "Your event has been successfully rescheduled.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Event Calendar
              </h1>
              <p className="text-purple-100 text-lg">Manage your events and schedule with style</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                onClick={() => setShowEventForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-purple-200 dark:border-purple-700">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            events={events}
          />
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-700 p-1 rounded-lg shadow-md">
              <TabsTrigger
                value="calendar"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200"
              >
                <CalendarDays className="w-4 h-4" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-200"
              >
                <List className="w-4 h-4" />
                List View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4 mt-6">
              <Calendar
                events={filteredEvents}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                onEventDrop={handleEventDrop}
              />
            </TabsContent>

            <TabsContent value="list" className="space-y-4 mt-6">
              <EventList events={filteredEvents} onEventClick={handleEventClick} onEventDelete={handleDeleteEvent} />
            </TabsContent>
          </Tabs>
        </div>

        {(showEventForm || editingEvent) && (
          <EventForm
            event={editingEvent}
            selectedDate={selectedDate}
            onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
            onCancel={() => {
              setShowEventForm(false)
              setEditingEvent(null)
            }}
            onDelete={editingEvent ? () => handleDeleteEvent(editingEvent.id) : undefined}
          />
        )}
      </div>
    </div>
  )
}
