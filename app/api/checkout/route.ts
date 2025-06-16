import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Invalid Content-Type" }, { status: 400 });
    }

    const body = await req.json();
    const { user_id, plan_id, email, plan_name, amount } = body;

    if (!user_id || !plan_id || !email || !plan_name || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🧠 Cari UUID dari slug (plan_id yang dikirim frontend adalah SLUG)
    const { data: planData, error: planError } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("slug", plan_id)
      .single();

    if (planError || !planData) {
      return NextResponse.json({ error: "Plan tidak ditemukan" }, { status: 400 });
    }

    const planUuid = planData.id;

    // 🔐 Bikin order_id pendek agar tidak error di Midtrans
    const shortId = crypto.randomBytes(8).toString("hex");
    const orderId = `sub-${shortId}`; // max ~20 karakter

    // 🔁 Buat transaksi ke Midtrans
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        email,
      },
      item_details: [
        {
          id: plan_id, // ini slug, tidak masalah
          price: amount,
          quantity: 1,
          name: `Langganan ${plan_name}`,
        },
      ],
    });

    // 💾 Simpan transaksi ke Supabase
    const { error } = await supabase.from("payment_transactions").insert({
      user_id,
      plan_id: planUuid, // pakai UUID
      midtrans_order_id: orderId,
      status: "pending",
      gross_amount: amount,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ✅ Beri response redirect_url
    if (transaction?.redirect_url) {
      return NextResponse.json({ redirect_url: transaction.redirect_url });
    } else {
      return NextResponse.json({ error: "Gagal mendapatkan redirect URL" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
