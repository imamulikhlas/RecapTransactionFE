"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LayoutDashboard, ListOrdered, PieChart, Settings, Menu, X, LogOut, FileText, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils/utils"
import type { User as SupabaseUser} from "@supabase/auth-js"


interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  isMobile: boolean
  user?: SupabaseUser | null
  onLogout: () => void
}

export default function Sidebar({ activeView, onViewChange, isMobile, user, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: ListOrdered },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "roasts", label: "Roasts", icon: Flame },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logs", label: "Logs", icon: FileText },
  ]

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (view: string) => {
    onViewChange(view)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  }

  const overlayVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 },
  }

  const getUserInitials = (user: SupabaseUser | null) => {
    if (!user) return "U"
    const name = user.user_metadata?.full_name || user.email
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserDisplayName = (user: SupabaseUser | null) => {
    if (!user) return "User"
    return user.user_metadata?.full_name || user.email.split("@")[0]
  }

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {isMobile && isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-40"
          onClick={toggleSidebar}
        />
      )}

      <motion.div
        initial={isMobile ? "closed" : "open"}
        animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("bg-card border-r border-border h-full w-64 flex flex-col z-50", isMobile && "fixed")}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <img src="assets/logo.png" alt="Logo" className="w-full h-full object-cover" /> 
            </div>
            <h1 className="text-xl font-semibold tracking-tight">TransactionHub</h1>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {user && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getUserDisplayName(user)}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  activeView === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </motion.button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={onLogout}>
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </motion.div>
    </>
  )
}
