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
                <p className="text-sm text-muted-foreground">{new Date(pmt.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">Rp{parseInt(pmt.gross_amount).toLocaleString("id-ID")}</p>
                <p className={`text-xs mt-1 ${pmt.status === "settlement" ? "text-green-600" : "text-yellow-600"}`}>
                  {pmt.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
