"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Copy, ExternalLink, AlertTriangle, Server, Code, Globe, Key, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SetupPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative">
      <pre className="bg-muted/50 border rounded-lg p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedCode === id ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar unreadAlerts={0} />

      <div className="flex-1 pl-16 lg:pl-64">
        <Header unreadAlerts={0} />

        <main className="p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Setup Guide</h1>
              <p className="text-muted-foreground mt-2">
                Complete guide to connect your MT5 trading bots to this dashboard
              </p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="mt5">MT5 Setup</TabsTrigger>
                <TabsTrigger value="api">API Config</TabsTrigger>
                <TabsTrigger value="vercel">Vercel Deploy</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Architecture Overview
                    </CardTitle>
                    <CardDescription>
                      How the MT5 bot communicates with your web dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-6 overflow-x-auto">
                      <pre className="text-sm text-muted-foreground whitespace-pre font-mono">
{`┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   MetaTrader 5      │         │   Vercel App        │         │   Admin Dashboard   │
│   (Your PC/VPS)     │────────▶│   (API Routes)      │────────▶│   (This UI)         │
│                     │  HTTPS  │                     │  React  │                     │
│   MT5_ExnessBot.mq5 │         │   /api/bots         │         │   Real-time charts  │
│   - Sends updates   │         │   /api/trades       │         │   Live metrics      │
│   - Every 30 sec    │         │   /api/alerts       │         │   Notifications     │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘`}
                      </pre>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Server className="h-8 w-8 text-blue-500" />
                            <div>
                              <p className="font-semibold">MT5 Expert Advisor</p>
                              <p className="text-sm text-muted-foreground">Runs on MetaTrader 5</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Executes trades and sends real-time updates to the API
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Code className="h-8 w-8 text-green-500" />
                            <div>
                              <p className="font-semibold">Next.js API Routes</p>
                              <p className="text-sm text-muted-foreground">Hosted on Vercel</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Receives data from MT5 and serves it to the dashboard
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Globe className="h-8 w-8 text-purple-500" />
                            <div>
                              <p className="font-semibold">Web Dashboard</p>
                              <p className="text-sm text-muted-foreground">This interface</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Displays real-time bot activity and analytics
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Start Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "Deploy this dashboard to Vercel",
                        "Set MT5_API_KEY environment variable in Vercel",
                        "Download MT5_ExnessBot.mq5 file",
                        "Install EA on MetaTrader 5",
                        "Configure EA input parameters with your Vercel URL",
                        "Allow WebRequest URL in MT5 settings",
                        "Start the EA on your chart",
                      ].map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mt5" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Step 1: Download the Expert Advisor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Download the <code className="bg-muted px-1.5 py-0.5 rounded">MT5_ExnessBot.mq5</code> file from this project.
                    </p>
                    <Button>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Download MT5_ExnessBot.mq5
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Step 2: Install on MetaTrader 5</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                      <li>Open MetaTrader 5</li>
                      <li>Press <Badge variant="outline">F4</Badge> to open MetaEditor</li>
                      <li>Go to <code className="bg-muted px-1.5 py-0.5 rounded">File - Open</code> and select the .mq5 file</li>
                      <li>Press <Badge variant="outline">F7</Badge> to compile (should show 0 errors)</li>
                      <li>Close MetaEditor and restart MT5</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Step 3: Configure Input Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      When you attach the EA to a chart, configure these parameters:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Parameter</th>
                            <th className="text-left py-2 px-4">Description</th>
                            <th className="text-left py-2 px-4">Example Value</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono">ApiBaseUrl</td>
                            <td className="py-2 px-4">Your Vercel app URL</td>
                            <td className="py-2 px-4 font-mono">https://your-app.vercel.app</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono">ApiKey</td>
                            <td className="py-2 px-4">API key for authentication</td>
                            <td className="py-2 px-4 font-mono">your-secret-key-123</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono">ClientId</td>
                            <td className="py-2 px-4">Unique ID for this client</td>
                            <td className="py-2 px-4 font-mono">client-marcus-chen</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono">ApiUpdateSeconds</td>
                            <td className="py-2 px-4">Update frequency (seconds)</td>
                            <td className="py-2 px-4 font-mono">30</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono">LotSize</td>
                            <td className="py-2 px-4">Trade lot size</td>
                            <td className="py-2 px-4 font-mono">0.6</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono">TakeProfitUSD</td>
                            <td className="py-2 px-4">Take profit in USD</td>
                            <td className="py-2 px-4 font-mono">0.60</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono">MaxLossPercent</td>
                            <td className="py-2 px-4">Max loss percentage</td>
                            <td className="py-2 px-4 font-mono">4.0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Step 4: Allow WebRequest URL
                    </CardTitle>
                    <CardDescription>
                      This is required for the EA to send data to your dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                      <li>In MT5, go to <code className="bg-muted px-1.5 py-0.5 rounded">Tools - Options</code></li>
                      <li>Click on the <Badge variant="outline">Expert Advisors</Badge> tab</li>
                      <li>Check <code className="bg-muted px-1.5 py-0.5 rounded">Allow WebRequest for listed URL</code></li>
                      <li>Click <Badge variant="outline">Add</Badge> and enter your Vercel URL:</li>
                    </ol>
                    <CodeBlock 
                      code="https://your-app.vercel.app"
                      id="webrequest-url"
                    />
                    <p className="text-sm text-yellow-500 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Without this step, the EA will show error 4014 in the Experts log
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      API Endpoints
                    </CardTitle>
                    <CardDescription>
                      Available endpoints that receive data from MT5
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">POST /api/bots</h4>
                      <p className="text-sm text-muted-foreground mb-2">Send bot status updates</p>
                      <CodeBlock 
                        code={`{
  "clientId": "c1",
  "accountNumber": "50123456",
  "symbol": "XAUUSD",
  "status": "running",
  "initialCapital": 10000,
  "currentBalance": 10250.50,
  "profit": 250.50,
  "profitPercentage": 2.51,
  "totalTrades": 45,
  "winningTrades": 32,
  "losingTrades": 13,
  "winRate": 71.11,
  "maxDrawdown": 1.5,
  "todayProfit": 35.20
}`}
                        id="api-bots"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">POST /api/trades</h4>
                      <p className="text-sm text-muted-foreground mb-2">Record trade activity</p>
                      <CodeBlock 
                        code={`{
  "ticket": 123456789,
  "clientId": "c1",
  "symbol": "XAUUSD",
  "type": "BUY",
  "lotSize": 0.6,
  "openPrice": 2350.25,
  "closePrice": 2351.25,
  "profit": 0.60,
  "status": "closed",
  "openTime": "2024-01-15 10:30:00",
  "closeTime": "2024-01-15 10:35:00"
}`}
                        id="api-trades"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">POST /api/alerts</h4>
                      <p className="text-sm text-muted-foreground mb-2">Send critical alerts</p>
                      <CodeBlock 
                        code={`{
  "type": "error",
  "title": "Max Loss Reached",
  "message": "Bot stopped due to reaching 4% max loss",
  "clientId": "c1",
  "botId": "bot-c1"
}`}
                        id="api-alerts"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Test API Connection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Test your API using curl:
                    </p>
                    <CodeBlock 
                      code={`curl -X POST https://your-app.vercel.app/api/bots \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key" \\
  -d '{"clientId":"test","accountNumber":"12345","currentBalance":10000}'`}
                      id="test-curl"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vercel" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Step 1: Deploy to Vercel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                      <li>Click the <Badge>Publish</Badge> button in the top right of v0</li>
                      <li>Connect your Vercel account if not already connected</li>
                      <li>Choose a project name (this becomes your URL)</li>
                      <li>Click Deploy</li>
                    </ol>
                    <p className="text-sm text-muted-foreground">
                      Your dashboard will be available at: <code className="bg-muted px-1.5 py-0.5 rounded">https://your-project.vercel.app</code>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Step 2: Set Environment Variables
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      In the v0 sidebar, click on <Badge variant="outline">Vars</Badge> and add:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Variable</th>
                            <th className="text-left py-2 px-4">Description</th>
                            <th className="text-left py-2 px-4">Example</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono">MT5_API_KEY</td>
                            <td className="py-2 px-4">Secret key for API authentication</td>
                            <td className="py-2 px-4 font-mono">sk_live_abc123xyz</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can generate an API key from the <a href="/api-keys" className="text-primary hover:underline">API Keys page</a>.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Step 3: Verify Deployment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      After deployment, verify everything is working:
                    </p>
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                      <li>Visit your Vercel URL</li>
                      <li>Go to the API Keys page and check the status</li>
                      <li>Test the connection using the test form</li>
                      <li>Configure your MT5 EA with the URL and API key</li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">API Key Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            All API endpoints require the x-api-key header for authentication
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">HTTPS Only</p>
                          <p className="text-sm text-muted-foreground">
                            All communication between MT5 and Vercel uses encrypted HTTPS
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Environment Variables</p>
                          <p className="text-sm text-muted-foreground">
                            Sensitive keys are stored as environment variables, never in code
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Input Validation</p>
                          <p className="text-sm text-muted-foreground">
                            All incoming data is validated before processing
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Important Security Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        Never share your API key publicly or commit it to version control
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        Rotate your API key periodically for enhanced security
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        Use a strong, unique API key (the generator creates 64-character keys)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        Monitor the Alerts page for any suspicious activity
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
