export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom"

export interface Recurrence {
  type: RecurrenceType
  interval: number
  daysOfWeek: number[] // 0 = Sunday, 1 = Monday, etc.
  endDate: Date | null
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  startTime: Date
  endTime: Date
  category: string
  recurrence: Recurrence
  createdAt: Date
  updatedAt: Date
}

export interface EventFormData {
  title: string
  description: string
  startDate: Date
  endDate: Date
  startTime: Date
  endTime: Date
  category: string
  recurrence: Recurrence
}
