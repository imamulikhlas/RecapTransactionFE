"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Calendar,
  PieChart,
  BarChart3,
  Zap,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/utils"
import { getTransactionStats, getRecentTransactions, type Transaction } from "@/lib/supabase"
import FeaturedRoast from "@/components/featured-roast"


interface OverviewProps {
  transactions: Transaction[]
  onTransactionClick: (transaction: Transaction) => void
  loading: boolean
  userId?: string
  onViewAllRoasts: () => void
  onViewRoastDetails: (roastId: number) => void
  onViewChange: (view: string) => void
}

export default function Overview({
  transactions,
  onTransactionClick,
  loading,
  userId,
  onViewAllRoasts,
  onViewRoastDetails,
  onViewChange,
}: OverviewProps) {
  const [stats, setStats] = useState({ income: 0, expense: 0 })
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setStatsLoading(true)
      try {
        const [statsData, recentData] = await Promise.all([
          getTransactionStats(userId),
          getRecentTransactions(5, userId)
        ])
        setStats(statsData)
        setRecentTransactions(recentData)
      } catch (error) {
        console.error("Error fetching overview data:", error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const netIncome = stats.income - stats.expense
  const savingsRate = stats.income > 0 ? (netIncome / stats.income) * 100 : 0

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    gradient,
    index,
    description,
    trend,
  }: {
    title: string
    value: string
    change?: string
    icon: any
    gradient: string
    index: number
    description: string
    trend?: "up" | "down"
  }) => (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />

        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
          <p className="text-xs text-slate-400 mb-2">{description}</p>
          {change && (
            <div
              className={`flex items-center text-xs ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-slate-400"}`}
            >
              {trend === "up" && <ArrowUpRight className="h-3 w-3 mr-1" />}
              {trend === "down" && <ArrowDownRight className="h-3 w-3 mr-1" />}
              {change}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Financial Overview
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Your complete financial dashboard
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onViewChange("analytics")}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            onClick={() => onViewChange("transactions")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Net Income"
          value={formatCurrency(netIncome)}
          change={netIncome >= 0 ? "Positive flow" : "Negative flow"}
          icon={DollarSign}
          gradient="from-blue-500 to-cyan-500"
          index={0}
          description="Total income minus expenses"
          trend={netIncome >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.income)}
          change="This month"
          icon={TrendingUp}
          gradient="from-green-500 to-emerald-500"
          index={1}
          description="All incoming transactions"
          trend="up"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.expense)}
          change="This month"
          icon={TrendingDown}
          gradient="from-red-500 to-pink-500"
          index={2}
          description="All outgoing transactions"
          trend="down"
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          change="Of total income"
          icon={Target}
          gradient="from-purple-500 to-indigo-500"
          index={3}
          description="Money saved vs earned"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Transactions */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants} className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>Your latest financial activity</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewChange("transactions")}
                  className="text-slate-400 hover:text-white"
                >
                  View all
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded animate-pulse" />
                        <div className="h-3 bg-slate-700 rounded w-1/2 animate-pulse" />
                      </div>
                      <div className="h-4 bg-slate-700 rounded w-20 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No transactions yet</p>
                  <p className="text-sm">Your recent transactions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {recentTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onTransactionClick(transaction)}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-700/30 cursor-pointer transition-all duration-200 group"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.transaction_type == "expense"
                              ? "bg-gradient-to-r from-red-500 to-pink-500"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                          }`}
                        >
                          {transaction.transaction_type == "expense" ? (
                            <ArrowDownRight className="h-5 w-5 text-white" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-slate-400">{formatDate(transaction.date)}</p>
                            {transaction.category && (
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {transaction.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${
                              transaction.transaction_type == "expense"? "text-red-400" : "text-green-400"
                            }`}
                          >
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-slate-400">{transaction.provider}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Savings Progress */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-purple-400" />
                  Savings Goal
                </CardTitle>
                <CardDescription>Track your monthly savings progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Current Rate</span>
                    <span className="text-white font-medium">{savingsRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(savingsRate, 100)} className="h-2 bg-slate-700" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>Target: 20%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">This month</span>
                    <span className="text-lg font-bold text-purple-400">{formatCurrency(netIncome)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Roast */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants}>
            <FeaturedRoast userId={userId} onViewAllRoasts={onViewAllRoasts} onViewRoastDetails={onViewRoastDetails} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div custom={7} initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => onViewChange("analytics")}
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => onViewChange("roasts")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Roasted
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => onViewChange("settings")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Sync Gmail
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
