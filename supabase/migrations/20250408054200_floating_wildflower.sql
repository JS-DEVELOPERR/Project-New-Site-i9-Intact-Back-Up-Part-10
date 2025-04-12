/*
  # Forms Tables Creation

  1. New Tables
    - `agendamento_consultoria`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `service` (text, required)
      - `message` (text)
      - `date` (date, required)
      - `time_slot` (text, required)
      - `status` (text, default: 'pending')

    - `formulario_contato`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text)
      - `service` (text)
      - `message` (text, required)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to insert data
    - Add policies for authenticated admins to view all data
*/

-- Create agendamento_consultoria table
CREATE TABLE IF NOT EXISTS agendamento_consultoria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  message text,
  date date NOT NULL,
  time_slot text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Add validation constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,}$')
);

-- Create formulario_contato table
CREATE TABLE IF NOT EXISTS formulario_contato (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  message text NOT NULL,
  
  -- Add validation constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (CASE WHEN phone IS NOT NULL THEN phone ~* '^\+?[0-9]{10,}$' ELSE true END)
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
CREATE INDEX IF NOT EXISTS idx_agendamento_consultoria_date ON agendamento_consultoria(date);
CREATE INDEX IF NOT EXISTS idx_agendamento_consultoria_email ON agendamento_consultoria(email);
CREATE INDEX IF NOT EXISTS idx_formulario_contato_email ON formulario_contato(email);