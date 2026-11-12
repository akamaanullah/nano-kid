/* ==========================================================================
   NANO KIDS — shared behaviour (vanilla JS, no dependencies)
   1 Helpers · 2 Icons · 3 Store (cart/wishlist, localStorage) · 4 Layout
   injection (header, footer, drawers) · 5 Product card + quick view
   6 Page modules: home, product, cart, checkout, contact/about
   Requires data.js to be loaded first.
   ========================================================================== */
(() => {
'use strict';

/* 1 — HELPERS ------------------------------------------------------------ */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => 'Rs. ' + Math.round(n).toLocaleString('en-US');
const FREE_SHIP = 8000, SHIP_FEE = 300;
const page = document.body.dataset.page || '';
const params = new URLSearchParams(location.search);
const labelOf = (list, key) => (list.find(x => x.key === key) || {}).label || key;
const catLabel = k => labelOf(CATS, k);
window.NK = { $, $$, fmt, FREE_SHIP, SHIP_FEE };

/* 2 — ICONS (inline SVG line icons) --------------------------------------- */
const ICONS = {
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
  bag:'<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  menu:'<path d="M4 8h16M4 16h16"/>',
  close:'<path d="M5 5l14 14M19 5L5 19"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  arrow:'<path d="M4 12h15M13 6l6 6-6 6"/>',
  down:'<path d="M6 9l6 6 6-6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  truck:'<path d="M3 6.5h11v9H3zM14 10h4l3 3v2.5h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  leaf:'<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c3-4 6-6 9-8"/>',
  swap:'<path d="M4 9h13l-3-3M20 15H7l3 3"/>',
  gift:'<rect x="4" y="9" width="16" height="11"/><path d="M3 9h18v-3H3zM12 6v14M12 6c-1-3-5-3-4-.5M12 6c1-3 5-3 4-.5"/>',
  shield:'<path d="M12 3l7 3v5.5c0 4.3-3 8-7 9.5-4-1.500-7-5.200-7-9.500V6z"/><path d="M9 12l2.200 2.200L15.500 10"/>',
  needle:'<path d="M5 19L19 5"/><ellipse cx="17" cy="7" rx="1" ry="2.600" transform="rotate(45 17 7)"/><path d="M5 19c4 0 3-4 7-4"/>',
  phone:'<path d="M6 3.500h3l1.500 4-2 1.500a11 11 0 0 0 6.500 6.500l1.500-2 4 1.500v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5.500a2 2 0 0 1 2-2z"/>',
  mail:'<rect x="3" y="5.500" width="18" height="13"/><path d="M3.500 6.500L12 13l8.500-6.500"/>',
  pin:'<path d="M12 21s-6.500-5.700-6.500-11a6.500 6.500 0 0 1 13 0c0 5.300-6.500 11-6.500 11z"/><circle cx="12" cy="10" r="2.300"/>',
  clock:'<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>',
  insta:'<rect x="4" y="4" width="16" height="16" rx="4.500"/><circle cx="12" cy="12" r="3.700"/><circle cx="16.800" cy="7.200" r=".6" fill="currentColor"/>',
  fb:'<path d="M14 21v-8h2.700l.5-3.200H14V8c0-1 .5-1.800 1.800-1.800h1.500V3.400A18 18 0 0 0 15 3.200c-2.500 0-4.200 1.500-4.200 4.200v2.400H8V13h2.800v8"/>',
  chat:'<path d="M4 19l1.200-3.800A8 8 0 1 1 8.800 18.800z"/><path d="M9 9.500c0 3 2.500 5.500 5.500 5.500l1-1.500-2-1-1 .8a3.500 3.500 0 0 1-1.800-1.800l.8-1-1-2z"/>',
  grid:'<rect x="4" y="4" width="6.500" height="6.500"/><rect x="13.500" y="4" width="6.500" height="6.500"/><rect x="4" y="13.500" width="6.500" height="6.500"/><rect x="13.500" y="13.500" width="6.500" height="6.500"/>',
  list:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  upload:'<path d="M12 16V5M7.500 9.500L12 5l4.500 4.500M5 19h14"/>',
  filter:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  ruler:'<rect x="3" y="8" width="18" height="8" transform="rotate(-20 12 12)"/><path d="M7 11l1.200 2.200M10.500 9.800l1.200 2.200M14 8.500l1.200 2.200"/>',
  star:'<path d="M12 3l2.700 5.800 6.300.7-4.700 4.300 1.300 6.200L12 16.800 6.400 20l1.300-6.200L3 9.500l6.300-.7z"/>',
  scissors:'<circle cx="6" cy="7" r="2.500"/><circle cx="6" cy="17" r="2.500"/><path d="M8 8.500L20 18M8 15.500L20 6"/>'
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const STAR = '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.8 6.4 20l1.3-6.2L3 9.500l6.300-.7z"/></svg>';
const starRow = () => `<span class="stars" aria-hidden="true">${STAR.repeat(5)}</span>`;
window.NK.ico = ico; window.NK.starRow = starRow;

/* 3 — STORE (cart + wishlist persisted in localStorage) -------------------- */
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let cart = store.get('nk_cart', []);
let wish = store.get('nk_wish', []);
const saveCart = () => { store.set('nk_cart', cart); updateCartUI(); window.dispatchEvent(new Event('nk:cart')); };
const saveWish = () => { store.set('nk_wish', wish); updateBadges(); };
const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
const cartSub = () => cart.reduce((n, i) => n + i.qty * i.price, 0);
const shipping = sub => (sub === 0 || sub >= FREE_SHIP) ? 0 : SHIP_FEE;

function addToCart(item) {
  const key = item.key || [item.id, item.size, item.color].join('|');
  const ex = cart.find(i => i.key === key);
  if (ex) ex.qty += item.qty || 1; else cart.push({ ...item, key, qty: item.qty || 1 });
  saveCart();
}
function setQty(key, q) { const it = cart.find(i => i.key === key); if (!it) return; it.qty = Math.max(1, Math.min(20, q)); saveCart(); }
function removeItem(key) { cart = cart.filter(i => i.key !== key); saveCart(); }
function toggleWish(id) { wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id]; saveWish(); return wish.includes(id); }
window.NK.cart = { get: () => cart, add: addToCart, setQty, remove: removeItem, sub: cartSub, ship: shipping, clear: () => { cart = []; saveCart(); } };
window.NK.wish = { get: () => wish, toggle: toggleWish };

/* 4 — LAYOUT INJECTION ---------------------------------------------------- */
const MSGS = [
  'Complimentary delivery on orders above Rs. 8,000',
  'Cash on delivery available nationwide',
  'New: Design Your Own — personalised pieces <a href="customize.html">Start</a>'
];
const logoHTML = `<a class="logo" href="index.html" aria-label="Nano Kids home"><span class="logo-word">Nano<i>Kids</i></span><span class="logo-sub">Children's Outfitters</span></a>`;

function megaHTML() {
  const col = (title, list, param) => `<div><h4>${title}</h4><ul>${list.map(x =>
    `<li><a href="shop.html?${param}=${x.key}">${x.label}${x.range ? `<small>${x.range}</small>` : ''}</a></li>`).join('')}</ul></div>`;
  return `<div class="mega"><div class="mega-inner">
    ${col('Shop by age', AGES, 'age')}${col('Shop by season', SEASONS, 'season')}${col('Shop by category', CATS, 'cat')}
    <a class="mega-feature" href="shop.html?season=festive"><img src="${img(PH.vest, 700, 520)}" alt="" loading="lazy"><span>The Eid Edit</span></a>
  </div></div>`;
}
function mobileMenuHTML() {
  const sub = (t, list, p) => `<h5>${t}</h5>` + list.map(x => `<a href="shop.html?${p}=${x.key}">${x.label}</a>`).join('');
  return `<aside class="mobile-menu" id="mobileMenu" aria-label="Menu">
    <div class="mm-top">${logoHTML}<button class="icon-btn" data-close-menu aria-label="Close menu">${ico('close')}</button></div>
    <ul class="mm-list">
      <li><a href="shop.html?sort=new">New In</a></li>
      <li><button class="mm-acc-btn" aria-expanded="false">Shop ${ico('plus')}</button>
        <div class="mm-sub"><div class="mm-sub-inner">${sub('By age', AGES, 'age')}${sub('By season', SEASONS, 'season')}${sub('By category', CATS, 'cat')}</div></div></li>
      <li><a href="shop.html?gender=girls">Girls</a></li>
      <li><a href="shop.html?gender=boys">Boys</a></li>
      <li><a href="customize.html" style="color:var(--accent)">Design Your Own</a></li>
      <li><a href="about.html">Our Story</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <div class="mm-foot">hello@nanokids.pk<br>+92 300 000 0000</div>
  </aside>`;
}
function headerHTML() {
  const act = h => page && location.pathname.endsWith(h) ? 'is-active' : '';
  return `
  <div class="announce" role="region" aria-label="Announcements">${MSGS.map((m, i) => `<div class="announce-msg ${i ? '' : 'is-on'}">${m}</div>`).join('')}</div>
  <header class="site-header" id="siteHeader">
    <div class="wrap header-inner">
      <button class="icon-btn menu-toggle" data-open-menu aria-label="Open menu">${ico('menu')}</button>
      <ul class="main-nav">
        <li><a href="shop.html?sort=new">New In</a></li>
        <li class="has-mega"><a href="shop.html" class="${act('shop.html')}">Shop</a>${megaHTML()}</li>
        <li><a href="shop.html?gender=girls">Girls</a></li>
        <li><a href="shop.html?gender=boys">Boys</a></li>
        <li><a class="nav-accent ${act('customize.html')}" href="customize.html">Design Your Own</a></li>
        <li><a href="about.html" class="${act('about.html')}">Our Story</a></li>
      </ul>
      ${logoHTML}
      <div class="header-actions">
        <button class="icon-btn" data-open-search aria-label="Search">${ico('search')}</button>
        <a class="icon-btn hide-sm" href="shop.html?wishlist=1" aria-label="Wishlist">${ico('heart')}<span class="badge" data-wish-count>0</span></a>
        <button class="icon-btn" data-open-cart aria-label="Open cart">${ico('bag')}<span class="badge" data-cart-count>0</span></button>
      </div>
    </div>
  </header>
  ${mobileMenuHTML()}
  <div class="scrim" id="scrim"></div>
  <div class="search-overlay" id="searchOverlay" role="dialog" aria-label="Search">
    <div class="search-top"><input type="search" id="searchInput" placeholder="Search dresses, jackets, Eid…" autocomplete="off">
      <button class="icon-btn" data-close-search aria-label="Close search">${ico('close')}</button></div>
    <div class="search-body">
      <p class="eyebrow">Popular searches</p>
      <div class="search-hints"><a href="shop.html?q=dress">Dresses</a><a href="shop.html?season=festive">Eid</a><a href="shop.html?age=newborn">Newborn</a><a href="shop.html?q=jacket">Jackets</a><a href="shop.html?q=set">Sets</a></div>
      <div class="search-results" id="searchResults"></div>
    </div>
  </div>`;
}
function footerHTML() {
  const li = (list, p) => list.map(x => `<li><a href="shop.html?${p}=${x.key}">${x.label}</a></li>`).join('');
  return `<footer class="site-footer"><div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">${logoHTML}<p>Considered clothing for the smallest members of the family. Soft fabrics, honest craft, made to be loved and handed down.</p>
        <div class="socials"><a href="#" aria-label="Instagram">${ico('insta')}</a><a href="#" aria-label="Facebook">${ico('fb')}</a><a href="#" aria-label="WhatsApp">${ico('chat')}</a></div></div>
      <div><h5>Shop</h5><ul><li><a href="shop.html?sort=new">New arrivals</a></li>${li(AGES, 'age')}<li><a href="customize.html">Design your own</a></li></ul></div>
      <div><h5>Collections</h5><ul>${li(SEASONS, 'season')}<li><a href="shop.html?cat=ethnic">Ethnic wear</a></li></ul></div>
      <div><h5>Help</h5><ul><li><a href="contact.html">Contact us</a></li><li><a href="contact.html#faq">Delivery &amp; returns</a></li><li><a href="contact.html#faq">Size guide</a></li><li><a href="about.html">Our story</a></li><li><a href="cart.html">Your bag</a></li></ul></div>
      <div class="footer-contact"><h5>Visit &amp; write</h5><ul>
        <li>${ico('pin')}<span>12-B, Main Boulevard, Gulberg III<br>Lahore, Pakistan</span></li>
        <li>${ico('phone')}<span>+92 300 000 0000</span></li>
        <li>${ico('mail')}<span>hello@nanokids.pk</span></li>
        <li>${ico('clock')}<span>Mon – Sat, 11 am – 8 pm</span></li></ul></div>
    </div>
    <div class="footer-bottom"><span>© 2026 Nano Kids. All rights reserved.</span>
      <div class="pay-chips"><span>Cash on delivery</span><span>Visa</span><span>Mastercard</span><span>JazzCash</span><span>Easypaisa</span></div>
      <nav><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Returns</a></nav></div>
  </div></footer>`;
}
const drawerHTML = `
  <aside class="drawer" id="cartDrawer" aria-label="Shopping bag">
    <div class="drawer-head"><h3>Your bag <small data-drawer-count></small></h3><button class="icon-btn" data-close-cart aria-label="Close bag">${ico('close')}</button></div>
    <div class="drawer-ship" id="drawerShip"></div>
    <div class="drawer-body" id="drawerBody"></div>
    <div class="drawer-foot" id="drawerFoot"></div>
  </aside>
  <div class="modal" id="qvModal" aria-hidden="true"><div class="modal-scrim" data-close-modal></div><div class="modal-card" id="qvCard"></div></div>
  <div class="modal" id="sizeModal" aria-hidden="true"><div class="modal-scrim" data-close-modal></div><div class="modal-card modal-card--sm">
    <button class="modal-close" data-close-modal aria-label="Close">${ico('close')}</button>
    <p class="eyebrow">Fit guide</p><h2 style="font-size:2.4rem;margin:8px 0 18px">Size <em>guide</em></h2>
    <table class="size-table"><thead><tr><th>Age</th><th>Height (cm)</th><th>Chest (cm)</th><th>Waist (cm)</th></tr></thead><tbody>
      <tr><td>0 – 3 m</td><td>56 – 62</td><td>41</td><td>40</td></tr><tr><td>3 – 6 m</td><td>62 – 68</td><td>43</td><td>42</td></tr>
      <tr><td>6 – 12 m</td><td>68 – 80</td><td>46</td><td>44</td></tr><tr><td>12 – 24 m</td><td>80 – 92</td><td>49</td><td>47</td></tr>
      <tr><td>2 – 3 y</td><td>92 – 98</td><td>52</td><td>49</td></tr><tr><td>4 – 5 y</td><td>104 – 110</td><td>56</td><td>52</td></tr>
      <tr><td>6 – 7 y</td><td>116 – 122</td><td>60</td><td>54</td></tr><tr><td>7 – 8 y</td><td>122 – 128</td><td>63</td><td>56</td></tr>
      <tr><td>9 – 10 y</td><td>134 – 140</td><td>68</td><td>59</td></tr><tr><td>11 – 12 y</td><td>146 – 152</td><td>74</td><td>63</td></tr>
      <tr><td>13 – 14 y</td><td>158 – 164</td><td>80</td><td>67</td></tr></tbody></table>
    <p class="muted" style="font-size:.82rem;margin:18px 0 0">Between two sizes? We recommend sizing up — our pieces are cut to be worn for more than one season.</p>
  </div></div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

function mountLayout() {
  document.body.insertAdjacentHTML('afterbegin', headerHTML());
  document.body.insertAdjacentHTML('beforeend', footerHTML() + drawerHTML);
  // Announcement rotator
  const msgs = $$('.announce-msg'); let mi = 0;
  setInterval(() => { msgs[mi].classList.remove('is-on'); mi = (mi + 1) % msgs.length; msgs[mi].classList.add('is-on'); }, 4200);
  // Sticky header shadow
  const hdr = $('#siteHeader');
  const onScroll = () => hdr.classList.toggle('is-scrolled', scrollY > 10);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  updateBadges(); updateCartUI();
}

/* open/close helpers */
const scrim = () => $('#scrim');
function openPanel(el) { el.classList.add('open'); scrim().classList.add('show'); document.body.classList.add('no-scroll'); }
function closePanels() {
  $$('.drawer.open, .mobile-menu.open, .filters.open').forEach(e => e.classList.remove('open'));
  $$('.modal.open').forEach(e => { e.classList.remove('open'); e.setAttribute('aria-hidden', 'true'); });
  $('#searchOverlay').classList.remove('open');
  scrim().classList.remove('show'); document.body.classList.remove('no-scroll');
}
function openModal(el) { el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); }
function toast(msg) {
  const t = $('#toast'); t.innerHTML = ico('check') + `<span>${msg}</span>`; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2800);
}
window.NK.toast = toast; window.NK.openPanel = openPanel; window.NK.closePanels = closePanels; window.NK.openModal = openModal;
const openCart = () => { closePanels(); openPanel($('#cartDrawer')); };
window.NK.openCart = openCart;

/* badges + cart drawer rendering */
function updateBadges() {
  $$('[data-wish-count]').forEach(b => { b.textContent = wish.length; b.classList.toggle('has', wish.length > 0); });
  $$('.pcard-wish, .wish-btn[data-id]').forEach(b => b.classList.toggle('is-on', wish.includes(Number(b.dataset.id))));
}
function updateCartUI() {
  const n = cartCount();
  $$('[data-cart-count]').forEach(b => { const had = b.textContent; b.textContent = n; b.classList.toggle('has', n > 0); if (had != n) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } });
  const body = $('#drawerBody'); if (!body) return;
  const sub = cartSub();
  $('[data-drawer-count]').textContent = n ? `(${n})` : '';
  const left = Math.max(0, FREE_SHIP - sub);
  $('#drawerShip').innerHTML = n ? (left > 0
    ? `Add <b>${fmt(left)}</b> more for complimentary delivery<div class="ship-bar" style="--p:${Math.min(100, sub / FREE_SHIP * 100)}%"><i></i></div>`
    : `You've unlocked <b>complimentary delivery</b><div class="ship-bar" style="--p:100%"><i></i></div>`) : '';
  $('#drawerShip').style.display = n ? '' : 'none';
  if (!n) {
    body.innerHTML = `<div class="drawer-empty"><h4>Your bag is empty</h4><p>Pieces you love will wait for you here.</p><a class="btn btn--ghost" href="shop.html">Start browsing</a></div>`;
    $('#drawerFoot').innerHTML = ''; $('#drawerFoot').style.display = 'none'; return;
  }
  $('#drawerFoot').style.display = '';
  body.innerHTML = cart.map(i => `
    <div class="dr-item"><img src="${i.img}" alt=""><div>
      <h4>${i.name}</h4><p>${itemMeta(i)}</p>
      <div class="dr-row">${qtyHTML(i)}<span class="price">${fmt(i.price * i.qty)}</span></div>
      <button class="rm" data-remove="${i.key}">Remove</button></div></div>`).join('');
  $('#drawerFoot').innerHTML = `<div class="s-line"><span>Subtotal</span><b>${fmt(sub)}</b></div>
    <a class="btn btn--block" href="checkout.html">Checkout</a><a class="btn btn--ghost btn--block" href="cart.html">View bag</a>
    <small>Delivery &amp; taxes calculated at checkout</small>`;
}
const itemMeta = i => i.custom ? i.custom.join(' · ') : [i.size && `Size ${i.size}`, i.color].filter(Boolean).join(' · ');
const qtyHTML = i => `<div class="qty" data-key="${i.key}"><button data-qty="-1" aria-label="Decrease">${ico('minus')}</button><input type="text" value="${i.qty}" readonly aria-label="Quantity"><button data-qty="1" aria-label="Increase">${ico('plus')}</button></div>`;
window.NK.qtyHTML = qtyHTML; window.NK.itemMeta = itemMeta;

/* global event delegation */
document.addEventListener('click', e => {
  const t = e.target.closest('button, a, [data-close-modal], .scrim');
  if (!t) return;
  if (t.matches('[data-open-menu]')) { openPanel($('#mobileMenu')); }
  else if (t.matches('[data-close-menu]') || t.matches('.scrim')) closePanels();
  else if (t.matches('[data-open-cart]')) { e.preventDefault(); openCart(); }
  else if (t.matches('[data-close-cart]')) closePanels();
  else if (t.matches('[data-open-search]')) { closePanels(); $('#searchOverlay').classList.add('open'); document.body.classList.add('no-scroll'); setTimeout(() => $('#searchInput').focus(), 400); }
  else if (t.matches('[data-close-search]')) closePanels();
  else if (t.matches('[data-close-modal]')) closePanels();
  else if (t.matches('[data-size-guide]')) { e.preventDefault(); openModal($('#sizeModal')); }
  else if (t.matches('.mm-acc-btn')) { const open = t.getAttribute('aria-expanded') === 'true'; t.setAttribute('aria-expanded', !open); const s = t.nextElementSibling; s.style.maxHeight = open ? 0 : s.scrollHeight + 'px'; }
  else if (t.matches('[data-qty]')) {
    const key = t.closest('.qty').dataset.key; if (!key) return;
    const it = cart.find(i => i.key === key); if (it) setQty(key, it.qty + Number(t.dataset.qty));
  }
  else if (t.matches('[data-remove]')) removeItem(t.dataset.remove);
  else if (t.matches('.pcard-wish')) { e.preventDefault(); const on = toggleWish(Number(t.dataset.id)); toast(on ? 'Saved to your wishlist' : 'Removed from wishlist'); if (window.NK.onWishChange) window.NK.onWishChange(); }
  else if (t.matches('[data-quick]')) { e.preventDefault(); openQuickView(Number(t.dataset.quick)); }
  else if (t.matches('.acc-btn')) toggleAcc(t);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanels(); });

/* accordions (height animated) */
function toggleAcc(btn, exclusive = false) {
  const panel = btn.nextElementSibling, open = btn.getAttribute('aria-expanded') === 'true';
  if (exclusive) $$('.acc-btn', btn.closest('.accordion')).forEach(b => { if (b !== btn) { b.setAttribute('aria-expanded', 'false'); b.nextElementSibling.style.maxHeight = 0; } });
  btn.setAttribute('aria-expanded', !open); panel.style.maxHeight = open ? 0 : panel.scrollHeight + 'px';
}
window.NK.toggleAcc = toggleAcc;
function initAccordions() { $$('.acc-btn[aria-expanded=true]').forEach(b => b.nextElementSibling.style.maxHeight = b.nextElementSibling.scrollHeight + 'px'); }

/* search overlay (live) */
function initSearch() {
  const inp = $('#searchInput'), out = $('#searchResults');
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    if (q.length < 2) { out.innerHTML = ''; return; }
    const hits = PRODUCTS.filter(p => (p.name + ' ' + catLabel(p.cat) + ' ' + p.gender + ' ' + p.ages.join(' ') + ' ' + p.seasons.join(' ')).toLowerCase().includes(q)).slice(0, 8);
    out.innerHTML = hits.length ? hits.map(p => `<a class="search-item" href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}"><h5>${p.name}</h5><span>${fmt(p.price)}</span></a>`).join('')
      : `<p class="muted" style="grid-column:1/-1">No pieces found for “${inp.value}”.</p>`;
  });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter' && inp.value.trim()) location.href = 'shop.html?q=' + encodeURIComponent(inp.value.trim()); });
}

