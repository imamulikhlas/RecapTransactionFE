"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, X, Rocket } from "lucide-react"

interface WelcomeBadgeProps {
  userId?: string
  onStartTour?: () => void
}

export default function WelcomeBadge({ userId, onStartTour }: WelcomeBadgeProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show welcome badge if user just completed onboarding
    const justCompleted = sessionStorage.getItem(`just-completed-onboarding-${userId}`)

    if (justCompleted) {
      setIsVisible(true)
      sessionStorage.removeItem(`just-completed-onboarding-${userId}`)

      // Auto hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [userId])

  const handleStartTour = () => {
    setIsVisible(false)
    onStartTour?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <Card className="glass border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>

                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Welcome to TransHub! 🎉</h3>
                  <p className="text-sm text-white/80 mb-3">
                    Ready to explore? Let's set up your Gmail connection first!
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleStartTour}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs"
                    >
                      <Rocket className="h-3 w-3 mr-1" />
                      Let's Go!
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
