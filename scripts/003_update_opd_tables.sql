-- Add notes column to opd_patients table
ALTER TABLE opd_patients ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_opd_patients_updated_at ON opd_patients;
CREATE TRIGGER update_opd_patients_updated_at
    BEFORE UPDATE ON opd_patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
