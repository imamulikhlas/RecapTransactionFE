"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { CheckCircle2, Sparkles, Gift, Crown, ArrowRight, Download, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import confetti from "canvas-confetti"

export default function EnhancedSuccessClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [tx, setTx] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

      // Trigger confetti animation
      if (data) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!tx) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Transaction not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-200/30 rounded-full"
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
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </motion.div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h1 className="text-2xl font-bold text-gray-900">Payment Successful! 🎉</h1>
              <p className="text-gray-600">
                Welcome to <span className="font-semibold text-green-600">{tx.subscription_plans?.name}</span>! Your
                subscription is now active.
              </p>
            </motion.div>

            {/* Plan Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm">
                <Crown className="h-4 w-4 mr-2" />
                {tx.subscription_plans?.name} Plan
              </Badge>
            </motion.div>

            <Separator />

            {/* Transaction Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm"
            >
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-mono text-gray-900">{tx.midtrans_order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">{tx.subscription_plans?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-green-600">{formatCurrency(Number.parseInt(tx.gross_amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">{tx.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900">{formatDate(tx.paid_at || tx.created_at)}</span>
              </div>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-50 rounded-lg p-4 text-left"
            >
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Gift className="h-4 w-4 mr-2" />
                What's Next?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Access to premium features is now available</li>
                <li>• Check your email for subscription details</li>
                <li>• Explore advanced analytics in your dashboard</li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <a href="/" className="flex items-center justify-center">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
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
