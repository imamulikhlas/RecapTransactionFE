-- This script inserts sample data into the transactions table
-- Only run this if you want to populate your table with test data

-- Insert sample transactions if the table is empty
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.transactions) = 0 THEN
    INSERT INTO public.transactions (
      reference, 
      date, 
      description, 
      amount, 
      provider, 
      transaction_type, 
      account_from, 
      account_to, 
      fee, 
      total_amount, 
      raw_payload
    ) VALUES
    ('TRX-001', '2023-05-15', 'Salary Payment', 5000000, 'Bank Transfer', 'income', 'Company Account', 'Personal Account', 0, 5000000, '{"note": "Monthly salary payment"}'::jsonb),
    ('TRX-002', '2023-05-16', 'Grocery Shopping', -250000, 'Supermarket', 'expense', 'Personal Account', 'Supermarket', 2500, 252500, '{"items": ["food", "household"]}'::jsonb),
    ('TRX-003', '2023-05-17', 'Internet Bill', -350000, 'ISP Provider', 'expense', 'Personal Account', 'ISP Provider', 0, 350000, '{"period": "May 2023"}'::jsonb),
    ('TRX-004', '2023-05-20', 'Freelance Work', 1500000, 'Client Payment', 'income', 'Client Account', 'Personal Account', 15000, 1485000, '{"project": "Website Design"}'::jsonb),
    ('TRX-005', '2023-05-22', 'Restaurant Dinner', -175000, 'Restaurant', 'expense', 'Credit Card', 'Restaurant', 0, 175000, '{"location": "Downtown"}'::jsonb),
    ('TRX-006', '2023-05-25', 'Mobile Phone Bill', -120000, 'Mobile Provider', 'expense', 'Personal Account', 'Mobile Provider', 1000, 121000, '{"plan": "Monthly Data Plan"}'::jsonb),
    ('TRX-007', '2023-05-28', 'Book Purchase', -85000, 'Bookstore', 'expense', 'Personal Account', 'Bookstore', 0, 85000, '{"title": "Financial Freedom"}'::jsonb),
    ('TRX-008', '2023-05-30', 'Investment Dividend', 750000, 'Investment Fund', 'income', 'Investment Account', 'Personal Account', 7500, 742500, '{"fund": "Index Fund"}'::jsonb),
    ('TRX-009', '2023-06-01', 'Rent Payment', -2000000, 'Landlord', 'expense', 'Personal Account', 'Landlord Account', 0, 2000000, '{"period": "June 2023"}'::jsonb),
    ('TRX-010', '2023-06-03', 'Coffee Shop', -35000, 'Coffee Shop', 'expense', 'Personal Account', 'Coffee Shop', 0, 35000, '{"items": ["cappuccino", "croissant"]}'::jsonb),
    ('TRX-011', '2023-06-05', 'Gym Membership', -300000, 'Fitness Center', 'expense', 'Credit Card', 'Fitness Center', 0, 300000, '{"period": "Monthly"}'::jsonb),
    ('TRX-012', '2023-06-10', 'Bonus Payment', 2000000, 'Company', 'income', 'Company Account', 'Personal Account', 0, 2000000, '{"reason": "Performance bonus"}'::jsonb),
    ('TRX-013', '2023-06-12', 'Electricity Bill', -420000, 'Electric Company', 'expense', 'Personal Account', 'Electric Company', 0, 420000, '{"period": "May-June 2023"}'::jsonb),
    ('TRX-014', '2023-06-15', 'Salary Payment', 5000000, 'Bank Transfer', 'income', 'Company Account', 'Personal Account', 0, 5000000, '{"note": "Monthly salary payment"}'::jsonb),
    ('TRX-015', '2023-06-18', 'Online Shopping', -750000, 'E-commerce', 'expense', 'Credit Card', 'Online Store', 0, 750000, '{"items": ["electronics", "clothing"]}'::jsonb),
    ('TRX-016', '2023-06-20', 'Water Bill', -150000, 'Water Company', 'expense', 'Personal Account', 'Water Company', 1500, 151500, '{"period": "Quarterly"}'::jsonb),
    ('TRX-017', '2023-06-22', 'Side Project', 1200000, 'Client', 'income', 'Client Account', 'Personal Account', 12000, 1188000, '{"project": "Logo Design"}'::jsonb),
    ('TRX-018', '2023-06-25', 'Transportation', -100000, 'Ride Sharing', 'expense', 'Personal Account', 'Ride Sharing App', 0, 100000, '{"trips": 5}'::jsonb),
    ('TRX-019', '2023-06-28', 'Health Insurance', -500000, 'Insurance Company', 'expense', 'Personal Account', 'Insurance Company', 0, 500000, '{"coverage": "Monthly premium"}'::jsonb),
    ('TRX-020', '2023-06-30', 'Interest Income', 125000, 'Bank', 'income', 'Savings Account', 'Personal Account', 0, 125000, '{"rate": "3.5%"}'::jsonb);
    
    RAISE NOTICE 'Sample data inserted successfully!';
  ELSE
    RAISE NOTICE 'Table already contains data. No sample data inserted.';
  END IF;
END
$$;

-- Output the count of transactions
SELECT COUNT(*) AS "Total Transactions" FROM public.transactions;
