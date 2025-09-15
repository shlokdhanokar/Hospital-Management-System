-- Create 10 beds with sample data
INSERT INTO beds (bed_number, status) VALUES
(1, 'patient_admitted'),
(2, 'patient_admitted'),
(3, 'vacant'),
(4, 'patient_admitted'),
(5, 'under_maintenance'),
(6, 'patient_admitted'),
(7, 'vacant'),
(8, 'patient_admitted'),
(9, 'patient_admitted'),
(10, 'vacant')
ON CONFLICT (bed_number) DO UPDATE SET status = EXCLUDED.status;

-- Insert sample Indian patients for occupied beds
INSERT INTO patients (name, date_of_birth, blood_group, issue, recovery_rate, expected_discharge_date, doctor, medicines, caretaker_name, caretaker_contact, admission_date, bed_id, phone, address, emergency_contact_name, emergency_contact_phone) VALUES
('Rajesh Kumar Sharma', '1978-03-15', 'B+', 'Heart Surgery', 85, '2024-01-20', 'Dr. Priya Mehta', 'Aspirin, Metoprolol, Atorvastatin', 'Sunita Sharma', '+91 98765 43210', '2024-01-10', (SELECT id FROM beds WHERE bed_number = 1), '+91 98765 43211', '123 MG Road, Mumbai, Maharashtra 400001', 'Sunita Sharma', '+91 98765 43210'),

('Priya Devi Patel', '1985-07-22', 'A+', 'Diabetes Management', 92, '2024-01-18', 'Dr. Amit Singh', 'Metformin, Insulin, Glimepiride', 'Ravi Patel', '+91 87654 32109', '2024-01-12', (SELECT id FROM beds WHERE bed_number = 2), '+91 87654 32110', '456 Nehru Nagar, Delhi 110001', 'Ravi Patel', '+91 87654 32109'),

('Amit Singh Chauhan', '1990-11-08', 'O+', 'Orthopedic Surgery', 78, '2024-01-25', 'Dr. Kavya Reddy', 'Ibuprofen, Calcium, Vitamin D', 'Meera Chauhan', '+91 76543 21098', '2024-01-08', (SELECT id FROM beds WHERE bed_number = 4), '+91 76543 21099', '789 Gandhi Street, Bangalore, Karnataka 560001', 'Meera Chauhan', '+91 76543 21098'),

('Sunita Devi Singh', '1982-05-12', 'AB+', 'Hypertension Treatment', 88, '2024-01-22', 'Dr. Rohit Sharma', 'Amlodipine, Losartan, Hydrochlorothiazide', 'Vikram Singh', '+91 65432 10987', '2024-01-11', (SELECT id FROM beds WHERE bed_number = 6), '+91 65432 10988', '321 Rajiv Chowk, Chennai, Tamil Nadu 600001', 'Vikram Singh', '+91 65432 10987'),

('Vikram Kumar Gupta', '1975-09-30', 'B-', 'Gastroenterology', 90, '2024-01-19', 'Dr. Neha Agarwal', 'Omeprazole, Domperidone, Probiotics', 'Anjali Gupta', '+91 54321 09876', '2024-01-09', (SELECT id FROM beds WHERE bed_number = 8), '+91 54321 09877', '654 Park Avenue, Pune, Maharashtra 411001', 'Anjali Gupta', '+91 54321 09876'),

('Meera Devi Joshi', '1988-12-03', 'A-', 'Respiratory Issues', 82, '2024-01-21', 'Dr. Suresh Kumar', 'Salbutamol, Prednisolone, Montelukast', 'Deepak Joshi', '+91 43210 98765', '2024-01-13', (SELECT id FROM beds WHERE bed_number = 9), '+91 43210 98766', '987 Lake View, Hyderabad, Telangana 500001', 'Deepak Joshi', '+91 43210 98765');

-- Add some sample expenses for these patients
INSERT INTO expenses (patient_id, expense_type, amount, description, date_added) VALUES
((SELECT id FROM patients WHERE name = 'Rajesh Kumar Sharma'), 'Medical', 15000, 'Heart Surgery Procedure', '2024-01-10'),
((SELECT id FROM patients WHERE name = 'Rajesh Kumar Sharma'), 'Medicine', 2500, 'Post-surgery medications', '2024-01-11'),
((SELECT id FROM patients WHERE name = 'Priya Devi Patel'), 'Medical', 8000, 'Diabetes consultation and tests', '2024-01-12'),
((SELECT id FROM patients WHERE name = 'Amit Singh Chauhan'), 'Medical', 25000, 'Orthopedic Surgery', '2024-01-08'),
((SELECT id FROM patients WHERE name = 'Sunita Devi Singh'), 'Medicine', 1800, 'Hypertension medications', '2024-01-11'),
((SELECT id FROM patients WHERE name = 'Vikram Kumar Gupta'), 'Medical', 12000, 'Gastroenterology treatment', '2024-01-09'),
((SELECT id FROM patients WHERE name = 'Meera Devi Joshi'), 'Medicine', 3200, 'Respiratory medications', '2024-01-13');
