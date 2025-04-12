/*
  # Testimonials Table Creation

  1. New Table
    - `depoimentos_i9`
      - Client testimonials management
      - Rating system
      - Active status tracking

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create depoimentos_i9 table
CREATE TABLE depoimentos_i9 (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    image TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    full_testimonial TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    order_index INTEGER
);

-- Enable Row Level Security
ALTER TABLE depoimentos_i9 ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable public read access" ON depoimentos_i9
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON depoimentos_i9
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial testimonials
INSERT INTO depoimentos_i9 (
    name,
    position,
    image,
    content,
    rating,
    full_testimonial,
    order_index
) VALUES
(
    'Carlos Silva',
    'CEO da TechSoft',
    'https://i9empreendendo.com/wp-content/uploads/2024/10/testimonial-1.jpg',
    'A parceria com a i9 Agência foi transformadora para nossa empresa. Em menos de 3 meses, nossa taxa de conversão aumentou em 180%. A equipe é extremamente profissional e comprometida com resultados.',
    5,
    'A parceria com a i9 Agência foi verdadeiramente transformadora para a TechSoft. Em menos de 3 meses trabalhando juntos, nossa taxa de conversão aumentou impressionantes 180%, o que teve um impacto direto em nossa receita. A equipe é extremamente profissional, comprometida com resultados e sempre vai além do esperado. Eles entenderam perfeitamente nosso negócio e criaram estratégias personalizadas que realmente funcionam. Estamos extremamente satisfeitos com a abordagem consultiva e os resultados obtidos até agora, e mal podemos esperar para continuar crescendo com a i9 como nosso parceiro de marketing digital.',
    1
),
(
    'Ana Oliveira',
    'Diretora de Marketing da Retail Plus',
    'https://i9empreendendo.com/wp-content/uploads/2024/10/testimonial-2.jpg',
    'Contratamos a i9 para reestruturar nossa estratégia de SEO e os resultados superaram todas as nossas expectativas. Nosso tráfego orgânico cresceu 220% em 6 meses, com um aumento de 45% nas conversões.',
    5,
    'Contratamos a i9 Agência para reestruturar completamente nossa estratégia de SEO após alguns anos de estagnação nos resultados orgânicos. Os resultados superaram todas as nossas expectativas. Após uma análise inicial detalhada, eles desenvolveram um plano abrangente que incluiu otimização técnica, estratégia de conteúdo e construção de autoridade. Em apenas 6 meses, nosso tráfego orgânico cresceu impressionantes 220%, com um aumento de 45% nas conversões. A equipe da i9 não apenas entrega resultados notáveis, mas também é extremamente transparente com seus relatórios e sempre disponível para esclarecer dúvidas e fazer ajustes na estratégia quando necessário. Se você está procurando uma agência que realmente entende de SEO e está comprometida com resultados mensuráveis, não precisa procurar mais.',
    2
),
(
    'Rafael Mendes',
    'Proprietário da RM Confecções',
    'https://i9empreendendo.com/wp-content/uploads/2024/10/testimonial-3.jpg',
    'Como proprietário de uma empresa de médio porte, estava cético em investir em marketing digital. A i9 me mostrou o quanto estava perdendo. Em um ano, meu e-commerce cresceu 300% com as estratégias implementadas.',
    5,
    'Como proprietário de uma empresa de médio porte no setor de confecções, eu estava bastante cético quanto a investir em marketing digital. Depois de várias tentativas frustradas com outras agências, decidi dar uma última chance com a i9 Agência, e essa decisão mudou completamente o rumo do meu negócio. A equipe da i9 fez uma análise completa do meu mercado e desenvolveu uma estratégia multidisciplinar envolvendo SEO, Google Ads e gestão de mídias sociais que realmente funcionou para o meu público-alvo. Em apenas um ano, meu e-commerce cresceu impressionantes 300%, e o retorno sobre o investimento superou minhas expectativas mais otimistas. Além dos resultados extraordinários, o que mais me impressiona é a transparência e o compromisso da equipe em realmente entender meu negócio e propor soluções personalizadas. A i9 não é apenas um fornecedor, mas um verdadeiro parceiro estratégico do meu negócio.',
    3
);