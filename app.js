async function loadProducts(){
  const res = await fetch('products.json?ts=' + Date.now(), {cache:'no-store'});
  const data = await res.json();
  const products = Array.isArray(data) ? data : (data.products || []);

  document.querySelectorAll('[data-category]').forEach(grid => {
    const category = grid.dataset.category;
    const items = products.filter(p => p.category === category);

    grid.innerHTML = items.map(p => {
      const image = p.image
        ? `<img src="${p.image}" alt="${p.name}">`
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

  document.getElementById('year').textContent = new Date().getFullYear();
}
loadProducts();
