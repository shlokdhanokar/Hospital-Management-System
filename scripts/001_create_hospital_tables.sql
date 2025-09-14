-- Create beds table
CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_number INTEGER NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('vacant', 'under_maintenance', 'patient_admitted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  blood_group TEXT NOT NULL,
  issue TEXT NOT NULL,
  recovery_rate INTEGER CHECK (recovery_rate >= 0 AND recovery_rate <= 100),
  expected_discharge_date DATE,
  doctor TEXT NOT NULL,
  medicines TEXT,
  caretaker_name TEXT,
  caretaker_contact TEXT,
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  bed_id UUID REFERENCES beds(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discharge summaries table
CREATE TABLE IF NOT EXISTS discharge_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  total_bill DECIMAL(10,2) NOT NULL,
  discharge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample beds (20 beds)
INSERT INTO beds (bed_number, status) VALUES
(1, 'vacant'),
(2, 'patient_admitted'),
(3, 'vacant'),
(4, 'under_maintenance'),
(5, 'patient_admitted'),
(6, 'vacant'),
(7, 'vacant'),
(8, 'patient_admitted'),
(9, 'vacant'),
(10, 'vacant'),
(11, 'patient_admitted'),
(12, 'vacant'),
(13, 'under_maintenance'),
(14, 'vacant'),
(15, 'patient_admitted'),
(16, 'vacant'),
(17, 'vacant'),
(18, 'vacant'),
(19, 'patient_admitted'),
(20, 'vacant');

-- Insert sample patients
INSERT INTO patients (name, date_of_birth, blood_group, issue, recovery_rate, expected_discharge_date, doctor, medicines, caretaker_name, caretaker_contact, bed_id) VALUES
('John Smith', '1985-03-15', 'A+', 'Pneumonia', 75, '2024-12-20', 'Dr. Johnson', 'Antibiotics, Pain relievers', 'Mary Smith', '+1-555-0101', (SELECT id FROM beds WHERE bed_number = 2)),
('Sarah Wilson', '1992-07-22', 'B-', 'Appendicitis Surgery', 90, '2024-12-18', 'Dr. Brown', 'Post-surgery medication', 'Tom Wilson', '+1-555-0102', (SELECT id FROM beds WHERE bed_number = 5)),
('Michael Davis', '1978-11-08', 'O+', 'Heart Surgery', 60, '2024-12-25', 'Dr. Anderson', 'Heart medication, Blood thinners', 'Lisa Davis', '+1-555-0103', (SELECT id FROM beds WHERE bed_number = 8)),
('Emma Johnson', '1995-05-30', 'AB+', 'Broken Leg', 85, '2024-12-22', 'Dr. Miller', 'Pain medication, Calcium supplements', 'Robert Johnson', '+1-555-0104', (SELECT id FROM beds WHERE bed_number = 11)),
('David Brown', '1988-09-12', 'A-', 'Diabetes Management', 70, '2024-12-28', 'Dr. Wilson', 'Insulin, Metformin', 'Jennifer Brown', '+1-555-0105', (SELECT id FROM beds WHERE bed_number = 15)),
('Lisa Garcia', '1990-01-25', 'O-', 'Kidney Stones', 80, '2024-12-19', 'Dr. Taylor', 'Pain relievers, Antibiotics', 'Carlos Garcia', '+1-555-0106', (SELECT id FROM beds WHERE bed_number = 19));

-- Insert sample expenses
INSERT INTO expenses (patient_id, description, amount) VALUES
((SELECT id FROM patients WHERE name = 'John Smith'), 'X-Ray Chest', 150.00),
((SELECT id FROM patients WHERE name = 'John Smith'), 'Blood Test', 75.00),
((SELECT id FROM patients WHERE name = 'Sarah Wilson'), 'CT Scan', 500.00),
((SELECT id FROM patients WHERE name = 'Sarah Wilson'), 'Surgery Fee', 2500.00),
((SELECT id FROM patients WHERE name = 'Michael Davis'), 'ECG', 100.00),
((SELECT id FROM patients WHERE name = 'Michael Davis'), 'Cardiac Catheterization', 3000.00),
((SELECT id FROM patients WHERE name = 'Emma Johnson'), 'X-Ray Leg', 120.00),
((SELECT id FROM patients WHERE name = 'David Brown'), 'Blood Sugar Test', 50.00),
((SELECT id FROM patients WHERE name = 'Lisa Garcia'), 'Ultrasound', 200.00);

-- Enable Row Level Security (RLS) - for future authentication if needed
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE discharge_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (can be restricted later with authentication)
CREATE POLICY "Allow all operations on beds" ON beds FOR ALL USING (true);
CREATE POLICY "Allow all operations on patients" ON patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on expenses" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow all operations on discharge_summaries" ON discharge_summaries FOR ALL USING (true);
