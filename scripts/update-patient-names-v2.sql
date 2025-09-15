-- Update existing patients with Indian names and realistic medical conditions
UPDATE patients SET 
  name = 'Rajesh Kumar Sharma',
  issue = 'Acute chest pain with shortness of breath',
  doctor = 'Dr. Anil Mehta',
  caretaker_name = 'Priya Sharma',
  phone = '+91 9876543210',
  address = '123 MG Road, Andheri West, Mumbai, Maharashtra 400058'
WHERE name = 'Michael Davis';

UPDATE patients SET 
  name = 'Sunita Devi Patel',
  issue = 'Diabetes management and hypertension',
  doctor = 'Dr. Kavita Singh',
  caretaker_name = 'Ramesh Patel',
  phone = '+91 9876543211',
  address = '456 Park Street, Bandra East, Mumbai, Maharashtra 400051'
WHERE name = 'Sarah Johnson';

UPDATE patients SET 
  name = 'Amit Singh Chauhan',
  issue = 'Post-operative recovery from appendectomy',
  doctor = 'Dr. Rajesh Gupta',
  caretaker_name = 'Neha Chauhan',
  phone = '+91 9876543212',
  address = '789 Hill Road, Bandra West, Mumbai, Maharashtra 400050'
WHERE name = 'John Smith';

UPDATE patients SET 
  name = 'Meera Krishnan',
  issue = 'Respiratory infection and pneumonia',
  doctor = 'Dr. Suresh Kumar',
  caretaker_name = 'Ravi Krishnan',
  phone = '+91 9876543213',
  address = '321 Marine Drive, Nariman Point, Mumbai, Maharashtra 400021'
WHERE name = 'Emily Brown';

-- Insert additional Indian patients if beds are available
INSERT INTO patients (name, date_of_birth, blood_group, phone, address, emergency_contact_name, emergency_contact_phone, issue, doctor, medicines, caretaker_name, caretaker_contact, admission_date, recovery_rate, expected_discharge_date, bed_id)
SELECT 
  'Arjun Reddy',
  '1990-03-20',
  'B+',
  '+91 9876543214',
  '654 Linking Road, Khar West, Mumbai, Maharashtra 400052',
  'Kavya Reddy',
  '+91 9876543215',
  'Orthopedic surgery recovery - fractured femur',
  'Dr. Vikram Rao',
  'Paracetamol 500mg, Ibuprofen 400mg',
  'Kavya Reddy',
  '+91 9876543215',
  NOW(),
  25,
  NOW() + INTERVAL '10 days',
  id
FROM beds 
WHERE status = 'vacant' 
LIMIT 1;
