"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  getTransactionsPaginated,
  getFilterOptions,
  type Transaction,
  type TransactionFilters,
  type PaginationResult,
} from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  Loader2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/utils"

interface TransactionListProps {
  onTransactionClick: (transaction: Transaction) => void
  userId?: string
}

export default function TransactionList({ onTransactionClick, userId }: TransactionListProps) {
  const [paginationData, setPaginationData] = useState<PaginationResult<Transaction>>({
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    transaction_types: [],
    providers: [],
    merchants: [],
  })
  const [showFilters, setShowFilters] = useState(false)

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      const options = await getFilterOptions(userId)
      setFilterOptions(options)
    }
    fetchFilterOptions()
  }, [userId])

  // Fetch transactions when filters, sorting, or pagination changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const result = await getTransactionsPaginated(
          paginationData.page,
          paginationData.limit,
          sortBy,
          sortOrder,
          filters,
          userId,
        )
        setPaginationData(result)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [paginationData.page, paginationData.limit, sortBy, sortOrder, filters, userId])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const handleFilterChange = (key: keyof TransactionFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
    setPaginationData((prev) => ({ ...prev, page: 1 })) // Reset to first page
  }

  const clearFilters = () => {
    setFilters({})
    setPaginationData((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPaginationData((prev) => ({ ...prev, page: newPage }))
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4 text-blue-400" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4 text-blue-400" />
    )
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Transaction History
        </h1>
        <p className="text-slate-400 mt-2 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          Complete overview of your financial activity
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  All Transactions
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>{paginationData.total} total transactions</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                    </Badge>
                  )}
                </CardDescription>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs text-white font-bold">{activeFiltersCount}</span>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search transactions, references, or merchants..."
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 transition-colors"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 border-t border-slate-700 pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Category</label>
                      <Select
                        value={filters.category || ""}
                        onValueChange={(value) => handleFilterChange("category", value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">All categories</SelectItem>
                          {filterOptions.categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Transaction Type Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Type</label>
                      <Select
                        value={filters.transaction_type || ""}
                        onValueChange={(value) => handleFilterChange("transaction_type", value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">All types</SelectItem>
                          {filterOptions.transaction_types.map((type) => (
                            <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Provider Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Provider</label>
                      <Select
                        value={filters.provider || ""}
                        onValueChange={(value) => handleFilterChange("provider", value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="All providers" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">All providers</SelectItem>
                          {filterOptions.providers.map((provider) => (
                            <SelectItem key={provider} value={provider} className="text-white hover:bg-slate-700">
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Merchant Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Merchant</label>
                      <Select
                        value={filters.merchant || ""}
                        onValueChange={(value) => handleFilterChange("merchant", value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="All merchants" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">All merchants</SelectItem>
                          {filterOptions.merchants.map((merchant) => (
                            <SelectItem key={merchant} value={merchant} className="text-white hover:bg-slate-700">
                              {merchant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Date Range and Amount Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date Range
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          placeholder="From"
                          value={filters.date_from || ""}
                          onChange={(e) => handleFilterChange("date_from", e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                        <Input
                          type="date"
                          placeholder="To"
                          value={filters.date_to || ""}
                          onChange={(e) => handleFilterChange("date_to", e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Amount Range
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min amount"
                          value={filters.amount_min || ""}
                          onChange={(e) =>
                            handleFilterChange("amount_min", e.target.value ? Number(e.target.value) : undefined)
                          }
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                        <Input
                          type="number"
                          placeholder="Max amount"
                          value={filters.amount_max || ""}
                          onChange={(e) =>
                            handleFilterChange("amount_max", e.target.value ? Number(e.target.value) : undefined)
                          }
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <div className="flex justify-end">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear all filters
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="h-8 w-8 text-blue-400" />
                </motion.div>
                <p className="text-slate-400">Loading transactions...</p>
              </div>
            ) : paginationData.data.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 text-slate-400"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8" />
                </div>
                <p className="text-lg font-medium text-white mb-2">No transactions found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </motion.div>
            ) : (
              <>
                {/* Transactions Table */}
                <div className="rounded-lg border border-slate-700/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-800/30">
                        <TableHead
                          className="cursor-pointer text-slate-300 hover:text-white transition-colors"
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Date {getSortIcon("date")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer text-slate-300 hover:text-white transition-colors"
                          onClick={() => handleSort("description")}
                        >
                          <div className="flex items-center">Description {getSortIcon("description")}</div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer text-slate-300 hover:text-white transition-colors"
                          onClick={() => handleSort("category")}
                        >
                          <div className="flex items-center">Category {getSortIcon("category")}</div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer text-slate-300 hover:text-white transition-colors"
                          onClick={() => handleSort("merchant")}
                        >
                          <div className="flex items-center">Merchant {getSortIcon("merchant")}</div>
                        </TableHead>
                        <TableHead
                          className="text-right cursor-pointer text-slate-300 hover:text-white transition-colors"
                          onClick={() => handleSort("amount")}
                        >
                          <div className="flex items-center justify-end">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Amount {getSortIcon("amount")}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {paginationData.data.map((transaction, index) => (
                          <motion.tr
                            key={transaction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="cursor-pointer hover:bg-slate-800/50 border-slate-700/30 transition-all duration-200 group"
                            onClick={() => onTransactionClick(transaction)}
                            whileHover={{ scale: 1.01 }}
                          >
                            <TableCell className="font-medium text-white">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    transaction.amount < 0 ? "bg-red-400" : "bg-green-400"
                                  }`}
                                />
                                {formatDate(transaction.date)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                                  {transaction.description}
                                </p>
                                {transaction.reference && (
                                  <p className="text-xs text-slate-400 font-mono mt-1">{transaction.reference}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {transaction.category && (
                                <Badge
                                  variant="outline"
                                  className="text-xs border-slate-600 text-slate-300 bg-slate-800/50"
                                >
                                  {transaction.category}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-white">
                                  {transaction.merchant || transaction.provider || "—"}
                                </p>
                                {transaction.merchant &&
                                  transaction.provider &&
                                  transaction.merchant !== transaction.provider && (
                                    <p className="text-xs text-slate-400">{transaction.provider}</p>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {transaction.amount < 0 ? (
                                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                                )}
                                <span
                                  className={`font-semibold ${
                                    transaction.amount < 0 ? "text-red-400" : "text-green-400"
                                  }`}
                                >
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4"
                >
                  <div className="text-sm text-slate-400">
                    Showing {(paginationData.page - 1) * paginationData.limit + 1} to{" "}
                    {Math.min(paginationData.page * paginationData.limit, paginationData.total)} of{" "}
                    {paginationData.total} transactions
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(paginationData.page - 1)}
                      disabled={paginationData.page === 1}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, paginationData.totalPages) }, (_, i) => {
                        const page = i + Math.max(1, paginationData.page - 2)
                        if (page > paginationData.totalPages) return null

                        return (
                          <Button
                            key={page}
                            variant={paginationData.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={
                              paginationData.page === page
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                            }
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(paginationData.page + 1)}
                      disabled={paginationData.page === paginationData.totalPages}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
