"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface FilterState {
  logLevel: string[]
  categories: string[]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  searchTerm: string
  severity: string
  source: string[]
  showAnomaliesOnly: boolean
  minConfidence: number
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableCategories: string[]
  availableSources: string[]
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  availableCategories,
  availableSources,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: "logLevel" | "categories" | "source", value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const clearFilters = () => {
    onFiltersChange({
      logLevel: [],
      categories: [],
      dateRange: { from: undefined, to: undefined },
      searchTerm: "",
      severity: "",
      source: [],
      showAnomaliesOnly: false,
      minConfidence: 0,
    })
  }

  const activeFiltersCount =
    filters.logLevel.length +
    filters.categories.length +
    filters.source.length +
    (filters.dateRange.from ? 1 : 0) +
    (filters.searchTerm ? 1 : 0) +
    (filters.severity ? 1 : 0) +
    (filters.showAnomaliesOnly ? 1 : 0) +
    (filters.minConfidence > 0 ? 1 : 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search Logs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search in log messages..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) => updateFilter("dateRange", { ...filters.dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange.to && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) => updateFilter("dateRange", { ...filters.dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Log Levels */}
          <div className="space-y-2">
            <Label>Log Levels</Label>
            <div className="flex flex-wrap gap-2">
              {["ERROR", "WARN", "INFO", "DEBUG", "TRACE"].map((level) => (
                <Button
                  key={level}
                  variant={filters.logLevel.includes(level) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter("logLevel", level)}
                  className={cn(
                    level === "ERROR" && "border-red-500 text-red-500 hover:bg-red-50",
                    level === "WARN" && "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
                    level === "INFO" && "border-blue-500 text-blue-500 hover:bg-blue-50",
                    level === "DEBUG" && "border-green-500 text-green-500 hover:bg-green-50",
                    level === "TRACE" && "border-purple-500 text-purple-500 hover:bg-purple-50",
                  )}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <Button
                  key={category}
                  variant={filters.categories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter("categories", category)}
                >
                  {category}
                  {filters.categories.includes(category) && <X className="w-3 h-3 ml-1" />}
                </Button>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="space-y-2">
            <Label>Sources</Label>
            <div className="flex flex-wrap gap-2">
              {availableSources.map((source) => (
                <Button
                  key={source}
                  variant={filters.source.includes(source) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter("source", source)}
                >
                  {source}
                  {filters.source.includes(source) && <X className="w-3 h-3 ml-1" />}
                </Button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label>Severity</Label>
            <Select value={filters.severity} onValueChange={(value) => updateFilter("severity", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Anomalies Only */}
          <div className="flex items-center space-x-2">
            <Switch
              id="anomalies-only"
              checked={filters.showAnomaliesOnly}
              onCheckedChange={(checked) => updateFilter("showAnomaliesOnly", checked)}
            />
            <Label htmlFor="anomalies-only">Show anomalies only</Label>
          </div>

          {/* Minimum Confidence */}
          <div className="space-y-2">
            <Label>Minimum Confidence: {filters.minConfidence}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minConfidence}
              onChange={(e) => updateFilter("minConfidence", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
