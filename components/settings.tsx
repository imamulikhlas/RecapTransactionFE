"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, CheckCircle, AlertCircle, Unlink, RefreshCw } from "lucide-react"
import { getEmailSettings, saveEmailSettings, type EmailSettings } from "@/lib/supabase"

interface SettingsProps {
  userId?: string
}

interface GoogleAuthResponse {
  access_token: string
  refresh_token: string
  email: string
  expires_in: number
}

export default function Settings({ userId }: SettingsProps) {
  const [settings, setSettings] = useState<EmailSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [connectedEmail, setConnectedEmail] = useState("")
  const [monitoringActive, setMonitoringActive] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) return

      setLoading(true)
      try {
        const data = await getEmailSettings(userId)
        setSettings(data)
        if (data && data.email_user && data.email_pass) {
          setIsConnected(true)
          setConnectedEmail(data.email_user)
          setMonitoringActive(data.active)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        setError("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [userId])

  const handleGoogleConnect = async () => {
    setConnecting(true)
    setError("")
    setSuccess("")

    try {
      // Create Google OAuth2 URL
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      if (!clientId) {
        throw new Error("Google OAuth not configured")
      }

      const redirectUri = `${window.location.origin}/api/auth/google/callback`
      const scope = "https://www.googleapis.com/auth/gmail.readonly email profile"
      const responseType = "code"
      const accessType = "offline"
      const prompt = "consent"

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
      authUrl.searchParams.set("client_id", clientId)
      authUrl.searchParams.set("redirect_uri", redirectUri)
      authUrl.searchParams.set("scope", scope)
      authUrl.searchParams.set("response_type", responseType)
      authUrl.searchParams.set("access_type", accessType)
      authUrl.searchParams.set("prompt", prompt)
      authUrl.searchParams.set("state", userId || "")

      // Open popup window for OAuth
      const popup = window.open(authUrl.toString(), "google-oauth", "width=500,height=600,scrollbars=yes,resizable=yes")

      // Listen for OAuth completion
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === "GOOGLE_OAUTH_SUCCESS") {
          const { tokens, email } = event.data

          try {
            // Save OAuth tokens to database
            await saveEmailSettings(userId!, {
              email_user: email,
              email_pass: tokens.refresh_token, // Store refresh token as "password"
              imap_host: "oauth2", // Special marker for OAuth
              imap_port: 993,
              active: true,
            })

            setIsConnected(true)
            setConnectedEmail(email)
            setMonitoringActive(true)
            setSuccess("Gmail connected successfully!")

            // Refresh settings
            const updatedSettings = await getEmailSettings(userId!)
            setSettings(updatedSettings)

            setTimeout(() => setSuccess(""), 3000)
          } catch (error: any) {
            setError(error.message || "Failed to save Gmail connection")
          }

          popup?.close()
        } else if (event.data.type === "GOOGLE_OAUTH_ERROR") {
          setError(event.data.error || "Failed to connect to Gmail")
          popup?.close()
        }

        window.removeEventListener("message", handleMessage)
      }

      window.addEventListener("message", handleMessage)

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          window.removeEventListener("message", handleMessage)
          setConnecting(false)
        }
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Failed to initiate Google connection")
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!userId) return

    setDisconnecting(true)
    setError("")

    try {
      // Remove OAuth settings
      await saveEmailSettings(userId, {
        email_user: "",
        email_pass: "",
        imap_host: "",
        imap_port: 993,
        active: false,
      })

      setIsConnected(false)
      setConnectedEmail("")
      setMonitoringActive(false)
      setSettings(null)
      setSuccess("Gmail disconnected successfully!")

      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      setError(error.message || "Failed to disconnect Gmail")
    } finally {
      setDisconnecting(false)
    }
  }

  const handleToggleMonitoring = async (active: boolean) => {
    if (!userId || !settings) return

    try {
      await saveEmailSettings(userId, {
        email_user: settings.email_user,
        email_pass: settings.email_pass,
        imap_host: settings.imap_host,
        imap_port: settings.imap_port,
        active,
      })

      setMonitoringActive(active)
      setSuccess(`Monitoring ${active ? "enabled" : "disabled"}!`)
      setTimeout(() => setSuccess(""), 2000)
    } catch (error: any) {
      setError(error.message || "Failed to update monitoring status")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Gmail Integration
        </h1>
        <p className="text-slate-400 mt-1">
          Connect your Gmail account with one click for automatic transaction monitoring
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              Gmail Connection
            </CardTitle>
            <CardDescription className="text-slate-400">
              {isConnected
                ? "Your Gmail account is connected and ready for transaction monitoring"
                : "Connect your Gmail account to start monitoring transactions automatically"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-900/20 border-green-800">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">{success}</AlertDescription>
              </Alert>
            )}

            {!isConnected ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Connect Your Gmail</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Securely connect your Gmail account using Google OAuth. We'll automatically monitor your emails for
                    transaction notifications.
                  </p>
                </div>

                <Button
                  onClick={handleGoogleConnect}
                  disabled={connecting}
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-gray-900 font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Connect with Google
                    </>
                  )}
                </Button>

                <div className="mt-6 text-xs text-slate-500 max-w-md mx-auto">
                  <p>
                    By connecting, you agree to allow secure access to your Gmail for transaction monitoring. We only
                    read emails and never send or modify them.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Connected Account Info */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-900/20 border border-green-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-400">Gmail Connected</p>
                      <p className="text-sm text-green-300">{connectedEmail}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    {disconnecting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Unlink className="mr-2 h-4 w-4" />
                    )}
                    Disconnect
                  </Button>
                </div>

                {/* Monitoring Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                  <div className="space-y-1">
                    <Label className="text-slate-300 font-medium">Active Monitoring</Label>
                    <p className="text-sm text-slate-400">Enable automatic Gmail monitoring for transactions</p>
                  </div>
                  <Switch
                    checked={monitoringActive}
                    onCheckedChange={handleToggleMonitoring}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                {/* Connection Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Connection Type</Label>
                    <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                      <p className="text-white font-medium">Google OAuth 2.0</p>
                      <p className="text-xs text-slate-400">Secure API access</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Status</Label>
                    <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                      <p className="text-green-400 font-medium">Active & Monitoring</p>
                      <p className="text-xs text-slate-400">Real-time sync enabled</p>
                    </div>
                  </div>
                </div>

                {/* Sync Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    View Sync History
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
