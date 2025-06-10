-- This script creates the transactions table if it doesn't exist
-- You can run this script to ensure your database schema is set up correctly

-- Check if the table exists, if not create it
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL NOT NULL,
  reference TEXT NULL,
  date DATE NULL,
  description TEXT NULL,
  amount NUMERIC NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
  provider TEXT NULL,
  transaction_type TEXT NULL,
  account_from TEXT NULL,
  account_to TEXT NULL,
  fee NUMERIC NULL,
  total_amount NUMERIC NULL,
  raw_payload JSONB NULL,
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_reference_key UNIQUE (reference)
);

-- Add RLS policy if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'transactions' 
    AND policyname = 'public_can_read_transactions'
  ) THEN
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "public_can_read_transactions"
    ON public.transactions
    FOR SELECT TO anon
    USING (true);
  END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_provider ON public.transactions(provider);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_type ON public.transactions(transaction_type);

-- Output success message
SELECT 'Transaction table setup complete!' AS result;
