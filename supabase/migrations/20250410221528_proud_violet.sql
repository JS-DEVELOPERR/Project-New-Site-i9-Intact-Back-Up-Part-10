/*
  # Update Analytics Tables

  1. Changes
    - Drop existing tables and related objects
    - Recreate tables with updated schemas
    - Update GA4 and GTM scripts with production values

  2. Security
    - Maintain existing RLS policies
    - Keep existing triggers
*/

-- Drop existing tables and related objects if they exist
DROP TRIGGER IF EXISTS update_google_analytics4_updated_at ON google_analytics4;
DROP TRIGGER IF EXISTS update_google_gtm_updated_at ON google_gtm;
DROP TABLE IF EXISTS google_analytics4;
DROP TABLE IF EXISTS google_gtm;

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Google_Analytics4 table
CREATE TABLE google_analytics4 (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    script_ga4 TEXT NOT NULL,
    script_backup TEXT,
    id_da_metrica TEXT NOT NULL,
    observacoes TEXT,
    active BOOLEAN DEFAULT true
);

-- Create Google_GTM table
CREATE TABLE google_gtm (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    script_head TEXT NOT NULL,
    script_body TEXT NOT NULL,
    script_backup TEXT,
    observacoes TEXT,
    active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE google_analytics4 ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_gtm ENABLE ROW LEVEL SECURITY;

-- Create policies for Google_Analytics4
CREATE POLICY "Enable public read access" ON google_analytics4
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON google_analytics4
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for Google_GTM
CREATE POLICY "Enable public read access" ON google_gtm
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Enable content management for authenticated users" ON google_gtm
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create triggers for Google_Analytics4
CREATE TRIGGER update_google_analytics4_updated_at
    BEFORE UPDATE ON google_analytics4
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for Google_GTM
CREATE TRIGGER update_google_gtm_updated_at
    BEFORE UPDATE ON google_gtm
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial GA4 data
INSERT INTO google_analytics4 (
    script_ga4,
    script_backup,
    id_da_metrica,
    observacoes
) VALUES (
    '<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TNWT4WLHWQ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-TNWT4WLHWQ");
</script>',
    '<!-- Backup GA4 tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TNWT4WLHWQ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-TNWT4WLHWQ");
</script>',
    'G-TNWT4WLHWQ',
    'Script do Google Analytics 4 para rastreamento do site i9'
);

-- Insert initial GTM data
INSERT INTO google_gtm (
    script_head,
    script_body,
    script_backup,
    observacoes
) VALUES (
    '<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":
new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src=
"https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,"script","dataLayer","GTM-5NXWP4WH");</script>
<!-- End Google Tag Manager -->',
    '<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NXWP4WH"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->',
    '<!-- Backup GTM tags -->
<!-- Head -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":
new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src=
"https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,"script","dataLayer","GTM-5NXWP4WH");</script>
<!-- Body -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5NXWP4WH"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
    'Scripts do Google Tag Manager para head e body do site i9'
);