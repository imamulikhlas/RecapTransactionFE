"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import PendingTransactionAlert  from "@/components/alert/PendingTransactionAlert";

export default function SubscriptionPage({ user }: { user: any }) {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [pendingTx, setPendingTx] = useState<{
    orderId: string;
    redirectUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(name, description)")
        .eq("user_id", user.id)
        .single();

      setCurrentPlan(subscription);

      const { data: allPlans } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price");

      setPlans(allPlans || []);
    };

    fetchData();
  }, [user]);

  const handleSubscribe = async (plan: any) => {
    setLoadingPlanId(plan.id);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        plan_id: plan.slug,
        email: user.email,
        plan_name: plan.name,
        amount: plan.price,
      }),
    });

    const data = await res.json();

    if (res.status === 400 && data?.existing_transaction) {
      setPendingTx({
        orderId: data.existing_transaction.midtrans_order_id,
        redirectUrl: data.existing_transaction.snap_redirect_url,
      });
    } else if (data?.redirect_url) {
      window.location.href = data.redirect_url;
    } else {
      alert("Gagal membuat pembayaran");
    }

    setLoadingPlanId(null);
  };

  return (
    <div className="space-y-6">
      {/* 🔔 Alert jika ada transaksi pending */}
      {pendingTx && (
        <PendingTransactionAlert
          orderId={pendingTx.orderId}
          redirectUrl={pendingTx.redirectUrl}
        />
      )}

      {/* 📌 Status Langganan */}
      <div>
        <h2 className="text-2xl font-bold">Status Langganan</h2>
        {currentPlan ? (
          <div className="mt-3 border p-4 rounded-lg shadow-sm bg-card">
            <p className="font-bold text-xl">
              {currentPlan.subscription_plans.name}
            </p>
            <p className="text-muted-foreground">
              {currentPlan.subscription_plans.description}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aktif sejak:{" "}
              {new Date(currentPlan.started_at).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground mt-2">
            Belum ada langganan aktif.
          </p>
        )}
      </div>

      {/* 💳 Pilihan Paket */}
      <div>
        <h2 className="text-2xl font-bold">Pilih Paket Langganan</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          {plans.map((plan) => {
            const isActive = currentPlan?.plan_id === plan.id;

            return (
              <div
                key={plan.id}
                className={`border p-4 rounded-lg shadow-sm ${
                  isActive ? "border-green-500" : "border-border"
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <p className="text-xl font-bold mt-2">
                  {plan.price > 0
                    ? `Rp${plan.price.toLocaleString("id-ID")}`
                    : "Free"}
                </p>

                <Button
                  className="mt-4 w-full"
                  onClick={() => handleSubscribe(plan)}
                  disabled={isActive || loadingPlanId === plan.id}
                  variant={isActive ? "outline" : "default"}
                >
                  {isActive
                    ? "Aktif"
                    : loadingPlanId === plan.id
                    ? "Loading..."
                    : "Langganan"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
