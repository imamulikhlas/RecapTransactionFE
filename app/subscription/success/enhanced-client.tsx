"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { CheckCircle2, Gift, Crown, ArrowRight, Download, Share2, Star, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import confetti from "canvas-confetti"

export default function ModernSuccessClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [tx, setTx] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(true)

  useEffect(() => {
    if (!orderId) return

    const fetchTransaction = async () => {
      const { data } = await supabase
        .from("payment_transactions")
        .select("*, subscription_plans(name, description)")
        .eq("midtrans_order_id", orderId)
        .single()

      setTx(data)
      setLoading(false)

      // Enhanced confetti animation
      if (data) {
        setTimeout(() => {
          const duration = 3000
          const animationEnd = Date.now() + duration
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

          function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min
          }

          const interval: any = setInterval(() => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
              return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            confetti(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
              }),
            )
            confetti(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
              }),
            )
          }, 250)
        }, 500)
      }
    }

    fetchTransaction()
  }, [orderId])

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
          }}
          className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!tx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <p className="text-red-400">Transaction not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/20 rounded-full"
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
      <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border border-gray-700/50 bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5" />

          <CardContent className="p-8 text-center space-y-6 relative">
            {/* Success Icon with enhanced animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="relative"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl relative">
                <CheckCircle2 className="h-12 w-12 text-white" />

                {/* Pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 border-2 border-green-400 rounded-full"
                />
              </div>

              {/* Floating icons */}
              <motion.div
                animate={{
                  rotate: 360,
                  y: [-5, 5, -5],
                }}
                transition={{
                  rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  y: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="h-4 w-4 text-yellow-900" />
                </div>
              </motion.div>

              <motion.div
                animate={{
                  rotate: -360,
                  y: [5, -5, 5],
                }}
                transition={{
                  rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  y: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                }}
                className="absolute -top-2 -left-2"
              >
                <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="h-3 w-3 text-purple-900" />
                </div>
              </motion.div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Payment Successful! 🎉
              </h1>
              <p className="text-gray-300 leading-relaxed">
                Welcome to <span className="font-semibold text-green-400">{tx.subscription_plans?.name}</span>! Your
                premium subscription is now active and ready to use.
              </p>
            </motion.div>

            {/* Enhanced Plan Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 text-base font-medium shadow-lg">
                <Crown className="h-5 w-5 mr-2" />
                {tx.subscription_plans?.name} Plan
              </Badge>
            </motion.div>

            <Separator className="bg-gray-700" />

            {/* Transaction Details with toggle */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Button
                variant="ghost"
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-300 hover:text-white mb-4"
              >
                {showDetails ? "Hide" : "Show"} Transaction Details
              </Button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-700/50 rounded-lg p-4 space-y-3 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order ID</span>
                      <span className="font-mono text-gray-200">{tx.midtrans_order_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plan</span>
                      <span className="font-medium text-gray-200">{tx.subscription_plans?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount</span>
                      <span className="font-bold text-green-400">
                        {formatCurrency(Number.parseInt(tx.gross_amount))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <Badge className="bg-green-900/50 text-green-300 border-green-700">{tx.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="text-gray-200">{formatDate(tx.paid_at || tx.created_at)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 text-left"
            >
              <h3 className="font-semibold text-blue-300 mb-3 flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                What's Next?
              </h3>
              <ul className="text-sm text-blue-200 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  Access to premium features is now available
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  Check your email for subscription details
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  Explore advanced analytics in your dashboard
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <a href="/" className="flex items-center justify-center">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </a>
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
