/*
  # Header and Footer Content Management Tables

  1. New Tables
    - `header_site`
      - Logo management
      - Navigation links
      - Button text and actions
      - Active status tracking
    
    - `baseboard_site` (Footer)
      - Company info
      - Quick links
      - Services links
      - Social media links
      - Copyright info

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create header_site table
CREATE TABLE header_site (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    logo_url TEXT NOT NULL,
    nav_links JSONB NOT NULL DEFAULT '[
        {"name": "Início", "href": "#home"},
        {"name": "Serviços", "href": "#services"},
        {"name": "Sobre", "href": "#about"},
        {"name": "Blog", "href": "#blog"},
        {"name": "Contato", "href": "#contact"}
    ]',
    appointment_button_text TEXT NOT NULL DEFAULT 'Agendar Consultoria',
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 1
);

-- Create baseboard_site table
CREATE TABLE baseboard_site (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    logo_url TEXT NOT NULL,
    company_description TEXT NOT NULL,
    quick_links JSONB NOT NULL,
    services_links JSONB NOT NULL,
    social_media JSONB NOT NULL,
    privacy_policy_url TEXT,
    terms_of_use_url TEXT,
    copyright_text TEXT NOT NULL,
    active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE header_site ENABLE ROW LEVEL SECURITY;
ALTER TABLE baseboard_site ENABLE ROW LEVEL SECURITY;

-- Create policies for header_site
CREATE POLICY "Enable public read access" ON header_site
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON header_site
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for baseboard_site
CREATE POLICY "Enable public read access" ON baseboard_site
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON baseboard_site
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial header data
INSERT INTO header_site (
    logo_url,
    nav_links,
    appointment_button_text
) VALUES (
    'https://i9empreendendo.com/wp-content/uploads/2024/10/i9logo-2_preview_rev_1.png',
    '[
        {"name": "Início", "href": "#home"},
        {"name": "Serviços", "href": "#services"},
        {"name": "Sobre", "href": "#about"},
        {"name": "Blog", "href": "#blog"},
        {"name": "Contato", "href": "#contact"}
    ]',
    'Agendar Consultoria'
);

-- Insert initial footer data
INSERT INTO baseboard_site (
    logo_url,
    company_description,
    quick_links,
    services_links,
    social_media,
    privacy_policy_url,
    terms_of_use_url,
    copyright_text
) VALUES (
    'https://i9empreendendo.com/wp-content/uploads/2024/10/i9logo-2_preview_rev_1.png',
    'Transformamos negócios através de estratégias de marketing digital com foco em resultados mensuráveis e ROI positivo.',
    '[
        {"name": "Início", "href": "#home"},
        {"name": "Serviços", "href": "#services"},
        {"name": "Sobre Nós", "href": "#about"},
        {"name": "Depoimentos", "href": "#testimonials"},
        {"name": "Blog", "href": "#blog"},
        {"name": "Contato", "href": "#contact"}
    ]',
    '[
        {"name": "SEO", "href": "#"},
        {"name": "Google Ads", "href": "#"},
        {"name": "Facebook Ads", "href": "#"},
        {"name": "Marketing de Conteúdo", "href": "#"},
        {"name": "Desenvolvimento Web", "href": "#"},
        {"name": "Consultoria", "href": "#"}
    ]',
    '{
        "facebook": "https://facebook.com/i9agencia",
        "instagram": "https://instagram.com/i9agencia",
        "linkedin": "https://linkedin.com/company/i9agencia",
        "twitter": "https://twitter.com/i9agencia"
    }',
    'https://i9empreendendo.com/politica-de-privacidade',
    'https://i9empreendendo.com/termos-de-uso',
    '© 2024 i9 Agência. Todos os direitos reservados.'
);