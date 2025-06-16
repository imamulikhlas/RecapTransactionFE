"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function PendingTransactionAlert({
  orderId,
  redirectUrl,
}: {
  orderId: string
  redirectUrl: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" />
            <CardTitle className="text-yellow-800">Transaksi Tertunda</CardTitle>
          </div>
          <Badge className="bg-yellow-600 text-white">Order ID: {orderId}</Badge>
        </CardHeader>
        <CardContent className="flex justify-between items-center flex-wrap gap-3">
          <p className="text-sm text-yellow-700">
            Kamu masih memiliki transaksi yang belum diselesaikan. Silakan lanjutkan pembayaran sebelum membuat langganan baru.
          </p>
          <Button
            onClick={() => window.location.href = redirectUrl}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Lanjutkan Pembayaran <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