/* scroll reveal */
function initReveal() {
  const els = $$('[data-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(e => io.observe(e));
}
window.NK.initReveal = initReveal;

/* demo forms: validate, then show a success state (no backend) */
function initForms() {
  $$('form[data-demo]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); if (!f.reportValidity()) return;
    const ok = f.parentElement.querySelector('.form-success');
    if (ok) { f.style.display = 'none'; ok.classList.add('show'); }
    else { f.innerHTML = `<p style="margin:0;padding:18px 0">${ico('check')} &nbsp;Thank you — you're on the list.</p>`; }
  }));
}

/* 5 — PRODUCT CARD + QUICK VIEW ------------------------------------------ */
function cardHTML(p, delay = 0) {
  const sale = p.old ? `<s>${fmt(p.old)}</s>` : '';
  return `<article class="pcard" data-reveal style="--d:${delay}s">
    <div class="pcard-media">
      ${p.tag ? `<span class="pcard-tag ${p.tag === 'Sale' ? 'sale' : ''}">${p.tag}</span>` : ''}
      <button class="pcard-wish ${wish.includes(p.id) ? 'is-on' : ''}" data-id="${p.id}" aria-label="Add ${p.name} to wishlist">${ico('heart')}</button>
      <a href="product.html?id=${p.id}" aria-label="${p.name}"><img src="${p.img}" alt="${p.name}" loading="lazy"><img class="alt" src="${p.img2}" alt="" loading="lazy"></a>
      <button class="pcard-quick" data-quick="${p.id}">Quick view</button>
    </div>
    <div class="pcard-info">
      <h3 class="pcard-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <span class="pcard-price">${sale}${fmt(p.price)}</span>
      <span class="pcard-cat">${catLabel(p.cat)} · ${p.ages.map(a => labelOf(AGES, a)).join(' / ')}</span>
      <div class="pcard-dots">${p.colors.map(c => `<i style="--c:${COLORS[c].h}" title="${COLORS[c].n}"></i>`).join('')}</div>
      <p class="pcard-desc">${p.desc || ''}</p>
    </div></article>`;
}
window.NK.cardHTML = cardHTML;

