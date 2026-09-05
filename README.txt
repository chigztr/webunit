WEBUNIT MOBILE FIX
==================

This is a targeted patch for the latest desktop design.

FIXES:
- Mobile hero no longer has a large empty gap
- Hero image no longer overlaps awkwardly
- YouTube / subscriber / view stats are now a compact card under the hero image
- Category buttons no longer sit underneath the stats card
- Dedicated mobile hero crop removes the ghosted headline from the artwork
- "recommend." uses a darker blue for better contrast
- Desktop layout is left unchanged

REPLACE:
- index.html
- style.css

ADD:
- images/chigz-hero-mobile.jpg

KEEP EVERYTHING ELSE, including:
- app.js
- products.json
- settings.json
- admin/config.yml
- images/chigz-hero-final.png
- images/uploads/
- _headers
