/*
  # Update Google Tag Manager Scripts

  1. Changes
    - Update GTM scripts with new container ID
    - Update backup scripts
    - Update observations
*/

UPDATE google_gtm
SET 
    script_head = '<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({''gtm.start'':
new Date().getTime(),event:''gtm.js''});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!=''dataLayer''?''&l=''+l:'''';j.async=true;j.src=
''https://www.googletagmanager.com/gtm.js?id=''+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,''script'',''dataLayer'',''GTM-5FGLCVKM'');</script>
<!-- End Google Tag Manager -->',
    script_body = '<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5FGLCVKM"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->',
    script_backup = '<!-- Backup GTM tags -->
<!-- Head -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({''gtm.start'':
new Date().getTime(),event:''gtm.js''});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!=''dataLayer''?''&l=''+l:'''';j.async=true;j.src=
''https://www.googletagmanager.com/gtm.js?id=''+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,''script'',''dataLayer'',''GTM-5FGLCVKM'');</script>
<!-- Body -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5FGLCVKM"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
    observacoes = 'Scripts atualizados do Google Tag Manager com novo container ID GTM-5FGLCVKM'
WHERE active = true;