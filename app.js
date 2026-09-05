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

function renderHeroSecondLine(value) {
  const el = document.getElementById('hero-headline-2');
  if (!el || !value) return;

  const text = String(value).trim();
  const parts = text.split(/\s+/);
  if (parts.length < 2) {
    el.textContent = text;
    return;
  }

  const last = parts.pop();
  el.innerHTML = `${escapeHtml(parts.join(' '))} <em>${escapeHtml(last)}</em>`;
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
    renderHeroSecondLine(s.heroHeadline2);
    setText('hero-copy', s.heroCopy);

    setText('subscriber-count', s.youtubeSubscriberCount);
    setText('total-view-count', s.youtubeTotalViews);
    setHref('youtube-subs-link', s.youtubeUrl);
    setHref('youtube-views-link', s.youtubeUrl);
    setHref('youtube-cta', s.youtubeUrl);
    setHref('footer-youtube', s.youtubeUrl);

    if (s.chigzChannelDisplayUrl) setText('channel-display-label', s.chigzChannelDisplayUrl);
    if (s.chigzChannelUrl) setHref('chigz-channel-link', s.chigzChannelUrl);

    setText('deals-kicker', s.dealsKicker);
    setText('deals-title', s.dealsTitle);
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
    setText('footer-tagline', s.footerTagline);
    setText('affiliate-disclosure', s.affiliateDisclosure);
    setText('footer-credit', s.footerCredit);
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
    if (host === 'youtu.be') return u.pathname.split('/').filter(Boolean)[0] || '';
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname === '/watch') return u.searchParams.get('v') || '';
      const parts = u.pathname.split('/').filter(Boolean);
      if (['shorts', 'embed', 'live'].includes(parts[0])) return parts[1] || '';
    }
  } catch (_) {}
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
        <span class="youtube-play" aria-hidden="true"><span class="youtube-play-triangle"></span></span>
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

  return `<div class="product-placeholder">WEBUNIT</div>`;
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

function applySearch(query) {
  const normalized = String(query || '').trim().toLowerCase();

  document.querySelectorAll('.product-card').forEach(card => {
    const haystack = card.dataset.search || '';
    card.classList.toggle('search-hidden', Boolean(normalized) && !haystack.includes(normalized));
  });

  document.querySelectorAll('.product-grid').forEach(grid => {
    const cards = [...grid.querySelectorAll('.product-card')];
    if (!cards.length) return;
    const anyVisible = cards.some(card => !card.classList.contains('search-hidden'));

    let msg = grid.nextElementSibling;
    if (!msg || !msg.classList.contains('search-empty')) {
      msg = document.createElement('div');
      msg.className = 'search-empty';
      msg.textContent = 'No matching products in this section.';
      grid.insertAdjacentElement('afterend', msg);
    }
    msg.classList.toggle('visible', Boolean(normalized) && !anyVisible);
  });
}

function enableSearch() {
  const input = document.getElementById('product-search');
  if (!input) return;
  input.addEventListener('input', () => applySearch(input.value));
}

async function loadProducts() {
  try {
    const res = await fetch('products.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const products = Array.isArray(data) ? data : (data.products || []);

    document.querySelectorAll('[data-category]').forEach(grid => {
      const category = grid.dataset.category;
      const items = products.filter(p => p.category === category);

      if (!items.length) {
        grid.innerHTML = `<div class="empty-state">No products added here yet. Add them in the CMS when ready.</div>`;
        return;
      }

      grid.innerHTML = items.map(p => {
        const media = renderProductMedia(p);
        const affiliateUrl = safeUrl(p.affiliate);
        const reviewUrl = safeUrl(p.review);
        const searchText = [p.name, p.badge, p.description, p.meta, p.category].filter(Boolean).join(' ').toLowerCase();

        const affiliate = affiliateUrl
          ? `<a class="buy-link" href="${escapeHtml(affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">◆ Check latest price</a>`
          : `<a class="buy-link" href="#" onclick="return false;">◆ Add affiliate link</a>`;

        const review = reviewUrl
          ? `<a class="review-link" href="${escapeHtml(reviewUrl)}" target="_blank" rel="noopener">▶ Watch review</a>`
          : `<a class="review-link" href="#" onclick="return false;">▶ Add review link</a>`;

        return `
          <article class="product-card" data-search="${escapeHtml(searchText)}">
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
  } catch (e) {
    console.warn('Could not load products', e);
  }
}

async function init() {
  enableClickToPlay();
  enableSearch();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  await Promise.all([loadSettings(), loadProducts()]);
}

init();
