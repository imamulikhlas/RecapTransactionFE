"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PaymentHistory({ userId }: { userId: string }) {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await supabase
        .from("payment_transactions")
        .select("*, subscription_plans(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setPayments(data || []);
    };

    fetchPayments();
  }, [userId]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>
      {payments.length === 0 ? (
        <p>Belum ada transaksi.</p>
      ) : (
        <ul className="space-y-3">
          {payments.map((pmt) => (
            <li
              key={pmt.id}
              className="border p-4 rounded-lg shadow-sm bg-card flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{pmt.subscription_plans.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(pmt.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  Rp{parseInt(pmt.gross_amount).toLocaleString("id-ID")}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    pmt.status === "capture"
                      ? "bg-green-800 text-green-100"
                      : pmt.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : pmt.status === "expire"
                      ? "bg-red-800 text-red-100"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {pmt.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
