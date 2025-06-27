"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import type { Event } from "@/types/event"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterCategory: string
  onFilterChange: (category: string) => void
  events: Event[]
}

const getCategoryEmoji = (category: string) => {
  const emojis = {
    work: "💼",
    personal: "🏠",
    health: "🏥",
    social: "👥",
    other: "📝",
  }
  return emojis[category as keyof typeof emojis] || "📝"
}

export function SearchBar({ searchQuery, onSearchChange, filterCategory, onFilterChange, events }: SearchBarProps) {
  const categories = Array.from(new Set(events.map((event) => event.category)))

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 dark:text-purple-400 w-5 h-5" />
        <Input
          placeholder="🔍 Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 border-2 border-purple-200 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-md">
        <Filter className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        <Select value={filterCategory} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px] border-2 border-indigo-200 dark:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200">
            <SelectValue placeholder="🏷️ Filter by category" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-600">
            <SelectItem value="all" className="hover:bg-indigo-50 dark:hover:bg-indigo-900">
              🌟 All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="hover:bg-indigo-50 dark:hover:bg-indigo-900">
                {getCategoryEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
