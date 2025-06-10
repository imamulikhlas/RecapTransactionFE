-- Insert sample email logs for testing
-- This will only work if you have email_transactions records

DO $$
DECLARE
  sample_account_id INTEGER;
  sample_user_id UUID;
BEGIN
  -- Get a sample account and user for demo data
  SELECT id, user_id INTO sample_account_id, sample_user_id 
  FROM public.email_transactions 
  LIMIT 1;

  -- Only insert if we have an account
  IF sample_account_id IS NOT NULL THEN
    INSERT INTO public.email_logs (account_id, user_id, status, message, created_at) VALUES
    (sample_account_id, sample_user_id, 'success', 'Email processed successfully - 5 transactions found', NOW() - INTERVAL '1 hour'),
    (sample_account_id, sample_user_id, 'success', 'Email processed successfully - 2 transactions found', NOW() - INTERVAL '2 hours'),
    (sample_account_id, sample_user_id, 'warning', 'No new emails found in inbox', NOW() - INTERVAL '3 hours'),
    (sample_account_id, sample_user_id, 'error', 'Failed to connect to IMAP server - timeout', NOW() - INTERVAL '4 hours'),
    (sample_account_id, sample_user_id, 'success', 'Email processed successfully - 1 transaction found', NOW() - INTERVAL '5 hours'),
    (sample_account_id, sample_user_id, 'processing', 'Starting email scan process', NOW() - INTERVAL '6 hours'),
    (sample_account_id, sample_user_id, 'error', 'Authentication failed - invalid credentials', NOW() - INTERVAL '1 day'),
    (sample_account_id, sample_user_id, 'success', 'Email processed successfully - 8 transactions found', NOW() - INTERVAL '1 day 2 hours'),
    (sample_account_id, sample_user_id, 'warning', 'Email quota limit reached', NOW() - INTERVAL '1 day 4 hours'),
    (sample_account_id, sample_user_id, 'success', 'Email processed successfully - 3 transactions found', NOW() - INTERVAL '2 days');
    
    RAISE NOTICE 'Sample email logs inserted successfully!';
  ELSE
    RAISE NOTICE 'No email_transactions found. Please set up email settings first.';
  END IF;
END
$$;

-- Show the count of logs
SELECT COUNT(*) AS "Total Email Logs" FROM public.email_logs;
