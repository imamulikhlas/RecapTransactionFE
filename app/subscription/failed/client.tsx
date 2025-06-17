"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function FailedTransactionClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    supabase
      .from("payment_transactions")
      .select("*, subscription_plans(name)")
      .eq("midtrans_order_id", orderId)
      .single()
      .then(({ data }) => {
        setTx(data);
        setLoading(false);
      });
  }, [orderId]);

  const formatCurrency = (val: number) =>
    `Rp ${val.toLocaleString("id-ID")}`;
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-sm">Memuat transaksi...</p>
      </div>
    );

  if (!tx)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">Transaksi tidak ditemukan.</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-muted px-4"
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-6">
        <div className="text-center space-y-1">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-600">Pembayaran Gagal</h2>
          <p className="text-sm text-muted-foreground">
            Tenang, kamu bisa coba ulang pembayaran di bawah ini.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
          <Detail label="Order ID" value={tx.midtrans_order_id} mono />
          <Detail label="Plan" value={tx.subscription_plans?.name} />
          <Detail
            label="Jumlah"
            value={formatCurrency(parseInt(tx.gross_amount))}
          />
          <Detail label="Status" value={tx.status} />
          <Detail label="Tanggal" value={formatDate(tx.created_at)} />
        </div>

        {tx.snap_redirect_url && (
          <a href={tx.snap_redirect_url} target="_blank" rel="noopener noreferrer">
            <Button className="w-full">Bayar Ulang Sekarang</Button>
          </a>
        )}

        <Button asChild variant="ghost" className="w-full">
          <a href="/">Kembali ke Dashboard</a>
        </Button>
      </div>
    </motion.div>
  );
}

function Detail({ label, value, mono = false }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono" : ""}>{value}</span>
    </div>
  );
}
