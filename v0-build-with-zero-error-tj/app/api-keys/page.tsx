"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Key,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function ApiKeysPage() {
  const [adminPassword, setAdminPassword] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Test connection state
  const [testKey, setTestKey] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // API status state
  const [apiStatus, setApiStatus] = useState<{
    configured: boolean;
    message: string;
    keyPreview: string | null;
  } | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Check API status on mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const generateApiKey = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedKey(null);

    try {
      const response = await fetch("/api/generate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate API key");
      }

      setGeneratedKey(data.apiKey);
      setShowKey(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkApiStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const response = await fetch("/api/generate-key");
      const data = await response.json();
      setApiStatus(data);
    } catch {
      setApiStatus({ configured: false, message: "Failed to check status", keyPreview: null });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": testKey,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message,
        });
        // Refresh status after successful test
        checkApiStatus();
      } else {
        setTestResult({
          success: false,
          message: data.message || data.error || "Connection failed. Check your API key.",
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: "Connection failed. Network error.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Get the current dashboard URL
  const dashboardUrl = typeof window !== "undefined" ? window.location.origin : "https://your-app.vercel.app";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar unreadAlerts={0} />

      <div className="flex-1 pl-16 lg:pl-64">
        <Header unreadAlerts={0} />

        <main className="p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Current Status Card */}
            <Card className={`border-2 ${apiStatus?.configured ? "border-emerald-500/50 bg-emerald-500/5" : "border-amber-500/50 bg-amber-500/5"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {apiStatus?.configured ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  )}
                  API Key Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isCheckingStatus ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Checking status...
                  </div>
                ) : apiStatus?.configured ? (
                  <div className="space-y-3">
                    <p className="text-emerald-500 font-medium">API Key is configured and active</p>
                    {apiStatus.keyPreview && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Key:</span>
                        <code className="rounded bg-muted px-2 py-1 font-mono text-sm">{apiStatus.keyPreview}</code>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Your MT5 bots can now connect to this dashboard. Use the same API key in your MT5 EA configuration.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-amber-500 font-medium">No API Key configured</p>
                    <p className="text-sm text-muted-foreground">
                      Generate an API key below and add it to your Vercel environment variables.
                    </p>
                  </div>
                )}
                <Button
                  onClick={checkApiStatus}
                  variant="outline"
                  size="sm"
                  className="mt-4 bg-transparent"
                  disabled={isCheckingStatus}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isCheckingStatus ? "animate-spin" : ""}`} />
                  Refresh Status
                </Button>
              </CardContent>
            </Card>

            {/* Generate API Key Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Generate New API Key
                </CardTitle>
                <CardDescription>
                  Generate a secure API key for your MT5 bots to communicate with this dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Default password: <code className="rounded bg-muted px-1">admin123</code>
                  </p>
                </div>

                <Button
                  onClick={generateApiKey}
                  disabled={isGenerating || !adminPassword}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Generate API Key
                    </>
                  )}
                </Button>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-500">
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {generatedKey && (
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-primary bg-primary/10 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="text-primary">Your API Key</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowKey(!showKey)}
                          >
                            {showKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedKey)}
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <code className="block break-all rounded bg-background p-3 font-mono text-sm">
                        {showKey ? generatedKey : "••••••••••••••••••••••••••••••••••••••••"}
                      </code>
                    </div>

                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold text-amber-500">Save this key now - it will only be shown once!</p>
                          <ol className="mt-2 list-decimal space-y-1 pl-4 text-muted-foreground">
                            <li>Copy the key above</li>
                            <li>Go to your Vercel project settings</li>
                            <li>Add environment variable: <code className="rounded bg-muted px-1">MT5_API_KEY</code></li>
                            <li>Paste the key as the value</li>
                            <li>Redeploy your project</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Connection Card */}
            <Card>
              <CardHeader>
                <CardTitle>Test API Connection</CardTitle>
                <CardDescription>
                  Verify your API key works by sending a test signal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testKey">API Key</Label>
                  <Input
                    id="testKey"
                    type="password"
                    placeholder="Paste your API key to test"
                    value={testKey}
                    onChange={(e) => setTestKey(e.target.value)}
                  />
                </div>

                <Button
                  onClick={testConnection}
                  disabled={isTesting || !testKey}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>

                {testResult && (
                  <div
                    className={`flex items-center gap-2 rounded-lg p-4 ${
                      testResult.success
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                        : "bg-red-500/10 text-red-500 border border-red-500/30"
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 flex-shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* MT5 Configuration Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>MT5 Expert Advisor Configuration</CardTitle>
                <CardDescription>
                  Configure your MT5 bot to send data to this dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                      <h4 className="font-semibold">Allow WebRequest in MT5</h4>
                    </div>
                    <div className="ml-11 space-y-2 text-sm text-muted-foreground">
                      <p>Open MT5 and go to: <code className="rounded bg-muted px-1">Tools &gt; Options &gt; Expert Advisors</code></p>
                      <p>Check: <strong>"Allow WebRequest for listed URL"</strong></p>
                      <p>Add this URL:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded bg-muted p-2 break-all">{dashboardUrl}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(dashboardUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                      <h4 className="font-semibold">Configure EA Input Parameters</h4>
                    </div>
                    <div className="ml-11 space-y-3 text-sm">
                      <p className="text-muted-foreground">When attaching the EA to a chart, set these inputs:</p>
                      <div className="rounded bg-muted p-3 font-mono text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ApiBaseUrl</span>
                          <span className="text-primary">{dashboardUrl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ApiKey</span>
                          <span className="text-primary">{apiStatus?.keyPreview || "mt5_your_key_here"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ClientId</span>
                          <span className="text-primary">client_001</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                      <h4 className="font-semibold">Start the Bot</h4>
                    </div>
                    <div className="ml-11 space-y-2 text-sm text-muted-foreground">
                      <p>Enable <strong>"Algo Trading"</strong> in MT5 toolbar</p>
                      <p>Confirm the smiley face appears on the chart</p>
                      <p>Check the Experts tab for "API Update sent successfully" messages</p>
                    </div>
                  </div>

                  {/* Download EA */}
                  <div className="rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-4 text-center">
                    <p className="mb-2 font-medium">Need the MT5 Expert Advisor file?</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download the .mq5 file from this project and compile it in MetaEditor
                    </p>
                    <Button variant="outline" className="bg-transparent" asChild>
                      <a href="/setup">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Setup Guide
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
