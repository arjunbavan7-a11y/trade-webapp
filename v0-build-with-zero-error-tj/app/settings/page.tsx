"use client"

import { useState } from "react"
import { useTradingData } from "@/hooks/use-trading-data"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Loader2, Shield, Bell, Sliders, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { alerts, isLoading } = useTradingData()
  const unreadAlerts = alerts.filter((a) => !a.read).length

  const [settings, setSettings] = useState({
    emailAlerts: true,
    maxLossAlerts: true,
    dailyReports: false,
    twoFactorAuth: true,
    sessionTimeout: "30",
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar unreadAlerts={unreadAlerts} />

      <div className="flex-1 pl-16 lg:pl-64">
        <Header unreadAlerts={unreadAlerts} />

        <main className="p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground">Configure dashboard preferences and security</p>
            </div>

            {/* Notifications */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage alert preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Email Alerts</div>
                    <div className="text-sm text-muted-foreground">Receive critical alerts via email</div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      settings.emailAlerts ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                        settings.emailAlerts && "translate-x-5"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Max Loss Alerts</div>
                    <div className="text-sm text-muted-foreground">Alert when bot reaches loss threshold</div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, maxLossAlerts: !settings.maxLossAlerts })}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      settings.maxLossAlerts ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                        settings.maxLossAlerts && "translate-x-5"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Daily Reports</div>
                    <div className="text-sm text-muted-foreground">Receive daily performance summaries</div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, dailyReports: !settings.dailyReports })}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      settings.dailyReports ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                        settings.dailyReports && "translate-x-5"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Security</h3>
                  <p className="text-sm text-muted-foreground">Manage authentication and access</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add extra security to your account</div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      settings.twoFactorAuth ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                        settings.twoFactorAuth && "translate-x-5"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Session Timeout</div>
                    <div className="text-sm text-muted-foreground">Auto-logout after inactivity</div>
                  </div>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trading Parameters */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Sliders className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Default Trading Parameters</h3>
                  <p className="text-sm text-muted-foreground">Configure default bot settings</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Default Lot Size</label>
                  <input
                    type="text"
                    defaultValue="0.6"
                    disabled
                    className="mt-1 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Take Profit (USD)</label>
                  <input
                    type="text"
                    defaultValue="$0.60"
                    disabled
                    className="mt-1 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Max Loss (%)</label>
                  <input
                    type="text"
                    defaultValue="4%"
                    disabled
                    className="mt-1 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Trade Interval</label>
                  <input
                    type="text"
                    defaultValue="5 minutes"
                    disabled
                    className="mt-1 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                These values are configured in the MT5 Expert Advisor
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
