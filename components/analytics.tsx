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
import { TrendingUp, TrendingDown, DollarSign, PieChartIcon, BarChart3, Loader2, Calendar, Filter,Download } from "lucide-react"
import CategoryTransactionsModal from "@/components/category-transactions-modal"
import type { Transaction } from "@/types"
import { PDFDownloadLink, pdf } from "@react-pdf/renderer"
import AnalyticsReportPDF from "@/components/pdf/AnalyticsReportPDF"  

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights into your spending patterns</p>
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
      logoUrl="/logo.png"
    />
  }
  fileName={`Report-${timeRange}.pdf`}
  className="inline-flex items-center gap-2 text-sm px-4 py-2 border rounded-md hover:bg-muted transition-colors"
>
  {({ loading }) => (
    <>
      <Download className="h-4 w-4" />
      {loading ? "Loading.." : "Export PDF"}
    </>
  )}
</PDFDownloadLink>

          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily View</SelectItem>
              <SelectItem value="weekly">Weekly View</SelectItem>
              <SelectItem value="monthly">Monthly View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Net Income</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(netIncome)}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {netIncome >= 0 ? "Positive cash flow" : "Negative cash flow"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Savings Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{savingsRate.toFixed(1)}%</div>
              <p className="text-xs text-green-600 mt-1">Of total income</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.income)}</div>
              <p className="text-xs text-purple-600 mt-1">{getTimeRangeLabel()}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.expense)}</div>
              <p className="text-xs text-red-600 mt-1">{getTimeRangeLabel()}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {timeRange === "daily" ? "Daily" : timeRange === "weekly" ? "Weekly" : "Monthly"} Trends
              </CardTitle>
              <CardDescription>Income vs Expenses over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent formatter={(value: any) => [formatCurrency(value), ""]} />}
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

        <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Expense Categories
              </CardTitle>
              <CardDescription>Breakdown of your spending by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
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
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{data.category}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(data.amount)} ({data.percentage}%)
                              </p>
                              <p className="text-xs text-muted-foreground">{data.count} transactions</p>
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
      <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Category Analysis</CardTitle>
            <CardDescription>Detailed breakdown of spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="category"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(data.amount)} ({data.percentage}%)
                              </p>
                              <p className="text-xs text-muted-foreground">{data.count} transactions</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Details Table */}
      <motion.div custom={7} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Detailed spending analysis by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleCategoryClick(category.category)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <span className="font-medium">{category.category}</span>
                      <p className="text-sm text-muted-foreground">{category.count} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">{formatCurrency(category.amount)}</div>
                    <div className="text-sm text-muted-foreground">{category.percentage}% of total expenses</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
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
