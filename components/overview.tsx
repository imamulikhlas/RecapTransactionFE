"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  type Transaction,
  getTransactionStats,
  getRecentProviders,
  getLatestRoasts,
  type TransactionRoast,
} from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  TrendingUp,
  Wallet,
  Flame,
  Sparkles,
  AlertTriangle,
  Coffee,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import FeaturedRoast from "@/components/featured-roast"
import ProviderTransactionsModal from "@/components/provider-transactions-modal"

interface OverviewProps {
  transactions: Transaction[]
  onTransactionClick: (transaction: Transaction) => void
  loading: boolean
  userId?: string
  onViewAllRoasts?: () => void
  onViewRoastDetails?: (roastId: number) => void
  onViewChange?: (view: string) => void
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
  const [providers, setProviders] = useState<any[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [latestRoast, setLatestRoast] = useState<TransactionRoast | null>(null)
  const [roastLoading, setRoastLoading] = useState(true)

  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [providerModalOpen, setProviderModalOpen] = useState(false)
  
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true)
      setRoastLoading(true)
      const [statsData, providersData, roastsData] = await Promise.all([
        getTransactionStats(userId),
        getRecentProviders(userId),
        getLatestRoasts(userId, 1),
      ])
      setStats(statsData)
      setProviders(providersData)
      if (roastsData.length > 0) {
        setLatestRoast(roastsData[0])
      }
      setStatsLoading(false)
      setRoastLoading(false)
    }

    fetchStats()
  }, [userId])

  const recentTransactions = transactions.slice(0, 5)
  const balance = stats.income - stats.expense
  const savingsRate = stats.income > 0 ? (balance / stats.income) * 100 : 0

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  const getRoastIcon = (type: string) => {
    switch (type) {
      case "spending_spree":
        return <Flame className="h-5 w-5 text-red-400" />
      case "income_flex":
        return <TrendingUp className="h-5 w-5 text-green-400" />
      case "budget_reality":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "savings_hero":
        return <Sparkles className="h-5 w-5 text-blue-400" />
      default:
        return <Coffee className="h-5 w-5 text-purple-400" />
    }
  }

  const getRoastColor = (type: string) => {
    switch (type) {
      case "spending_spree":
        return "from-red-500/20 to-orange-500/20 border-red-500/30"
      case "income_flex":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30"
      case "budget_reality":
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
      case "savings_hero":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
      default:
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30"
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

  const handleProviderClick = (provider: string) => {
    setSelectedProvider(provider)
    setProviderModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Welcome to your financial overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(balance)}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">{balance >= 0 ? "Positive balance" : "Negative balance"}</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Income</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.income)}</div>
                  <p className="text-xs text-green-600 mt-1">Total incoming transactions</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Expenses</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.expense)}</div>
                  <p className="text-xs text-red-600 mt-1">Total outgoing transactions</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Savings Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-purple-600">{savingsRate.toFixed(1)}%</div>
                  <p className="text-xs text-purple-600 mt-1">Of total income</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Featured Roast */}
      {latestRoast && !roastLoading && (
        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
          <FeaturedRoast
            roast={latestRoast}
            onViewAll={() => onViewAllRoasts?.()}
            onViewDetails={() => onViewRoastDetails?.(latestRoast.id)}
          />
        </motion.div>
      )}

      {/* Loading state for roast */}
      {roastLoading && (
        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Flame className="h-6 w-6 text-purple-400" />
                </motion.div>
                <span className="text-white">Loading your latest roast...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest 5 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No recent transactions</p>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction, i) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => onTransactionClick(transaction)}
                    >
                      <div className="space-y-1">
                        <p className="font-medium line-clamp-1">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`font-medium ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                        {formatCurrency(transaction.amount)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Top Providers</CardTitle>
              <CardDescription>Your most frequent transaction providers</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : providers.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No provider data available</p>
              ) : (
                <div className="space-y-4">
                  {providers.map((provider, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between cursor-pointer hover:bg-muted/30 p-3 rounded-lg transition-colors"
                      onClick={() => handleProviderClick(provider.provider)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="font-medium text-xs text-white">{provider.provider?.charAt(0) || "?"}</span>
                        </div>
                        <div>
                          <p className="font-medium">{provider.provider || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{provider.count} transactions</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants} className="flex justify-center">
        <Button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
          onClick={() => onViewChange?.("transactions")}
        >
          View All Transactions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
      <ProviderTransactionsModal
        open={providerModalOpen}
        onOpenChange={setProviderModalOpen}
        provider={selectedProvider}
        userId={userId}
        onTransactionClick={onTransactionClick}
      />
    </div>
  )
}
