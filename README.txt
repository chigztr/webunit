WEBUNIT STATIC HUB — NETLIFY READY

FILES
-----
index.html
style.css
app.js
products.json

HOW TO UPDATE PRODUCTS
----------------------
Open products.json.

Each product looks like this:

{
  "category": "picks",
  "name": "POCO F9 Ultra",
  "badge": "Chigz Pick",
  "description": "One-line recommendation.",
  "meta": "Chigz Tech Score: 94/100",
  "affiliate": "YOUR-AFFILIATE-LINK",
  "review": "YOUR-YOUTUBE-REVIEW-LINK",
  "image": "images/poco-f9-ultra.webp"
}

CATEGORIES
----------
deals
picks
phones
creator
home

IMAGES
------
Create an /images folder and place product images inside it.
Then update the "image" field in products.json.

NETLIFY
-------
Drag the whole folder contents into your existing Netlify site deployment.
Make webunit.co.uk the primary custom domain.

IMPORTANT
---------
The site contains an affiliate disclosure.
For Amazon and other affiliate programs, follow the exact disclosure requirements of each program as well.


EASY PRODUCT EDITOR
-------------------
Open:
  https://YOURDOMAIN/admin.html

Use the visual editor to:
- Add products
- Delete products
- Change category
- Edit descriptions
- Add affiliate links
- Add YouTube review links
- Reorder entries

Then click:
  Download products.json

Replace the existing products.json in your Netlify deployment.

NOTE:
This editor does not save directly to Netlify because a static site has no database/backend.
For true browser-based publishing without re-uploading a file, use a Git-backed CMS such as Decap CMS.
