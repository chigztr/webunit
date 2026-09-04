function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null && value !== '') el.textContent = value;
}

function setHref(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.href = value;
}

async function loadSettings() {
  try {
    const res = await fetch('settings.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const s = await res.json();

    if (s.siteTitle) document.title = s.siteTitle;
    const meta = document.getElementById('meta-description');
    if (meta && s.metaDescription) meta.setAttribute('content', s.metaDescription);

    setText('hero-eyebrow', s.heroEyebrow);
    setText('hero-headline-1', s.heroHeadline1);
    setText('hero-headline-2', s.heroHeadline2);
    setText('hero-copy', s.heroCopy);

    setText('deals-kicker', s.dealsKicker);
    setText('deals-title', s.dealsTitle);
    setText('deals-description', s.dealsDescription);
    setText('picks-kicker', s.picksKicker);
    setText('picks-title', s.picksTitle);
    setText('picks-description', s.picksDescription);
    setText('phones-kicker', s.phonesKicker);
    setText('phones-title', s.phonesTitle);
    setText('phones-description', s.phonesDescription);
    setText('creator-kicker', s.creatorKicker);
    setText('creator-title', s.creatorTitle);
    setText('creator-description', s.creatorDescription);
    setText('home-kicker', s.homeKicker);
    setText('home-title', s.homeTitle);
    setText('home-description', s.homeDescription);

    setText('reviews-kicker', s.reviewsKicker);
    setText('reviews-title', s.reviewsTitle);
    setText('reviews-description', s.reviewsDescription);
    setText('youtube-cta', s.reviewsButtonLabel);
    setHref('youtube-cta', s.youtubeUrl);

    setText('footer-tagline', s.footerTagline);
    setText('affiliate-disclosure', s.affiliateDisclosure);
    setText('footer-credit', s.footerCredit);
    setHref('footer-youtube', s.youtubeUrl);
    setHref('footer-chigztech', s.chigzTechUrl);
    if (s.contactEmail) setHref('footer-contact', `mailto:${s.contactEmail}`);
  } catch (e) {
    console.warn('Could not load site settings', e);
  }
}

function getYouTubeVideoId(url) {
  if (!url || url === '#') return '';

  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return u.pathname.split('/').filter(Boolean)[0] || '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname === '/watch') return u.searchParams.get('v') || '';

      const parts = u.pathname.split('/').filter(Boolean);
      if (['shorts', 'embed', 'live'].includes(parts[0])) {
        return parts[1] || '';
      }
    }
  } catch (_) {
    // Fall through to regex for pasted links without a protocol.
  }

  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/))([A-Za-z0-9_-]{6,})/i);
  return match ? match[1] : '';
}

function getYouTubeThumbnail(url) {
  const id = getYouTubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
}

async function loadProducts() {
  const res = await fetch('products.json?ts=' + Date.now(), { cache: 'no-store' });
  const data = await res.json();
  const products = Array.isArray(data) ? data : (data.products || []);

  document.querySelectorAll('[data-category]').forEach(grid => {
    const category = grid.dataset.category;
    const items = products.filter(p => p.category === category);

    grid.innerHTML = items.map(p => {
      const youtubeThumbnail = getYouTubeThumbnail(p.review);
      const imageSrc = p.image || youtubeThumbnail;
      const image = imageSrc
        ? `<img src="${imageSrc}" alt="${p.name}">`
        : `<div class="product-placeholder">WU</div>`;

      const affiliate = p.affiliate && p.affiliate !== '#'
        ? `<a class="buy-link" href="${p.affiliate}" target="_blank" rel="sponsored nofollow noopener">Check latest price</a>`
        : `<a class="buy-link" href="#" onclick="return false;">Add affiliate link</a>`;

      const review = p.review && p.review !== '#'
        ? `<a class="review-link" href="${p.review}" target="_blank" rel="noopener">Watch review</a>`
        : `<a class="review-link" href="#" onclick="return false;">Add review link</a>`;

      return `
        <article class="product-card">
          <div class="product-image">${image}</div>
          <div class="product-body">
            <span class="badge">${p.badge || 'Recommended'}</span>
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="product-meta">${p.meta || ''}</div>
            <div class="product-actions">${affiliate}${review}</div>
          </div>
        </article>
      `;
    }).join('');
  });
}

async function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  await Promise.all([loadSettings(), loadProducts()]);
}

init();
