WEBUNIT CMS TEXT FIX
====================

This patch fixes the Site Settings text fields not updating the live website.

WHY IT HAPPENED
---------------
The previous mockup-matching version intentionally locked the hero wording in
the HTML so old CMS text could not break the design. That also meant publishing
new text from the CMS had no effect.

FIXED CMS FIELDS
----------------
These now update the live website again:
- Hero Eyebrow
- Hero Headline — Line 1
- Hero Highlight Word / Phrase
- Hero Description
- YouTube subscriber count
- YouTube total views
- Deals text
- Chigz Picks text
- Smartphones text
- Creator Gear text
- Home Tech text
- Reviews CTA text/button
- Footer text and links

The final word of the Hero Highlight Word / Phrase stays blue so the approved
design style is preserved.

UPLOAD / REPLACE
----------------
Replace:
- index.html
- app.js
- style.css

No settings.json or products.json replacement is needed.

After Cloudflare deploys, publish a small text change in the CMS and reload the
site. The change should now appear.
