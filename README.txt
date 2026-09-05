WEBUNIT — CLEAN RESPONSIVE REDESIGN
====================================

This replaces the unstable overlapping hero layout with a simpler,
more reliable design that should look consistent on desktop and mobile.

KEY FIXES
---------
- No overlapping stats panel
- No tiny floating product thumbnails in the hero
- Clean two-column desktop hero
- Uses your real uploaded photo
- Hero image is a single stable visual panel
- Stats sit in normal page flow below the hero
- Mobile stacks naturally:
    1. Hero text
    2. Buttons
    3. Photo
    4. YouTube stats
    5. Categories
- Larger small text throughout
- Product cards keep readable 14–15px descriptions on mobile
- Existing CMS text editing continues to work
- Existing manual subscriber / total-view counts continue to work
- Existing product cards, affiliate links and YouTube click-to-play remain compatible

UPLOAD / REPLACE
----------------
Replace:
- index.html
- style.css
- app.js

Add / replace:
- images/chigz-hero.jpg

KEEP YOUR EXISTING:
- products.json
- settings.json
- admin/config.yml
- _headers
- images/uploads/

No CMS migration is required.
