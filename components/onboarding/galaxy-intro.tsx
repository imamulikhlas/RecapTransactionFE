"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Rocket, Settings, Mail, BarChart3, Zap, StarIcon, Play, ChevronRight } from "lucide-react"

interface GalaxyIntroProps {
  onComplete: () => void
  onSkip: () => void
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
}

export default function GalaxyIntro({ onComplete, onSkip }: GalaxyIntroProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stars, setStars] = useState<Star[]>([])
  const [showContent, setShowContent] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Generate stars for starfield effect
  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = []
      for (let i = 0; i < 200; i++) {
        newStars.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          color: ["#60A5FA", "#A78BFA", "#34D399", "#FBBF24", "#F87171"][Math.floor(Math.random() * 5)],
        })
      }
      setStars(newStars)
    }

    generateStars()

    // Show content after initial animation
    const timer = setTimeout(() => setShowContent(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Animate starfield
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and animate stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = star.opacity
        ctx.fill()

        // Create trailing effect
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - star.speed * 10, star.y)
        ctx.strokeStyle = star.color
        ctx.lineWidth = star.size / 2
        ctx.globalAlpha = star.opacity * 0.3
        ctx.stroke()

        // Move star
        star.x -= star.speed
        if (star.x < -10) {
          star.x = canvas.width + 10
          star.y = Math.random() * canvas.height
        }
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [stars])

  const tutorialSteps = [
    {
      title: "Welcome to TransHub Galaxy! 🚀",
      description: "Your journey to financial mastery begins here. Let's explore the universe of your transactions!",
      icon: <Rocket className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Connect Your Gmail 📧",
      description:
        "First, we'll connect your Gmail to automatically detect and categorize your transactions from emails.",
      icon: <Mail className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "AI-Powered Analytics 📊",
      description:
        "Our AI will analyze your spending patterns and provide insights to help you make better financial decisions.",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Get Roasted! 🔥",
      description: "Receive hilarious AI-generated roasts about your spending habits. It's tough love for your wallet!",
      icon: <Zap className="h-8 w-8" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Ready to Launch! 🌟",
      description: "You're all set! Let's start your financial journey and take control of your money.",
      icon: <StarIcon className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500",
      final: true,
    },
  ]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      {/* Animated Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "radial-gradient(ellipse at center, #1e293b 0%, #0f172a 70%, #000000 100%)" }}
      />

      {/* Floating Nebula Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Skip Button */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-6 right-6 z-10"
      >
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
        >
          Skip Tutorial
        </Button>
      </motion.div> */}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <AnimatePresence mode="wait">
          {!showContent ? (
            // Initial Galaxy Entry Animation
            <motion.div
              key="intro"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 2,
              }}
              className="text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                }}
                className="mb-8"
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4"
              >
                TransHub
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-xl text-white/80"
              >
                Entering Financial Galaxy...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8 flex justify-center"
              >
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                      className="w-3 h-3 bg-blue-400 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Tutorial Steps
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 100, rotateY: 90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -90 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              className="max-w-2xl w-full"
            >
              <Card className="glass-dark border-slate-700/50 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${tutorialSteps[currentStep].color} opacity-10`} />

                <CardContent className="relative p-8 text-center">
                  {/* Step Indicator */}
                  <div className="flex justify-center mb-6">
                    <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                      Step {currentStep + 1} of {tutorialSteps.length}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${tutorialSteps[currentStep].color} mb-6 shadow-2xl`}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="text-white"
                    >
                      {tutorialSteps[currentStep].icon}
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-white mb-4"
                  >
                    {tutorialSteps[currentStep].title}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-white/80 mb-8 leading-relaxed"
                  >
                    {tutorialSteps[currentStep].description}
                  </motion.p>

                  {/* Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                  >
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${tutorialSteps[currentStep].color} rounded-full`}
                      />
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      {currentStep + 1} of {tutorialSteps.length} completed
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 justify-center"
                  >
                    {tutorialSteps[currentStep].action && (
                      <Button
                        onClick={() => {
                          onComplete()
                          // Navigate to settings
                        }}
                        className={`bg-gradient-to-r ${tutorialSteps[currentStep].color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-3`}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        {tutorialSteps[currentStep].action}
                      </Button>
                    )}

                    <Button
                      onClick={handleNext}
                      className={`bg-gradient-to-r ${tutorialSteps[currentStep].color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-3`}
                    >
                      {tutorialSteps[currentStep].final ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Launch TransHub!
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Navigation Dots */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center gap-2 mt-6"
                  >
                    {tutorialSteps.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentStep ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              y: -100,
              rotate: 360,
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            className="absolute"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
