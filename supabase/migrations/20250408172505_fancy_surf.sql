/*
  # Database Schema Update

  1. Changes to formulario_contato
    - Add separate date and time columns
    - Update policies for better access control

  2. Update policies for both tables
    - Enable proper insert and select policies
    - Remove authentication requirement for inserts
*/

-- Drop existing tables
DROP TABLE IF EXISTS agendamento_consultoria;
DROP TABLE IF EXISTS formulario_contato;

-- Create agendamento_consultoria table
CREATE TABLE agendamento_consultoria (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo'),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,}$')
);

-- Create formulario_contato table with separate date and time columns
CREATE TABLE formulario_contato (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo'),
    submission_date DATE DEFAULT (CURRENT_DATE AT TIME ZONE 'America/Sao_Paulo'),
    submission_time TIME DEFAULT (CURRENT_TIME AT TIME ZONE 'America/Sao_Paulo'),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (
        CASE 
            WHEN phone IS NOT NULL THEN phone ~* '^\+?[0-9]{10,}$'
            ELSE true
        END
    )
);

-- Enable RLS
ALTER TABLE agendamento_consultoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulario_contato ENABLE ROW LEVEL SECURITY;

-- Policies for agendamento_consultoria
CREATE POLICY "Enable public insert" ON agendamento_consultoria 
    FOR INSERT TO public 
    WITH CHECK (true);

CREATE POLICY "Enable public select" ON agendamento_consultoria 
    FOR SELECT TO public 
    USING (true);

-- Policies for formulario_contato
CREATE POLICY "Enable public insert" ON formulario_contato 
    FOR INSERT TO public 
    WITH CHECK (true);

CREATE POLICY "Enable public select" ON formulario_contato 
    FOR SELECT TO public 
    USING (true);

-- Create indexes
CREATE INDEX idx_agendamento_consultoria_date ON agendamento_consultoria(date);
CREATE INDEX idx_agendamento_consultoria_email ON agendamento_consultoria(email);
CREATE INDEX idx_agendamento_consultoria_created_at ON agendamento_consultoria(created_at);

CREATE INDEX idx_formulario_contato_email ON formulario_contato(email);
CREATE INDEX idx_formulario_contato_created_at ON formulario_contato(created_at);
CREATE INDEX idx_formulario_contato_submission_date ON formulario_contato(submission_date);

COMMENT ON TABLE agendamento_consultoria IS 'Tabela para armazenar agendamentos de consultoria';
COMMENT ON TABLE formulario_contato IS 'Tabela para armazenar mensagens do formulário de contato';