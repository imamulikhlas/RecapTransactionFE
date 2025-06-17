"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      supabase
        .from("payment_transactions")
        .select("*, subscription_plans(name)")
        .eq("midtrans_order_id", orderId)
        .single()
        .then(({ data }) => {
          setTx(data);
          setLoading(false);
        });
    }
  }, [orderId]);

  if (loading) {
    return <Loader2 className="h-6 w-6 animate-spin mt-10 mx-auto" />;
  }

  if (!tx) {
    return <p className="text-center mt-10 text-red-500">Transaksi tidak ditemukan.</p>;
  }

  const formatCurrency = (val: number) =>
    `Rp ${val.toLocaleString("id-ID")}`;
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="max-w-xl mx-auto py-10 px-6 space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
        <h1 className="text-2xl font-semibold">Pembayaran Berhasil</h1>
        <p className="text-muted-foreground">Terima kasih atas langganan Anda</p>
      </div>

      <div className="border rounded-lg p-6 bg-muted/40 space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-y-2">
          <span>Order ID:</span>
          <span className="font-mono">{tx.midtrans_order_id}</span>

          <span>Plan:</span>
          <span>{tx.subscription_plans?.name}</span>

          <span>Nominal:</span>
          <span>{formatCurrency(parseInt(tx.gross_amount))}</span>

          <span>Status:</span>
          <Badge variant="outline">{tx.status}</Badge>

          <span>Dibayar pada:</span>
          <span>{tx.paid_at ? formatDate(tx.paid_at) : "-"}</span>
        </div>
      </div>

      <div className="text-center">
        <Button asChild>
          <a href="/">Kembali ke Beranda</a>
        </Button>
      </div>
    </div>
  );
}
