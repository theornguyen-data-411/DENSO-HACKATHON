"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Legend, Cell, Tooltip } from "recharts"
import { useOverviewData } from "@/lib/store/hooks"
import { PieChartIcon as PieIcon } from "lucide-react"
import { useMemo } from "react"

// Seeded random number generator for consistent data
const seededRandom = (seed: number) => {
  let x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

export function ConsumptionBreakdown() {
  const data = useOverviewData()

  // Define custom colors for sensor distribution
  const sensorColors = [
    "#FF6B00", // Orange - Left
    "#F44336", // Red - Right
    "#2196F3", // Blue - Lift
  ]

  // Generate dummy data for Sensor Distribution
  const sensorDistributionData = useMemo(() => {
    const categories = ["Left", "Right", "Lift"]
    const generatedData = categories.map((name, index) => {
      const value = Math.floor(seededRandom(index + 1) * 30) + 10 // Random value between 10 and 40
      return { name, value, color: sensorColors[index] }
    })

    // Ensure total is not 0 for percentage calculation
    const total = generatedData.reduce((sum, item) => sum + item.value, 0)
    if (total === 0) {
      generatedData[0].value = 100 // Fallback if all are 0
    }

    return generatedData
  }, [])

  const totalAlerts = sensorDistributionData.reduce((sum, item) => sum + item.value, 0)
  const topSensor = sensorDistributionData.reduce((max, item) => (item.value > max.value ? item : max), sensorDistributionData[0])

  return (
    <Card className="bg-[#1B1B1B] border-[#2A2A2A] text-[#EDEDED]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-[#FF6B00]" />
          Sensor Distribution
        </CardTitle>
        <CardDescription className="text-[#9A9A9A] mt-1">
          Distribution of alerts by sensor location.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sensorDistributionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
              paddingAngle={5}
            >
              {sensorDistributionData.map((entry, index) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1B1B1B", borderColor: "#2A2A2A", borderRadius: "8px" }}
              itemStyle={{ color: "#EDEDED" }}
              formatter={(value: number, name: string) => [`${value} alerts`, name]}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ right: -10, fontSize: "12px", color: "#EDEDED" }}
              formatter={(value: string, entry: any) => (
                <span style={{ color: entry.color }}>{value} ({entry.payload.value} alerts)</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      {/* Summary */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0E0E0E]/50 p-2 rounded-lg text-center">
            <div className="text-lg font-bold text-[#FF6B00]">{topSensor ? `${Math.round((topSensor.value / totalAlerts) * 100)}%` : 'N/A'}</div>
            <div className="text-xs text-[#9A9A9A]">Top Sensor</div>
          </div>
          <div className="bg-[#0E0E0E]/50 p-2 rounded-lg text-center">
            <div className="text-lg font-bold text-[#EDEDED]">{totalAlerts}</div>
            <div className="text-xs text-[#9A9A9A]">Total Alerts</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
