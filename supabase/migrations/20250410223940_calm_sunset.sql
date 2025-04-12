/*
  # Update Google Analytics 4 Script

  1. Changes
    - Update GA4 script with new tracking ID
    - Maintain existing table structure and policies
*/

-- Update GA4 script
UPDATE google_analytics4
SET 
    script_ga4 = '<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-L5WTXJD4FE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-L5WTXJD4FE");
</script>',
    script_backup = '<!-- Backup GA4 tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-L5WTXJD4FE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-L5WTXJD4FE");
</script>',
    id_da_metrica = 'G-L5WTXJD4FE',
    observacoes = 'Script atualizado do Google Analytics 4 para rastreamento do site i9'
WHERE active = true;