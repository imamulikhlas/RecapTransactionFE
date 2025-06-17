"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Receipt, ClipboardCopy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  userId: string;
}

export default function PaymentHistory({ userId }: Props) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("*, subscription_plans(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error) setPayments(data || []);
      setLoading(false);
    };

    fetchPayments();
  }, [userId]);

  const formatCurrency = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  const formatDate = (raw: string) =>
    new Date(raw).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "settlement":
        return "bg-green-100 text-green-800";
      case "capture":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expire":
        return "bg-red-100 text-red-800";
      case "cancel":
      case "failure":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>

      {payments.length === 0 ? (
        <p className="text-muted-foreground">Belum ada transaksi.</p>
      ) : (
        <ul className="space-y-4">
          {payments.map((pmt) => {
            const expanded = expandedId === pmt.id;
            return (
              <li
                key={pmt.id}
                className="border rounded-lg bg-card shadow-sm overflow-hidden"
              >
                {/* Head */}
                <button
                  onClick={() => toggleExpand(pmt.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-muted transition"
                >
                  <div className="flex flex-col">
                    <p className="font-medium">{pmt.subscription_plans?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(pmt.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-semibold text-green-700 text-sm">
                      {formatCurrency(parseInt(pmt.gross_amount))}
                    </p>
                    <Badge className={`text-xs ${getStatusStyle(pmt.status)}`}>
                      {pmt.status}
                    </Badge>
                  </div>
                  {expanded ? <ChevronUp className="ml-4" /> : <ChevronDown className="ml-4" />}
                </button>

                {/* Detail */}
                {expanded && (
                  <div className="bg-muted/30 px-6 py-4 border-t space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-mono">{pmt.midtrans_order_id}</span>

                      <span className="text-muted-foreground">Nominal:</span>
                      <span>{formatCurrency(parseInt(pmt.gross_amount))}</span>

                      <span className="text-muted-foreground">Status:</span>
                      <span>{pmt.status}</span>

                      <span className="text-muted-foreground">Dibuat pada:</span>
                      <span>{formatDate(pmt.created_at)}</span>

                      <span className="text-muted-foreground">Dibayar pada:</span>
                      <span>{pmt.paid_at ? formatDate(pmt.paid_at) : "-"}</span>
                    </div>

                    {pmt.status !== "settlement"  || pmt.status !== "capture" && pmt.snap_redirect_url && (
                      <a
                        href={pmt.snap_redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-3"
                      >
                        <Button size="sm" className="w-full">
                          Bayar Sekarang
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
