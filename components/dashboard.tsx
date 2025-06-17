"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTransactions,
  type Transaction,
  supabase,
  getCurrentUser,
  signOut,
  type User,
} from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Sidebar from "@/components/sidebar";
import TransactionList from "@/components/transaction-list";
import TransactionDetails from "@/components/transaction-details";
import Overview from "@/components/overview";
import Analytics from "@/components/analytics";
import LoginForm from "@/components/auth/login-form";
import { useMediaQuery } from "@/hooks/use-media-query";
import Settings from "@/components/settings";
import Logs from "@/components/logs";
import TransactionRoasts from "@/components/transaction-roasts";
import RoastDetails from "@/components/roast-details";
import SubscriptionDashboard  from "@/components/subscription/subscription";
import type { TransactionRoast } from "@/lib/supabase";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedRoast, setSelectedRoast] = useState<TransactionRoast | null>(
    null
  );

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) {
        setAuthLoading(false);
        return;
      }

      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setAuthLoading(false);

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    };

    checkUser();
  }, []);

  // Only fetch transactions for overview - TransactionList will handle its own data
  useEffect(() => {
    const fetchTransactions = async () => {
      if (activeView === "overview") {
        setLoading(true);
        const data = await getTransactions(
          5,
          0,
          "date",
          "desc",
          undefined,
          user?.id
        );
        setTransactions(data);
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchTransactions();
    }
  }, [user, authLoading, activeView]);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setActiveView("details");
  };

  const handleRoastClick = (roast: TransactionRoast) => {
    setSelectedRoast(roast);
    setActiveView("roast-details");
  };

  const handleBackClick = () => {
    setActiveView("transactions");
    setSelectedTransaction(null);
  };

  const handleRoastBackClick = () => {
    setActiveView("roasts");
    setSelectedRoast(null);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view !== "details") {
      setSelectedTransaction(null);
    }
    if (view !== "roast-details") {
      setSelectedRoast(null);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await signOut();
    }
  };

  const handleLoginSuccess = () => {
    // User state will be updated by the auth state listener
  };

  const handleViewAllRoasts = () => {
    setActiveView("roasts");
  };

  const handleViewRoastDetails = (roastId: number) => {
    setActiveView("roasts");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login form if user is not authenticated and Supabase is configured
  if (supabase && !user) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        isMobile={isMobile}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-hidden">
        {!supabase && (
          <Alert className="m-4 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> Supabase is not configured. Using mock
              data for demonstration. Add your Supabase credentials to connect
              to your real database.
            </AlertDescription>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4,
            }}
            className="h-full overflow-auto p-4 md:p-8"
          >
            {activeView === "overview" && (
              <Overview
                transactions={transactions}
                onTransactionClick={handleTransactionClick}
                loading={loading}
                userId={user?.id}
                onViewAllRoasts={handleViewAllRoasts}
                onViewRoastDetails={handleViewRoastDetails}
                onViewChange={handleViewChange}
              />
            )}

            {activeView === "transactions" && (
              <TransactionList
                onTransactionClick={handleTransactionClick}
                userId={user?.id}
              />
            )}

            {activeView === "analytics" && (
              <Analytics
                userId={user?.id}
                onTransactionClick={handleTransactionClick}
              />
            )}

            {activeView === "details" && selectedTransaction && (
              <TransactionDetails
                transaction={selectedTransaction}
                onBackClick={handleBackClick}
              />
            )}

            {activeView === "settings" && <Settings userId={user?.id} />}

            {activeView === "logs" && <Logs userId={user?.id} />}

            {activeView === "roasts" && (
              <TransactionRoasts
                userId={user?.id}
                onRoastClick={handleRoastClick}
              />
            )}

            {activeView === "roast-details" && selectedRoast && (
              <RoastDetails
                roastId={selectedRoast.id}
                userId={user?.id}
                onBackClick={handleRoastBackClick}
                onTransactionClick={handleTransactionClick}
              />
            )}
            {activeView === "subscription" && <SubscriptionDashboard user={user} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
