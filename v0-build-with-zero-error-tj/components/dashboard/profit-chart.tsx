"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { BotInstance } from "@/lib/types"

interface ProfitChartProps {
  bots: BotInstance[]
}

export function ProfitChart({ bots }: ProfitChartProps) {
  const chartData = bots.map((bot) => ({
    name: bot.clientName.split(" ")[0],
    profit: bot.profit,
    profitPercentage: bot.profitPercentage,
  }))

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Profit by Client</h3>
        <p className="text-sm text-muted-foreground">Current P/L for each trading account</p>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="name"
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
              tickFormatter={(value) => `$${value}`}
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
                "Profit/Loss",
              ]}
            />
            <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.profit >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
