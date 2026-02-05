"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Server,
  Monitor,
  Database,
  Wifi,
  CheckCircle2,
  AlertCircle,
  Code,
  Settings,
  Play,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar unreadAlerts={0} />

      <main className="flex-1 pl-16 lg:pl-64">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              How The System Works
            </h1>
            <p className="text-muted-foreground">
              Complete step-by-step guide on how data flows from your MT5 bot to this web dashboard
            </p>
          </div>

          {/* System Architecture */}
          <Card className="mb-8 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                System Architecture Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                {/* MT5 Terminal */}
                <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border border-border">
                  <Monitor className="h-12 w-12 text-blue-500 mb-2" />
                  <span className="font-semibold">MT5 Terminal</span>
                  <span className="text-xs text-muted-foreground">Your Computer</span>
                  <Badge variant="outline" className="mt-2">Expert Advisor</Badge>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-8 w-8 text-primary hidden md:block" />
                  <ArrowRight className="h-8 w-8 text-primary rotate-90 md:hidden" />
                  <span className="text-xs text-muted-foreground mt-1">HTTP POST</span>
                </div>

                {/* Vercel API */}
                <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border border-border">
                  <Server className="h-12 w-12 text-green-500 mb-2" />
                  <span className="font-semibold">Vercel API</span>
                  <span className="text-xs text-muted-foreground">Cloud Server</span>
                  <Badge variant="outline" className="mt-2">/api/bots</Badge>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-8 w-8 text-primary hidden md:block" />
                  <ArrowRight className="h-8 w-8 text-primary rotate-90 md:hidden" />
                  <span className="text-xs text-muted-foreground mt-1">Real-time</span>
                </div>

                {/* Dashboard */}
                <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border border-border">
                  <Wifi className="h-12 w-12 text-primary mb-2" />
                  <span className="font-semibold">Web Dashboard</span>
                  <span className="text-xs text-muted-foreground">Your Browser</span>
                  <Badge variant="outline" className="mt-2">Live Updates</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step by Step */}
          <h2 className="text-2xl font-bold mb-4">Step-by-Step Process</h2>

          {/* Step 1 */}
          <Card className="mb-4 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">Step 1</Badge>
                Set Up Your API Key in Vercel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                First, you need to configure the API key that will authenticate requests from your MT5 bot.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">In v0 sidebar, click "Vars"</span>
                    <p className="text-sm text-muted-foreground">Look for the Vars option in the left sidebar of your v0 chat</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Add a new variable: MT5_API_KEY</span>
                    <p className="text-sm text-muted-foreground">Create any secure key like: mt5_abc123xyz789</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Save the key</span>
                    <p className="text-sm text-muted-foreground">This key will be used to verify requests from your bot</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="mb-4 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">Step 2</Badge>
                Deploy Your Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Deploy the dashboard to Vercel to get a public URL that your MT5 bot can send data to.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Click "Publish" in v0</span>
                    <p className="text-sm text-muted-foreground">This deploys your dashboard to Vercel</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Copy your Vercel URL</span>
                    <p className="text-sm text-muted-foreground">Example: https://your-app.vercel.app</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="mb-4 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">Step 3</Badge>
                Configure MT5 to Allow Web Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                MT5 blocks all web requests by default. You must add your Vercel URL to the allowed list.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Settings className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Open MT5 Terminal</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Go to: Tools &gt; Options &gt; Expert Advisors</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Check "Allow WebRequest for listed URL"</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Add your URL: https://your-app.vercel.app</span>
                    <p className="text-sm text-muted-foreground">Click "Add" and paste your full Vercel URL</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Click OK to save</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-yellow-500">Important!</span>
                  <p className="text-sm text-muted-foreground">
                    If you skip this step, MT5 will show "Error 4014" and your bot cannot send data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="mb-4 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">Step 4</Badge>
                Install the Expert Advisor (EA)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Download and install the MT5_ExnessBot.mq5 file in your MT5 terminal.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Download MT5_ExnessBot.mq5</span>
                    <p className="text-sm text-muted-foreground">Get the file from this project (click three dots &gt; Download ZIP)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Copy to MT5 Experts folder</span>
                    <p className="text-sm text-muted-foreground">Usually: C:\Users\[You]\AppData\Roaming\MetaQuotes\Terminal\[ID]\MQL5\Experts</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Open MetaEditor (F4) and compile (F7)</span>
                    <p className="text-sm text-muted-foreground">Should show "0 errors, 0 warnings"</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Restart MT5</span>
                    <p className="text-sm text-muted-foreground">The EA will appear in Navigator &gt; Expert Advisors</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card className="mb-4 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">Step 5</Badge>
                Configure and Start the EA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Attach the EA to your chart and configure it with your API settings.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Play className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Drag EA onto your chart (e.g., XAUUSD)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Configure Input Parameters:</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-medium">Parameter</th>
                      <th className="text-left p-2 font-medium">Value</th>
                      <th className="text-left p-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-2 font-mono text-primary">ApiBaseUrl</td>
                      <td className="p-2">https://your-app.vercel.app</td>
                      <td className="p-2 text-muted-foreground">Your deployed Vercel URL</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-2 font-mono text-primary">ApiKey</td>
                      <td className="p-2">mt5_abc123xyz789</td>
                      <td className="p-2 text-muted-foreground">Same key you set in Vercel Vars</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-2 font-mono text-primary">ClientId</td>
                      <td className="p-2">client1</td>
                      <td className="p-2 text-muted-foreground">Unique ID for this client/account</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-2 font-mono text-primary">ApiUpdateSeconds</td>
                      <td className="p-2">30</td>
                      <td className="p-2 text-muted-foreground">How often to send updates (seconds)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Enable "Algo Trading" button in MT5 toolbar</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Check the smiley face appears on chart</span>
                    <p className="text-sm text-muted-foreground">This means the EA is running</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 6 */}
          <Card className="mb-4 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">Step 6</Badge>
                Verify Data is Flowing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Once the EA is running, it will send data to your dashboard every 30 seconds.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Check MT5 Experts tab</span>
                    <p className="text-sm text-muted-foreground">You should see "API Update sent successfully" messages</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Open your dashboard in browser</span>
                    <p className="text-sm text-muted-foreground">The "Waiting for MT5 connection" message will change to show real data</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">See live updates</span>
                    <p className="text-sm text-muted-foreground">Balance, profits, trades will update in real-time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Data is Sent */}
          <Card className="mb-8 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                What Data Does MT5 Send?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Every 30 seconds, your MT5 bot sends this JSON data to the dashboard:
              </p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "clientId": "client1",
  "accountNumber": "12345678",
  "symbol": "XAUUSD",
  "status": "running",
  "initialCapital": 1000.00,
  "currentBalance": 1025.50,
  "profit": 25.50,
  "profitPercentage": 2.55,
  "totalTrades": 42,
  "winningTrades": 35,
  "losingTrades": 7,
  "winRate": 83.33,
  "maxDrawdown": 1.2,
  "todayProfit": 15.30,
  "lotSize": 0.6,
  "takeProfitUSD": 0.6,
  "maxLossPercentage": 4.0,
  "lastTradeTime": "2024.01.15 14:30:00"
}`}
              </pre>
            </CardContent>
          </Card>

          {/* Test Connection */}
          <Card className="mb-8 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                How to Test Your API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Before starting the MT5 bot, you can test if your API key is correct:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Go to the <a href="/api-keys" className="text-primary underline">API Keys</a> page</li>
                <li>Enter the <strong>exact same key</strong> you configured in Vercel Vars (MT5_API_KEY)</li>
                <li>Click "Test Connection"</li>
                <li>If successful, your MT5 bot will be able to connect</li>
              </ol>
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-yellow-500">Keys Must Match!</span>
                  <p className="text-sm text-muted-foreground">
                    The API key in Vercel Vars, the test input, and your MT5 EA configuration must all be identical.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <p className="font-medium text-foreground">MT5 shows "Error 4014"</p>
                  <p className="text-sm text-muted-foreground">
                    You forgot to add your Vercel URL to allowed WebRequest URLs. Go to Tools &gt; Options &gt; Expert Advisors and add it.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <p className="font-medium text-foreground">Dashboard shows "Waiting for MT5 connection"</p>
                  <p className="text-sm text-muted-foreground">
                    Either the MT5 bot is not running, or the API key doesn't match. Check the Experts tab in MT5 for error messages.
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <p className="font-medium text-foreground">Test connection says "Invalid API key"</p>
                  <p className="text-sm text-muted-foreground">
                    The key you entered in the test doesn't match MT5_API_KEY in Vercel Vars. Make sure they are exactly the same.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Data was showing but stopped</p>
                  <p className="text-sm text-muted-foreground">
                    MT5 bot might have stopped or lost internet connection. Check if the EA is still running (smiley face visible on chart).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
