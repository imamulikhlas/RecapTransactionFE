"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, ArrowRight } from "lucide-react"
import { getTransactionsPaginated, type Transaction, type TransactionFilters } from "@/lib/supabase"
import { formatCurrency, formatDate } from "@/lib/utils/utils"

interface CategoryTransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: string
  userId?: string
  onTransactionClick: (transaction: Transaction) => void
}

export default function CategoryTransactionsModal({
  open,
  onOpenChange,
  category,
  userId,
  onTransactionClick,
}: CategoryTransactionsModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!open || !category) return

      setLoading(true)
      try {
        const filters: TransactionFilters = { category }
        const result = await getTransactionsPaginated(1, 10, "date", "desc", filters, userId)
        setTransactions(result.data)
        setTotal(result.total)
      } catch (error) {
        console.error("Error fetching category transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [open, category, userId])

  const handleTransactionClick = (transaction: Transaction) => {
    onTransactionClick(transaction)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal">
              {category}
            </Badge>
            <span>Transactions</span>
          </DialogTitle>
          <DialogDescription>
            Showing {transactions.length} of {total} transactions in this category
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No transactions found in this category</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {transactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{transaction.note_to_user}</TableCell>
                      <TableCell>{transaction.merchant || transaction.provider || "—"}</TableCell>
                      <TableCell
                        className={`text-right ${transaction.amount < 0 ? "text-destructive" : "text-green-600"}`}
                      >
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button onClick={() => onOpenChange(false)} className="gap-2">
            View All Transactions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
