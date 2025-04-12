/*
  # Database Schema Update

  1. Drop existing tables
    - Drop agendamento_consultoria
    - Drop formulario_contato

  2. New Tables with Brazil/Sao Paulo timezone
    - agendamento_consultoria
      - All timestamps will use America/Sao_Paulo timezone
      - Added validation constraints
      - Added proper indexes
    
    - formulario_contato
      - All timestamps will use America/Sao_Paulo timezone
      - Added validation constraints
      - Added proper indexes

  3. Security
    - Enable RLS on both tables
    - Add policies for data access
*/

-- Set timezone to Brazil/Sao Paulo
SET timezone = 'America/Sao_Paulo';

-- Drop existing tables if they exist
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
    
    -- Add validation constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,}$')
);

-- Create formulario_contato table
CREATE TABLE formulario_contato (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo'),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    
    -- Add validation constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (
        CASE 
            WHEN phone IS NOT NULL THEN phone ~* '^\+?[0-9]{10,}$'
            ELSE true
        END
    )
);

-- Enable Row Level Security
ALTER TABLE agendamento_consultoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulario_contato ENABLE ROW LEVEL SECURITY;

-- Create policies for agendamento_consultoria
CREATE POLICY "Enable insert access for all users" ON agendamento_consultoria
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON agendamento_consultoria
    FOR SELECT TO authenticated
    USING (auth.role() = 'authenticated');

-- Create policies for formulario_contato
CREATE POLICY "Enable insert access for all users" ON formulario_contato
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON formulario_contato
    FOR SELECT TO authenticated
    USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX idx_agendamento_consultoria_date ON agendamento_consultoria(date);
CREATE INDEX idx_agendamento_consultoria_email ON agendamento_consultoria(email);
CREATE INDEX idx_agendamento_consultoria_created_at ON agendamento_consultoria(created_at);

CREATE INDEX idx_formulario_contato_email ON formulario_contato(email);
CREATE INDEX idx_formulario_contato_created_at ON formulario_contato(created_at);

-- Set comment on tables
COMMENT ON TABLE agendamento_consultoria IS 'Tabela para armazenar agendamentos de consultoria';
COMMENT ON TABLE formulario_contato IS 'Tabela para armazenar mensagens do formulário de contato';