/* Shared option pickers (used in quick view + product page) */
function optionsHTML(p) {
  return `<div class="opt"><div class="opt-head"><span class="field-label">Colour<em data-color-name>${COLORS[p.colors[0]].n}</em></span></div>
      <div class="swatches" data-colors>${p.colors.map((c, i) => `<button class="swatch swatch--lg ${i ? '' : 'is-on'}" style="--c:${COLORS[c].h}" data-color="${COLORS[c].n}" aria-label="${COLORS[c].n}"></button>`).join('')}</div></div>
    <div class="opt"><div class="opt-head"><span class="field-label">Size<em data-size-name>Select a size</em></span><a class="link" href="#" data-size-guide>Size guide</a></div>
      <div class="chips" data-sizes>${p.sizes.map((s, i) => `<button class="chip ${(p.id * 3 + i) % 7 === 0 ? 'is-off' : ''}" data-size="${s}">${s}</button>`).join('')}</div></div>`;
}
function bindOptions(root) {
  root.addEventListener('click', e => {
    const sw = e.target.closest('[data-color]'), ch = e.target.closest('[data-size]');
    if (sw) { $$('[data-color]', root).forEach(x => x.classList.remove('is-on')); sw.classList.add('is-on'); $('[data-color-name]', root).textContent = sw.dataset.color; }
    if (ch && !ch.classList.contains('is-off')) { $$('[data-size]', root).forEach(x => x.classList.remove('is-on')); ch.classList.add('is-on'); $('[data-size-name]', root).textContent = ch.dataset.size; }
  });
}
function readSelection(root, p) {
  const size = $('[data-size].is-on', root)?.dataset.size, color = $('[data-color].is-on', root)?.dataset.color;
  const qty = Number($('.qty input', root)?.value || 1);
  return { size, color, qty };
}
function qtyInput() { return `<div class="qty" data-local><button type="button" data-lqty="-1" aria-label="Decrease">${ico('minus')}</button><input type="text" value="1" aria-label="Quantity"><button type="button" data-lqty="1" aria-label="Increase">${ico('plus')}</button></div>`; }
document.addEventListener('click', e => {
  const b = e.target.closest('[data-lqty]'); if (!b) return;
  const inp = b.parentElement.querySelector('input'); inp.value = Math.max(1, Math.min(20, Number(inp.value) + Number(b.dataset.lqty)));
});
window.NK.optionsHTML = optionsHTML; window.NK.bindOptions = bindOptions; window.NK.readSelection = readSelection; window.NK.qtyInput = qtyInput;

