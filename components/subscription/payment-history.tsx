"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronUp,
  Receipt,
  ClipboardCopy,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Calendar,
  DollarSign,
  ExternalLink,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Props {
  userId: string
}

export default function PaymentHistory({ userId }: Props) {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("*, subscription_plans(name, description)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!error) setPayments(data || [])
      setLoading(false)
    }

    fetchPayments()
  }, [userId])

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`

  const formatDate = (raw: string) =>
    new Date(raw).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })

  const formatDateOnly = (raw: string) =>
    new Date(raw).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "settlement":
      case "capture":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "challenge":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "expire":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancel":
      case "failure":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "settlement":
      case "capture":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "pending":
      case "challenge":
        return <Clock className="h-4 w-4 text-amber-600" />
      case "expire":
      case "cancel":
      case "failure":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "settlement":
        return "Berhasil"
      case "capture":
        return "Berhasil"
      case "pending":
        return "Menunggu"
      case "challenge":
        return "Verifikasi"
      case "expire":
        return "Kedaluwarsa"
      case "cancel":
        return "Dibatalkan"
      case "failure":
        return "Gagal"
      default:
        return status
    }
  }

  const canCancel = (status: string) => {
    return ["pending", "challenge"].includes(status)
  }

  const handleCancel = async (paymentId: string, orderId: string) => {
    setCancellingId(paymentId)

    try {
      // Call API to cancel transaction
      const response = await fetch("/api/midtrans/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      })

      if (response.ok) {
        // Update local state
        setPayments((prev) =>
          prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "cancel" } : payment)),
        )
        toast.success("Transaksi berhasil dibatalkan")
      } else {
        toast.error("Gagal membatalkan transaksi")
      }
    } catch (error) {
      console.error("Cancel error:", error)
      toast.error("Terjadi kesalahan saat membatalkan transaksi")
    } finally {
      setCancellingId(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Disalin ke clipboard")
  }

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>
        <Badge variant="secondary" className="ml-auto">
          {payments.length} transaksi
        </Badge>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Receipt className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">Belum ada transaksi</h3>
            <p className="text-sm text-slate-500 text-center max-w-sm">
              Riwayat pembayaran langganan Anda akan muncul di sini setelah melakukan transaksi pertama.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {payments.map((pmt, index) => {
              const expanded = expandedId === pmt.id
              const isPending = canCancel(pmt.status)
              const isSuccess = ["settlement", "capture"].includes(pmt.status)

              return (
                <motion.div
                  key={pmt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                      isPending ? "border-amber-200 bg-amber-50/30" : isSuccess ? "border-green-200 bg-green-50/30" : ""
                    }`}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleExpand(pmt.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSuccess ? "bg-green-100" : isPending ? "bg-amber-100" : "bg-slate-100"
                          }`}
                        >
                          {getStatusIcon(pmt.status)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-slate-900 truncate">
                              {pmt.subscription_plans?.name || "Paket Langganan"}
                            </h3>
                            <Badge className={`text-xs ${getStatusStyle(pmt.status)}`}>
                              {getStatusText(pmt.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateOnly(pmt.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(Number.parseInt(pmt.gross_amount))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {expanded ? (
                          <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t bg-slate-50/50">
                            <div className="pt-4 space-y-4">
                              {/* Transaction Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      Order ID
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                                        {pmt.midtrans_order_id}
                                      </code>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(pmt.midtrans_order_id)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ClipboardCopy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      Paket Langganan
                                    </label>
                                    <p className="text-sm font-medium mt-1">
                                      {pmt.subscription_plans?.name || "Paket Tidak Diketahui"}
                                    </p>
                                    {pmt.subscription_plans?.description && (
                                      <p className="text-xs text-slate-500 mt-1">
                                        {pmt.subscription_plans.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      Total Pembayaran
                                    </label>
                                    <p className="text-lg font-bold text-slate-900 mt-1">
                                      {formatCurrency(Number.parseInt(pmt.gross_amount))}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Dibuat
                                      </label>
                                      <p className="text-sm mt-1">{formatDate(pmt.created_at)}</p>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Dibayar
                                      </label>
                                      <p className="text-sm mt-1">{pmt.paid_at ? formatDate(pmt.paid_at) : "-"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap gap-2 pt-2 border-t">
                                {isPending && pmt.snap_redirect_url && (
                                  <Button
                                    onClick={() => window.open(pmt.snap_redirect_url, "_blank")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    size="sm"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Bayar Sekarang
                                  </Button>
                                )}

                                {isPending && (
                                  <Button
                                    onClick={() => handleCancel(pmt.id, pmt.midtrans_order_id)}
                                    disabled={cancellingId === pmt.id}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-200 text-red-700 hover:bg-red-50"
                                  >
                                    {cancellingId === pmt.id ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"
                                      />
                                    ) : (
                                      <X className="h-4 w-4 mr-2" />
                                    )}
                                    {cancellingId === pmt.id ? "Membatalkan..." : "Batalkan"}
                                  </Button>
                                )}

                                <Button
                                  onClick={() => copyToClipboard(pmt.midtrans_order_id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <ClipboardCopy className="h-4 w-4 mr-2" />
                                  Salin Order ID
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
