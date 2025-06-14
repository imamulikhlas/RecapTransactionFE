"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, TrendingUp, AlertTriangle, Sparkles, Coffee, Clock, Eye, ArrowRight, Zap, Star } from "lucide-react"
import type { TransactionRoast } from "@/lib/supabase"
import { formatDate } from "@/lib/utils/utils"

interface FeaturedRoastProps {
  roast: TransactionRoast
  onViewAll: () => void
  onViewDetails: () => void
}

export default function FeaturedRoast({ roast, onViewAll, onViewDetails }: FeaturedRoastProps) {
  const getRoastIcon = (type: string) => {
    switch (type) {
      case "spending_spree":
        return <Flame className="h-6 w-6 text-white" />
      case "income_flex":
        return <TrendingUp className="h-6 w-6 text-white" />
      case "budget_reality":
        return <AlertTriangle className="h-6 w-6 text-white" />
      case "savings_hero":
        return <Sparkles className="h-6 w-6 text-white" />
      default:
        return <Zap className="h-6 w-6 text-white" />
    }
  }

  const getRoastColor = (type: string) => {
    switch (type) {
      case "spending_spree":
        return {
          gradient: "from-red-500/30 via-orange-500/20 to-pink-500/30",
          border: "border-red-500/40",
          glow: "shadow-red-500/20",
          iconBg: "from-red-600 to-orange-600",
        }
      case "income_flex":
        return {
          gradient: "from-green-500/30 via-emerald-500/20 to-teal-500/30",
          border: "border-green-500/40",
          glow: "shadow-green-500/20",
          iconBg: "from-green-600 to-emerald-600",
        }
      case "budget_reality":
        return {
          gradient: "from-yellow-500/30 via-amber-500/20 to-orange-500/30",
          border: "border-yellow-500/40",
          glow: "shadow-yellow-500/20",
          iconBg: "from-yellow-600 to-amber-600",
        }
      case "savings_hero":
        return {
          gradient: "from-blue-500/30 via-cyan-500/20 to-indigo-500/30",
          border: "border-blue-500/40",
          glow: "shadow-blue-500/20",
          iconBg: "from-blue-600 to-cyan-600",
        }
      default:
        return {
          gradient: "from-purple-500/30 via-pink-500/20 to-indigo-500/30",
          border: "border-purple-500/40",
          glow: "shadow-purple-500/20",
          iconBg: "from-purple-600 to-pink-600",
        }
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

  const colors = getRoastColor(roast.roast_type)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card
        className={`relative bg-gradient-to-br ${colors.gradient} ${colors.border} backdrop-blur-sm overflow-hidden hover:shadow-2xl ${colors.glow} transition-all duration-500 group`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeOut",
              }}
              style={{
                left: `${20 + i * 12}%`,
                top: "100%",
              }}
            />
          ))}
        </div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 2,
                }}
                className={`w-14 h-14 bg-gradient-to-r ${colors.iconBg} rounded-full flex items-center justify-center shadow-lg relative`}
              >
                {getRoastIcon(roast.roast_type)}

                {/* Pulse Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.iconBg} opacity-30`}
                />
              </motion.div>

              <div>
                <CardTitle className="text-white text-xl mb-1 flex items-center gap-2">
                  {getRoastTitle(roast.roast_type)}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Star className="h-4 w-4 text-yellow-300" />
                  </motion.div>
                </CardTitle>
                <CardDescription className="text-slate-200 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatDate(roast.roast_time)} • Latest AI Roast
                </CardDescription>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/15 hover:bg-white/25 text-white border-white/30 backdrop-blur-sm"
                onClick={onViewAll}
              >
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-5"
          >
            {/* Roast Text */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black/30 rounded-xl p-5 backdrop-blur-md border border-white/10 group-hover:bg-black/40 transition-all duration-300"
            >
              <p className="text-white text-lg leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                {roast.roast_text}
              </p>
            </motion.div>

            {/* Bottom Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-white/40 text-white bg-white/10 backdrop-blur-sm">
                  <Coffee className="h-3 w-3 mr-1" />
                  {roast.tx_ids?.length || 0} transactions
                </Badge>

                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="flex items-center"
                >
                  {getRoastIcon(roast.roast_type)}
                </motion.div>
              </div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center text-white/90 hover:text-white cursor-pointer group"
                onClick={onViewDetails}
              >
                <span className="text-sm mr-2 font-medium">Read full roast</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </motion.div>
        </CardContent>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          initial={false}
        />
      </Card>
    </motion.div>
  )
}