function openQuickView(id) {
  const p = byId(id), card = $('#qvCard');
  card.innerHTML = `<button class="modal-close" data-close-modal aria-label="Close">${ico('close')}</button>
    <div class="qv"><div class="qv-img"><img src="${p.gallery[0]}" alt="${p.name}"></div>
    <div class="qv-info"><span class="eyebrow">${catLabel(p.cat)}</span><h2>${p.name}</h2>
      <div class="pdp-price">${p.old ? `<s>${fmt(p.old)}</s>` : ''}<span>${fmt(p.price)}</span></div>
      <p>${p.desc}</p>${optionsHTML(p)}
      <div class="buy-row">${qtyInput()}<button class="btn" data-qv-add>Add to bag</button></div>
      <a class="link" href="product.html?id=${p.id}">View full details ${ico('arrow')}</a></div></div>`;
  bindOptions(card);
  $('[data-qv-add]', card).addEventListener('click', () => {
    const s = readSelection(card, p);
    if (!s.size) { toast('Please choose a size'); return; }
    addToCart({ id: p.id, name: p.name, price: p.price, img: p.img, size: s.size, color: s.color, qty: s.qty });
    closePanels(); setTimeout(openCart, 250);
  });
  openModal($('#qvModal'));
}
window.NK.openQuickView = openQuickView;

