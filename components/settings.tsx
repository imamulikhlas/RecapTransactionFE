"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Key,
  Save,
  Edit,
  CheckCircle,
  ExternalLink,
  Info,
  Eye,
  EyeOff,
  Shield,
  Server,
  Zap,
  Copy,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  getEmailSettings,
  saveEmailSettings,
  type EmailSettings,
} from "@/lib/supabase";

interface SettingsProps {
  userId?: string;
}

export default function ModernSettings({ userId }: SettingsProps) {
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
  const { toast } = useToast();

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
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
      // Step 1: Test IMAP connection
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

      // Step 2: Save to Supabase
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

      toast({
        title: "Settings Saved!",
        description: "Your Gmail configuration has been updated successfully.",
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to save settings");
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
          }}
          className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse pointer-events-none z-0" />
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Gmail Integration
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Gmail Settings
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Connect your Gmail account for automatic transaction monitoring and
            seamless email processing
          </p>
        </motion.div>

        {/* App Password Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Info className="h-6 w-6 text-blue-400" />
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-lg font-semibold text-blue-300">
                    How to get Gmail App Password
                  </h3>
                  <div className="grid gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          1
                        </div>
                        <span className="text-sm text-slate-300">
                          Enable 2-Step Verification{" "}
                          <a
                            href="https://myaccount.google.com/security"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            Google Account settings
                          </a>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <span className="text-sm text-slate-300 ml-2">
                          <li>Go to Security →{" "}
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
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          <Info className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-slate-300">
                          <a
                            href="https://support.google.com/accounts/answer/185833"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            Learn more about App Passwords
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </span>
                      </div>
                    </div>
                    {/* <div className="space-y-3">
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-blue-300 bg-slate-800/40 hover:bg-blue-500/10 border border-blue-500/20 transition-colors duration-200"
                      >
                        <Shield className="h-4 w-4" />
                        Google Account Security
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-purple-300 bg-slate-800/40 hover:bg-purple-500/10 border border-purple-500/20 transition-colors duration-200"
                      >
                        <Key className="h-4 w-4" />
                        App Passwords
                        <ExternalLink className="h-3 w-3" />
                      </a>
                                            <a
                        href="https://support.google.com/accounts/answer/185833"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white-300 bg-slate-800/40 hover:bg-purple-500/10 border border-purple-500/20 transition-colors duration-200"
                      >
                        <Info className="h-4 w-4" />
                        Learn More
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Configuration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-dark border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      Gmail Configuration
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {settings
                        ? "Your Gmail account is connected and ready"
                        : "Connect your Gmail account to start monitoring"}
                    </CardDescription>
                  </div>
                </div>
                {settings && !isEditing && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Alert */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid gap-6">
                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="email_user"
                    className="text-slate-300 font-medium"
                  >
                    Gmail Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="email_user"
                      type="email"
                      placeholder="your-email@gmail.com"
                      value={formData.email_user}
                      onChange={(e) =>
                        setFormData({ ...formData, email_user: e.target.value })
                      }
                      disabled={!isEditing}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 disabled:opacity-60 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                    {!isEditing && formData.email_user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(formData.email_user, "Email")
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-slate-700"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {isEditing &&
                    !validateGmailEmail(formData.email_user) &&
                    formData.email_user && (
                      <p className="text-sm text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" />
                        Please enter a valid Gmail address
                      </p>
                    )}
                </motion.div>

                {/* Password Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="email_pass"
                    className="text-slate-300 font-medium"
                  >
                    Gmail App Password
                  </Label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
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
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 disabled:opacity-60 focus:border-blue-500/50 focus:ring-blue-500/20"
                      maxLength={16}
                    />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-slate-500">
                      Enter the 16-character app password from your Google
                      Account settings
                    </p>
                  )}
                </motion.div>

                {/* Server Configuration Display */}
                {!isEditing && settings && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <div className="space-y-3">
                      <Label className="text-slate-300 font-medium flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        IMAP Server
                      </Label>
                      <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-white font-mono text-sm">
                          imap.gmail.com
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Auto-configured for Gmail
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-slate-300 font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        IMAP Port
                      </Label>
                      <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-white font-mono text-sm">
                          993 (SSL)
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Secure connection
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Separator className="bg-slate-700/50" />

                {/* Active Monitoring Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-800/30 to-slate-700/30 border border-slate-700/50"
                >
                  <div className="space-y-1">
                    <Label className="text-slate-300 font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4" />
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
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex justify-end gap-3 pt-4"
              >
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
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {saving && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Gmail Settings
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEdit}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Settings
                  </Button>
                )}
              </motion.div>

              {/* Connection Status */}
              {!isEditing && settings && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
                >
                  <div className="flex items-center gap-3 text-green-400 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-lg">
                      Gmail Connected Successfully
                    </span>
                  </div>
                  <p className="text-sm text-green-300/80 leading-relaxed">
                    Your Gmail account is securely connected and configured for
                    automatic transaction monitoring. The system uses Gmail's
                    IMAP server with SSL encryption to ensure your data remains
                    protected.
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
