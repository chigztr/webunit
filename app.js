function setText(id,value){
  const el=document.getElementById(id);
  if(el&&value!==undefined&&value!==null&&value!=='')el.textContent=value;
}
function setHref(id,value){
  const el=document.getElementById(id);
  if(el&&value)el.href=value;
}
function setImage(id,value){
  const el=document.getElementById(id);
  if(el&&value)el.src=value;
}
function escapeHtml(value=''){
  return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function safeUrl(value=''){
  const url=String(value||'').trim();
  if(!url||url==='#')return'';
  try{
    const parsed=new URL(url,window.location.href);
    return ['http:','https:'].includes(parsed.protocol)?parsed.href:'';
  }catch(_){return'';}
}
function renderHeroSecondLine(value){
  const el=document.getElementById('hero-headline-2');
  if(!el||!value)return;
  const words=String(value).trim().split(/\s+/).filter(Boolean);
  if(words.length<=1){
    el.innerHTML=`<em>${escapeHtml(value)}</em>`;
    return;
  }
  const last=words.pop();
  el.innerHTML=`${escapeHtml(words.join(' '))} <em>${escapeHtml(last)}</em>`;
}

async function loadSettings(){
  try{
    const res=await fetch('settings.json?ts='+Date.now(),{cache:'no-store'});
    if(!res.ok)return;
    const s=await res.json();

    if(s.siteTitle)document.title=s.siteTitle;
    const meta=document.getElementById('meta-description');
    if(meta&&s.metaDescription)meta.setAttribute('content',s.metaDescription);

    setText('hero-eyebrow',s.heroEyebrow);
    setText('hero-headline-1',s.heroHeadline1);
    renderHeroSecondLine(s.heroHeadline2);
    setText('hero-copy',s.heroCopy);
    if(s.heroPortraitImage)setImage('hero-image',s.heroPortraitImage);

    setText('subscriber-count',s.youtubeSubscriberCount);
    setText('total-view-count',s.youtubeTotalViews);
    setHref('youtube-subs-link',s.youtubeUrl);
    setHref('youtube-views-link',s.youtubeUrl);
    setHref('hero-video-link',s.youtubeUrl);
    setHref('youtube-cta',s.youtubeUrl);
    setHref('footer-youtube',s.youtubeUrl);

    if(s.chigzChannelDisplayUrl)setText('channel-display-label',s.chigzChannelDisplayUrl);
    if(s.chigzChannelUrl)setHref('chigz-channel-link',s.chigzChannelUrl);

    setText('deals-kicker',s.dealsKicker);
    setText('deals-title',s.dealsTitle);
    setText('deals-description',s.dealsDescription);
    setText('picks-kicker',s.picksKicker);
    setText('picks-title',s.picksTitle);
    setText('picks-description',s.picksDescription);
    setText('phones-kicker',s.phonesKicker);
    setText('phones-title',s.phonesTitle);
    setText('phones-description',s.phonesDescription);
    setText('creator-kicker',s.creatorKicker);
    setText('creator-title',s.creatorTitle);
    setText('creator-description',s.creatorDescription);
    setText('home-kicker',s.homeKicker);
    setText('home-title',s.homeTitle);
    setText('home-description',s.homeDescription);
    setText('reviews-kicker',s.reviewsKicker);
    setText('reviews-title',s.reviewsTitle);
    setText('reviews-description',s.reviewsDescription);
    setText('youtube-cta',s.reviewsButtonLabel);

    setText('footer-tagline',s.footerTagline);
    setText('affiliate-disclosure',s.affiliateDisclosure);
    setText('footer-credit',s.footerCredit);
    setHref('footer-chigztech',s.chigzTechUrl);
    if(s.contactEmail)setHref('footer-contact',`mailto:${s.contactEmail}`);
  }catch(e){console.warn('Could not load site settings',e);}
}

function getYouTubeVideoId(url){
  if(!url||url==='#')return'';
  try{
    const u=new URL(url);
    const host=u.hostname.replace(/^www\./,'');
    if(host==='youtu.be')return u.pathname.split('/').filter(Boolean)[0]||'';
    if(host==='youtube.com'||host==='m.youtube.com'){
      if(u.pathname==='/watch')return u.searchParams.get('v')||'';
      const parts=u.pathname.split('/').filter(Boolean);
      if(['shorts','embed','live'].includes(parts[0]))return parts[1]||'';
    }
  }catch(_){}
  const m=String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/))([A-Za-z0-9_-]{6,})/i);
  return m?m[1]:'';
}
function getYouTubeThumbnail(url){
  const id=getYouTubeVideoId(url);
  return id?`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`:'';
}
function getYouTubeFallbackThumbnail(id){
  return id?`https://i.ytimg.com/vi/${id}/hqdefault.jpg`:'';
}

