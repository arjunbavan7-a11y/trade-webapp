"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BotInstance } from "@/lib/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ClientDistributionProps {
  bots: BotInstance[]
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function ClientDistribution({ bots }: ClientDistributionProps) {
  const clientStats = bots.reduce((acc, bot) => {
    const clientName = bot.clientName || `Client ${bot.clientId}`
    if (!acc[clientName]) {
      acc[clientName] = 0
    }
    acc[clientName]++
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(clientStats).map(([name, count]) => ({
    name,
    value: count,
  }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Distribution</CardTitle>
          <CardDescription>No client data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Distribution</CardTitle>
        <CardDescription>Bots per client</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
