/* ==========================================================================
   NANO KIDS — shop page: filtering, sorting, view toggle, pagination
   ========================================================================== */
(() => {
'use strict';
const { $, $$, fmt, ico, cardHTML } = NK;
const PAGE_SIZE = 12;
const MAXP = Math.max(...PRODUCTS.map(p => p.price)), MINP = Math.min(...PRODUCTS.map(p => p.price));
const params = new URLSearchParams(location.search);
const list = k => (params.get(k) || '').split(',').filter(Boolean);

/* Filter state — seeded from the URL so category/age tiles deep-link here */
const state = {
  age: list('age'), season: list('season'), cat: list('cat'), size: list('size'), color: list('color'),
  gender: params.get('gender') || '', q: params.get('q') || '', sort: params.get('sort') || 'featured',
  min: Number(params.get('min')) || 0, max: Number(params.get('max')) || MAXP, wishlist: params.get('wishlist') === '1',
  shown: PAGE_SIZE, view: 'grid'
};

/* --- Build filter panel ---------------------------------------------------- */
const GROUPS = [
  { id: 'age',    title: 'Age',      items: AGES.map(a => ({ v: a.key, l: `${a.label} <span class="muted">${a.range}</span>` })) },
  { id: 'season', title: 'Season',   items: SEASONS.map(s => ({ v: s.key, l: s.label })) },
  { id: 'cat',    title: 'Category', items: CATS.map(c => ({ v: c.key, l: c.label })) }
];
const countFor = (g, v) => PRODUCTS.filter(p => g === 'age' ? p.ages.includes(v) : g === 'season' ? p.seasons.includes(v) : p.cat === v).length;

function buildFilters() {
  const el = $('#filters');
  const checks = g => `<div class="fg-inner">${g.items.map(i => `<label class="check"><input type="checkbox" data-f="${g.id}" value="${i.v}"><span class="box"></span><span>${i.l}</span><span class="count">${countFor(g.id, i.v)}</span></label>`).join('')}</div>`;
  const grp = (id, title, inner, open = true) => `<div class="filter-group"><button class="fg-btn" aria-expanded="${open}" data-fg>${title}${ico('down')}</button><div class="fg-body" ${open ? '' : 'style="max-height:0"'}>${inner}</div></div>`;
  el.innerHTML = `<div class="filter-head"><h3>Filters</h3><button class="link" id="clearAll" style="font-size:.66rem">Clear all</button></div>
    ${GROUPS.map(g => grp(g.id, g.title, checks(g))).join('')}
    ${grp('gender', 'Gender', `<div class="fg-inner">${[['', 'All'], ['girls', 'Girls'], ['boys', 'Boys']].map(([v, l]) => `<label class="check radio"><input type="radio" name="gender" data-f="gender" value="${v}"><span class="box"></span><span>${l}</span></label>`).join('')}</div>`)}
    ${grp('size', 'Size', `<div class="fg-inner"><div class="chips">${ALL_SIZES.map(s => `<button class="chip" data-size="${s}">${s}</button>`).join('')}</div></div>`, false)}
    ${grp('color', 'Colour', `<div class="fg-inner"><div class="swatches">${Object.entries(COLORS).map(([k, c]) => `<button class="swatch" data-color="${k}" style="--c:${c.h}" title="${c.n}" aria-label="${c.n}"></button>`).join('')}</div></div>`)}
    ${grp('price', 'Price', `<div class="fg-inner"><input type="range" id="priceRange" min="${Math.floor(MINP / 100) * 100}" max="${MAXP}" step="100" value="${state.max}" aria-label="Maximum price">
      <div class="price-inputs"><input type="number" id="pMin" aria-label="Minimum price" placeholder="Min"><span>–</span><input type="number" id="pMax" aria-label="Maximum price" placeholder="Max"></div></div>`)}`;
  // heights for open groups
  $$('.fg-body', el).forEach(b => { if (b.style.maxHeight !== '0px') b.style.maxHeight = b.scrollHeight + 'px'; });
  syncControls();
}

/* reflect state in controls */
function syncControls() {
  $$('[data-f]').forEach(i => { i.checked = i.type === 'radio' ? state.gender === i.value : state[i.dataset.f].includes(i.value); });
  $$('[data-size]').forEach(b => b.classList.toggle('is-on', state.size.includes(b.dataset.size)));
  $$('[data-color]', $('#filters')).forEach(b => b.classList.toggle('is-on', state.color.includes(b.dataset.color)));
  $('#pMin').value = state.min || ''; $('#pMax').value = state.max < MAXP ? state.max : ''; $('#priceRange').value = state.max;
  $('#sortSel').value = state.sort;
}

/* --- Filtering ------------------------------------------------------------- */
function filtered() {
  let r = PRODUCTS.filter(p =>
    (!state.age.length    || p.ages.some(a => state.age.includes(a))) &&
    (!state.season.length || p.seasons.some(s => state.season.includes(s))) &&
    (!state.cat.length    || state.cat.includes(p.cat)) &&
    (!state.gender        || p.gender === state.gender || p.gender === 'unisex') &&
    (!state.size.length   || p.sizes.some(s => state.size.includes(s))) &&
    (!state.color.length  || p.colors.some(c => state.color.includes(c))) &&
    p.price >= state.min && p.price <= state.max &&
    (!state.wishlist || NK.wish.get().includes(p.id)) &&
    (!state.q || (p.name + ' ' + CATS.find(c => c.key === p.cat).label + ' ' + p.gender + ' ' + p.desc).toLowerCase().includes(state.q.toLowerCase())));
  const s = state.sort;
  if (s === 'new') r.sort((a, b) => b.id - a.id);
  else if (s === 'price-asc') r.sort((a, b) => a.price - b.price);
  else if (s === 'price-desc') r.sort((a, b) => b.price - a.price);
  else if (s === 'rating') r.sort((a, b) => b.rating - a.rating);
  return r;
}

const lab = (arr, k) => (arr.find(x => x.key === k) || {}).label || k;
function render() {
  const res = filtered(), grid = $('#productGrid');
  $('#resultCount').textContent = `${res.length} ${res.length === 1 ? 'piece' : 'pieces'}`;
  grid.className = 'products' + (state.view === 'list' ? ' is-list' : '');
  grid.innerHTML = res.length ? res.slice(0, state.shown).map((p, i) => cardHTML(p, (i % 4) * .06)).join('')
    : `<div class="empty-state" style="grid-column:1/-1"><h3>Nothing matches just yet</h3><p class="muted">Try removing a filter or two.</p><button class="btn btn--ghost" id="emptyClear">Clear all filters</button></div>`;
  NK.initReveal();
  // load more
  const shown = Math.min(state.shown, res.length);
  $('#loadMore').style.display = res.length > PAGE_SIZE ? '' : 'none';
  $('#loadMore p').textContent = `Showing ${shown} of ${res.length}`;
  $('#loadMore .progress-line').style.setProperty('--p', (res.length ? shown / res.length * 100 : 0) + '%');
  $('#loadMoreBtn').style.display = shown < res.length ? '' : 'none';
  renderChips(); renderTitle(); pushUrl();
}
function renderChips() {
  const chips = [];
  state.age.forEach(v => chips.push(['age', v, lab(AGES, v)])); state.season.forEach(v => chips.push(['season', v, lab(SEASONS, v)]));
  state.cat.forEach(v => chips.push(['cat', v, lab(CATS, v)])); state.size.forEach(v => chips.push(['size', v, 'Size ' + v]));
  state.color.forEach(v => chips.push(['color', v, COLORS[v].n]));
  if (state.gender) chips.push(['gender', state.gender, state.gender[0].toUpperCase() + state.gender.slice(1)]);
  if (state.q) chips.push(['q', '', `“${state.q}”`]);
  if (state.min > 0 || state.max < MAXP) chips.push(['price', '', `${fmt(state.min)} – ${fmt(state.max)}`]);
  if (state.wishlist) chips.push(['wishlist', '', 'Wishlist']);
  $('#activeFilters').innerHTML = chips.length ? chips.map(c => `<button class="af-chip" data-rm="${c[0]}" data-v="${c[1]}">${c[2]} ${ico('close')}</button>`).join('') + `<button class="af-clear" id="afClear">Clear all</button>` : '';
}
function renderTitle() {
  let t = 'All <em>collections</em>', d = 'Every piece, from newborn essentials to junior wardrobes.';
  if (state.wishlist) { t = 'Your <em>wishlist</em>'; d = 'The pieces you have saved.'; }
  else if (state.q) { t = `Results for <em>“${state.q}”</em>`; d = ''; }
  else if (state.age.length === 1 && !state.season.length && !state.cat.length) { const a = AGES.find(x => x.key === state.age[0]); t = `${a.label} <em>${a.range}</em>`; d = 'Sizes ' + a.sizes.join(', ') + '.'; }
  else if (state.season.length === 1 && !state.age.length && !state.cat.length) { const s = SEASONS.find(x => x.key === state.season[0]); t = `${s.label} <em>edit</em>`; d = s.note; }
  else if (state.cat.length === 1 && !state.age.length && !state.season.length) { t = `${lab(CATS, state.cat[0])}`; d = ''; }
  else if (state.sort === 'new' && !Object.values({ a: state.age, s: state.season, c: state.cat }).some(x => x.length)) { t = 'New <em>arrivals</em>'; d = 'The latest pieces to join the collection.'; }
  else if (state.gender && !state.age.length && !state.season.length && !state.cat.length) { t = `${state.gender === 'girls' ? 'Girls' : 'Boys'} <em>wardrobe</em>`; d = ''; }
  else if (state.age.length + state.season.length + state.cat.length + state.size.length + state.color.length > 1 || state.gender) { t = 'Your <em>selection</em>'; d = ''; }
  $('#shopTitle').innerHTML = t; $('#shopDesc').textContent = d; $('#shopDesc').style.display = d ? '' : 'none';
  $('#crumbCur').textContent = $('#shopTitle').textContent;
}
function pushUrl() {
  const p = new URLSearchParams();
  ['age', 'season', 'cat', 'size', 'color'].forEach(k => state[k].length && p.set(k, state[k].join(',')));
  if (state.gender) p.set('gender', state.gender); if (state.q) p.set('q', state.q);
  if (state.sort !== 'featured') p.set('sort', state.sort);
  if (state.min > 0) p.set('min', state.min); if (state.max < MAXP) p.set('max', state.max); if (state.wishlist) p.set('wishlist', '1');
  history.replaceState(null, '', p.toString() ? '?' + p : location.pathname);
}
const update = () => { state.shown = PAGE_SIZE; render(); };
const clearAll = () => { Object.assign(state, { age: [], season: [], cat: [], size: [], color: [], gender: '', q: '', min: 0, max: MAXP, wishlist: false }); syncControls(); update(); };

/* --- Events ----------------------------------------------------------------- */
function bind() {
  const f = $('#filters');
  f.addEventListener('change', e => {
    const t = e.target.closest('[data-f]'); if (!t) return;
    if (t.type === 'radio') state.gender = t.value;
    else { const a = state[t.dataset.f], i = a.indexOf(t.value); i < 0 ? a.push(t.value) : a.splice(i, 1); }
    update();
  });
  f.addEventListener('click', e => {
    const sz = e.target.closest('[data-size]'), co = e.target.closest('[data-color]'), g = e.target.closest('[data-fg]');
    if (sz) { const a = state.size, i = a.indexOf(sz.dataset.size); i < 0 ? a.push(sz.dataset.size) : a.splice(i, 1); sz.classList.toggle('is-on'); update(); }
    if (co) { const a = state.color, i = a.indexOf(co.dataset.color); i < 0 ? a.push(co.dataset.color) : a.splice(i, 1); co.classList.toggle('is-on'); update(); }
    if (g) { const open = g.getAttribute('aria-expanded') === 'true', b = g.nextElementSibling; g.setAttribute('aria-expanded', !open); b.style.maxHeight = open ? 0 : b.scrollHeight + 'px'; }
    if (e.target.closest('#clearAll')) clearAll();
  });
  $('#priceRange').addEventListener('input', e => { state.max = Number(e.target.value); $('#pMax').value = state.max < MAXP ? state.max : ''; update(); });
  const num = () => { state.min = Number($('#pMin').value) || 0; state.max = Number($('#pMax').value) || MAXP; $('#priceRange').value = state.max; update(); };
  $('#pMin').addEventListener('change', num); $('#pMax').addEventListener('change', num);
  $('#sortSel').addEventListener('change', e => { state.sort = e.target.value; update(); });
  $$('.view-toggle button').forEach(b => b.addEventListener('click', () => { state.view = b.dataset.view; $$('.view-toggle button').forEach(x => x.classList.toggle('is-on', x === b)); render(); }));
  $('#loadMoreBtn').addEventListener('click', () => { state.shown += PAGE_SIZE; render(); });
  $('#activeFilters').addEventListener('click', e => {
    if (e.target.closest('#afClear')) return clearAll();
    const c = e.target.closest('.af-chip'); if (!c) return;
    const k = c.dataset.rm, v = c.dataset.v;
    if (['age', 'season', 'cat', 'size', 'color'].includes(k)) state[k] = state[k].filter(x => x !== v);
    else if (k === 'gender') state.gender = ''; else if (k === 'q') state.q = ''; else if (k === 'price') { state.min = 0; state.max = MAXP; } else if (k === 'wishlist') state.wishlist = false;
    syncControls(); update();
  });
  $('#productGrid').addEventListener('click', e => { if (e.target.closest('#emptyClear')) clearAll(); });
  $('#filterOpen').addEventListener('click', () => NK.openPanel($('#filters')));
  $('#filterApply').addEventListener('click', NK.closePanels);
  $('#filterReset').addEventListener('click', clearAll);
  NK.onWishChange = () => { if (state.wishlist) render(); };
}

document.addEventListener('DOMContentLoaded', () => { buildFilters(); bind(); render(); });
})();
