"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Transaction } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Search, ArrowUpDown, Loader2 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface TransactionListProps {
  transactions: Transaction[]
  onTransactionClick: (transaction: Transaction) => void
  onSort: (column: string) => void
  sortBy: string
  sortOrder: string
  onSearch: (term: string) => void
  searchTerm: string
  loading: boolean
}

export default function TransactionList({
  transactions,
  onTransactionClick,
  onSort,
  sortBy,
  sortOrder,
  onSearch,
  searchTerm,
  loading,
}: TransactionListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleRowClick = (transaction: Transaction) => {
    if (expandedId === transaction.id) {
      setExpandedId(null)
    } else {
      setExpandedId(transaction.id)
    }
  }

  const handleViewDetails = (transaction: Transaction) => {
    onTransactionClick(transaction)
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortOrder === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>View and manage all your transactions</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No transactions found</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] cursor-pointer" onClick={() => onSort("date")}>
                    <div className="flex items-center">Date {getSortIcon("date")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => onSort("description")}>
                    <div className="flex items-center">Description {getSortIcon("description")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => onSort("provider")}>
                    <div className="flex items-center">Provider {getSortIcon("provider")}</div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => onSort("amount")}>
                    <div className="flex items-center justify-end">Amount {getSortIcon("amount")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {transactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>
                      <TableRow
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(transaction)}
                      >
                        <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                        <TableCell>{transaction.provider || "—"}</TableCell>
                        <TableCell
                          className={`text-right ${transaction.amount < 0 ? "text-destructive" : "text-green-600"}`}
                        >
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                      </TableRow>

                      {expandedId === transaction.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={4}>
                            <div className="p-4 bg-muted/30 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Reference</p>
                                  <p>{transaction.reference || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Transaction Type</p>
                                  <p className="capitalize">{transaction.transaction_type || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">From Account</p>
                                  <p>{transaction.account_from || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">To Account</p>
                                  <p>{transaction.account_to || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Fee</p>
                                  <p>{transaction.fee ? formatCurrency(transaction.fee) : "—"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                  <p>{transaction.total_amount ? formatCurrency(transaction.total_amount) : "—"}</p>
                                </div>
                              </div>
                              <Button onClick={() => handleViewDetails(transaction)} className="w-full sm:w-auto">
                                View Full Details
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
