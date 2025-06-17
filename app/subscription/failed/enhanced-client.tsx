"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { AlertTriangle, RefreshCw, ArrowLeft, HelpCircle, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function EnhancedFailedClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [tx, setTx] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [retryLoading, setRetryLoading] = useState(false)

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-200/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
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
            {/* Failed Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3, delay: 0.5 }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">!</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Failed Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
              <p className="text-gray-600">
                Don't worry! You can try again or contact support if the problem persists.
              </p>
            </motion.div>

            <Separator />

            {/* Transaction Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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
                <span className="font-bold text-gray-900">{formatCurrency(Number.parseInt(tx.gross_amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge className="bg-red-100 text-red-800 border-red-200">{tx.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900">{formatDate(tx.created_at)}</span>
              </div>
            </motion.div>

            {/* Common Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 rounded-lg p-4 text-left"
            >
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                Common Issues
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Insufficient balance in your account</li>
                <li>• Network connection issues</li>
                <li>• Card expired or blocked</li>
                <li>• Payment timeout</li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              {tx.snap_redirect_url && (
                <Button
                  onClick={handleRetry}
                  disabled={retryLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  {retryLoading ? (
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
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
              )}

              <div className="flex gap-2">
                <Button variant="outline" asChild className="flex-1">
                  <a href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </a>
                </Button>
                <Button variant="outline" className="flex-1">
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
