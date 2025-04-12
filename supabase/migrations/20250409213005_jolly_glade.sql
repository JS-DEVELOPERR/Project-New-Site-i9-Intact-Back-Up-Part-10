/*
  # Content Management Tables Creation

  1. New Tables
    - `politica_privacidade`
      - URLs for privacy policy and terms of use
      - Logo URL management
    
    - `section_1`
      - Hero section content management
      - Media, text, and informative content
    
    - `section_3`
      - About section content management
      - Media, text, and benefits content

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create politica_privacidade table
CREATE TABLE politica_privacidade (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    logo_url TEXT NOT NULL,
    politica_privacidade_url TEXT NOT NULL,
    termos_uso_url TEXT NOT NULL,
    active BOOLEAN DEFAULT true
);

-- Create section_1 table (Hero Section)
CREATE TABLE section_1 (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    primary_button_text TEXT,
    secondary_button_text TEXT,
    background_image_url TEXT,
    video_url TEXT,
    stats_users_count INTEGER DEFAULT 200,
    stats_rating NUMERIC(2,1) DEFAULT 4.9,
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 1
);

-- Create section_3 table (About Section)
CREATE TABLE section_3 (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 1
);

-- Create table for about section benefits
CREATE TABLE section_3_benefits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    section_3_id uuid REFERENCES section_3(id) ON DELETE CASCADE,
    benefit_text TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    order_index INTEGER
);

-- Enable Row Level Security
ALTER TABLE politica_privacidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_3_benefits ENABLE ROW LEVEL SECURITY;

-- Create policies for politica_privacidade
CREATE POLICY "Enable public read access" ON politica_privacidade
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON politica_privacidade
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for section_1
CREATE POLICY "Enable public read access" ON section_1
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON section_1
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for section_3
CREATE POLICY "Enable public read access" ON section_3
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON section_3
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for section_3_benefits
CREATE POLICY "Enable public read access" ON section_3_benefits
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON section_3_benefits
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial data for politica_privacidade
INSERT INTO politica_privacidade (
    logo_url,
    politica_privacidade_url,
    termos_uso_url
) VALUES (
    'https://i9empreendendo.com/wp-content/uploads/2024/10/i9logo-2_preview_rev_1.png',
    'https://i9empreendendo.com/politica-de-privacidade',
    'https://i9empreendendo.com/termos-de-uso'
);

-- Insert initial data for section_1
INSERT INTO section_1 (
    title,
    subtitle,
    description,
    primary_button_text,
    secondary_button_text,
    background_image_url,
    video_url
) VALUES (
    'Transforme sua presença digital com estratégias que convertem',
    'Agência de Marketing Digital',
    'A i9 Agência desenvolve estratégias personalizadas de marketing digital para empresas que buscam crescimento real e mensurável.',
    'Agendar uma Consultoria',
    'Ver Nossos Serviços',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80',
    'https://i9empreendendo.com/wp-content/uploads/2024/10/marketing-video.mp4'
);

-- Insert initial data for section_3
INSERT INTO section_3 (
    title,
    subtitle,
    description,
    image_url
) VALUES (
    'Sobre a i9 Agência',
    'Nossa História e Missão',
    'A i9 Agência nasceu com o propósito de transformar negócios através do marketing digital de alta performance. Com anos de experiência e centenas de cases de sucesso, nossa equipe é especializada em desenvolver estratégias personalizadas que geram resultados reais e mensuráveis.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80'
);

-- Insert initial benefits for section_3
INSERT INTO section_3_benefits (section_3_id, benefit_text, order_index) 
SELECT 
    id,
    benefit,
    row_number() OVER ()
FROM section_3,
UNNEST(ARRAY[
    'Equipe de especialistas certificados',
    'Estratégias personalizadas para cada negócio',
    'Foco em ROI e resultados mensuráveis',
    'Transparência e relatórios detalhados',
    'Atendimento ágil e consultivo',
    'Metodologia comprovada de sucesso'
]) AS benefit;