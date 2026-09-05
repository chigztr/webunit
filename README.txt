WEBUNIT COMPLETE DESIGN FIX
===========================

This update fixes the missing design elements and rebuilds the homepage to match
the approved "WEBUNIT by Chigz" direction.

WHAT IS NOW INCLUDED
--------------------
- WEBUNIT by Chigz logo at the very top
- Handwritten Chigz-style logo treatment
- Functional search box in the header
- Main hero with the real uploaded Chigz face
- "Real tech. Real tests. Real opinions." hero styling
- Browse Picks button + handwritten upgrade note
- Manual YouTube subscriber and total-view stats panel
- Quick category tiles
- Chigz quote/signature panel
- Improved Today's Deals heading and View All button
- Trust ribbon below the deal cards
- Existing CMS-driven product cards
- Existing Static Image / YouTube Video option
- Fixed centered YouTube play button
- Mobile responsive layout

UPLOAD / REPLACE
----------------
Replace:
- index.html
- style.css
- app.js
- admin/config.yml

Add / replace:
- images/chigz-hero.png

IMPORTANT
---------
KEEP your existing:
- products.json
- settings.json
- images/uploads/
- _headers

That preserves your current products, affiliate links and site settings.

NEW CMS OPTION
--------------
Site Settings now includes "Hero Portrait Image", so in future you can replace
the Chigz image without editing code.

The bundled images/chigz-hero.png is used automatically if that CMS field is blank.
