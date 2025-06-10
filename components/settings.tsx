"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Loader2, Mail, Server, Shield, Save, Edit, CheckCircle } from "lucide-react"
import { getEmailSettings, saveEmailSettings, type EmailSettings } from "@/lib/supabase"

interface SettingsProps {
  userId?: string
}

export default function Settings({ userId }: SettingsProps) {
  const [settings, setSettings] = useState<EmailSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email_user: "",
    email_pass: "",
    imap_host: "imap.gmail.com",
    imap_port: 993,
    active: true,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) return

      setLoading(true)
      try {
        const data = await getEmailSettings(userId)
        setSettings(data)
        if (data) {
          setFormData({
            email_user: data.email_user,
            email_pass: data.email_pass,
            imap_host: data.imap_host,
            imap_port: data.imap_port,
            active: data.active,
          })
        } else {
          setIsEditing(true)
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

  const handleSave = async () => {
    if (!userId) return

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      await saveEmailSettings(userId, formData)
      setSuccess("Settings saved successfully!")
      setIsEditing(false)

      // Refresh settings
      const updatedSettings = await getEmailSettings(userId)
      setSettings(updatedSettings)

      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      setError(error.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    if (settings) {
      setFormData({
        email_user: settings.email_user,
        email_pass: settings.email_pass,
        imap_host: settings.imap_host,
        imap_port: settings.imap_port,
        active: settings.active,
      })
    }
    setIsEditing(false)
    setError("")
    setSuccess("")
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
          Settings
        </h1>
        <p className="text-slate-400 mt-1">Configure your email transaction monitoring</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">
              {settings
                ? "Configure your email settings for automatic transaction monitoring"
                : "Set up your email account to start monitoring transactions"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-900/20 border-green-800">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email_user" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email_user"
                    type="email"
                    placeholder="your-email@gmail.com"
                    value={formData.email_user}
                    onChange={(e) => setFormData({ ...formData, email_user: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_pass" className="text-slate-300">
                    App Password
                  </Label>
                  <Input
                    id="email_pass"
                    type="password"
                    placeholder="Your app password"
                    value={formData.email_pass}
                    onChange={(e) => setFormData({ ...formData, email_pass: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="imap_host" className="text-slate-300">
                    IMAP Host
                  </Label>
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="imap_host"
                      type="text"
                      placeholder="imap.gmail.com"
                      value={formData.imap_host}
                      onChange={(e) => setFormData({ ...formData, imap_host: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imap_port" className="text-slate-300">
                    IMAP Port
                  </Label>
                  <Input
                    id="imap_port"
                    type="number"
                    placeholder="993"
                    value={formData.imap_port}
                    onChange={(e) => setFormData({ ...formData, imap_port: Number.parseInt(e.target.value) || 993 })}
                    disabled={!isEditing}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                <div className="space-y-1">
                  <Label className="text-slate-300 font-medium">Active Monitoring</Label>
                  <p className="text-sm text-slate-400">Enable automatic email monitoring for transactions</p>
                </div>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  disabled={!isEditing}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !formData.email_user || !formData.email_pass}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Settings
                </Button>
              )}
            </div>

            {!isEditing && settings && (
              <div className="mt-6 p-4 rounded-lg bg-blue-900/20 border border-blue-800">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Security Note</span>
                </div>
                <p className="text-sm text-blue-300">
                  Your email password is encrypted and stored securely. We recommend using an app-specific password
                  instead of your main email password for better security.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
