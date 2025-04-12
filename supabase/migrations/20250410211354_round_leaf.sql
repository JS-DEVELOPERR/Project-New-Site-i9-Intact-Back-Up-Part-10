/*
  # Analytics Tables Creation

  1. New Tables
    - `Google_Analytics4`
      - GA4 script management
      - Backup script storage
      - Metric ID tracking
      - Observations field
    
    - `Google_GTM`
      - GTM script management for head and body
      - Backup script storage
      - Observations field

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create Google_Analytics4 table
CREATE TABLE Google_Analytics4 (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    Script_GA4 TEXT NOT NULL,
    Script_Backup TEXT,
    ID_da_metrica TEXT NOT NULL,
    Observacoes TEXT,
    active BOOLEAN DEFAULT true
);

-- Create Google_GTM table
CREATE TABLE Google_GTM (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    Script_head TEXT NOT NULL,
    Script_body TEXT NOT NULL,
    Script_backup TEXT,
    Observacoes TEXT,
    active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE Google_Analytics4 ENABLE ROW LEVEL SECURITY;
ALTER TABLE Google_GTM ENABLE ROW LEVEL SECURITY;

-- Create policies for Google_Analytics4
CREATE POLICY "Enable public read access" ON Google_Analytics4
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON Google_Analytics4
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for Google_GTM
CREATE POLICY "Enable public read access" ON Google_GTM
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON Google_GTM
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for Google_Analytics4
CREATE TRIGGER update_Google_Analytics4_updated_at
    BEFORE UPDATE ON Google_Analytics4
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for Google_GTM
CREATE TRIGGER update_Google_GTM_updated_at
    BEFORE UPDATE ON Google_GTM
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial GA4 data
INSERT INTO Google_Analytics4 (
    Script_GA4,
    Script_Backup,
    ID_da_metrica,
    Observacoes
) VALUES (
    '<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>',
    '<!-- Backup GA4 tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>',
    'G-XXXXXXXXXX',
    'Script inicial do Google Analytics 4 para rastreamento do site'
);

-- Insert initial GTM data
INSERT INTO Google_GTM (
    Script_head,
    Script_body,
    Script_backup,
    Observacoes
) VALUES (
    '<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":
new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src=
"https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,"script","dataLayer","GTM-XXXXXXX");</script>
<!-- End Google Tag Manager -->',
    '<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->',
    '<!-- Backup GTM tags -->
<!-- Head -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":
new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src=
"https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,"script","dataLayer","GTM-XXXXXXX");</script>
<!-- Body -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
    'Scripts iniciais do Google Tag Manager para head e body do site'
);