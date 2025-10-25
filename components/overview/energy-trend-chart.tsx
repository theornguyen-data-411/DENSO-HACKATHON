"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useOverviewData } from "@/lib/store/hooks"
import { BarChart3 } from "lucide-react"

type TimeRange = "24H" | "7D" | "30D"

// Seeded random function for consistent data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function EnergyTrendChart() {
  const data = useOverviewData()
  const [timeRange, setTimeRange] = useState<TimeRange>("24H")

  // Generate realistic temperature data
  const chartData = useMemo(() => {
    if (timeRange === "24H") {
      // Generate hourly temperature data for 24 hours
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i
        let baseTemp = 50 // Base temperature
        
        // Temperature patterns throughout the day
        if (hour >= 6 && hour <= 8) {
          baseTemp = 60 // Morning
        } else if (hour >= 9 && hour <= 17) {
          baseTemp = 70 // Business hours (higher activity)
        } else if (hour >= 18 && hour <= 21) {
          baseTemp = 75 // Evening peak
        } else if (hour >= 22 || hour <= 5) {
          baseTemp = 45 // Night hours (lower activity)
        }
        
        // Add some randomness
        const randomVariation = (seededRandom(i + 1000) - 0.5) * 20
        const temperature = Math.max(20, Math.min(90, baseTemp + randomVariation))
        
        return {
          time: `${hour.toString().padStart(2, "0")}:00`,
          consumption: Math.round(temperature * 10) / 10, // Round to 1 decimal
        }
      })
    } else if (timeRange === "7D") {
      // Generate daily temperature data for 7 days
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return days.map((day, index) => {
        let baseTemp = 60
        
        // Weekend pattern (lower temperatures)
        if (index >= 5) {
          baseTemp = 50
        }
        
        const randomVariation = (seededRandom(index + 2000) - 0.5) * 15
        const temperature = Math.max(30, Math.min(85, baseTemp + randomVariation))
        
        return {
          date: day,
          consumption: Math.round(temperature * 10) / 10,
        }
      })
    } else {
      // Generate monthly temperature data for 30 days
      return Array.from({ length: 30 }, (_, i) => {
        const day = i + 1
        let baseTemp = 55
        
        // Weekend pattern
        if (day % 7 === 0 || day % 7 === 6) {
          baseTemp = 45
        }
        
        const randomVariation = (seededRandom(day + 3000) - 0.5) * 20
        const temperature = Math.max(25, Math.min(80, baseTemp + randomVariation))
        
        return {
          date: `${day}/12`,
          consumption: Math.round(temperature * 10) / 10,
        }
      })
    }
  }, [timeRange])

  if (!data) {
    return <div className="h-[400px] bg-[#1B1B1B] border border-[#2A2A2A] rounded-lg animate-pulse" />
  }

  return (
    <Card className="bg-[#1B1B1B] border-[#2A2A2A] text-[#EDEDED]">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#FF6B00]" />
              Energy Consumption
            </CardTitle>
            <CardDescription className="text-[#9A9A9A] mt-1">
              Temperature readings across selected time period.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-[#0E0E0E] p-1 rounded-lg w-fit">
            {(["24H", "7D", "30D"] as TimeRange[]).map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? "default" : "ghost"}
                onClick={() => setTimeRange(range)}
                className={`
                  ${timeRange === range ? "bg-[#FF6B00] hover:bg-[#E55A00] text-black" : "hover:bg-[#2A2A2A]"}
                  px-3 py-1 h-7 text-xs
                `}
              >
                {range}
              </Button>
            ))}
          </div>
          {/* Peak, Avg, Min Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-[#0E0E0E]/50 px-3 py-2 rounded-lg text-center">
              <div className="text-lg font-bold text-[#FF6B00]">85</div>
              <div className="text-xs text-[#9A9A9A]">Peak (°C)</div>
            </div>
            <div className="bg-[#0E0E0E]/50 px-3 py-2 rounded-lg text-center">
              <div className="text-lg font-bold text-[#EDEDED]">65</div>
              <div className="text-xs text-[#9A9A9A]">Avg (°C)</div>
            </div>
            <div className="bg-[#0E0E0E]/50 px-3 py-2 rounded-lg text-center">
              <div className="text-lg font-bold text-green-400">45</div>
              <div className="text-xs text-[#9A9A9A]">Min (°C)</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[280px] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis
              dataKey={timeRange === "24H" ? "time" : "date"}
              tick={{ fill: "#9A9A9A", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#9A9A9A", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              unit="°C"
              domain={["dataMin - 10", "dataMax + 10"]}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
              contentStyle={{
                backgroundColor: "#0E0E0E",
                border: "1px solid #2A2A2A",
                borderRadius: "0.5rem",
              }}
              itemStyle={{ color: "hsl(var(--chart-1))" }}
              labelStyle={{ color: "#9A9A9A" }}
              formatter={(value) => [`${(value as number).toLocaleString()}°C`, "Temperature"]}
            />
            <Bar dataKey="consumption" fill="#000000" radius={[4, 4, 0, 0]} strokeWidth={0} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
