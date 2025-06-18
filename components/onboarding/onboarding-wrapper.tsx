"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GalaxyIntro from "./galaxy-intro"
import { useRouter } from "next/navigation"

interface OnboardingWrapperProps {
  children: React.ReactNode
  userId?: string
}

export default function OnboardingWrapper({ children, userId }: OnboardingWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(`onboarding-completed-${userId}`)

    if (!hasCompletedOnboarding && userId) {
      setShowOnboarding(true)
    } else {
      setIsComplete(true)
    }
  }, [userId])

  const handleOnboardingComplete = () => {
    // Mark onboarding as completed
    if (userId) {
      localStorage.setItem(`onboarding-completed-${userId}`, "true")
    }

    setShowOnboarding(false)

    // Smooth transition to main app
    setTimeout(() => {
      setIsComplete(true)
      // Navigate to settings page
      router.push("/?view=settings")
    }, 500)
  }

  const handleSkip = () => {
    if (userId) {
      localStorage.setItem(`onboarding-completed-${userId}`, "true")
    }

    setShowOnboarding(false)
    setTimeout(() => {
      setIsComplete(true)
    }, 500)
  }

  return (
    <AnimatePresence mode="wait">
      {showOnboarding ? (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GalaxyIntro onComplete={handleOnboardingComplete} onSkip={handleSkip} />
        </motion.div>
      ) : isComplete ? (
        <motion.div
          key="main-app"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
