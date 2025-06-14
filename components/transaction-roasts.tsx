"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Coffee, TrendingUp, AlertTriangle, Sparkles, Zap, Clock, Eye, Loader2 } from "lucide-react"
import { getLatestRoasts, type TransactionRoast } from "@/lib/supabase"
import { formatDate } from "@/lib/utils/utils"

// Tambahkan import untuk RoastCarousel
import RoastCarousel from "@/components/roast-carousel"

interface TransactionRoastsProps {
  userId?: string
  onRoastClick?: (roast: TransactionRoast) => void
}

export default function TransactionRoasts({ userId, onRoastClick }: TransactionRoastsProps) {
  const [roasts, setRoasts] = useState<TransactionRoast[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoast, setSelectedRoast] = useState<TransactionRoast | null>(null)

  useEffect(() => {
    const fetchRoasts = async () => {
      setLoading(true)
      try {
        const data = await getLatestRoasts(userId, 3)
        setRoasts(data)
        if (data.length > 0) {
          setSelectedRoast(data[0])
        }
      } catch (error) {
        console.error("Error fetching roasts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoasts()
  }, [userId])

  const getRoastIcon = (type: string) => {
    switch (type) {
      case "spending_spree":
        return <Flame className="h-5 w-5 text-red-400" />
      case "income_flex":
        return <TrendingUp className="h-5 w-5 text-green-400" />
      case "budget_reality":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "savings_hero":
        return <Sparkles className="h-5 w-5 text-blue-400" />
      default:
        return <Zap className="h-5 w-5 text-purple-400" />
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (roasts.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Roasts Yet!</h3>
          <p className="text-slate-400 text-center max-w-md">
            Your financial AI is still analyzing your spending patterns. Check back soon for some spicy takes on your
            transactions! 🌶️
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Featured Roast */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card
          className={`bg-gradient-to-br ${getRoastColor(selectedRoast?.roast_type || "")} border backdrop-blur-sm overflow-hidden`}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Flame className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <CardTitle className="text-white text-xl">{getRoastTitle(selectedRoast?.roast_type || "")}</CardTitle>
                  <CardDescription className="text-slate-300 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedRoast && formatDate(selectedRoast.roast_time)}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                Latest Roast
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-white text-lg leading-relaxed">{selectedRoast?.roast_text}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-white/30 text-white">
                    {selectedRoast?.tx_ids?.length || 0} transactions
                  </Badge>
                  {getRoastIcon(selectedRoast?.roast_type || "")}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={() => selectedRoast && onRoastClick?.(selectedRoast)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Roast History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Roast Timeline
            </CardTitle>
            <CardDescription className="text-slate-400">Browse your financial roasts by date</CardDescription>
          </CardHeader>
          <CardContent>
            <RoastCarousel userId={userId} onRoastClick={onRoastClick} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Fun Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Roasts", value: roasts.length, icon: Flame, color: "text-red-400" },
          {
            label: "Spending Alerts",
            value: roasts.filter((r) => r.roast_type === "spending_spree").length,
            icon: AlertTriangle,
            color: "text-yellow-400",
          },
          {
            label: "Income Flexes",
            value: roasts.filter((r) => r.roast_type === "income_flex").length,
            icon: TrendingUp,
            color: "text-green-400",
          },
          {
            label: "Reality Checks",
            value: roasts.filter((r) => r.roast_type === "budget_reality").length,
            icon: Coffee,
            color: "text-blue-400",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
          >
            <Card className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
