function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null && value !== '') el.textContent = value;
}

function setHref(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.href = value;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function safeUrl(value = '') {
  const url = String(value || '').trim();
  if (!url || url === '#') return '';
  try {
    const parsed = new URL(url, window.location.href);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.href;
  } catch (_) {
    return '';
  }
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
  return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : '';
}

function getYouTubeFallbackThumbnail(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
}

function renderProductMedia(product) {
  const mediaType = product.media_type || 'image';
  const videoId = getYouTubeVideoId(product.review);
  const uploadedImage = safeUrl(product.image);
  const youtubeThumbnail = videoId ? getYouTubeThumbnail(product.review) : '';
  const fallbackThumbnail = getYouTubeFallbackThumbnail(videoId);
  const name = escapeHtml(product.name || 'Product');

  if (mediaType === 'video' && videoId) {
    const poster = uploadedImage || youtubeThumbnail;
    const fallbackAttr = !uploadedImage && fallbackThumbnail
      ? ` onerror="this.onerror=null;this.src='${escapeHtml(fallbackThumbnail)}'"`
      : '';

    return `
      <button class="youtube-media" type="button" data-video-id="${escapeHtml(videoId)}" aria-label="Play ${name} review">
        <img src="${escapeHtml(poster)}" alt="${name} video thumbnail" loading="lazy" decoding="async"${fallbackAttr}>
        <span class="youtube-play" aria-hidden="true">
          <svg viewBox="0 0 68 48" role="img">
            <path d="M66.52 7.74a8 8 0 0 0-5.63-5.66C55.92.75 34 .75 34 .75S12.08.75 7.11 2.08A8 8 0 0 0 1.48 7.74C.15 12.73.15 24 .15 24s0 11.27 1.33 16.26a8 8 0 0 0 5.63 5.66C12.08 47.25 34 47.25 34 47.25s21.92 0 26.89-1.33a8 8 0 0 0 5.63-5.66C67.85 35.27 67.85 24 67.85 24s0-11.27-1.33-16.26Z"></path>
            <path class="youtube-play-triangle" d="M27 34.5 45 24 27 13.5Z"></path>
          </svg>
        </span>
        <span class="youtube-play-label">Play review</span>
      </button>
    `;
  }

  const imageSrc = uploadedImage || youtubeThumbnail;

  if (imageSrc) {
    const fallbackAttr = !uploadedImage && fallbackThumbnail
      ? ` onerror="this.onerror=null;this.src='${escapeHtml(fallbackThumbnail)}'"`
      : '';
    return `<img src="${escapeHtml(imageSrc)}" alt="${name}" loading="lazy" decoding="async"${fallbackAttr}>`;
  }

  return `<div class="product-placeholder">WU</div>`;
}

function installVideoStyles() {
  if (document.getElementById('webunit-video-media-styles')) return;

  const style = document.createElement('style');
  style.id = 'webunit-video-media-styles';
  style.textContent = `
    .youtube-media{
      position:relative;
      width:100%;
      height:100%;
      padding:0;
      border:0;
      display:block;
      overflow:hidden;
      background:#0f172a;
      cursor:pointer;
      font:inherit;
    }
    .youtube-media img{
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:center;
      display:block;
      transition:transform .25s ease, filter .25s ease;
    }
    .youtube-media::after{
      content:"";
      position:absolute;
      inset:0;
      background:linear-gradient(180deg,rgba(15,23,42,.02),rgba(15,23,42,.16));
      pointer-events:none;
    }
    .youtube-media:hover img{
      transform:scale(1.025);
      filter:brightness(.92);
    }
    .youtube-media:focus-visible{
      outline:3px solid #1267e8;
      outline-offset:-3px;
    }
    .youtube-play{
      position:absolute;
      left:50%;
      top:50%;
      width:68px;
      height:48px;
      transform:translate(-50%,-50%);
      z-index:2;
      filter:drop-shadow(0 6px 15px rgba(0,0,0,.28));
      transition:transform .2s ease;
    }
    .youtube-media:hover .youtube-play{
      transform:translate(-50%,-50%) scale(1.08);
    }
    .youtube-play svg{
      width:100%;
      height:100%;
      display:block;
    }
    .youtube-play path:first-child{
      fill:#ff0000;
    }
    .youtube-play-triangle{
      fill:#fff;
    }
    .youtube-play-label{
      position:absolute;
      left:12px;
      bottom:12px;
      z-index:2;
      padding:6px 9px;
      border-radius:999px;
      background:rgba(15,23,42,.82);
      color:#fff;
      font-size:11px;
      line-height:1;
      font-weight:800;
      letter-spacing:.04em;
      text-transform:uppercase;
      backdrop-filter:blur(6px);
    }
    .youtube-iframe{
      width:100%;
      height:100%;
      display:block;
      border:0;
      background:#000;
    }
  `;
  document.head.appendChild(style);
}

function enableClickToPlay() {
  document.addEventListener('click', event => {
    const trigger = event.target.closest('.youtube-media[data-video-id]');
    if (!trigger) return;

    const videoId = trigger.dataset.videoId;
    if (!videoId || !/^[A-Za-z0-9_-]{6,}$/.test(videoId)) return;

    const media = trigger.closest('.product-image');
    if (!media) return;

    media.innerHTML = `
      <iframe
        class="youtube-iframe"
        src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>
    `;
  });
}

async function loadProducts() {
  const res = await fetch('products.json?ts=' + Date.now(), { cache: 'no-store' });
  const data = await res.json();
  const products = Array.isArray(data) ? data : (data.products || []);

  document.querySelectorAll('[data-category]').forEach(grid => {
    const category = grid.dataset.category;
    const items = products.filter(p => p.category === category);

    grid.innerHTML = items.map(p => {
      const media = renderProductMedia(p);
      const affiliateUrl = safeUrl(p.affiliate);
      const reviewUrl = safeUrl(p.review);

      const affiliate = affiliateUrl
        ? `<a class="buy-link" href="${escapeHtml(affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">Check latest price</a>`
        : `<a class="buy-link" href="#" onclick="return false;">Add affiliate link</a>`;

      const review = reviewUrl
        ? `<a class="review-link" href="${escapeHtml(reviewUrl)}" target="_blank" rel="noopener">Watch review</a>`
        : `<a class="review-link" href="#" onclick="return false;">Add review link</a>`;

      return `
        <article class="product-card">
          <div class="product-image">${media}</div>
          <div class="product-body">
            <span class="badge">${escapeHtml(p.badge || 'Recommended')}</span>
            <h3>${escapeHtml(p.name || '')}</h3>
            <p>${escapeHtml(p.description || '')}</p>
            <div class="product-meta">${escapeHtml(p.meta || '')}</div>
            <div class="product-actions">${affiliate}${review}</div>
          </div>
        </article>
      `;
    }).join('');
  });
}

async function init() {
  installVideoStyles();
  enableClickToPlay();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  await Promise.all([loadSettings(), loadProducts()]);
}

init();
