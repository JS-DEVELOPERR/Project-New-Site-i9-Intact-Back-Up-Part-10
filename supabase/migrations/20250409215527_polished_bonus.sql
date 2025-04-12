/*
  # Content Management Tables for Blog and Contact Sections

  1. New Tables
    - `section_4` (Blog Section)
      - Blog posts management
      - Media content and external links
      - Post metadata and content
    
    - `section_5` (Contact Section)
      - Contact section content management
      - Media and informative content
      - Social media links

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create section_4 table (Blog Section)
CREATE TABLE section_4 (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL,
    author TEXT,
    tags TEXT[],
    active BOOLEAN DEFAULT true,
    order_index INTEGER
);

-- Create section_5 table (Contact Section)
CREATE TABLE section_5 (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    subtitle TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    whatsapp_message TEXT NOT NULL,
    social_media JSONB NOT NULL DEFAULT '{
        "facebook": "",
        "instagram": "",
        "linkedin": "",
        "twitter": ""
    }',
    active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE section_4 ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_5 ENABLE ROW LEVEL SECURITY;

-- Create policies for section_4
CREATE POLICY "Enable public read access" ON section_4
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON section_4
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for section_5
CREATE POLICY "Enable public read access" ON section_5
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON section_5
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial blog posts data
INSERT INTO section_4 (title, date, excerpt, content, image, order_index) VALUES
(
    'Como o Marketing Digital Pode Transformar Seu Negócio em 2023',
    '15 Março, 2023',
    'Descubra as estratégias de marketing digital mais efetivas para impulsionar seu negócio este ano.',
    '<p>No cenário empresarial atual, ter uma presença digital forte não é mais opcional — é essencial. As empresas que adotam estratégias eficazes de marketing digital estão vendo resultados transformadores em seus negócios.</p>
    <h3>Por Que o Marketing Digital é Crucial Hoje</h3>
    <p>O comportamento do consumidor mudou drasticamente na última década. Hoje, a maioria dos consumidores inicia sua jornada de compra online, pesquisando produtos e serviços antes de fazer uma decisão.</p>
    <p>As estatísticas mostram que 87% dos consumidores começam suas pesquisas de produtos na internet, e 70% dos processos de compra B2B envolvem pesquisa online.</p>
    <h3>Estratégias Que Estão Funcionando em 2023</h3>
    <ul>
      <li><strong>Marketing de Conteúdo Personalizado:</strong> Conteúdo relevante e personalizado continua sendo rei, mas agora com ênfase em segmentação avançada.</li>
      <li><strong>Vídeo Marketing:</strong> Conteúdo em vídeo domina as redes sociais e tem taxas de engajamento significativamente maiores que outros formatos.</li>
      <li><strong>Marketing de Influência:</strong> Parceria com micro-influenciadores para alcançar audiências nichos altamente engajadas.</li>
      <li><strong>Marketing Automatizado:</strong> Uso de IA e automação para personalizar a experiência do cliente em escala.</li>
    </ul>
    <p>Implementar essas estratégias requer um planejamento cuidadoso e execução consistente, mas os resultados podem transformar completamente o crescimento do seu negócio.</p>',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    1
),
(
    'SEO em 2023: O Que Realmente Funciona Agora',
    '27 Abril, 2023',
    'As táticas de SEO evoluíram drasticamente. Aprenda o que está funcionando agora e o que deve ser evitado.',
    '<p>O SEO continua sendo uma parte vital de qualquer estratégia de marketing digital, mas as táticas que funcionaram há alguns anos podem não ser mais eficazes hoje.</p>
    <h3>As Mudanças Mais Importantes no SEO</h3>
    <p>Os algoritmos dos mecanismos de busca estão cada vez mais sofisticados, com foco em intenção de pesquisa e experiência do usuário, em vez de palavras-chave isoladas.</p>
    <p>O Google agora utiliza inteligência artificial através do BERT e MUM para entender o contexto das pesquisas e fornecer resultados mais relevantes.</p>
    <h3>Táticas de SEO Que Funcionam em 2023</h3>
    <ul>
      <li><strong>Conteúdo Orientado para Clusters de Tópicos:</strong> Organizar o conteúdo em tópicos relacionados em vez de palavras-chave isoladas.</li>
      <li><strong>Otimização para Intenção de Pesquisa:</strong> Compreender e atender à verdadeira intenção por trás das pesquisas dos usuários.</li>
      <li><strong>Core Web Vitals:</strong> Garantir que seu site tenha boa performance, especialmente em dispositivos móveis.</li>
      <li><strong>EAT (Expertise, Autoridade, Confiabilidade):</strong> Demonstrar credibilidade e autoridade em seu nicho.</li>
    </ul>
    <p>Adaptar sua estratégia de SEO para estas tendências atuais pode resultar em um aumento significativo no tráfego orgânico e nas conversões.</p>',
    'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    2
);

-- Insert initial contact section data
INSERT INTO section_5 (
    title,
    subtitle,
    email,
    phone,
    whatsapp_number,
    whatsapp_message,
    social_media
) VALUES (
    'Contato',
    'Entre em contato com nossa equipe e descubra como podemos impulsionar os resultados do seu negócio.',
    'contato@i9agencia.com.br',
    '+55 11 99876-5432',
    '5511998765432',
    'Olá! Gostaria de mais informações sobre os serviços da i9 Agência.',
    '{
        "facebook": "https://facebook.com/i9agencia",
        "instagram": "https://instagram.com/i9agencia",
        "linkedin": "https://linkedin.com/company/i9agencia",
        "twitter": "https://twitter.com/i9agencia"
    }'
);