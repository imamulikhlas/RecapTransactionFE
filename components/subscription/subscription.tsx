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
} from "lucide-react"

interface Props {
  user: any
}

export default function EnhancedSubscription({ user }: Props) {
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingTx, setPendingTx] = useState<{
    orderId: string
    redirectUrl: string
  } | null>(null)

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
        window.location.href = data.redirect_url
      } else {
        throw new Error("Failed to create payment")
      }
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setLoadingPlanId(null)
    }
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
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expire":
      case "cancel":
      case "failure":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Subscription Management</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful features to take control of your finances. Upgrade anytime, cancel whenever you want.
        </p>
      </motion.div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Plans & Pricing
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-8">
          {/* Current Plan Status */}
          {currentPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPlanIcon(currentPlan.subscription_plans.name)}
                      <div>
                        <CardTitle className="text-green-800">{currentPlan.subscription_plans.name}</CardTitle>
                        <CardDescription className="text-green-600">Your current active plan</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-700">{currentPlan.subscription_plans.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Active since:</span>
                    <span className="font-medium text-green-800">{formatDate(currentPlan.started_at)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Monthly cost:</span>
                    <span className="font-bold text-green-800">
                      {formatCurrency(currentPlan.subscription_plans.price)}
                    </span>
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
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {isPremium && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <Card
                    className={`h-full transition-all duration-300 hover:shadow-lg ${
                      isPremium ? "border-2 border-yellow-300 shadow-lg" : ""
                    } ${isActive ? "ring-2 ring-green-500" : ""}`}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-4">
                        <div
                          className={`p-3 rounded-full ${
                            isPremium ? "bg-gradient-to-r from-yellow-100 to-orange-100" : "bg-blue-100"
                          }`}
                        >
                          {getPlanIcon(plan.name)}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                      <div className="pt-4">
                        <div className="text-3xl font-bold">{plan.price > 0 ? formatCurrency(plan.price) : "Free"}</div>
                        {plan.price > 0 && <div className="text-sm text-muted-foreground">per month</div>}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleSubscribe(plan)}
                        disabled={isActive || loadingPlanId === plan.id}
                        className={`w-full mt-6 ${
                          isPremium
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                            : ""
                        }`}
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment History
                </CardTitle>
                <CardDescription>Track all your subscription payments and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payment history yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment, index) => (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-full">{getStatusIcon(payment.status)}</div>
                          <div>
                            <div className="font-medium">{payment.subscription_plans?.name || "Unknown Plan"}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(payment.created_at)}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              ID: {payment.midtrans_order_id}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {formatCurrency(Number.parseInt(payment.gross_amount))}
                          </div>
                          <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Why Upgrade?</CardTitle>
            <CardDescription>See what you get with each plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto" />
                <h3 className="font-semibold">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">Get deeper insights into your spending patterns</p>
              </div>
              <div className="space-y-2">
                <Shield className="h-8 w-8 text-green-500 mx-auto" />
                <h3 className="font-semibold">Priority Support</h3>
                <p className="text-sm text-muted-foreground">Get help when you need it most</p>
              </div>
              <div className="space-y-2">
                <Database className="h-8 w-8 text-purple-500 mx-auto" />
                <h3 className="font-semibold">Unlimited Data</h3>
                <p className="text-sm text-muted-foreground">No limits on transactions or storage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
