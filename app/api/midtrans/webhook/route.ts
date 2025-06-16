import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const payload = await req.json();

  const {
    order_id,
    transaction_status,
    payment_type,
    transaction_id,
    gross_amount
  } = payload;

  // Update status transaksi
  await supabase.from("payment_transactions")
    .update({
      status: transaction_status,
      midtrans_transaction_id: transaction_id,
      payment_type,
      paid_at: transaction_status === "settlement" ? new Date().toISOString() : null
    })
    .eq("midtrans_order_id", order_id);

  // Aktifkan subscription jika sukses bayar
  if (transaction_status === "settlement") {
    const { data: tx } = await supabase
      .from("payment_transactions")
      .select("user_id, plan_id")
      .eq("midtrans_order_id", order_id)
      .single();

    await supabase.from("user_subscriptions").upsert({
      user_id: tx.user_id,
      plan_id: tx.plan_id,
      is_active: true,
      started_at: new Date().toISOString(),
    }, { onConflict: ['user_id'] });
  }

  return NextResponse.json({ message: "Webhook received" });
}
