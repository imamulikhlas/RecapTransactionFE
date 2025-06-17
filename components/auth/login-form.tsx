"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { signIn, signUp, resendConfirmation } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedAlert, type AlertType } from "@/components/ui/enhanced-alert"
import { Loader2, Eye, EyeOff, Mail, Lock, User, RefreshCw } from "lucide-react"
import ForgotPasswordForm from "./forgot-password-form"

interface LoginFormProps {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showResendButton, setShowResendButton] = useState(false)
  const [alert, setAlert] = useState<{
    type: AlertType
    title?: string
    message: string
    isVisible: boolean
  }>({
    type: "info",
    message: "",
    isVisible: false,
  })

  const showAlert = (type: AlertType, message: string, title?: string) => {
    setAlert({ type, message, title, isVisible: true })
  }

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, isVisible: false }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    hideAlert()
    setShowResendButton(false)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            showAlert(
              "warning",
              "Please check your email and click the confirmation link before signing in.",
              "Email Not Confirmed",
            )
            setShowResendButton(true)
          } else if (error.message.includes("Invalid login credentials")) {
            showAlert("error", "Invalid email or password. Please try again.", "Login Failed")
          } else {
            showAlert("error", error.message, "Login Failed")
          }
        } else {
          showAlert("success", "Welcome back! Redirecting to dashboard...", "Login Successful")
          setTimeout(() => onSuccess(), 1500)
        }
      } else {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          if (error.message.includes("User already registered")) {
            showAlert("warning", "An account with this email already exists. Please sign in instead.", "Account Exists")
            setIsLogin(true)
          } else {
            showAlert("error", error.message, "Registration Failed")
          }
        } else {
          showAlert(
            "success",
            "Account created successfully! Please check your email to verify your account before signing in.",
            "Registration Successful",
          )
          setShowResendButton(true)
          setPassword("")
          setFullName("")
        }
      }
    } catch (error: any) {
      showAlert("error", error.message || "An unexpected error occurred", "Error")
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      showAlert("warning", "Please enter your email address first.", "Email Required")
      return
    }

    setResendLoading(true)
    hideAlert()

    try {
      const { error } = await resendConfirmation(email)
      if (error) {
        showAlert("error", error.message, "Resend Failed")
      } else {
        showAlert(
          "success",
          "Confirmation email has been resent. Please check your inbox and spam folder.",
          "Email Sent!",
        )
      }
    } catch (error: any) {
      showAlert("error", error.message || "Failed to resend confirmation email", "Error")
    } finally {
      setResendLoading(false)
    }
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
  }

  return (
    <>
      <EnhancedAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="shadow-2xl border border-slate-700 bg-slate-800/90 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              >
                <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-cover rounded-2xl" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TransHub
                </CardTitle>
                <CardDescription className="text-slate-400 text-base mt-2">
                  {isLogin ? "Welcome back! Sign in to your account" : "Create your account to get started"}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="fullName"
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="fullName" className="text-slate-300">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required={!isLogin}
                          className="h-12 pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <motion.div
                        initial={false}
                        animate={{ rotate: showPassword ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </motion.div>
                    </Button>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {showResendButton && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendConfirmation}
                        disabled={resendLoading}
                        className="w-full h-10 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
                      >
                        {resendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!resendLoading && <RefreshCw className="mr-2 h-4 w-4" />}
                        Resend Confirmation Email
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>

                  {isLogin && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="w-full text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Forgot your password?
                    </Button>
                  )}
                </motion.div>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-slate-400">or</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <Button
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    hideAlert()
                    setShowResendButton(false)
                  }}
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
