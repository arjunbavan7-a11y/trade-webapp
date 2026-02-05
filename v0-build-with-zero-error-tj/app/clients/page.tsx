"use client"

import { useTradingData } from "@/hooks/use-trading-data"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Loader2, Mail, Calendar, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ClientsPage() {
  const {
    clients,
    allBots,
    alerts,
    isLoading,
  } = useTradingData()

  const unreadAlerts = alerts.filter((a) => !a.read).length

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    )
  }

  const getClientBot = (clientId: string) => allBots.find((b) => b.clientId === clientId)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar unreadAlerts={unreadAlerts} />

      <div className="flex-1 pl-16 lg:pl-64">
        <Header unreadAlerts={unreadAlerts} />

        <main className="p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Clients</h2>
                <p className="text-muted-foreground">Manage and monitor client accounts</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {clients.length} total clients
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => {
                const bot = getClientBot(client.id)
                return (
                  <div
                    key={client.id}
                    className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{client.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          client.status === "active" && "bg-primary/10 text-primary",
                          client.status === "paused" && "bg-warning/10 text-warning",
                          client.status === "stopped" && "bg-destructive/10 text-destructive"
                        )}
                      >
                        {client.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Account</div>
                        <div className="font-mono text-sm text-foreground">{client.accountNumber}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Broker</div>
                        <div className="text-sm text-foreground">{client.broker}</div>
                      </div>
                    </div>

                    {bot && (
                      <div className="mt-4 border-t border-border pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Balance</div>
                            <div className="font-mono text-sm text-foreground">
                              ${bot.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">P/L</div>
                            <div
                              className={cn(
                                "font-mono text-sm",
                                bot.profit >= 0 ? "text-primary" : "text-destructive"
                              )}
                            >
                              {bot.profit >= 0 ? "+" : ""}${bot.profit.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Joined {client.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
