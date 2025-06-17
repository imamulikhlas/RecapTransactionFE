"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import {
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  XCircle,
  Clock,
  CreditCard,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ModernFailedClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [tx, setTx] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [retryLoading, setRetryLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(true)

  useEffect(() => {
    if (!orderId) return

    const fetchTransaction = async () => {
      const { data } = await supabase
        .from("payment_transactions")
        .select("*, subscription_plans(name)")
        .eq("midtrans_order_id", orderId)
        .single()

      setTx(data)
      setLoading(false)
    }

    fetchTransaction()
  }, [orderId])

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })

  const handleRetry = () => {
    if (tx?.snap_redirect_url) {
      setRetryLoading(true)
      window.location.href = tx.snap_redirect_url
    }
  }

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
          className="w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950/10 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-400/20 rounded-full"
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
      <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border border-gray-700/50 bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" />

          <CardContent className="p-8 text-center space-y-6 relative">
            {/* Failed Icon with enhanced animation */}
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
              <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl relative">
                <AlertTriangle className="h-12 w-12 text-white" />

                {/* Pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 border-2 border-red-400 rounded-full"
                />
              </div>

              {/* Floating warning icon */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  y: [-2, 2, -2],
                }}
                transition={{
                  rotate: { duration: 0.5, repeat: Number.POSITIVE_INFINITY },
                  y: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <XCircle className="h-4 w-4 text-yellow-900" />
                </div>
              </motion.div>
            </motion.div>

            {/* Failed Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Payment Failed
              </h1>
              <p className="text-gray-300 leading-relaxed">
                Don't worry! Payment issues happen. You can try again or contact our support team for assistance.
              </p>
            </motion.div>

            <Separator className="bg-gray-700" />

            {/* Transaction Details with toggle */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
                      <span className="font-bold text-red-400">{formatCurrency(Number.parseInt(tx.gross_amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <Badge className="bg-red-900/50 text-red-300 border-red-700">{tx.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="text-gray-200">{formatDate(tx.created_at)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Common Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 text-left"
            >
              <h3 className="font-semibold text-blue-300 mb-3 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Common Issues
              </h3>
              <ul className="text-sm text-blue-200 space-y-2">
                <li className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-3 text-blue-400" />
                  Insufficient balance in your account
                </li>
                <li className="flex items-center">
                  <Clock className="w-4 h-4 mr-3 text-blue-400" />
                  Payment timeout or network issues
                </li>
                <li className="flex items-center">
                  <XCircle className="w-4 h-4 mr-3 text-blue-400" />
                  Card expired or blocked by bank
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              {tx.snap_redirect_url && (
                <Button
                  onClick={handleRetry}
                  disabled={retryLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {retryLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
              )}

              <div className="flex gap-3">
                <Button variant="outline" asChild className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <a href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Support
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
