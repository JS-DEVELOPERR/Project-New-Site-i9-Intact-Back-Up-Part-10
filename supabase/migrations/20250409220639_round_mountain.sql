/*
  # Blog Access URL Management Table

  1. New Table
    - `acesse_blog`
      - URL management for blog access
      - Active status tracking
      - Creation and update timestamps

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create acesse_blog table
CREATE TABLE acesse_blog (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE acesse_blog ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable public read access" ON acesse_blog
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON acesse_blog
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial data
INSERT INTO acesse_blog (
    url,
    title,
    subtitle,
    cta_text
) VALUES (
    'https://mkt-imobiliario.i9empreendendo.com/',
    'Acessar Blog i9',
    'Fique por dentro das últimas tendências e estratégias do marketing digital',
    'Explore nosso conteúdo exclusivo e descubra insights valiosos para seu negócio'
);