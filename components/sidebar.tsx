"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, CreditCard, BarChart3, Settings, FileText, Flame, User, FlagIcon as SubscriptionIcon, LogOut, Menu, X, Sparkles, TrendingUp } from 'lucide-react'
import type { User as UserType } from "@/lib/supabase"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  isMobile: boolean
  user: UserType | null
  onLogout: () => void
}

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    gradient: "from-blue-500 to-cyan-500",
    description: "Dashboard overview",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: CreditCard,
    gradient: "from-green-500 to-emerald-500",
    description: "View all transactions",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    gradient: "from-purple-500 to-pink-500",
    description: "Financial insights",
  },
  {
    id: "roasts",
    label: "Roasts",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    description: "Get roasted",
    badge: "Hot",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    gradient: "from-slate-500 to-slate-600",
    description: "App settings",
  },
  {
    id: "logs",
    label: "Logs",
    icon: FileText,
    gradient: "from-indigo-500 to-blue-500",
    description: "System logs",
  },
  {
    id: "subscription",
    label: "Subscription",
    icon: SubscriptionIcon,
    gradient: "from-yellow-500 to-orange-500",
    description: "Manage subscription",
    badge: "Pro",
  },
]

export default function Sidebar({ activeView, onViewChange, isMobile, user, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  const handleItemClick = (viewId: string) => {
    onViewChange(viewId)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden">
            <img src="/assets/logo.png" alt="TransHub Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TransHub
            </h2>
            <p className="text-xs text-slate-400">Financial Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-6 border-b border-slate-700/50">
          <Button
            variant="ghost"
            className="w-full p-0 h-auto hover:bg-slate-700/30 transition-colors duration-200"
            onClick={() => handleItemClick("profile")}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-slate-600">
                  <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate">{user.user_metadata?.full_name || "User"}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <Badge variant="outline" className="text-xs mt-1 border-green-500/30 text-green-400">
                  Online
                </Badge>
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <motion.div key={item.id} custom={index} initial="hidden" animate="visible" variants={itemVariants}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-12 px-4 group relative overflow-hidden transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                {/* Background gradient for active state */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20`}
                    layoutId="activeBackground"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 mr-3 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Label and description */}
                <div className="flex-1 text-left relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className={`text-xs ml-2 ${
                          isActive ? "border-white/30 text-white" : "border-slate-500 text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}>{item.description}</p>
                </div>

                {/* Hover effect */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-slate-700/0 via-slate-600/20 to-slate-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                )}
              </Button>
            </motion.div>
          )
        })}
      </nav>

      <Separator className="bg-slate-700/50" />

      {/* Footer */}
      <div className="p-4 space-y-3">
        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Quick Stats</span>
            <TrendingUp className="h-3 w-3 text-green-400" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">This Month</span>
              <span className="text-green-400 font-medium">+12.5%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Savings</span>
              <span className="text-blue-400 font-medium">$2,450</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full border-slate-600 text-slate-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-slate-800/80 backdrop-blur-sm border-slate-600 text-white hover:bg-slate-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl z-50"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <aside className="w-80 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl">
      <SidebarContent />
    </aside>
  )
}
