"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OverviewKpiSection } from "@/components/overview/overview-kpi-section"
import { EnergyTrendChart } from "@/components/overview/energy-trend-chart"
import { EnergyHeatmap } from "@/components/overview/energy-heatmap"
import { ConsumptionBreakdown } from "@/components/overview/consumption-breakdown"
import { useAppDispatch, useOverviewData, useOverviewLoading } from "@/lib/store/hooks"
import { fetchOverviewDataRequest } from "@/lib/store/slices/overviewSlice"

export default function OverviewPage() {
  const dispatch = useAppDispatch()
  const data = useOverviewData()
  const loading = useOverviewLoading()

  useEffect(() => {
    if (!data) {
      dispatch(fetchOverviewDataRequest())
    }
  }, [dispatch, data])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-[#FF6B00] rounded flex items-center justify-center">
            <div className="h-3 w-3 bg-black rounded-sm"></div>
          </div>
          <h1 className="text-2xl font-semibold text-[#EDEDED]">Overview</h1>
        </div>

        {/* KPI Section - 5 cards in a row */}
        <OverviewKpiSection />

        {/* Energy Consumption - Full Width */}
        <EnergyTrendChart />

        {/* Consumption Breakdown and Energy Consumption Heatmap - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConsumptionBreakdown />
          <EnergyHeatmap />
        </div>
      </div>
    </DashboardLayout>
  )
}
