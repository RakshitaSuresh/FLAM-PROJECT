import { addDays, addWeeks, addMonths, isBefore, isAfter, isSameDay, format } from "date-fns"
import type { Event, EventFormData } from "@/types/event"

export function generateRecurringEvents(baseEvents: Event[]): Event[] {
  const allEvents: Event[] = []
  const maxDate = addMonths(new Date(), 12) // Generate events up to 1 year ahead

  baseEvents.forEach((baseEvent) => {
    allEvents.push(baseEvent)

    if (baseEvent.recurrence.type === "none") {
      return
    }

    let currentDate = new Date(baseEvent.startDate)
    let instanceCount = 0
    const maxInstances = 365 // Prevent infinite loops

    while (instanceCount < maxInstances && isBefore(currentDate, maxDate)) {
      let nextDate: Date

      switch (baseEvent.recurrence.type) {
        case "daily":
          nextDate = addDays(currentDate, baseEvent.recurrence.interval)
          break
        case "weekly":
          if (baseEvent.recurrence.daysOfWeek.length === 0) {
            nextDate = addWeeks(currentDate, baseEvent.recurrence.interval)
          } else {
            // Find next occurrence based on selected days of week
            nextDate = findNextWeeklyOccurrence(currentDate, baseEvent.recurrence.daysOfWeek)
          }
          break
        case "monthly":
          nextDate = addMonths(currentDate, baseEvent.recurrence.interval)
          break
        case "custom":
          nextDate = addDays(currentDate, baseEvent.recurrence.interval)
          break
        default:
          return
      }

      if (baseEvent.recurrence.endDate && isAfter(nextDate, baseEvent.recurrence.endDate)) {
        break
      }

      if (isBefore(nextDate, maxDate)) {
        const recurringEvent: Event = {
          ...baseEvent,
          id: `${baseEvent.id}-${format(nextDate, "yyyy-MM-dd")}`,
          startDate: nextDate,
          endDate: nextDate,
        }
        allEvents.push(recurringEvent)
      }

      currentDate = nextDate
      instanceCount++
    }
  })

  return allEvents
}

function findNextWeeklyOccurrence(currentDate: Date, daysOfWeek: number[]): Date {
  const currentDay = currentDate.getDay()
  const sortedDays = [...daysOfWeek].sort((a, b) => a - b)

  // Find next day in the same week
  const nextDayThisWeek = sortedDays.find((day) => day > currentDay)

  if (nextDayThisWeek !== undefined) {
    return addDays(currentDate, nextDayThisWeek - currentDay)
  }

  // If no day found this week, go to first day of next week
  const firstDayNextWeek = sortedDays[0]
  const daysUntilNextWeek = 7 - currentDay + firstDayNextWeek
  return addDays(currentDate, daysUntilNextWeek)
}

export function checkEventConflicts(newEvent: EventFormData, existingEvents: Event[]): Event[] {
  const conflicts: Event[] = []

  existingEvents.forEach((existingEvent) => {
    // Check if events are on the same date
    if (isSameDay(new Date(newEvent.startDate), new Date(existingEvent.startDate))) {
      // Check for time overlap
      const newStart = new Date(newEvent.startTime).getTime()
      const newEnd = new Date(newEvent.endTime).getTime()
      const existingStart = new Date(existingEvent.startTime).getTime()
      const existingEnd = new Date(existingEvent.endTime).getTime()

      // Check if times overlap
      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        conflicts.push(existingEvent)
      }
    }
  })

  return conflicts
}
