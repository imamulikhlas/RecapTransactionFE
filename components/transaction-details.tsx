"use client";

import { motion } from "framer-motion";
import type { Transaction } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/utils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TransactionReceiptPDF from "@/components/pdf/TransactionReceiptPDF";

interface TransactionDetailsProps {
  transaction: Transaction;
  onBackClick: () => void;
}

export default function TransactionDetails({
  transaction,
  onBackClick,
}: TransactionDetailsProps) {
  const isExpense = transaction.amount < 0;
  const amountColor = isExpense ? "text-red-600" : "text-green-600";
  const amountBg = isExpense
    ? "from-red-50 to-red-100"
    : "from-green-50 to-green-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Button variant="ghost" onClick={onBackClick} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Transactions
      </Button>

      {/* Main Transaction Card */}
      <Card className="overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${amountBg} border-b`}>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {transaction.description}
              </CardTitle>
              <CardDescription className="text-base">
                Transaction details and information
              </CardDescription>
            </div>
            <Badge
              variant={isExpense ? "destructive" : "default"}
              className="text-sm px-3 py-1"
            >
              {transaction.transaction_type?.toUpperCase() || "TRANSACTION"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Amount Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className={`h-6 w-6 ${amountColor}`} />
              <h3 className="text-lg font-medium">Amount</h3>
            </div>
            <div className={`text-4xl font-bold ${amountColor}`}>
              {formatCurrency(transaction.amount)}
            </div>
            {transaction.fee && transaction.fee > 0 && (
              <p className="text-muted-foreground mt-1">
                Fee: {formatCurrency(transaction.fee)} • Total:{" "}
                {formatCurrency(transaction.total_amount || transaction.amount)}
              </p>
            )}
          </div>

          <Separator className="my-6" />

          {/* Transaction Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Basic Information
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Date
                    </p>
                    <p className="font-medium">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Reference
                    </p>
                    <p className="font-medium font-mono text-sm">
                      {transaction.reference || "—"}
                    </p>
                  </div>
                </div>

                {transaction.category && (
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Category
                      </p>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </div>
                  </div>
                )}

                {transaction.merchant && (
                  <div className="flex items-center gap-3">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Merchant
                      </p>
                      <p className="font-medium">{transaction.merchant}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Account Information
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Provider
                    </p>
                    <p className="font-medium">{transaction.provider || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      From Account
                    </p>
                    <p className="font-medium">
                      {transaction.account_from || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      To Account
                    </p>
                    <p className="font-medium">
                      {transaction.account_to || "—"}
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Extracted At</p>
                    <p className="font-medium text-sm">
                      {formatDate(transaction.extracted_at || transaction.created_at)}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Note Section */}
          {transaction.note_to_user && (
            <>
              <Separator className="my-6" />
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <StickyNote className="h-5 w-5" />
                  Note
                </h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground">
                    {transaction.note_to_user}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Raw Data Section */}
          {/* {transaction.raw_payload && (
            <>
              <Separator className="my-6" />
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Raw Data
                </h4>
                <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[200px]">
                  <pre className="text-xs text-muted-foreground">
                    {JSON.stringify(transaction.raw_payload, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )} */}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
          <PDFDownloadLink
            document={<TransactionReceiptPDF transaction={transaction} />}
            fileName={`transaction-${transaction.id}.pdf`}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 border rounded-md hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Receipt
          </PDFDownloadLink>

          <Button>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      </Card>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-r ${amountBg} flex items-center justify-center`}
              >
                <DollarSign className={`h-5 w-5 ${amountColor}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Transaction Type
                </p>
                <p className="font-semibold capitalize">
                  {transaction.transaction_type}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-semibold">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 flex items-center justify-center">
                <Hash className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-semibold">#{transaction.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