function renderProductMedia(product){
  const mode=product.media_type||'image';
  const videoId=getYouTubeVideoId(product.review);
  const uploaded=safeUrl(product.image);
  const yt=videoId?getYouTubeThumbnail(product.review):'';
  const fallback=getYouTubeFallbackThumbnail(videoId);
  const name=escapeHtml(product.name||'Product');

  if(mode==='video'&&videoId){
    const poster=uploaded||yt;
    const fallbackAttr=!uploaded&&fallback?` onerror="this.onerror=null;this.src='${escapeHtml(fallback)}'"`:'';
    return `<button class="youtube-media" type="button" data-video-id="${escapeHtml(videoId)}" aria-label="Play ${name} review">
      <img src="${escapeHtml(poster)}" alt="${name}" loading="lazy"${fallbackAttr}>
      <span class="youtube-play" aria-hidden="true"><span class="youtube-play-triangle"></span></span>
      <span class="youtube-play-label">Play review</span>
    </button>`;
  }

  const src=uploaded||yt;
  if(src){
    const fallbackAttr=!uploaded&&fallback?` onerror="this.onerror=null;this.src='${escapeHtml(fallback)}'"`:'';
    return `<img src="${escapeHtml(src)}" alt="${name}" loading="lazy"${fallbackAttr}>`;
  }
  return `<div class="product-placeholder">WEBUNIT</div>`;
}

function actionsHtml(product,featured=false){
  const affiliate=safeUrl(product.affiliate);
  const review=safeUrl(product.review);

  const buy=affiliate
    ? `<a class="buy-link" href="${escapeHtml(affiliate)}" target="_blank" rel="sponsored nofollow noopener">Check latest price</a>`
    : `<a class="buy-link" href="#" onclick="return false;">Add affiliate link</a>`;

  const watch=review
    ? `<a class="review-link" href="${escapeHtml(review)}" target="_blank" rel="noopener">Watch review</a>`
    : `<a class="review-link" href="#" onclick="return false;">Add review link</a>`;

  return featured
    ? `<div class="featured-actions">${buy}${watch}</div>`
    : `<div class="product-actions">${buy}${watch}</div>`;
}

function productCardHtml(p){
  const search=[p.name,p.badge,p.description,p.meta,p.category].filter(Boolean).join(' ').toLowerCase();
  return `<article class="product-card" data-search="${escapeHtml(search)}">
    <div class="product-image">${renderProductMedia(p)}</div>
    <span class="badge">${escapeHtml(p.badge||'Recommended')}</span>
    <div class="product-body">
      <h3>${escapeHtml(p.name||'')}</h3>
      <p>${escapeHtml(p.description||'')}</p>
      <div class="product-meta">${escapeHtml(p.meta||'')}</div>
      ${actionsHtml(p)}
    </div>
  </article>`;
}

function featuredDealHtml(p){
  if(!p)return'';
  const search=[p.name,p.badge,p.description,p.meta,p.category].filter(Boolean).join(' ').toLowerCase();
  return `<article class="featured-deal-card" data-search="${escapeHtml(search)}">
    <div class="featured-deal-media">
      <div class="product-image">${renderProductMedia(p)}</div>
    </div>
    <div class="featured-deal-content">
      <span class="featured-label">${escapeHtml(p.badge||'Featured deal')}</span>
      <h3>${escapeHtml(p.name||'')}</h3>
      <p>${escapeHtml(p.description||'')}</p>
      <div class="featured-meta">${escapeHtml(p.meta||'')}</div>
      ${actionsHtml(p,true)}
    </div>
  </article>`;
}

function enableClickToPlay(){
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('.youtube-media[data-video-id]');
    if(!trigger)return;
    const id=trigger.dataset.videoId;
    if(!id||!/^[A-Za-z0-9_-]{6,}$/.test(id))return;
    const media=trigger.closest('.product-image');
    if(!media)return;
    media.innerHTML=`<iframe class="youtube-iframe" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  });
}

function applySearch(query){
  const q=String(query||'').trim().toLowerCase();
  document.querySelectorAll('[data-search]').forEach(el=>{
    el.classList.toggle('search-hidden',Boolean(q)&&!el.dataset.search.includes(q));
  });
}
function enableSearch(){
  const input=document.getElementById('product-search');
  if(input)input.addEventListener('input',()=>applySearch(input.value));
}
function enableMenu(){
  const btn=document.getElementById('menu-button');
  const menu=document.getElementById('mobile-menu');
  if(!btn||!menu)return;
  btn.addEventListener('click',()=>{
    const open=menu.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  });
  menu.addEventListener('click',e=>{
    if(e.target.closest('a')){
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    }
  });
}

async function loadProducts(){
  try{
    const res=await fetch('products.json?ts='+Date.now(),{cache:'no-store'});
    if(!res.ok)return;
    const data=await res.json();
    const products=Array.isArray(data)?data:(data.products||[]);

    const deals=products.filter(p=>p.category==='deals');
    const featured=document.getElementById('featured-deal');
    const dealsGrid=document.getElementById('all-deals');

    if(featured){
      if(deals.length)featured.innerHTML=featuredDealHtml(deals[0]);
      else featured.innerHTML='';
    }
    if(dealsGrid){
      const rest=deals.slice(1);
      dealsGrid.innerHTML=rest.length
        ? rest.map(productCardHtml).join('')
        : '';
    }

    document.querySelectorAll('[data-category]:not(#all-deals)').forEach(grid=>{
      const items=products.filter(p=>p.category===grid.dataset.category);
      grid.innerHTML=items.length
        ? items.map(productCardHtml).join('')
        : `<div class="empty-state">No products added here yet.</div>`;
    });
  }catch(e){console.warn('Could not load products',e);}
}

async function init(){
  enableClickToPlay();
  enableSearch();
  enableMenu();
  const y=document.getElementById('year');
  if(y)y.textContent=new Date().getFullYear();
  await Promise.all([loadSettings(),loadProducts()]);
}
init();
