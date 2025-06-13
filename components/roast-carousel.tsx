"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Flame, TrendingUp, AlertTriangle, Sparkles, Zap, Eye } from "lucide-react"
import { getLatestRoasts, type TransactionRoast } from "@/lib/supabase"

interface RoastCarouselProps {
  userId?: string
  onRoastClick: (roast: TransactionRoast) => void
}

export default function RoastCarousel({ userId, onRoastClick }: RoastCarouselProps) {
  const [roasts, setRoasts] = useState<TransactionRoast[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [groupedRoasts, setGroupedRoasts] = useState<Record<string, TransactionRoast[]>>({})
  const [dates, setDates] = useState<string[]>([])
  const [currentDate, setCurrentDate] = useState<string>("")
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRoasts = async () => {
      setLoading(true)
      try {
        // Fetch more roasts for the carousel
        const data = await getLatestRoasts(userId, 20)
        setRoasts(data)

        // Group roasts by date
        const grouped = data.reduce((acc: Record<string, TransactionRoast[]>, roast) => {
          const date = new Date(roast.roast_time).toISOString().split("T")[0]
          if (!acc[date]) {
            acc[date] = []
          }
          acc[date].push(roast)
          return acc
        }, {})

        setGroupedRoasts(grouped)
        const dateKeys = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        setDates(dateKeys)

        if (dateKeys.length > 0) {
          setCurrentDate(dateKeys[0])
        }
      } catch (error) {
        console.error("Error fetching roasts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoasts()
  }, [userId])

  const nextDate = () => {
    const currentIndex = dates.indexOf(currentDate)
    if (currentIndex < dates.length - 1) {
      setCurrentDate(dates[currentIndex + 1])
    }
  }

  const prevDate = () => {
    const currentIndex = dates.indexOf(currentDate)
    if (currentIndex > 0) {
      setCurrentDate(dates[currentIndex - 1])
    }
  }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (dates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No roasts found</p>
        <p className="text-sm">Check back later for some spicy takes on your transactions!</p>
      </div>
    )
  }

  const currentRoasts = groupedRoasts[currentDate] || []
  const formattedDate = new Date(currentDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={prevDate}
          disabled={dates.indexOf(currentDate) === 0}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">{formattedDate}</h3>
          <Badge variant="outline" className="ml-2">
            {currentRoasts.length} roasts
          </Badge>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextDate}
          disabled={dates.indexOf(currentDate) === dates.length - 1}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Featured Roast (First roast of the day) */}
      {currentRoasts.length > 0 && (
        <motion.div
          key={`featured-${currentRoasts[0].id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className={`bg-gradient-to-br ${getRoastColor(
              currentRoasts[0].roast_type,
            )} cursor-pointer hover:shadow-lg transition-all duration-300`}
            onClick={() => onRoastClick(currentRoasts[0])}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                    className="text-2xl"
                  >
                    {getRoastEmoji(currentRoasts[0].roast_type)}
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Featured Roast</h3>
                    <p className="text-sm text-white/70">
                      {new Date(currentRoasts[0].roast_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRoastClick(currentRoasts[0])
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>

              <p className="text-white line-clamp-3">{currentRoasts[0].roast_text}</p>

              <div className="flex items-center justify-between mt-4">
                <Badge variant="outline" className="border-white/30 text-white text-xs">
                  {currentRoasts[0].tx_ids?.length || 0} transactions
                </Badge>
                <div className="flex items-center gap-2">
                  {getRoastIcon(currentRoasts[0].roast_type)}
                  <span className="text-white/70 text-sm capitalize">
                    {currentRoasts[0].roast_type.replace("_", " ")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Other Roasts for the day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={carouselRef}>
        <AnimatePresence mode="popLayout">
          {currentRoasts.slice(1).map((roast, index) => (
            <motion.div
              key={roast.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <Card
                className={`bg-gradient-to-r ${getRoastColor(
                  roast.roast_type,
                )} cursor-pointer hover:shadow-lg transition-all duration-300`}
                onClick={() => onRoastClick(roast)}
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

                      <p className="text-white text-sm line-clamp-2 leading-relaxed">
                        {roast.roast_text.substring(0, 100)}...
                      </p>

                      <div className="text-xs text-white/60 mt-2">
                        {new Date(roast.roast_time).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
