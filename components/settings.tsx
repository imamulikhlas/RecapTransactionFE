"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Mail,
  Key,
  Save,
  Edit,
  CheckCircle,
  ExternalLink,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  getEmailSettings,
  saveEmailSettings,
  type EmailSettings,
} from "@/lib/supabase";

interface SettingsProps {
  userId?: string;
}
//test
export default function Settings({ userId }: SettingsProps) {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email_user: "",
    email_pass: "",
    active: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const data = await getEmailSettings(userId);
        setSettings(data);
        if (data) {
          setFormData({
            email_user: data.email_user,
            email_pass: data.email_pass,
            active: data.active,
          });
        } else {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const validateGmailEmail = (email: string) => {
    return email.toLowerCase().endsWith("@gmail.com");
  };

  const handleSave = async () => {
    if (!userId) return;

    if (!validateGmailEmail(formData.email_user)) {
      setError("Please enter a valid Gmail address (must end with @gmail.com)");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: Cek koneksi IMAP ke Gmail
      const testRes = await fetch("/api/imap-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_user: formData.email_user,
          email_pass: formData.email_pass,
        }),
      });

      const testJson = await testRes.json();

      if (!testRes.ok || !testJson.success) {
        throw new Error(
          testJson.error || "Failed to connect to Gmail IMAP server"
        );
      }

      // Step 2: Lanjut simpan ke Supabase
      const settingsToSave = {
        email_user: formData.email_user,
        email_pass: formData.email_pass,
        imap_host: "imap.gmail.com",
        imap_port: 993,
        active: formData.active,
      };

      await saveEmailSettings(userId, settingsToSave);
      setSuccess("Gmail settings saved successfully!");
      setIsEditing(false);

      const updatedSettings = await getEmailSettings(userId);
      setSettings(updatedSettings);

      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    if (settings) {
      setFormData({
        email_user: settings.email_user,
        email_pass: settings.email_pass,
        active: settings.active,
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Gmail Settings
        </h1>
        <p className="text-slate-400 mt-1">
          Connect your Gmail account for automatic transaction monitoring
        </p>
      </div>

      {/* App Password Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      <Alert className="bg-blue-900/20 border-blue-800">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-300">
          <div className="space-y-2">
            <p className="font-medium">How to get Gmail App Password:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Go to your →{" "}
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google Account settings
                </a>
              </li>
              <li>Enable 2-Step Verification if not already enabled</li>
              <li>
                Go to Security →{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  App passwords
                </a>
              </li>
              <li>Generate a new app password for "TransHub"</li>
              <li>Use that 16-character password below</li>
            </ol>
            <a
              href="https://support.google.com/accounts/answer/185833"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Learn more about App Passwords
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </AlertDescription>
      </Alert>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              Gmail Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">
              {settings
                ? "Your Gmail account is connected and ready for transaction monitoring"
                : "Connect your Gmail account to start monitoring transactions automatically"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-800"
              >
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-900/20 border-green-800">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="email_user" className="text-slate-300">
                  Gmail Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email_user"
                    type="email"
                    placeholder="your-email@gmail.com"
                    value={formData.email_user}
                    onChange={(e) =>
                      setFormData({ ...formData, email_user: e.target.value })
                    }
                    disabled={!isEditing}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 disabled:opacity-60"
                  />
                </div>
                {isEditing &&
                  !validateGmailEmail(formData.email_user) &&
                  formData.email_user && (
                    <p className="text-sm text-red-400">
                      Please enter a valid Gmail address
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_pass" className="text-slate-300">
                  Gmail App Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email_pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="16-character app password"
                    value={formData.email_pass}
                    onChange={(e) => {
                      const cleaned = e.target.value
                        .replace(/\s+/g, "")
                        .slice(0, 16);
                      setFormData({
                        ...formData,
                        email_pass: cleaned,
                      });
                    }}
                    onPaste={(e) => {
                      e.preventDefault(); 
                      const text = e.clipboardData.getData("text/plain");
                      const cleaned = text.replace(/\s+/g, "").slice(0, 16); 
                      setFormData({
                        ...formData,
                        email_pass: cleaned,
                      });
                    }}
                    disabled={!isEditing}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 disabled:opacity-60"
                    maxLength={16}
                  />

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {isEditing && (
                  <p className="text-xs text-slate-400">
                    Enter the 16-character app password from your Google Account
                    settings
                  </p>
                )}
              </div>

              {/* Auto-configured settings display */}
              {!isEditing && settings && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-slate-300">IMAP Server</Label>
                    <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                      <p className="text-white font-mono">imap.gmail.com</p>
                      <p className="text-xs text-slate-400">
                        Auto-configured for Gmail
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">IMAP Port</Label>
                    <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                      <p className="text-white font-mono">993 (SSL)</p>
                      <p className="text-xs text-slate-400">
                        Secure connection
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                <div className="space-y-1">
                  <Label className="text-slate-300 font-medium">
                    Active Monitoring
                  </Label>
                  <p className="text-sm text-slate-400">
                    Enable automatic Gmail monitoring for transactions
                  </p>
                </div>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
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
                    disabled={
                      saving ||
                      !formData.email_user ||
                      !formData.email_pass ||
                      !validateGmailEmail(formData.email_user)
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {saving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save Gmail Settings
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
              <div className="mt-6 p-4 rounded-lg bg-green-900/20 border border-green-800">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Gmail Connected Successfully
                  </span>
                </div>
                <p className="text-sm text-green-300">
                  Your Gmail account is connected and configured for automatic
                  transaction monitoring. The system will securely access your
                  emails using Gmail's IMAP server (imap.gmail.com:993) with SSL
                  encryption.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
