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
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { user_id, plan_id, email, plan_name, amount } = body;

    if (!user_id || !plan_id || !email || !plan_name || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔎 Ambil UUID plan berdasarkan slug
    const { data: planData, error: planError } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("slug", plan_id)
      .single();

    if (planError || !planData) {
      return NextResponse.json(
        { error: "Plan tidak ditemukan" },
        { status: 400 }
      );
    }

    const planUuid = planData.id;

    // ❗ Cek apakah masih ada transaksi aktif (pending/challenge)
    const { data: existingTx, error: txError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("user_id", user_id)
      .in("status", ["pending", "challenge"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existingTx) {
      return NextResponse.json(
        {
          error: "Masih ada transaksi yang belum selesai.",
          existing_transaction: {
            midtrans_order_id: existingTx.midtrans_order_id,
            snap_redirect_url: existingTx.snap_redirect_url,
          },
        },
        { status: 400 }
      );
    }

    // 🔐 Buat order_id unik & pendek
    const shortId = crypto.randomBytes(8).toString("hex");
    const orderId = `sub-${shortId}`;

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
          id: plan_id,
          price: amount,
          quantity: 1,
          name: `Langganan ${plan_name}`,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/failed`,
        cancel: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/failed`,
      },
    });

    const redirectUrl = transaction.redirect_url;

    // 💾 Simpan ke payment_transactions
    const { error: insertError } = await supabase
      .from("payment_transactions")
      .insert({
        user_id,
        plan_id: planUuid,
        midtrans_order_id: orderId,
        status: "pending",
        gross_amount: amount,
        snap_redirect_url: redirectUrl, // <- penting!
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ redirect_url: redirectUrl });
  } catch (error: any) {
    console.error("❌ Checkout Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
