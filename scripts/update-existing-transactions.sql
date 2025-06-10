-- This script updates existing transactions to have a user_id
-- Only run this if you have existing data and want to assign it to a specific user

-- First, let's see if we have any users
SELECT 'Current users in auth.users:' AS info;
SELECT id, email, created_at FROM auth.users LIMIT 5;

-- Check current transactions without user_id
SELECT 'Transactions without user_id:' AS info;
SELECT COUNT(*) as count FROM public.transactions WHERE user_id IS NULL;

-- If you want to assign all existing transactions to the first user, uncomment and run:
-- UPDATE public.transactions 
-- SET user_id = (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)
-- WHERE user_id IS NULL;

-- Or assign to a specific user (replace 'user@example.com' with actual email):
-- UPDATE public.transactions 
-- SET user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
-- WHERE user_id IS NULL;

SELECT 'Script completed. Uncomment the UPDATE statement you want to use.' AS result;
