WEBUNIT — SECTION MANAGEMENT UPGRADE
====================================

This update adds a dedicated "Section Management" area to the CMS.

WHAT YOU CAN NOW DO
-------------------
For each homepage product section:
- Show / hide the entire section
- Change its order
- Rename the top navigation link
- Rename the category button
- Change the category subtitle
- Change the category icon
- Rename the section heading
- Change the small kicker
- Change the section description
- Show / hide it from the top navigation separately
- Show / hide its category button separately

IMPORTANT
---------
Turning a section OFF does NOT delete any products.

Example:
If you turn Creator Gear off, the Creator Gear section, top navigation link
and category card disappear. Your Creator Gear products remain safely in
products.json. Turn it back on later and they return.

Renaming a section is also safe. Internally the product category remains
"creator", "phones", "home", etc., so existing products do not break.

ORDERING
--------
Set Order to:
1 = first
2 = second
3 = third
etc.

The homepage sections, top navigation and category navigation all follow
that order automatically.

UPLOAD / REPLACE
----------------
Replace:
- index.html
- app.js
- style.css
- admin/config.yml

Add:
- sections.json

KEEP:
- products.json
- settings.json
- _headers
- images/
- admin/index.html
- favicon.svg

After Cloudflare deploys:
Admin -> Section Management -> Homepage Sections

Then edit a section and Publish.
