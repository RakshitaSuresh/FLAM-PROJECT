"use client"

import { useState, useEffect } from "react"
import type { Event } from "@/types/event"

const STORAGE_KEY = "event-calendar-events"

export function useEventStorage() {
  const [events, setEvents] = useState<Event[]>([])

  // Load events from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedEvents = JSON.parse(stored).map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
          recurrence: {
            ...event.recurrence,
            endDate: event.recurrence.endDate ? new Date(event.recurrence.endDate) : null,
          },
        }))
        setEvents(parsedEvents)
      }
    } catch (error) {
      console.error("Error loading events from localStorage:", error)
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error("Error saving events to localStorage:", error)
    }
  }, [events])

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event])
  }

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  }
}
