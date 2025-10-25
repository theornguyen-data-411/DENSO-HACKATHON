"use client"

import { UnifiedKpiCard } from "@/components/unified-kpi-card"
import { Zap, TrendingUp, DollarSign, Leaf } from "lucide-react"
import { useOverviewData } from "@/lib/store/hooks"

export function OverviewKpiSection() {
  const data = useOverviewData()

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 bg-[#1B1B1B] border border-[#2A2A2A] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const { kpis } = data

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UnifiedKpiCard
        title="Max Temperature (Today)"
        value="85"
        unit="°C"
        icon={<Zap />}
        emphasis="primary"
        trend={{
          direction: "up",
          percentage: "2.1%",
          period: "vs yesterday",
        }}
      />
      <UnifiedKpiCard
        title="Overheat Events (Today)"
        value="3"
        unit="events"
        icon={<TrendingUp />}
        emphasis="secondary"
        trend={{
          direction: "down",
          percentage: "0.9%",
          period: "vs yesterday",
        }}
      />
      <UnifiedKpiCard
        title="Average Operating Temperature (Today)"
        value="65.2"
        unit="°C"
        icon={<DollarSign />}
        emphasis="secondary"
        trend={{
          direction: "up",
          percentage: "1.5%",
          period: "vs yesterday",
        }}
      />
      <UnifiedKpiCard
        title="AMRs Online (Today)"
        value="24"
        unit="devices"
        icon={<Leaf />}
        emphasis="tertiary"
        trend={{
          direction: "up",
          percentage: "100%",
          period: "operational",
        }}
      />
    </div>
  )
}
