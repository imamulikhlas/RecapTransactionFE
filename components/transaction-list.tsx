"use client"

import React, { useState, useEffect } from "react"
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
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

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
  const [expandedId, setExpandedId] = useState<number | null>(null)

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

  const handleRowClick = (transaction: Transaction) => {
    if (expandedId === transaction.id) {
      setExpandedId(null)
    } else {
      setExpandedId(transaction.id)
    }
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortOrder === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground mt-1">View and manage all your transactions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>{paginationData.total} total transactions</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions, references, or merchants..."
              className="pl-10"
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
                className="space-y-4 border-t pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select
                      value={filters.category || ""}
                      onValueChange={(value) => handleFilterChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {filterOptions.categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transaction Type Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <Select
                      value={filters.transaction_type || ""}
                      onValueChange={(value) => handleFilterChange("transaction_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {filterOptions.transaction_types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Provider Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Provider</label>
                    <Select
                      value={filters.provider || ""}
                      onValueChange={(value) => handleFilterChange("provider", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All providers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All providers</SelectItem>
                        {filterOptions.providers.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Merchant Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Merchant</label>
                    <Select
                      value={filters.merchant || ""}
                      onValueChange={(value) => handleFilterChange("merchant", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All merchants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All merchants</SelectItem>
                        {filterOptions.merchants.map((merchant) => (
                          <SelectItem key={merchant} value={merchant}>
                            {merchant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date Range and Amount Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        placeholder="From"
                        value={filters.date_from || ""}
                        onChange={(e) => handleFilterChange("date_from", e.target.value)}
                      />
                      <Input
                        type="date"
                        placeholder="To"
                        value={filters.date_to || ""}
                        onChange={(e) => handleFilterChange("date_to", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount Range</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min amount"
                        value={filters.amount_min || ""}
                        onChange={(e) =>
                          handleFilterChange("amount_min", e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Max amount"
                        value={filters.amount_max || ""}
                        onChange={(e) =>
                          handleFilterChange("amount_max", e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginationData.data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              {/* Transactions Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Date {getSortIcon("date")}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                        <div className="flex items-center">Description {getSortIcon("description")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                        <div className="flex items-center">Category {getSortIcon("category")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("merchant")}>
                        <div className="flex items-center">Merchant {getSortIcon("merchant")}</div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort("amount")}>
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
                        <React.Fragment key={transaction.id}>
                          <motion.tr
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => onTransactionClick(transaction)}
                          >
                            <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium line-clamp-1">{transaction.description}</p>
                                {transaction.reference && (
                                  <p className="text-xs text-muted-foreground font-mono">{transaction.reference}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {transaction.category && (
                                <Badge variant="outline" className="text-xs">
                                  {transaction.category}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{transaction.merchant || transaction.provider || "—"}</p>
                                {transaction.merchant &&
                                  transaction.provider &&
                                  transaction.merchant !== transaction.provider && (
                                    <p className="text-xs text-muted-foreground">{transaction.provider}</p>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell
                              className={`text-right font-semibold ${
                                transaction.amount < 0 ? "text-destructive" : "text-green-600"
                              }`}
                            >
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                          </motion.tr>
                        </React.Fragment>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {(paginationData.page - 1) * paginationData.limit + 1} to{" "}
                  {Math.min(paginationData.page * paginationData.limit, paginationData.total)} of {paginationData.total}{" "}
                  transactions
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(paginationData.page - 1)}
                    disabled={paginationData.page === 1}
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
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
