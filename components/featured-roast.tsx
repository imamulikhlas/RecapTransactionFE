"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Sparkles, Coffee, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react"
import { getLatestRoasts, type TransactionRoast } from "@/lib/supabase"

interface FeaturedRoastProps {
  userId?: string
  onViewAllRoasts: () => void
  onViewRoastDetails: (roastId: number) => void
}

export default function FeaturedRoast({ userId, onViewAllRoasts, onViewRoastDetails }: FeaturedRoastProps) {
  const [latestRoast, setLatestRoast] = useState<TransactionRoast | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestRoast = async () => {
      setLoading(true)
      try {
        const roasts = await getLatestRoasts(userId, 1)
        if (roasts.length > 0) {
          setLatestRoast(roasts[0])
        }
      } catch (error) {
        console.error("Error fetching latest roast:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestRoast()
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
        return <Coffee className="h-5 w-5 text-purple-400" />
    }
  }

  const getRoastGradient = (type: string) => {
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
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Flame className="h-6 w-6 text-purple-400" />
            </motion.div>
            <span className="text-slate-400">Loading your latest roast...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!latestRoast) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Flame className="h-5 w-5 text-orange-400" />
            Financial Roast
          </CardTitle>
          <CardDescription>Get roasted about your spending habits</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Coffee className="h-12 w-12 mx-auto mb-4 text-slate-500" />
          <p className="text-slate-400 mb-4">No roasts available yet</p>
          <Button
            onClick={onViewAllRoasts}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Get Your First Roast
            <Flame className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`bg-gradient-to-br ${getRoastGradient(latestRoast.roast_type)} backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer`}
      onClick={() => onViewRoastDetails(latestRoast.id)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getRoastIcon(latestRoast.roast_type)}
            <CardTitle className="text-white text-sm">Latest Roast</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs border-white/20 text-white/80">
            {getRoastTitle(latestRoast.roast_type)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{latestRoast.roast_text}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">{new Date(latestRoast.created_at).toLocaleDateString()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onViewAllRoasts()
            }}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            View All
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
