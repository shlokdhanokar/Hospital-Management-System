-- Create OPD patients table
CREATE TABLE IF NOT EXISTS opd_patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    contact VARCHAR(20) NOT NULL,
    issue TEXT NOT NULL,
    doctor VARCHAR(255) NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_consultation', 'completed', 'cancelled')),
    queue_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_opd_patients_status ON opd_patients(status);
CREATE INDEX IF NOT EXISTS idx_opd_patients_queue_number ON opd_patients(queue_number);
CREATE INDEX IF NOT EXISTS idx_opd_patients_created_at ON opd_patients(created_at);

-- Enable RLS
ALTER TABLE opd_patients ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on opd_patients" ON opd_patients
    FOR ALL USING (true);
