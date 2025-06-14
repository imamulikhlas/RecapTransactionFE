"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Flame,
  Clock,
  Hash,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Zap,
  Share2,
  Copy,
  CheckCircle,
  ExternalLink,
  Store,
  Tag,
  StickyNote,
} from "lucide-react"
import { getRoastById, getTransactionById, type TransactionRoast, type Transaction } from "@/lib/supabase"
import { formatDate, formatCurrency } from "@/lib/utils/utils"

interface RoastDetailsProps {
  roastId: number
  userId?: string
  onBackClick: () => void
  onTransactionClick: (transaction: Transaction) => void
}

export default function RoastDetails({ roastId, userId, onBackClick, onTransactionClick }: RoastDetailsProps) {
  const [roast, setRoast] = useState<TransactionRoast | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchRoastDetails = async () => {
      setLoading(true)
      try {
        const roastData = await getRoastById(roastId, userId)
        setRoast(roastData)

        if (roastData?.tx_ids) {
          const txPromises = roastData.tx_ids.map((id) => getTransactionById(id, userId))
          const txResults = await Promise.all(txPromises)
          setTransactions(txResults.filter(Boolean) as Transaction[])
        }
      } catch (error) {
        console.error("Error fetching roast details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoastDetails()
  }, [roastId, userId])

  const getRoastIcon = (type: string) => {
    switch (type) {
      case "spending_spree":
        return <Flame className="h-6 w-6 text-red-400" />
      case "income_flex":
        return <TrendingUp className="h-6 w-6 text-green-400" />
      case "budget_reality":
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />
      case "savings_hero":
        return <Sparkles className="h-6 w-6 text-blue-400" />
      default:
        return <Zap className="h-6 w-6 text-purple-400" />
    }
  }

  const getRoastColor = (type: string) => {
    switch (type) {
      case "spending_spree":
        return "from-red-500/20 to-orange-500/20 border-red-500/30"
      case "income_flex":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30"
      case "budget_reality":
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
      case "savings_hero":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
      default:
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30"
    }
  }

  const getRoastTitle = (type: string) => {
    switch (type) {
      case "spending_spree":
        return "🔥 Spending Spree Alert!"
      case "income_flex":
        return "💰 Income Flex Mode"
      case "budget_reality":
        return "🎯 Budget Reality Check"
      case "savings_hero":
        return "⭐ Savings Hero"
      default:
        return "🚀 Financial Roast"
    }
  }

  const handleCopyRoast = async () => {
    if (!roast) return

    const text = `${getRoastTitle(roast.roast_type)}\n\n${roast.roast_text}\n\n- TransactionHub AI 🤖`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!roast) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Roast not found</p>
        <Button variant="ghost" onClick={onBackClick} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roasts
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Button variant="ghost" onClick={onBackClick} className="text-slate-300 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Roasts
      </Button>

      {/* Main Roast Card */}
      <Card className={`bg-gradient-to-br ${getRoastColor(roast.roast_type)} border backdrop-blur-sm overflow-hidden`}>
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
              >
                {getRoastIcon(roast.roast_type)}
              </motion.div>
              <div>
                <CardTitle className="text-white text-2xl mb-2">{getRoastTitle(roast.roast_type)}</CardTitle>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(roast.roast_time)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    ID: {roast.id}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={handleCopyRoast}
              >
                {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="bg-black/20 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-white text-lg leading-relaxed">{roast.roast_text}</p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Badge variant="outline" className="border-white/30 text-white">
              {roast.tx_ids?.length || 0} transactions analyzed
            </Badge>
            <div className="text-slate-300 text-sm">Roasted on {formatDate(roast.created_at)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Related Transactions */}
      {transactions.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Related Transactions</CardTitle>
            <CardDescription className="text-slate-400">Click on any transaction to view full details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="group cursor-pointer"
                  onClick={() => onTransactionClick(transaction)}
                >
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-200">
                    <div className="flex-1 space-y-3">
                      {/* Main Info */}
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">
                          {transaction.reference}
                        </h4>
                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-300 transition-colors" />
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Store className="h-3 w-3 text-slate-500" />
                          <span className="text-slate-400">{transaction.merchant || transaction.provider || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3 text-slate-500" />
                          <span className="text-slate-400">{transaction.category || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span className="text-slate-400">{formatDate(transaction.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 capitalize">{transaction.transaction_type}</span>
                        </div>
                      </div>

                      {/* Note */}
                      {transaction.note_to_user && (
                        <div className="flex items-start gap-2">
                          <StickyNote className="h-3 w-3 text-slate-500 mt-0.5" />
                          <span className="text-slate-400 text-sm">{transaction.note_to_user}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <div
                        className={`text-lg font-semibold ${
                          transaction.amount < 0 ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </div>
                      {transaction.fee && transaction.fee > 0 && (
                        <div className="text-xs text-slate-500">Fee: {formatCurrency(transaction.fee)}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roast Metadata */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Roast Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-slate-400 text-sm">Roast Type</div>
              <div className="text-white font-medium capitalize">{roast.roast_type.replace("_", " ")}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Transactions</div>
              <div className="text-white font-medium">{roast.tx_ids?.length || 0}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Created</div>
              <div className="text-white font-medium">{formatDate(roast.created_at)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Roast ID</div>
              <div className="text-white font-medium">#{roast.id}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