/* 6 — PAGE MODULES -------------------------------------------------------- */

/* HOME */
function initHome() {
  const ageEl = $('#ageGrid');
  ageEl.innerHTML = AGES.map((a, i) => `<a class="age-card" href="shop.html?age=${a.key}" data-reveal style="--d:${i * .08}s">
    <img src="${img(PH[a.img], 700, 1000, a.fy ? { fx: .5, fy: a.fy, fz: 1.15 } : {})}" alt="${a.label} clothing" loading="lazy">
    <div class="meta"><div><span class="num">${a.range}</span><h3>${a.label}</h3></div><span class="arrow">${ico('arrow')}</span></div></a>`).join('');
  $('#seasonGrid').innerHTML = SEASONS.map((s, i) => `<a class="season-card" href="shop.html?season=${s.key}" data-reveal style="--d:${i * .08}s">
    <div class="ph"><img src="${img(PH[s.img], 600, 750)}" alt="${s.label}" loading="lazy"></div>
    <div class="tx"><div><span class="no">0${i + 1}</span><h3>${s.label}</h3><p>${s.note}</p></div><span class="link">Explore ${ico('arrow')}</span></div></a>`).join('');
  $('#catRow').innerHTML = CATS.map((c, i) => `<a class="cat-item" href="shop.html?cat=${c.key}" data-reveal style="--d:${i * .05}s">
    <div class="ring"><img src="${img(PH[c.img], 400, 400, { crop: 'faces,entropy' })}" alt="${c.label}" loading="lazy"></div><span>${c.label}</span></a>`).join('');
  const newest = [...PRODUCTS].filter(p => p.tag === 'New' || p.tag === 'Bestseller').slice(0, 8);
  $('#newGrid').innerHTML = newest.map((p, i) => cardHTML(p, (i % 4) * .08)).join('');
  $('#insta').innerHTML = ['sprink','floral','bear','navy','rain','denim'].map(k => `<a href="#" aria-label="Instagram"><img src="${img(PH[k], 400, 400)}" alt="" loading="lazy"></a>`).join('');
  // slide track duplicate for seamless marquee
  const track = $('.strip-track'); if (track) track.innerHTML += track.innerHTML;
}

