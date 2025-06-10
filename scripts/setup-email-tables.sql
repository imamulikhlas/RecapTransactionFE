-- Create email_transactions table
CREATE TABLE IF NOT EXISTS public.email_transactions (
  id SERIAL NOT NULL,
  email_user TEXT NOT NULL,
  email_pass TEXT NOT NULL,
  imap_host TEXT NULL DEFAULT 'imap.gmail.com',
  imap_port INTEGER NULL DEFAULT 993,
  active BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  user_id UUID NOT NULL,
  CONSTRAINT email_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT email_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id SERIAL NOT NULL,
  account_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  status TEXT NOT NULL,
  message TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT email_logs_pkey PRIMARY KEY (id),
  CONSTRAINT email_logs_account_id_fkey FOREIGN KEY (account_id) REFERENCES email_transactions (id),
  CONSTRAINT email_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- Enable RLS
ALTER TABLE public.email_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for email_transactions
CREATE POLICY "Users can view own email settings" ON public.email_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email settings" ON public.email_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email settings" ON public.email_transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for email_logs
CREATE POLICY "Users can view own email logs" ON public.email_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email logs" ON public.email_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_transactions_user_id ON public.email_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_account_id ON public.email_logs(account_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at);

-- Add unique constraint to ensure one email setting per user
ALTER TABLE public.email_transactions 
ADD CONSTRAINT email_transactions_user_id_unique UNIQUE (user_id);

SELECT 'Email tables setup complete!' AS result;
