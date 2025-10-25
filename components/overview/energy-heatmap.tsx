"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useOverviewData } from "@/lib/store/hooks"
import { Calendar, TrendingUp } from "lucide-react"

interface HeatmapCell {
  day: string
  amrId: string
  alertCount: number
  intensity: number
}

interface TooltipData {
  day: string
  amrId: string
  alertCount: number
  x: number
  y: number
  show: boolean
}

export function EnergyHeatmap() {
  const data = useOverviewData()
  const [tooltip, setTooltip] = useState<TooltipData>({
    day: "",
    amrId: "",
    alertCount: 0,
    x: 0,
    y: 0,
    show: false,
  })

  // Seeded random function for consistent values
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Memoize heatmap data to prevent regeneration on every render
  const heatmapData = useMemo((): HeatmapCell[] => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const amrIds = Array.from({ length: 21 }, (_, i) => i.toString().padStart(2, "0")) // 00-20
    const heatmapData: HeatmapCell[] = []

    // Generate realistic alert patterns for AMR devices
    days.forEach((day, dayIndex) => {
      amrIds.forEach((amrId, amrIndex) => {
        let baseAlerts = 0

        // Weekend pattern (lower alerts)
        const isWeekend = dayIndex >= 5
        if (isWeekend) {
          baseAlerts = Math.floor(seededRandom(dayIndex * 21 + amrIndex + 1000) * 3)
        } else {
          baseAlerts = Math.floor(seededRandom(dayIndex * 21 + amrIndex + 2000) * 8)
        }

        // Some AMRs have higher alert rates (simulate problematic devices)
        if (amrIndex % 7 === 0) {
          baseAlerts = Math.floor(baseAlerts * 1.5)
        }

        // Add some randomness
        const randomVariation = Math.floor(seededRandom(dayIndex * 21 + amrIndex + 3000) * 4)
        const alertCount = Math.max(0, baseAlerts + randomVariation)

        heatmapData.push({
          day,
          amrId,
          alertCount,
          intensity: 0, // Will be calculated after all values are generated
        })
      })
    })

    // Calculate intensity (0-1) based on min/max values
    const values = heatmapData.map((cell) => cell.alertCount)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue

    return heatmapData.map((cell) => ({
      ...cell,
      intensity: range > 0 ? (cell.alertCount - minValue) / range : 0,
    }))
  }, []) // Empty dependency array - only generate once

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const amrIds = Array.from({ length: 21 }, (_, i) => i.toString().padStart(2, "0")) // 00-20

  // Calculate insights (also memoized to prevent recalculation)
  const insights = useMemo(() => {
    const weekdayAvg =
      heatmapData.filter((cell) => !["Sat", "Sun"].includes(cell.day)).reduce((sum, cell) => sum + cell.alertCount, 0) /
      (5 * 21)

    const weekendAvg =
      heatmapData.filter((cell) => ["Sat", "Sun"].includes(cell.day)).reduce((sum, cell) => sum + cell.alertCount, 0) /
      (2 * 21)

    const totalAlerts = heatmapData.reduce((sum, cell) => sum + cell.alertCount, 0)

    return { weekdayAvg, weekendAvg, totalAlerts }
  }, [heatmapData])

  if (!data) {
    return <div className="h-[400px] bg-[#1B1B1B] border border-[#2A2A2A] rounded-lg animate-pulse" />
  }

  const getIntensityColor = (intensity: number) => {
    const opacity = Math.max(0.1, intensity)
    return `rgba(255, 107, 0, ${opacity})`
  }

  const getCellValue = (day: string, amrId: string) => {
    return heatmapData.find((cell) => cell.day === day && cell.amrId === amrId)
  }

  const handleCellHover = (event: React.MouseEvent, day: string, amrId: string, alertCount: number) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top - 10

    setTooltip({
      day,
      amrId,
      alertCount,
      x,
      y,
      show: true,
    })
  }

  const handleCellLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }))
  }

  // Portal tooltip component
  const TooltipPortal = () => {
    if (!tooltip.show || typeof window === "undefined") return null

    return createPortal(
      <div
        className="fixed bg-[#0E0E0E] border border-[#2A2A2A] rounded px-2 py-1 text-xs whitespace-nowrap text-[#EDEDED] pointer-events-none transition-opacity duration-200 shadow-lg"
        style={{
          left: tooltip.x,
          top: tooltip.y,
          transform: "translateX(-50%)",
          zIndex: 99999,
        }}
      >
        {tooltip.day} AMR-{tooltip.amrId}
        <br />
        {tooltip.alertCount} alerts
        {/* Arrow pointing down */}
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "4px solid #2A2A2A",
          }}
        />
      </div>,
      document.body,
    )
  }

  return (
    <>
      <Card className="bg-[#1B1B1B] border-[#2A2A2A] text-[#EDEDED]">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FF6B00]" />
                Overheat Heatmap
              </CardTitle>
              <CardDescription className="text-[#9A9A9A] mt-1">
                Alert patterns by AMR device and day
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-[#0E0E0E]/50 px-3 py-2 rounded-lg text-center">
                <div className="text-lg font-bold text-[#EDEDED]">{insights.weekdayAvg.toFixed(0)}</div>
                <div className="text-xs text-[#9A9A9A]">Weekday Avg</div>
              </div>
              <div className="bg-[#0E0E0E]/50 px-3 py-2 rounded-lg text-center">
                <div className="text-lg font-bold text-[#EDEDED]">{insights.totalAlerts}</div>
                <div className="text-xs text-[#9A9A9A]">Total Alerts</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[280px] p-2">
          {/* Heatmap Grid */}
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* AMR ID labels */}
                <div className="flex mb-1">
                  <div className="w-10"></div>
                  {amrIds.map((amrId) => (
                    <div key={amrId} className="flex-1 text-center text-[8px] text-[#9A9A9A] min-w-[12px] font-medium">
                      {amrId}
                    </div>
                  ))}
                </div>

                {/* Heatmap rows */}
                <div className="flex-1 flex flex-col justify-between">
                  {days.map((day, dayIndex) => (
                    <div key={day} className="flex items-center">
                      <div className="w-10 text-[10px] text-[#9A9A9A] font-medium pr-2">{day}</div>
                      <div className="flex-1 flex">
                        {amrIds.map((amrId) => {
                          const cell = getCellValue(day, amrId)
                          return (
                            <div
                              key={`${day}-${amrId}`}
                              className="flex-1 aspect-square min-w-[12px] mx-[1px] rounded-sm cursor-pointer transition-all hover:scale-110 hover:brightness-125"
                              style={{
                                backgroundColor: cell ? getIntensityColor(cell.intensity) : "#2A2A2A",
                              }}
                              onMouseEnter={(e) => cell && handleCellHover(e, day, amrId, cell.alertCount)}
                              onMouseLeave={handleCellLeave}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2A2A2A]">
              <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                <span>Low</span>
                <div className="flex">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity) => (
                    <div
                      key={intensity}
                      className="w-3 h-3 mx-0.5 rounded-sm"
                      style={{ backgroundColor: getIntensityColor(intensity) }}
                    />
                  ))}
                </div>
                <span>High</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Compact Insights */}
        <div className="px-6 pb-4">
            <div className="flex items-start gap-2 p-2 bg-[#0E0E0E]/30 rounded-lg">
            <TrendingUp className="h-3 w-3 text-[#FF6B00] mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-medium text-[#EDEDED]">Alert Pattern</div>
              <div className="text-[#9A9A9A] mt-1">
                Weekend: {((insights.weekendAvg / insights.weekdayAvg - 1) * 100).toFixed(0)}%
                {insights.weekendAvg > insights.weekdayAvg ? " higher" : " lower"} • AMR devices: 00-20
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Portal-based tooltip */}
      <TooltipPortal />
    </>
  )
}
