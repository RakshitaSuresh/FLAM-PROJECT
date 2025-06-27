"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Event, EventFormData, RecurrenceType } from "@/types/event"
import { X, Trash2 } from "lucide-react"

interface EventFormProps {
  event?: Event | null
  selectedDate: Date
  onSubmit: (eventData: EventFormData) => boolean
  onCancel: () => void
  onDelete?: () => void
}

export function EventForm({ event, selectedDate, onSubmit, onCancel, onDelete }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    startDate: selectedDate,
    endDate: selectedDate,
    startTime: new Date(),
    endTime: new Date(),
    category: "other",
    recurrence: {
      type: "none",
      interval: 1,
      daysOfWeek: [],
      endDate: null,
    },
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        category: event.category,
        recurrence: event.recurrence,
      })
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = onSubmit(formData)
    if (success) {
      // Form will be closed by parent component
    }
  }

  const handleRecurrenceChange = (type: RecurrenceType) => {
    setFormData((prev) => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        type,
        daysOfWeek: type === "weekly" ? [] : prev.recurrence.daysOfWeek,
      },
    }))
  }

  const handleDayOfWeekToggle = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        daysOfWeek: prev.recurrence.daysOfWeek.includes(day)
          ? prev.recurrence.daysOfWeek.filter((d) => d !== day)
          : [...prev.recurrence.daysOfWeek, day],
      },
    }))
  }

  const weekDays = [
    { value: 0, label: "Sun" },
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 animate-in slide-in-from-bottom duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">{event ? "✏️ Edit Event" : "➕ Add New Event"}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
                className="border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200 hover:shadow-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={format(formData.startDate, "yyyy-MM-dd")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: new Date(e.target.value),
                      endDate: new Date(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={format(formData.endDate, "yyyy-MM-dd")}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: new Date(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={format(formData.startTime, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":")
                    const newTime = new Date()
                    newTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                    setFormData((prev) => ({ ...prev, startTime: newTime }))
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={format(formData.endTime, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":")
                    const newTime = new Date()
                    newTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                    setFormData((prev) => ({ ...prev, endTime: newTime }))
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recurrence</Label>
              <Select
                value={formData.recurrence.type}
                onValueChange={(value: RecurrenceType) => handleRecurrenceChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Recurrence</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.recurrence.type === "weekly" && (
              <div className="space-y-2">
                <Label>Days of Week</Label>
                <div className="flex gap-2 flex-wrap">
                  {weekDays.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={formData.recurrence.daysOfWeek.includes(day.value)}
                        onCheckedChange={() => handleDayOfWeekToggle(day.value)}
                      />
                      <Label htmlFor={`day-${day.value}`} className="text-sm">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(formData.recurrence.type === "custom" || formData.recurrence.type === "daily") && (
              <div className="space-y-2">
                <Label htmlFor="interval">Repeat every</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    value={formData.recurrence.interval}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recurrence: { ...prev.recurrence, interval: Number.parseInt(e.target.value) || 1 },
                      }))
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.recurrence.type === "daily" ? "days" : "intervals"}
                  </span>
                </div>
              </div>
            )}

            {formData.recurrence.type !== "none" && (
              <div className="space-y-2">
                <Label htmlFor="recurrenceEnd">End Recurrence (optional)</Label>
                <Input
                  id="recurrenceEnd"
                  type="date"
                  value={formData.recurrence.endDate ? format(formData.recurrence.endDate, "yyyy-MM-dd") : ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recurrence: {
                        ...prev.recurrence,
                        endDate: e.target.value ? new Date(e.target.value) : null,
                      },
                    }))
                  }
                />
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {event ? "💾 Update Event" : "✨ Add Event"}
              </Button>
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={onDelete}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-110 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
