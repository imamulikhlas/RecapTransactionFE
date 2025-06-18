"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PendingTransactionAlert from "@/components/alert/PendingTransactionAlert"
import {
  Crown,
  Star,
  Zap,
  Shield,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Database,
  Sparkles,
  ChevronRight,
  Rocket,
  Download,
  Copy,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"

interface Props {
  user: any
}

export default function ModernSubscription({ user }: Props) {
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingTx, setPendingTx] = useState<{
    orderId: string
    redirectUrl: string
  } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!user?.id) return

    const fetchData = async () => {
      try {
        // Fetch current subscription
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("*, subscription_plans(name, description, price)")
          .eq("user_id", user.id)
          .single()

        setCurrentPlan(subscription)

        // Fetch all plans
        const { data: allPlans } = await supabase.from("subscription_plans").select("*").order("price")

        setPlans(allPlans || [])

        // Fetch payment history
        const { data: paymentHistory } = await supabase
          .from("payment_transactions")
          .select("*, subscription_plans(name)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        setPayments(paymentHistory || [])
      } catch (error) {
        console.error("Error fetching subscription data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleSubscribe = async (plan: any) => {
    setLoadingPlanId(plan.id)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          plan_id: plan.slug,
          email: user.email,
          plan_name: plan.name,
          amount: plan.price,
        }),
      })

      const data = await res.json()

      if (res.status === 400 && data?.existing_transaction) {
        setPendingTx({
          orderId: data.existing_transaction.midtrans_order_id,
          redirectUrl: data.existing_transaction.snap_redirect_url,
        })
      } else if (data?.redirect_url) {
        // Trigger confetti before redirect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })

        setTimeout(() => {
          window.location.href = data.redirect_url
        }, 1000)
      } else {
        throw new Error("Failed to create payment")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingPlanId(null)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "settlement":
      case "capture":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "expire":
      case "cancel":
      case "failure":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "settlement":
      case "capture":
        return <CheckCircle2 className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "expire":
      case "cancel":
      case "failure":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes("premium")) return <Crown className="h-5 w-5" />
    if (planName.toLowerCase().includes("pro")) return <Star className="h-5 w-5" />
    return <Zap className="h-5 w-5" />
  }

  const getPlanFeatures = (planName: string) => {
    const features = {
      free: ["Basic transaction tracking", "Monthly reports", "Email support", "Up to 100 transactions"],
      pro: [
        "Advanced analytics",
        "Weekly reports",
        "Priority support",
        "Unlimited transactions",
        "Export to PDF/Excel",
        "Custom categories",
      ],
      premium: [
        "AI-powered insights",
        "Real-time notifications",
        "24/7 premium support",
        "Unlimited everything",
        "Advanced integrations",
        "Custom branding",
        "API access",
        "Multi-user access",
      ],
    }

    const key = planName.toLowerCase()
    return features[key as keyof typeof features] || features.free
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
          }}
          className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
      <div className="fixed top-1/2 left-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Alert untuk transaksi pending */}
        <AnimatePresence>
          {pendingTx && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PendingTransactionAlert orderId={pendingTx.orderId} redirectUrl={pendingTx.redirectUrl} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Subscription Management</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Unlock powerful features to take control of your finances. Upgrade anytime, cancel whenever you want.
          </p>
        </motion.div>

        <Tabs defaultValue="plans" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger
                value="plans"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600"
              >
                <Crown className="h-4 w-4" />
                Plans & Pricing
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600"
              >
                <CreditCard className="h-4 w-4" />
                Payment History
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="plans" className="space-y-8">
            {/* Current Plan Status */}
            {currentPlan && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-full">
                          {getPlanIcon(currentPlan.subscription_plans.name)}
                        </div>
                        <div>
                          <CardTitle className="text-green-300 text-xl">
                            {currentPlan.subscription_plans.name}
                          </CardTitle>
                          <CardDescription className="text-green-400">Your current active plan</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <p className="text-green-200">{currentPlan.subscription_plans.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="text-green-300">Active since:</span>
                        <span className="font-medium text-green-200">{formatDate(currentPlan.started_at)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="text-green-300">Monthly cost:</span>
                        <span className="font-bold text-green-200">
                          {formatCurrency(currentPlan.subscription_plans.price)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Available Plans */}
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const isActive = currentPlan?.plan_id === plan.id
                const isPremium = plan.name.toLowerCase().includes("premium")
                const features = getPlanFeatures(plan.name)

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative group"
                  >
                    {isPremium && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-4 py-2 shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <Card
                      className={`h-full transition-all duration-500 hover:scale-105 hover:shadow-2xl group-hover:border-blue-500/50 ${
                        isPremium
                          ? "glass border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"
                          : "glass-dark border-slate-700/50"
                      } ${isActive ? "ring-2 ring-green-500/50" : ""}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <CardHeader className="text-center pb-4 relative">
                        <div className="flex justify-center mb-4">
                          <div
                            className={`p-4 rounded-full transition-all duration-300 group-hover:scale-110 ${
                              isPremium
                                ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20"
                                : "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                            }`}
                          >
                            {getPlanIcon(plan.name)}
                          </div>
                        </div>
                        <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                        <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                        <div className="pt-4">
                          <div className="text-4xl font-bold text-white">
                            {plan.price > 0 ? formatCurrency(plan.price) : "Free"}
                          </div>
                          {plan.price > 0 && <div className="text-sm text-slate-400">per month</div>}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6 relative">
                        <ul className="space-y-3">
                          {features.map((feature, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + idx * 0.05 }}
                              className="flex items-center gap-3 text-sm"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                              <span className="text-slate-300">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>

                        <Button
                          onClick={() => handleSubscribe(plan)}
                          disabled={isActive || loadingPlanId === plan.id}
                          className={`w-full mt-6 transition-all duration-300 ${
                            isPremium
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          } ${isActive ? "opacity-60" : ""}`}
                          variant={isActive ? "outline" : "default"}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Current Plan
                            </>
                          ) : loadingPlanId === plan.id ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Rocket className="h-4 w-4 mr-2" />
                              Upgrade Now
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-dark border-slate-700/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
                        <CreditCard className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">Payment History</CardTitle>
                        <CardDescription className="text-slate-400">
                          Track all your subscription payments and transactions
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  {payments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-slate-800/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <CreditCard className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-lg">No payment history yet</p>
                      <p className="text-slate-500 text-sm mt-2">Your payment transactions will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment, index) => (
                        <motion.div
                          key={payment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-6 border border-slate-700/50 rounded-lg hover:bg-slate-700/20 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                              {getStatusIcon(payment.status)}
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium text-white">
                                {payment.subscription_plans?.name || "Unknown Plan"}
                              </div>
                              <div className="text-sm text-slate-400">{formatDate(payment.created_at)}</div>
                              <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                                ID: {payment.midtrans_order_id}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(payment.midtrans_order_id, "Transaction ID")}
                                  className="h-5 w-5 p-0 hover:bg-slate-600"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="font-bold text-xl text-white">
                              {formatCurrency(Number.parseInt(payment.gross_amount))}
                            </div>
                            <Badge className={getStatusColor(payment.status)}>
                              {getStatusIcon(payment.status)}
                              <span className="ml-1">{payment.status}</span>
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Features Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

            <CardHeader className="text-center relative">
              <CardTitle className="text-2xl text-white">Why Upgrade?</CardTitle>
              <CardDescription className="text-slate-400">
                See what you get with each plan and unlock your financial potential
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {[
                  {
                    icon: TrendingUp,
                    title: "Advanced Analytics",
                    description: "Get deeper insights into your spending patterns with AI-powered analysis",
                    color: "blue",
                  },
                  {
                    icon: Shield,
                    title: "Priority Support",
                    description: "Get help when you need it most with 24/7 premium customer support",
                    color: "green",
                  },
                  {
                    icon: Database,
                    title: "Unlimited Data",
                    description: "No limits on transactions, storage, or integrations for your business",
                    color: "purple",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="space-y-4 p-6 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                  >
                    <div
                      className={`p-4 rounded-full bg-${feature.color}-500/20 w-fit mx-auto group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className={`h-8 w-8 text-${feature.color}-400`} />
                    </div>
                    <h3 className="font-semibold text-lg text-white">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
