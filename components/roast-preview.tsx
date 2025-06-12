"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, TrendingUp, AlertTriangle, Sparkles, Zap } from "lucide-react"
import type { TransactionRoast } from "@/lib/supabase"

interface RoastPreviewProps {
  roast: TransactionRoast
  onClick: () => void
  index?: number
}

export default function RoastPreview({ roast, onClick, index = 0 }: RoastPreviewProps) {
  const getRoastIcon = (type: string) => {
    switch (type) {
      case "spending_spree":
        return <Flame className="h-4 w-4 text-red-400" />
      case "income_flex":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "budget_reality":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "savings_hero":
        return <Sparkles className="h-4 w-4 text-blue-400" />
      default:
        return <Zap className="h-4 w-4 text-purple-400" />
    }
  }

  const getRoastEmoji = (type: string) => {
    switch (type) {
      case "spending_spree":
        return "🔥"
      case "income_flex":
        return "💰"
      case "budget_reality":
        return "🎯"
      case "savings_hero":
        return "⭐"
      default:
        return "🚀"
    }
  }

  const getRoastColor = (type: string) => {
    switch (type) {
      case "spending_spree":
        return "from-red-500/10 to-orange-500/10 border-red-500/20 hover:border-red-500/40"
      case "income_flex":
        return "from-green-500/10 to-emerald-500/10 border-green-500/20 hover:border-green-500/40"
      case "budget_reality":
        return "from-yellow-500/10 to-amber-500/10 border-yellow-500/20 hover:border-yellow-500/40"
      case "savings_hero":
        return "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40"
      default:
        return "from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`bg-gradient-to-r ${getRoastColor(roast.roast_type)} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-lg`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
              className="text-2xl"
            >
              {getRoastEmoji(roast.roast_type)}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getRoastIcon(roast.roast_type)}
                <Badge variant="outline" className="border-white/30 text-white text-xs">
                  {roast.tx_ids?.length || 0} txs
                </Badge>
              </div>

              <p className="text-white text-sm line-clamp-2 leading-relaxed">{roast.roast_text.substring(0, 100)}...</p>

              <div className="text-xs text-white/60 mt-2">{new Date(roast.roast_time).toLocaleDateString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
