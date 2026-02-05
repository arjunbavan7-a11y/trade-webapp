"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts"
import type { BotInstance } from "@/lib/types"

interface WinRateChartProps {
  bots: BotInstance[]
}

export function WinRateChart({ bots }: WinRateChartProps) {
  const chartData = bots.map((bot) => ({
    name: bot.clientName.split(" ")[0],
    winRate: bot.winRate,
    trades: bot.totalTrades,
    wins: bot.winningTrades,
    losses: bot.losingTrades,
  }))

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Win Rate Comparison</h3>
        <p className="text-sm text-muted-foreground">Trading success rate by client</p>
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
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number, name: string, props: { payload: { wins: number; losses: number; trades: number } }) => [
                `${value}% (${props.payload.wins}W / ${props.payload.losses}L)`,
                "Win Rate",
              ]}
            />
            <ReferenceLine
              y={60}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{
                value: "Target 60%",
                position: "right",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
              }}
            />
            <Bar
              dataKey="winRate"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
