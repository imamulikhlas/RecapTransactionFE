"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight, X, Clock, CreditCard } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function PendingTransactionAlert({
  orderId,
  redirectUrl,
  onCancel,
}: {
  orderId: string
  redirectUrl: string
  onCancel?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    if (onCancel) {
      setIsLoading(true)
      await onCancel()
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className="relative overflow-hidden"
    >
      <Card className="border-0 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 shadow-lg shadow-amber-100/50">
        <CardContent className="p-0">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-orange-100/20" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/30 to-transparent rounded-full translate-y-12 -translate-x-12" />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <AlertTriangle className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-1">Transaksi Menunggu Pembayaran</h3>
                  <p className="text-amber-700/80 text-sm">Selesaikan pembayaran untuk mengaktifkan langganan Anda</p>
                </div>
              </div>

              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1 shadow-md">
                <CreditCard className="w-3 h-3 mr-1" />
                {orderId}
              </Badge>
            </div>

            {/* Content */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4 border border-amber-200/50">
              <div className="flex items-center gap-3 text-amber-800">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <p className="text-sm font-medium">
                  Anda memiliki transaksi yang belum diselesaikan. Lanjutkan pembayaran atau batalkan untuk membuat
                  langganan baru.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => (window.location.href = redirectUrl)}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-12"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Lanjutkan Pembayaran
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {onCancel && (
                <Button
                  onClick={handleCancel}
                  disabled={isLoading}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 h-12 px-6"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Membatalkan..." : "Batalkan"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
