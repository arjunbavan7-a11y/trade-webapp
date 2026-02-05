"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { PerformanceDataPoint } from "@/lib/types"

interface PerformanceChartProps {
  data: PerformanceDataPoint[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data.map((point) => ({
    time: point.timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    balance: point.totalBalance,
    profit: point.totalProfit,
  }))

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portfolio Performance</h3>
          <p className="text-sm text-muted-foreground">Real-time balance tracking</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Balance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-sm text-muted-foreground">Profit</span>
          </div>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                name === "balance" ? "Balance" : "Profit",
              ]}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
