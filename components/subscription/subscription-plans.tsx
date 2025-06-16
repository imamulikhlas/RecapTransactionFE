"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const PLANS = [
  { id: "plan-free", name: "Free", price: 0, description: "Basic usage" },
  {
    id: "plan-pro",
    name: "Pro",
    price: 49000,
    description: "Up to 100 emails/day",
  },
  {
    id: "plan-premium",
    name: "Premium",
    price: 99000,
    description: "Up to 500 emails/day",
  },
];

export default function SubscriptionPlans({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: any) => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        plan_id: plan.id,
        email: user.email,
        plan_name: plan.name,
        amount: plan.price,
      }),
    });

    const data = await res.json();

    if (data.redirect_url) {
      window.location.href = data.redirect_url;
    } else {
      console.error("Gagal mendapatkan redirect_url:", data);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Choose your plan</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div key={plan.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
            <p className="text-xl font-bold mt-2">
              {plan.price > 0
                ? `Rp${plan.price.toLocaleString("id-ID")}`
                : "Free"}
            </p>
            {plan.price > 0 && (
              <Button
                className="mt-4 w-full"
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
              >
                {loading ? "Processing..." : "Subscribe"}
              </Button>
            )}
            {plan.price === 0 && (
              <Button className="mt-4 w-full" disabled variant="outline">
                Active
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
