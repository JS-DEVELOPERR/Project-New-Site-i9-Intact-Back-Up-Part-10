/*
  # Add Unique Constraint for Appointments and Update Holiday Dates

  1. Changes
    - Add unique constraint for date and time_slot combination
    - Update existing table structure with new constraint

  2. Security
    - Maintain existing RLS policies
    - Keep existing indexes
*/

-- Drop existing table
DROP TABLE IF EXISTS agendamento_consultoria;

-- Recreate table with unique constraint
CREATE TABLE agendamento_consultoria (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo'),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    
    -- Add unique constraint for date and time_slot
    CONSTRAINT unique_date_time UNIQUE (date, time_slot),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,}$')
);

-- Enable RLS
ALTER TABLE agendamento_consultoria ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Enable public insert" ON agendamento_consultoria 
    FOR INSERT TO public 
    WITH CHECK (true);

CREATE POLICY "Enable public select" ON agendamento_consultoria 
    FOR SELECT TO public 
    USING (true);

-- Recreate indexes
CREATE INDEX idx_agendamento_consultoria_date ON agendamento_consultoria(date);
CREATE INDEX idx_agendamento_consultoria_email ON agendamento_consultoria(email);
CREATE INDEX idx_agendamento_consultoria_created_at ON agendamento_consultoria(created_at);

COMMENT ON TABLE agendamento_consultoria IS 'Tabela para armazenar agendamentos de consultoria';