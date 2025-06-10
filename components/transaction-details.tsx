"use client"

import { motion } from "framer-motion"
import type { Transaction } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface TransactionDetailsProps {
  transaction: Transaction
  onBackClick: () => void
}

export default function TransactionDetails({ transaction, onBackClick }: TransactionDetailsProps) {
  const detailItems = [
    { label: "Reference", value: transaction.reference },
    { label: "Date", value: formatDate(transaction.date) },
    { label: "Provider", value: transaction.provider },
    { label: "Transaction Type", value: transaction.transaction_type },
    { label: "From Account", value: transaction.account_from },
    { label: "To Account", value: transaction.account_to },
    { label: "Fee", value: transaction.fee ? formatCurrency(transaction.fee) : "—" },
    { label: "Total Amount", value: transaction.total_amount ? formatCurrency(transaction.total_amount) : "—" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Button variant="ghost" onClick={onBackClick} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Transactions
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-2xl">Transaction Details</CardTitle>
          <CardDescription>Complete information about this transaction</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{transaction.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Amount</h3>
            <div className="text-3xl font-bold">
              <span className={transaction.amount < 0 ? "text-destructive" : "text-green-600"}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detailItems.map((item, index) => (
              <div key={index} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value || "—"}</p>
              </div>
            ))}
          </div>

          {transaction.raw_payload && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Raw Data</h3>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[200px]">
                <pre className="text-xs">{JSON.stringify(transaction.raw_payload, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
