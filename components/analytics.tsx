"use client"

import { useEffect, useState } from "react"
import { getTransactionsPaginated } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { getTransactionStats, getTimeSeriesData, getCategoryAnalysis } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils/utils"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChartIcon,
  BarChart3,
  Loader2,
  Calendar,
  Filter,
  Download,
  Activity,
  Target,
  Zap,
} from "lucide-react"
import CategoryTransactionsModal from "@/components/category-transactions-modal"
import type { Transaction } from "@/types"
import { PDFDownloadLink } from "@react-pdf/renderer"
import AnalyticsReportPDF from "@/components/pdf/AnalyticsReportPDF"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Tambahkan onTransactionClick ke interface AnalyticsProps
interface AnalyticsProps {
  userId?: string
  onTransactionClick: (transaction: Transaction) => void
}

export default function Analytics({ userId, onTransactionClick }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState("daily")
  const [chartData, setChartData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [stats, setStats] = useState({ income: 0, expense: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true)
      try {
        const [timeData, categoryAnalysis, statsData, txPage] = await Promise.all([
          getTimeSeriesData(timeRange as "daily" | "weekly" | "monthly", userId),
          getCategoryAnalysis(userId),
          getTransactionStats(userId),
          getTransactionsPaginated(1, 1000, "date", "desc", {}, userId),
        ])

        setChartData(timeData)
        setCategoryData(categoryAnalysis)
        setStats(statsData)
        setTransactions(txPage.data)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [userId, timeRange])

  // Dynamic color generation based on number of categories
  const generateColors = (count: number) => {
    const baseColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"]
    const colors = []
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length])
    }
    return colors
  }

  const COLORS = generateColors(categoryData.length)

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
              <div className="absolute inset-0 h-12 w-12 bg-blue-400/20 rounded-full blur-xl mx-auto animate-pulse" />
            </div>
            <p className="text-slate-300 text-lg font-medium">Loading Analytics...</p>
            <p className="text-slate-500 text-sm mt-2">Analyzing your financial data</p>
          </motion.div>
        </div>
      </div>
    )
  }

  const netIncome = stats.income - stats.expense
  const savingsRate = stats.income > 0 ? (netIncome / stats.income) * 100 : 0

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "daily":
        return "Last 30 Days"
      case "weekly":
        return "Last 12 Weeks"
      case "monthly":
        return "Last 12 Months"
      default:
        return "Time Period"
    }
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setCategoryModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Financial Analytics</span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Deep insights into your spending patterns and financial trends
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10">
              <Target className="h-3 w-3 mr-1" />
              {getTimeRangeLabel()}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <PDFDownloadLink
              document={
                <AnalyticsReportPDF
                  stats={stats}
                  chartData={chartData}
                  categoryData={categoryData}
                  transactions={transactions}
                  timeRangeLabel={getTimeRangeLabel()}
                  logoUrl="assets/logo4.png"
                />
              }
              fileName={`Report-${timeRange}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="outline"
                  size="sm"
                  className="glass border-slate-600 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? "Loading..." : "Export PDF"}
                </Button>
              )}
            </PDFDownloadLink>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] glass border-slate-600 hover:border-blue-500/50 transition-all duration-300">
                  <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent className="glass-dark border-slate-600">
                  <SelectItem value="daily">Daily View</SelectItem>
                  <SelectItem value="weekly">Weekly View</SelectItem>
                  <SelectItem value="monthly">Monthly View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={cardVariants} custom={0}>
            <Card className="glass border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Net Income</CardTitle>
                <div className="relative">
                  <DollarSign className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-2 ${netIncome >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatCurrency(netIncome)}
                </div>
                <div className="flex items-center gap-2">
                  {netIncome >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <p className="text-xs text-slate-400">
                    {netIncome >= 0 ? "Positive cash flow" : "Negative cash flow"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={1}>
            <Card className="glass border-slate-700 hover:border-green-500/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Savings Rate</CardTitle>
                <div className="relative">
                  <Target className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">{savingsRate.toFixed(1)}%</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(savingsRate, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Of total income</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={2}>
            <Card className="glass border-slate-700 hover:border-purple-500/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total Income</CardTitle>
                <div className="relative">
                  <TrendingUp className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400 mb-2">{formatCurrency(stats.income)}</div>
                <p className="text-xs text-slate-400">{getTimeRangeLabel()}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={3}>
            <Card className="glass border-slate-700 hover:border-red-500/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total Expenses</CardTitle>
                <div className="relative">
                  <TrendingDown className="h-5 w-5 text-red-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-red-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400 mb-2">{formatCurrency(stats.expense)}</div>
                <p className="text-xs text-slate-400">{getTimeRangeLabel()}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4}>
            <Card className="glass border-slate-700 hover:border-blue-500/30 transition-all duration-300 h-[450px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-200">
                  <div className="relative">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg" />
                  </div>
                  {timeRange === "daily" ? "Daily" : timeRange === "weekly" ? "Weekly" : "Monthly"} Trends
                </CardTitle>
                <CardDescription className="text-slate-400">Income vs Expenses over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ChartContainer
                  config={{
                    income: {
                      label: "Income",
                      color: "#22c55e",
                    },
                    expense: {
                      label: "Expense",
                      color: "#ef4444",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="period" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value: any) => [formatCurrency(value), ""]}
                            className="glass-dark border-slate-600"
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5}>
            <Card className="glass border-slate-700 hover:border-purple-500/30 transition-all duration-300 h-[450px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-200">
                  <div className="relative">
                    <PieChartIcon className="h-6 w-6 text-purple-400" />
                    <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-lg" />
                  </div>
                  Expense Categories
                </CardTitle>
                <CardDescription className="text-slate-400">Breakdown of your spending by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ChartContainer config={{}} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="glass-dark border border-slate-600 rounded-lg p-3 shadow-lg">
                                <p className="font-medium text-slate-200">{data.category}</p>
                                <p className="text-sm text-slate-400">
                                  {formatCurrency(data.amount)} ({data.percentage}
                                  %)
                                </p>
                                <p className="text-xs text-slate-500">{data.count} transactions</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Expense Breakdown Bar Chart */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6}>
          <Card className="glass border-slate-700 hover:border-cyan-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-200">
                <div className="relative">
                  <Zap className="h-6 w-6 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg" />
                </div>
                Category Analysis
              </CardTitle>
              <CardDescription className="text-slate-400">Detailed breakdown of spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ChartContainer config={{}} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="category"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="glass-dark border border-slate-600 rounded-lg p-3 shadow-lg">
                                <p className="font-medium text-slate-200">{label}</p>
                                <p className="text-sm text-slate-400">
                                  {formatCurrency(data.amount)} ({data.percentage}
                                  %)
                                </p>
                                <p className="text-xs text-slate-500">{data.count} transactions</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Details Table */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={7}>
          <Card className="glass border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Category Breakdown</CardTitle>
              <CardDescription className="text-slate-400">Detailed spending analysis by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg glass-dark border border-slate-600 hover:border-slate-500 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleCategoryClick(category.category)}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                          boxShadow: `0 0 20px ${COLORS[index % COLORS.length]}40`,
                        }}
                      />
                      <div>
                        <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                          {category.category}
                        </span>
                        <p className="text-sm text-slate-400">{category.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-400 text-lg">{formatCurrency(category.amount)}</div>
                      <div className="text-sm text-slate-500">{category.percentage}% of total expenses</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <CategoryTransactionsModal
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        category={selectedCategory}
        userId={userId}
        onTransactionClick={onTransactionClick}
      />
    </div>
  )
}
