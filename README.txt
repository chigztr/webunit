WEBUNIT — FINAL MOCKUP FIX
===========================

This revision fixes the specific problems visible in the 13:55 screenshot.

WHAT WAS WRONG
--------------
- The hero had a hard 50/50 split instead of the soft overlap in the approved mockup.
- The face/artwork crop was too zoomed.
- The second headline wrapped onto a third line.
- The stats panel was too wide and sat over the CTA area.
- With only 3 live deal products, a forced 4-column grid left a large empty gap.

WHAT IS FIXED
-------------
- Right-side artwork is rebuilt directly from the approved mockup at its correct proportions.
- It fades into the white hero instead of creating a hard vertical split.
- "Deals I’d actually recommend." stays on one desktop line.
- The approved stats panel is narrower and centered correctly.
- The actual 3 deal cards now fill the available width cleanly; when you add a 4th deal, the grid automatically becomes 4 columns.
- Header, WEBUNIT by Chigz logo, search, category strip, CMS stats, video mode and trust row are retained.

UPLOAD / REPLACE
----------------
Replace:
- index.html
- style.css
- app.js

Add / replace:
- images/chigz-hero-final.png

KEEP:
- products.json
- settings.json
- admin/config.yml
- _headers
- images/uploads/

After Cloudflare deploys, hard-refresh webunit.co.uk once.
