"use client"

import { CardFooter } from "@/components/ui/card"

import { motion } from "framer-motion"
import type { Transaction } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  Building2,
  CreditCard,
  Hash,
  Store,
  Tag,
  StickyNote,
  Clock,
  DollarSign,
  ArrowRightLeft,
  Receipt,
  TrendingUp,
  TrendingDown,
  Copy,
  CheckCircle,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/utils"
import { PDFDownloadLink } from "@react-pdf/renderer"
import TransactionReceiptPDF from "@/components/pdf/TransactionReceiptPDF"
import { useState } from "react"
import { toast } from "sonner"

interface TransactionDetailsProps {
  transaction: Transaction
  onBackClick: () => void
}

export default function TransactionDetails({ transaction, onBackClick }: TransactionDetailsProps) {
  const [copied, setCopied] = useState(false)
  const isExpense = transaction.amount < 0
  const amountColor = isExpense ? "text-red-500" : "text-emerald-500"
  const amountBg = isExpense
    ? "from-red-500/10 via-red-500/5 to-transparent"
    : "from-emerald-500/10 via-emerald-500/5 to-transparent"
  const iconBg = isExpense ? "from-red-500 to-red-600" : "from-emerald-500 to-emerald-600"

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBackClick}
          className="glass hover:glass-dark transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>
        <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Receipt className="h-4 w-4" />
          <span className="text-sm">Transaction Details</span>
        </div>
      </motion.div>

      {/* Hero Card */}
      <motion.div variants={itemVariants}>
        <Card className="glass border-0 shadow-2xl overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

          <CardHeader className={`relative bg-gradient-to-r ${amountBg} border-b border-white/10 pb-8`}>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${iconBg} flex items-center justify-center shadow-lg`}
                  >
                    {isExpense ? (
                      <TrendingDown className="h-6 w-6 text-white" />
                    ) : (
                      <TrendingUp className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-white">{transaction.description}</CardTitle>
                    <CardDescription className="text-white/70 text-lg mt-1">
                      {formatDate(transaction.date)}
                    </CardDescription>
                  </div>
                </div>

                {/* Amount Display */}
                <div className="space-y-2">
                  <div className={`text-5xl font-bold ${amountColor} animate-fade-in`}>
                    {formatCurrency(transaction.amount)}
                  </div>
                  {transaction.fee && transaction.fee > 0 && (
                    <div className="flex items-center gap-4 text-white/60">
                      <span>Fee: {formatCurrency(transaction.fee)}</span>
                      <div className="h-4 w-px bg-white/20" />
                      <span>Total: {formatCurrency(transaction.total_amount || transaction.amount)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <Badge
                  variant={isExpense ? "destructive" : "default"}
                  className="text-sm px-4 py-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  {transaction.transaction_type?.toUpperCase() || "TRANSACTION"}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(transaction.reference || transaction.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy ID"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative p-8">
            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Transaction Information */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Hash className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Transaction Info</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: Calendar,
                      label: "Date & Time",
                      value: formatDate(transaction.date),
                      color: "from-purple-500 to-purple-600",
                    },
                    {
                      icon: Hash,
                      label: "Reference ID",
                      value: transaction.reference || "—",
                      color: "from-indigo-500 to-indigo-600",
                      copyable: true,
                    },
                    {
                      icon: Tag,
                      label: "Category",
                      value: transaction.category,
                      color: "from-pink-500 to-pink-600",
                      badge: true,
                    },
                    {
                      icon: Store,
                      label: "Merchant",
                      value: transaction.merchant,
                      color: "from-orange-500 to-orange-600",
                    },
                  ].map(
                    (item, index) =>
                      item.value && (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="glass-dark rounded-xl p-4 hover:bg-white/5 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            >
                              <item.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white/60 mb-1">{item.label}</p>
                              {item.badge ? (
                                <Badge variant="outline" className="border-white/20 text-white">
                                  {item.value}
                                </Badge>
                              ) : (
                                <p className="font-medium text-white flex items-center gap-2">
                                  {item.value}
                                  {item.copyable && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(item.value)}
                                      className="h-6 w-6 p-0 hover:bg-white/10"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ),
                  )}
                </div>
              </motion.div>

              {/* Account Information */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <ArrowRightLeft className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Account Details</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: Building2,
                      label: "Provider",
                      value: transaction.provider,
                      color: "from-cyan-500 to-cyan-600",
                    },
                    {
                      icon: CreditCard,
                      label: "From Account",
                      value: transaction.account_from,
                      color: "from-teal-500 to-teal-600",
                    },
                    {
                      icon: CreditCard,
                      label: "To Account",
                      value: transaction.account_to,
                      color: "from-green-500 to-green-600",
                    },
                    {
                      icon: Clock,
                      label: "Created At",
                      value: formatDate(transaction.created_at),
                      color: "from-slate-500 to-slate-600",
                    },
                  ].map(
                    (item, index) =>
                      item.value && (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="glass-dark rounded-xl p-4 hover:bg-white/5 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            >
                              <item.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/60 mb-1">{item.label}</p>
                              <p className="font-medium text-white">{item.value}</p>
                            </div>
                          </div>
                        </motion.div>
                      ),
                  )}
                </div>
              </motion.div>
            </div>

            {/* Note Section */}
            {transaction.note_to_user && (
              <motion.div variants={itemVariants} className="mt-8">
                <Separator className="my-6 bg-white/10" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                      <StickyNote className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Additional Notes</h3>
                  </div>
                  <div className="glass-dark rounded-xl p-6 border border-white/10">
                    <p className="text-white/80 leading-relaxed">{transaction.note_to_user}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="relative border-t border-white/10 p-6 bg-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
              <PDFDownloadLink
                document={<TransactionReceiptPDF transaction={transaction} logoUrl="/assets/logo4.png" />}
                fileName={`transaction-${transaction.id}.pdf`}
              >
                <Button
                  variant="outline"
                  className="glass border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Receipt
                </Button>
              </PDFDownloadLink>

              <Button className="btn-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Share2 className="mr-2 h-4 w-4" />
                Share Transaction
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: DollarSign,
            label: "Transaction Type",
            value:
              transaction.transaction_type?.charAt(0).toUpperCase() + transaction.transaction_type?.slice(1) ||
              "Transaction",
            color: iconBg,
            bgColor: amountBg,
          },
          {
            icon: Calendar,
            label: "Processing Time",
            value: "Instant",
            color: "from-blue-500 to-blue-600",
            bgColor: "from-blue-500/10 via-blue-500/5 to-transparent",
          },
          {
            icon: Hash,
            label: "Transaction ID",
            value: `#${transaction.id}`,
            color: "from-purple-500 to-purple-600",
            bgColor: "from-purple-500/10 via-purple-500/5 to-transparent",
          },
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg animate-float`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">{stat.label}</p>
                    <p className="font-bold text-white text-lg">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
