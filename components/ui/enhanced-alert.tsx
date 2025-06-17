"use client"

import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils/utils"

export type AlertType = "success" | "error" | "warning" | "info"

interface EnhancedAlertProps {
  type: AlertType
  title?: string
  message: string
  isVisible: boolean
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-800 dark:text-green-200",
    iconColor: "text-green-600 dark:text-green-400",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-800 dark:text-red-200",
    iconColor: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-800 dark:text-yellow-200",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-800 dark:text-blue-200",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
}

export function EnhancedAlert({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}: EnhancedAlertProps) {
  const config = alertConfig[type]
  const Icon = config.icon

  // Auto close functionality
  React.useEffect(() => {
    if (isVisible && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, autoClose, onClose, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
          className={cn(
            "fixed top-4 right-4 z-50 max-w-md w-full mx-auto",
            "rounded-lg border p-4 shadow-lg backdrop-blur-sm",
            config.bgColor,
            config.borderColor,
          )}
        >
          <div className="flex items-start space-x-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <Icon className={cn("h-5 w-5 mt-0.5", config.iconColor)} />
            </motion.div>

            <div className="flex-1 min-w-0">
              {title && (
                <motion.h4
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={cn("text-sm font-semibold", config.textColor)}
                >
                  {title}
                </motion.h4>
              )}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: title ? 0.3 : 0.2 }}
                className={cn("text-sm", config.textColor, title ? "mt-1" : "")}
              >
                {message}
              </motion.p>
            </div>

            {onClose && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={cn(
                  "rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                  config.textColor,
                )}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Progress bar for auto-close */}
          {autoClose && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={cn(
                "absolute bottom-0 left-0 h-1 rounded-b-lg origin-left",
                config.iconColor.replace("text-", "bg-"),
              )}
              style={{ width: "100%" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
