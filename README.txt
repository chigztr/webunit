WEBUNIT.CO.UK
==============

WebUnit is a lightweight affiliate/recommendation site for Chigz Tech Reviews.

LIVE SITE
---------
https://webunit.co.uk

CMS
---
https://webunit.co.uk/admin/

GITHUB REPOSITORY
-----------------
https://github.com/chigztr/webunit

HOSTING
-------
Cloudflare Pages

Production branch:
main

Pages project:
webunit

Cloudflare Pages deployment URL:
https://webunit-5r9.pages.dev

Build settings:
- Framework preset: None
- Build command: blank
- Build output directory: .
- Root directory: blank

AUTOMATIC DEPLOYMENTS
---------------------
Changes committed to the main branch in GitHub automatically trigger a new
Cloudflare Pages deployment.

CMS publishing flow:

Decap CMS
→ Cloudflare Worker OAuth
→ GitHub
→ Cloudflare Pages
→ webunit.co.uk

CMS AUTHENTICATION
------------------
The CMS uses GitHub OAuth through a Cloudflare Worker.

Worker:
https://webunit-cms-auth.cvyas.workers.dev

The Worker stores these secrets/variables in Cloudflare:
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET

Do not place the GitHub Client Secret in the GitHub repository.

DOMAIN & DNS
------------
Domain:
webunit.co.uk

DNS provider:
Cloudflare

Domain registrar:
IONOS

Primary website:
https://webunit.co.uk

WWW:
https://www.webunit.co.uk
redirects permanently to:
https://webunit.co.uk

SSL:
Cloudflare SSL enabled

EMAIL
-----
Email remains hosted by IONOS.

Important:
Do not remove or change the existing IONOS email DNS records unless intentionally
changing email providers.

These include:
- MX records
- SPF TXT record
- DMARC
- autodiscover
- DKIM records

CMS CONTENT FILES
-----------------
products.json
Contains the products/deals shown on the site.

settings.json
Contains editable site-wide content and links.

admin/config.yml
Controls Decap CMS and points authentication to the Cloudflare Worker.

_headers
Cloudflare Pages response-header configuration.
It prevents the CMS from being indexed and reduces stale JSON caching.

PRODUCT IMAGES
--------------
A manually uploaded product image takes priority.

If no product image is uploaded and a YouTube Review Link is present,
the site can automatically use the YouTube video thumbnail.

CMS USAGE
---------
1. Open https://webunit.co.uk/admin/
2. Click Login with GitHub.
3. Edit Products & Deals or Site Settings.
4. Click Publish.
5. Decap commits the change to GitHub.
6. Cloudflare Pages automatically deploys the new version.

NORMAL UPDATES DO NOT REQUIRE:
- Editing HTML manually
- Uploading ZIP files to a host
- Manually deploying the website

NETLIFY
-------
Netlify is no longer required for the live WebUnit setup.

The old Netlify project may be kept temporarily as a backup, but the live site,
CMS authentication, DNS, SSL and deployments are handled by Cloudflare.

Last updated:
September 2026