/* PRODUCT DETAIL */
function initProduct() {
  const p = byId(params.get('id')) || PRODUCTS[0];
  document.title = `${p.name} — Nano Kids`;
  $('#crumb').innerHTML = `<span><a href="index.html">Home</a></span><span><a href="shop.html">Shop</a></span><span><a href="shop.html?cat=${p.cat}">${catLabel(p.cat)}</a></span><span>${p.name}`;
  $('#pdpThumbs').innerHTML = p.gallery.map((g, i) => `<button class="thumb ${i ? '' : 'is-on'}" data-i="${i}" aria-label="View image ${i + 1}"><img src="${g.replace('w=1000&h=1250', 'w=200&h=250')}" alt=""></button>`).join('');
  const main = $('#pdpMain'), mi = $('img', main);
  mi.src = p.gallery[0]; mi.alt = p.name;
  if (p.tag) main.insertAdjacentHTML('afterbegin', `<span class="pcard-tag">${p.tag}</span>`);
  $('#pdpThumbs').addEventListener('click', e => {
    const t = e.target.closest('.thumb'); if (!t) return;
    $$('.thumb').forEach(x => x.classList.remove('is-on')); t.classList.add('is-on');
    mi.style.opacity = 0; setTimeout(() => { mi.src = p.gallery[t.dataset.i]; mi.style.opacity = 1; }, 220);
  });
  // hover zoom (desktop)
  main.addEventListener('mousemove', e => { if (innerWidth < 981) return; const r = main.getBoundingClientRect(); main.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%'); main.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%'); main.classList.add('zoom'); });
  main.addEventListener('mouseleave', () => main.classList.remove('zoom'));

  $('#pdpEyebrow').textContent = `${catLabel(p.cat)} · ${p.ages.map(a => labelOf(AGES, a)).join(' / ')}`;
  $('#pdpTitle').textContent = p.name;
  $('#pdpPrice').innerHTML = (p.old ? `<s>${fmt(p.old)}</s>` : '') + `<span>${fmt(p.price)}</span>`;
  $('#pdpRating').innerHTML = starRow() + `<span>${p.rating.toFixed(1)} · ${p.reviews} reviews</span>`;
  $('#pdpDesc').textContent = p.desc;
  $('#pdpOptions').innerHTML = optionsHTML(p);
  bindOptions($('#pdpOptions'));
  const wb = $('#pdpWish'); wb.dataset.id = p.id; wb.classList.toggle('is-on', wish.includes(p.id));
  wb.addEventListener('click', () => { const on = toggleWish(p.id); wb.classList.toggle('is-on', on); toast(on ? 'Saved to your wishlist' : 'Removed from wishlist'); });
  $('#pdpQty').innerHTML = qtyInput();
  const add = () => {
    const s = readSelection($('.pdp-info'), p);
    if (!s.size) { toast('Please choose a size'); $('#pdpOptions [data-sizes]').animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
    addToCart({ id: p.id, name: p.name, price: p.price, img: p.img, size: s.size, color: s.color, qty: s.qty });
    openCart();
  };
  $('#pdpAdd').addEventListener('click', add);
  // sticky mobile buy bar
  const sb = $('#stickyBuy'); sb.innerHTML = `<div><small class="muted">${p.name}</small><br><b>${fmt(p.price)}</b></div><button class="btn">Add to bag</button>`;
  $('button', sb).addEventListener('click', add);
  new IntersectionObserver(([en]) => sb.classList.toggle('show', !en.isIntersecting && en.boundingClientRect.top < 0), { threshold: 0 }).observe($('#pdpAdd'));
  // accordion
  $('#accDesc').textContent = p.desc + ' Designed in Lahore and finished with care, every piece is cut generously so it lasts beyond a single season.';
  // related
  const rel = PRODUCTS.filter(x => x.id !== p.id && (x.cat === p.cat || x.ages.some(a => p.ages.includes(a)))).slice(0, 4);
  $('#related').innerHTML = rel.map((x, i) => cardHTML(x, i * .08)).join('');
}

