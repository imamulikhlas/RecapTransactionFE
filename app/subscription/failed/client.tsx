"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  if (loading)
    return <p className="text-center mt-10">Memuat transaksi...</p>;
  if (!tx)
    return (
      <p className="text-center mt-10 text-red-500">Transaksi tidak ditemukan.</p>
    );

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="max-w-xl mx-auto py-10 px-6 space-y-6">
      <div className="text-center space-y-2">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h1 className="text-2xl font-semibold text-red-600">Pembayaran Gagal</h1>
        <p className="text-muted-foreground">Silakan coba lagi atau bayar ulang</p>
      </div>

      <div className="border rounded-lg p-6 bg-muted/30 space-y-4 text-sm">
        <p><strong>Order ID:</strong> <span className="font-mono">{tx.midtrans_order_id}</span></p>
        <p><strong>Plan:</strong> {tx.subscription_plans?.name}</p>
        <p><strong>Jumlah:</strong> {formatCurrency(parseInt(tx.gross_amount))}</p>
        <p><strong>Status:</strong> {tx.status}</p>

        {tx.snap_redirect_url && (
          <a href={tx.snap_redirect_url} target="_blank" rel="noopener noreferrer">
            <Button variant="default" className="mt-2 w-full">Bayar Ulang</Button>
          </a>
        )}
      </div>

      <div className="text-center">
        <Button asChild variant="ghost">
          <a href="/">Kembali ke Dashboard</a>
        </Button>
      </div>
    </div>
  );
}
