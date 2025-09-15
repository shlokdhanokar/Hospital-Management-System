-- Add missing columns to patients table for patient admission functionality
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

-- Update existing patients with sample data to maintain consistency
UPDATE patients 
SET 
  phone = CASE 
    WHEN name LIKE '%Rajesh%' THEN '+91 9876543210'
    WHEN name LIKE '%Sunita%' THEN '+91 9876543211'
    WHEN name LIKE '%Amit%' THEN '+91 9876543212'
    WHEN name LIKE '%Priya%' THEN '+91 9876543213'
    WHEN name LIKE '%Vikram%' THEN '+91 9876543214'
    ELSE '+91 9876543200'
  END,
  address = CASE 
    WHEN name LIKE '%Rajesh%' THEN '123 MG Road, Andheri West, Mumbai, Maharashtra 400058'
    WHEN name LIKE '%Sunita%' THEN '456 CP Road, Sector 15, Noida, Uttar Pradesh 201301'
    WHEN name LIKE '%Amit%' THEN '789 Brigade Road, Bangalore, Karnataka 560001'
    WHEN name LIKE '%Priya%' THEN '321 Anna Salai, T Nagar, Chennai, Tamil Nadu 600017'
    WHEN name LIKE '%Vikram%' THEN '654 Park Street, Kolkata, West Bengal 700016'
    ELSE 'Address not provided'
  END,
  emergency_contact_name = CASE 
    WHEN name LIKE '%Rajesh%' THEN 'Priya Sharma'
    WHEN name LIKE '%Sunita%' THEN 'Ramesh Patel'
    WHEN name LIKE '%Amit%' THEN 'Neha Chauhan'
    WHEN name LIKE '%Priya%' THEN 'Arjun Mehta'
    WHEN name LIKE '%Vikram%' THEN 'Kavya Singh'
    ELSE 'Emergency Contact'
  END,
  emergency_contact_phone = CASE 
    WHEN name LIKE '%Rajesh%' THEN '+91 9876543220'
    WHEN name LIKE '%Sunita%' THEN '+91 9876543221'
    WHEN name LIKE '%Amit%' THEN '+91 9876543222'
    WHEN name LIKE '%Priya%' THEN '+91 9876543223'
    WHEN name LIKE '%Vikram%' THEN '+91 9876543224'
    ELSE '+91 9876543299'
  END
WHERE phone IS NULL OR address IS NULL OR emergency_contact_name IS NULL OR emergency_contact_phone IS NULL;