/* CART PAGE */
function initCart() {
  let promo = store.get('nk_promo', null);
  const root = $('#cartRoot');
  const render = () => {
    if (!cart.length) {
      root.innerHTML = `<div class="cart-empty wrap">${ico('bag')}<h2>Your bag is <em>empty</em></h2><p>Looks like you haven't chosen anything yet.</p><a class="btn" href="shop.html">Continue shopping</a></div>`; return;
    }
    const sub = cartSub(), disc = promo ? sub * .1 : 0, ship = shipping(sub - disc), total = sub - disc + ship, left = Math.max(0, FREE_SHIP - sub);
    root.innerHTML = `<div class="wrap cart-layout">
      <div><div class="cart-head"><span>Product</span><span>Quantity</span><span>Price</span><span>Total</span></div>
      ${cart.map(i => `<div class="cart-row"><div class="cart-prod"><img src="${i.img}" alt=""><div><h4>${i.name}</h4><p>${itemMeta(i)}</p><button class="rm" data-remove="${i.key}">Remove</button></div></div>
        ${qtyHTML(i)}<span>${fmt(i.price)}</span><b>${fmt(i.price * i.qty)}</b></div>`).join('')}
        <div class="cart-note-wrap field"><label for="note">Order note</label><textarea id="note" placeholder="Gift message or delivery instructions"></textarea></div></div>
      <aside class="summary-card"><h3>Order summary</h3>
        <div class="ship-progress">${left > 0 ? `You're <b>${fmt(left)}</b> away from complimentary delivery` : `Your order qualifies for <b>complimentary delivery</b>`}<div class="ship-bar" style="--p:${Math.min(100, sub / FREE_SHIP * 100)}%"><i></i></div></div>
        <div class="s-line"><span>Subtotal</span><span>${fmt(sub)}</span></div>
        ${promo ? `<div class="s-line"><span>Promo NANO10</span><span>– ${fmt(disc)}</span></div>` : ''}
        <div class="s-line"><span>Delivery</span><span>${ship ? fmt(ship) : 'Free'}</span></div>
        <div class="promo"><input type="text" id="promoIn" placeholder="Promo code (try NANO10)" aria-label="Promo code"><button class="btn btn--sm" id="promoBtn">Apply</button></div>
        <div class="promo-msg" id="promoMsg" style="color:${promo ? 'var(--ok)' : 'var(--muted)'}">${promo ? 'Code applied — 10% off.' : ''}</div>
        <div class="s-line total"><span>Total</span><b>${fmt(total)}</b></div>
        <a class="btn btn--block" href="checkout.html" style="margin-top:22px">Proceed to checkout</a>
        <p class="muted" style="font-size:.76rem;text-align:center;margin:14px 0 0">Cash on delivery · Easy 14-day returns</p></aside></div>`;
    $('#promoBtn')?.addEventListener('click', () => {
      const v = $('#promoIn').value.trim().toUpperCase();
      if (v === 'NANO10') { promo = true; store.set('nk_promo', true); render(); }
      else { const m = $('#promoMsg'); m.style.color = 'var(--accent)'; m.textContent = 'Sorry, that code isn’t valid.'; }
    });
  };
  render(); window.addEventListener('nk:cart', render);
}

/* CHECKOUT */
function initCheckout() {
  const items = $('#coItems'), sumEl = $('#coSummary');
  const render = () => {
    const sub = cartSub(), disc = store.get('nk_promo', false) ? sub * .1 : 0;
    const method = $('input[name=ship]:checked')?.value || 'standard';
    const ship = shipping(sub - disc) + (method === 'express' ? 450 : 0);
    items.innerHTML = cart.length ? cart.map(i => `<div class="co-item"><div class="im"><img src="${i.img}" alt=""><b>${i.qty}</b></div><div><h5>${i.name}</h5><small>${itemMeta(i)}</small></div><span>${fmt(i.price * i.qty)}</span></div>`).join('')
      : `<p class="muted">Your bag is empty. <a class="link" href="shop.html">Continue shopping</a></p>`;
    sumEl.innerHTML = `<div class="s-line"><span>Subtotal</span><span>${fmt(sub)}</span></div>${disc ? `<div class="s-line"><span>Promo NANO10</span><span>– ${fmt(disc)}</span></div>` : ''}
      <div class="s-line"><span>Delivery</span><span>${ship ? fmt(ship) : 'Free'}</span></div><div class="s-line total"><span>Total</span><b>${fmt(sub - disc + ship)}</b></div>`;
  };
  render(); $$('input[name=ship]').forEach(r => r.addEventListener('change', render));
  // payment option highlight
  const payRadios = $$('input[name=pay]');
  const syncPay = () => $$('.pay-opt').forEach(o => o.classList.toggle('is-on', $('input', o).checked));
  $$('input[name=pay], input[name=ship]').forEach(r => r.addEventListener('change', syncPay)); syncPay();
  $('#checkoutForm').addEventListener('submit', e => {
    e.preventDefault(); if (!e.target.reportValidity()) return;
    if (!cart.length) { toast('Your bag is empty'); return; }
    $('#orderNo').textContent = 'NK-' + Math.floor(100000 + Math.random() * 900000);
    $('#checkoutWrap').style.display = 'none'; $('#orderDone').classList.add('show'); window.scrollTo({ top: 0, behavior: 'smooth' });
    cart = []; store.set('nk_promo', false); saveCart();
  });
}

/* BOOT -------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  mountLayout(); initSearch(); initForms();
  ({ home: initHome, product: initProduct, cart: initCart, checkout: initCheckout }[page] || (() => {}))();
  initAccordions(); initReveal();
});
})();
