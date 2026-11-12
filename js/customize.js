/* ==========================================================================
   NANO KIDS — "Design Your Own" studio
   Step accordion  ·  live SVG preview  ·  price summary  ·  cart / quote
   ========================================================================== */
(() => {
'use strict';
const { $, $$, fmt, ico } = NK;

/* --- Config ----------------------------------------------------------------- */
const GARMENTS = {
  tee:    { label: 'T-shirt',      base: 1800, note: 'from Rs. 1,800' },
  sweat:  { label: 'Sweatshirt',   base: 3400, note: 'from Rs. 3,400' },
  dress:  { label: 'Frock',        base: 3600, note: 'from Rs. 3,600' },
  kurta:  { label: 'Kurta',        base: 4200, note: 'from Rs. 4,200' }
};
const FABRICS = {
  jersey: { label: 'Combed cotton jersey', note: 'Soft, breathable, everyday', add: 0 },
  fleece: { label: 'Brushed cotton fleece', note: 'Warm, plush inside, for winter', add: 600 },
  linen:  { label: 'Linen-cotton blend', note: 'Airy and textured, for summer', add: 500 },
  lawn:   { label: 'Cotton lawn', note: 'Fine and crisp, ideal for festive wear', add: 400 }
};
const FONTS = {
  classic: { label: 'Classic', css: "'Cormorant Garamond', serif", style: 'italic', weight: 500 },
  modern:  { label: 'Modern', css: "'Manrope', sans-serif", style: 'normal', weight: 700 },
  hand:    { label: 'Handwritten', css: "'Caveat', cursive", style: 'normal', weight: 600 },
  playful: { label: 'Playful', css: "'Fraunces', serif", style: 'normal', weight: 600 }
};
const PLACES = { centre: 'Centre chest', left: 'Left chest', lower: 'Lower front', back: 'Back' };
const GARMENT_COLORS = ['ivory', 'sand', 'terracotta', 'olive', 'sage', 'navy', 'charcoal', 'rose', 'mustard', 'denim', 'brick'];
const TEXT_COLORS = ['ivory', 'charcoal', 'terracotta', 'navy', 'mustard', 'olive'];
const TEXT_FEE = 450, ART_FEE = 650;

/* Garment outlines. n = neckline depth (front vs back) */
const PATHS = {
  tee:   n => `M130 40 L88 56 L32 112 L68 152 L100 130 L100 384 Q100 394 110 394 L290 394 Q300 394 300 384 L300 130 L332 152 L368 112 L312 56 L270 40 Q200 ${n} 130 40 Z`,
  sweat: n => `M130 40 L92 56 Q50 80 38 130 L24 318 Q24 328 34 330 L70 334 Q80 334 82 324 L100 190 L100 372 Q100 384 112 384 L288 384 Q300 384 300 372 L300 190 L318 324 Q320 334 330 334 L366 330 Q376 328 376 318 L362 130 Q350 80 308 56 L270 40 Q200 ${n} 130 40 Z`,
  dress: n => `M150 30 Q200 ${n} 250 30 L292 48 L324 94 L298 114 L284 102 L282 190 L352 400 Q200 424 48 400 L118 190 L116 102 L102 114 L76 94 L108 48 Z`,
  kurta: n => `M140 34 Q200 ${n} 260 34 L300 50 L350 100 L318 140 L298 120 L296 410 L104 410 L102 120 L82 140 L50 100 L100 50 Z`
};
const NECK = { tee: [100, 58], sweat: [100, 58], dress: [76, 46], kurta: [86, 58] };
const NECK_X = { tee: [130, 270, 40], sweat: [130, 270, 40], dress: [150, 250, 30], kurta: [140, 260, 34] };
const DETAILS = {
  tee: v => `<path d="M100 384 H300" class="st"/><path d="M68 152 L100 130 M332 152 L300 130" class="st"/>`,
  sweat: v => `<path d="M100 364 H300" class="st-solid"/><path d="M26 306 L76 313 M374 306 L324 313" class="st-solid"/><path d="M100 190 L100 372 M300 190 L300 372" class="st" opacity="0"/>`,
  dress: v => `<path d="M118 190 H282" class="st"/><path d="M60 392 Q200 414 340 392" class="st"/>${v === 'back' ? '<path d="M200 60 V190" class="st"/><circle cx="200" cy="76" r="2.6" class="btn-dot"/><circle cx="200" cy="104" r="2.6" class="btn-dot"/><circle cx="200" cy="132" r="2.6" class="btn-dot"/>' : ''}`,
  kurta: v => v === 'back' ? `<path d="M104 396 H296" class="st"/>` : `<path d="M200 76 V196" class="st-solid"/><path d="M194 76 V196" class="st" opacity=".6"/>${[98, 126, 154, 182].map(y => `<circle cx="200" cy="${y}" r="2.8" class="btn-dot"/>`).join('')}<path d="M104 396 H296" class="st"/>`
};
/* Where text/art sit on each garment: [x,y] per placement */
const ANCHORS = {
  tee:   { centre: [200, 205], left: [262, 156], lower: [200, 335], back: [200, 175] },
  sweat: { centre: [200, 205], left: [262, 156], lower: [200, 325], back: [200, 175] },
  dress: { centre: [200, 150], left: [252, 124], lower: [200, 345], back: [200, 140] },
  kurta: { centre: [200, 268], left: [262, 176], lower: [200, 354], back: [200, 205] }
};
const MOTIFS = {
  star:  '<path d="M0 -30 L8 -9 L30 -9 L12 5 L19 27 L0 14 L-19 27 L-12 5 L-30 -9 L-8 -9 Z"/>',
  moon:  '<path d="M14 -26 A28 28 0 1 0 14 26 A22 22 0 0 1 14 -26 Z"/>',
  sun:   '<circle r="13"/><path d="M0 -30 V-21 M0 30 V21 M-30 0 H-21 M30 0 H21 M-21 -21 L-15 -15 M21 21 L15 15 M-21 21 L-15 15 M21 -21 L15 -15"/>',
  heart: '<path d="M0 26 C-34 4 -26 -26 -8 -20 C-3 -18 0 -14 0 -10 C0 -14 3 -18 8 -20 C26 -26 34 4 0 26 Z"/>'
};

/* --- State ------------------------------------------------------------------- */
const S = { garment: 'tee', size: '4-5y', fabric: 'jersey', color: 'terracotta', text: 'Zayan', font: 'classic', textColor: 'ivory', textSize: 32,
  textPlace: 'centre', manualText: false, art: null /* {type:'upload',src,name} | {type:'motif',key} */, artPlace: 'lower', artSize: 70, view: 'front', qty: 1, open: 0, done: new Set() };

const STEPS = [
  { id: 'garment', title: 'Choose a garment', sub: 'Four timeless silhouettes' },
  { id: 'size', title: 'Age & size', sub: 'Newborn to 14 years' },
  { id: 'fabric', title: 'Fabric', sub: 'Pick a feel for the season' },
  { id: 'color', title: 'Colour', sub: 'Eleven considered shades' },
  { id: 'personalise', title: 'Name & artwork', sub: 'Lettering, logo or motif' },
  { id: 'placement', title: 'Placement', sub: 'Where each detail sits' }
];

/* relative luminance of a #hex colour (0–1), used to pick readable lettering */
const luminance = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255); return .2126 * r + .7152 * g + .0722 * b; };

/* --- Build step UI ---------------------------------------------------------- */
const miniGarment = k => `<svg viewBox="0 0 400 440" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"><path d="${PATHS[k](NECK[k][0])}"/></svg>`;
const placeIcon = (p) => {
  const [x, y] = ANCHORS.tee[p === 'back' ? 'back' : p], b = p === 'back';
  return `<svg viewBox="0 0 400 440" fill="none" stroke="currentColor" stroke-width="14" stroke-linejoin="round"><path d="${PATHS.tee(b ? NECK.tee[1] : NECK.tee[0])}"/><circle cx="${x}" cy="${y}" r="${p === 'left' ? 22 : 34}" fill="var(--accent)" stroke="none"/></svg>`;
};
function stepBody(id) {
  switch (id) {
    case 'garment': return `<div class="opt-cards">${Object.entries(GARMENTS).map(([k, g]) => `<button class="opt-card" data-garment="${k}">${miniGarment(k)}<b>${g.label}</b><small>${g.note}</small></button>`).join('')}</div>`;
    case 'size': return `<p class="muted" style="margin:0 0 14px">Choose the age size. Not sure? <a class="link" href="#" data-size-guide>Open size guide</a></p>
      <div class="chips">${ALL_SIZES.map(s => `<button class="chip" data-size="${s}">${s}</button>`).join('')}</div>`;
    case 'fabric': return `<div class="fabric-list">${Object.entries(FABRICS).map(([k, f]) => `<button class="fabric" data-fabric="${k}"><span class="dot"></span><span><b>${f.label}</b><small>${f.note}</small></span><span class="pr">${f.add ? '+ ' + fmt(f.add) : 'Included'}</span></button>`).join('')}</div>`;
    case 'color': return `<div class="swatches">${GARMENT_COLORS.map(k => `<button class="swatch swatch--lg" data-gcolor="${k}" style="--c:${COLORS[k].h}" aria-label="${COLORS[k].n}" title="${COLORS[k].n}"></button>`).join('')}</div><p class="muted" style="margin:16px 0 0" id="colorName"></p>`;
    case 'personalise': return `
      <p class="field-label sub-label">Name or message</p>
      <div class="field"><input type="text" id="txtIn" maxlength="14" placeholder="e.g. Zayan" aria-label="Name or message"><small class="muted" style="font-size:.74rem">Up to 14 characters · embroidered + ${fmt(TEXT_FEE)}</small></div>
      <p class="field-label sub-label">Lettering</p>
      <div class="font-grid">${Object.entries(FONTS).map(([k, f]) => `<button class="font-opt" data-font="${k}" style="font-family:${f.css};font-style:${f.style};font-weight:${f.weight}">Nano Kids<small>${f.label}</small></button>`).join('')}</div>
      <p class="field-label sub-label">Lettering colour</p>
      <div class="swatches">${TEXT_COLORS.map(k => `<button class="swatch" data-tcolor="${k}" style="--c:${COLORS[k].h}" aria-label="${COLORS[k].n}" title="${COLORS[k].n}"></button>`).join('')}</div>
      <p class="field-label sub-label">Lettering size</p>
      <div class="range-row"><input type="range" id="txtSize" min="18" max="46" value="${S.textSize}" aria-label="Lettering size"><span id="txtSizeV"></span></div>
      <hr class="hairline" style="margin:30px 0 4px">
      <p class="field-label sub-label">Artwork · + ${fmt(ART_FEE)}</p>
      <label class="upload"><input type="file" id="artIn" accept="image/png,image/jpeg,image/svg+xml,image/webp">${ico('upload')}<b>Upload a logo or drawing</b><small>PNG, JPG or SVG · up to 5 MB · preview only, we confirm before printing</small></label>
      <div class="upload-file" id="artFile"><img alt=""><span></span><button type="button" id="artRm">Remove</button></div>
      <p class="field-label sub-label">…or choose a motif</p>
      <div class="chips" id="motifs">${Object.keys(MOTIFS).map(k => `<button class="chip" data-motif="${k}" style="text-transform:capitalize">${k}</button>`).join('')}</div>
      <p class="field-label sub-label" id="artSizeLbl">Artwork size</p>
      <div class="range-row"><input type="range" id="artSize" min="36" max="120" value="${S.artSize}" aria-label="Artwork size"><span id="artSizeV"></span></div>`;
    case 'placement': return `
      <p class="field-label sub-label">Name placement</p><div class="placement" data-place="text">${Object.entries(PLACES).map(([k, l]) => `<button class="place-opt" data-p="${k}">${placeIcon(k)}${l}</button>`).join('')}</div>
      <p class="field-label sub-label">Artwork placement</p><div class="placement" data-place="art">${Object.entries(PLACES).map(([k, l]) => `<button class="place-opt" data-p="${k}">${placeIcon(k)}${l}</button>`).join('')}</div>
      <p class="muted" style="font-size:.8rem;margin:18px 0 0">When both sit in the same spot, the artwork is placed above the name.</p>`;
  }
}
function buildSteps() {
  $('#steps').innerHTML = STEPS.map((s, i) => `<div class="step" data-step="${i}">
    <button class="step-head" aria-expanded="false"><span class="step-no">0${i + 1}</span><span><h3>${s.title}</h3><small>${s.sub}</small></span><span class="step-state"><span data-state></span>${ico('plus')}</span></button>
    <div class="step-body"><div class="step-inner">${stepBody(s.id)}
      <div class="step-actions">${i ? '<button class="btn btn--ghost btn--sm" data-prev>Back</button>' : ''}${i < STEPS.length - 1 ? '<button class="btn btn--sm" data-next>Continue</button>' : '<button class="btn btn--sm" data-finish>Review &amp; order</button>'}</div>
    </div></div></div>`).join('');
}
function openStep(i) {
  S.open = i;
  $$('.step').forEach((el, k) => {
    const on = k === i, b = $('.step-body', el);
    el.classList.toggle('is-open', on); $('.step-head', el).setAttribute('aria-expanded', on);
    b.style.maxHeight = on ? b.scrollHeight + 'px' : 0;
  });
}
const refreshHeights = () => { const el = $('.step.is-open .step-body'); if (el) el.style.maxHeight = el.scrollHeight + 'px'; };

/* --- Preview SVG -------------------------------------------------------------- */
function svgFor(view = 'front', withUpload = true) {
  const g = S.garment, n = NECK[g][view === 'back' ? 1 : 0], fill = COLORS[S.color].h;
  const [nx1, nx2, ny] = NECK_X[g];
  const collar = `M${nx1} ${ny} Q200 ${n} ${nx2} ${ny}`;
  const innerBack = view === 'front' ? `<path d="M${nx1} ${ny} Q200 ${NECK[g][1] + 6} ${nx2} ${ny} Q200 ${n} ${nx1} ${ny} Z" fill="rgba(0,0,0,.18)"/>` : '';
  const pat = { linen: 'url(#pLinen)', fleece: 'url(#pFleece)', lawn: 'url(#pLawn)' }[S.fabric];
  const tcol = COLORS[S.textColor].h;
  const same = S.textPlace === S.artPlace;
  const placeOn = p => (p === 'back') === (view === 'back');
  let out = '';
  // artwork
  if (S.art && placeOn(S.artPlace)) {
    let [x, y] = ANCHORS[g][S.artPlace]; if (same && S.text) y -= 26;
    const k = S.artPlace === 'left' ? .6 : 1, sz = S.artSize * k;
    if (S.art.type === 'upload') { if (withUpload) out += `<image href="${S.art.src}" x="${x - sz / 2}" y="${y - sz / 2}" width="${sz}" height="${sz}" preserveAspectRatio="xMidYMid meet"/>`; }
    else out += `<g transform="translate(${x} ${y}) scale(${sz / 70})" fill="none" stroke="${tcol}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${MOTIFS[S.art.key]}</g>`;
  }
  // text
  if (S.text && placeOn(S.textPlace)) {
    let [x, y] = ANCHORS[g][S.textPlace]; if (same && S.art) y += 50;
    const f = FONTS[S.font], k = S.textPlace === 'left' ? .55 : 1;
    out += `<text x="${x}" y="${y}" text-anchor="middle" font-family="${f.css.replace(/'/g, '')}" font-style="${f.style}" font-weight="${f.weight}" font-size="${S.textSize * k}" fill="${tcol}" style="paint-order:stroke" stroke="rgba(0,0,0,.14)" stroke-width=".6">${S.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`;
  }
  return `<defs>
      <pattern id="pLinen" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3H6M3 0V6" stroke="rgba(0,0,0,.09)" stroke-width=".7"/></pattern>
      <pattern id="pFleece" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".7" fill="rgba(255,255,255,.28)"/><circle cx="4" cy="4" r=".7" fill="rgba(0,0,0,.08)"/></pattern>
      <pattern id="pLawn" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 2H4" stroke="rgba(0,0,0,.06)" stroke-width=".6"/></pattern>
      <linearGradient id="shade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".28" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
      <style>.st{fill:none;stroke:rgba(0,0,0,.28);stroke-width:1.2;stroke-dasharray:4 3}.st-solid{fill:none;stroke:rgba(0,0,0,.22);stroke-width:1.4}.btn-dot{fill:rgba(0,0,0,.35)}</style>
    </defs>
    <ellipse cx="200" cy="425" rx="130" ry="9" fill="rgba(60,40,20,.12)"/>
    <path class="garment-fill" d="${PATHS[g](n)}" fill="${fill}" stroke="rgba(0,0,0,.12)" stroke-width="1.2" stroke-linejoin="round"/>
    ${pat ? `<path d="${PATHS[g](n)}" fill="${pat}"/>` : ''}
    <path d="${PATHS[g](n)}" fill="url(#shade)"/>
    ${innerBack}
    <path d="${collar}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="${g === 'sweat' ? 12 : 8}" stroke-linecap="round"/>
    ${DETAILS[g](view)}
    ${out}`;
}
function renderPreview() {
  $('#previewSvg').innerHTML = svgFor(S.view);
  $$('[data-view]').forEach(b => b.classList.toggle('is-on', b.dataset.view === S.view));
}

/* --- Pricing & summary -------------------------------------------------------- */
function unitPrice() {
  let p = GARMENTS[S.garment].base + FABRICS[S.fabric].add;
  if (['9-10y', '11-12y', '13-14y'].includes(S.size)) p += 300;
  if (S.text.trim()) p += TEXT_FEE;
  if (S.art) p += ART_FEE;
  return p;
}
const discount = q => q >= 10 ? .15 : q >= 5 ? .10 : 0;
function summaryLines() {
  const L = [['Garment', GARMENTS[S.garment].label], ['Size', S.size], ['Fabric', FABRICS[S.fabric].label + (FABRICS[S.fabric].add ? ` (+${fmt(FABRICS[S.fabric].add)})` : '')], ['Colour', COLORS[S.color].n]];
  L.push(['Name', S.text.trim() ? `“${S.text.trim()}” · ${FONTS[S.font].label} · ${PLACES[S.textPlace]}` : 'None']);
  L.push(['Artwork', S.art ? `${S.art.type === 'upload' ? 'Uploaded file' : 'Motif: ' + S.art.key} · ${PLACES[S.artPlace]}` : 'None']);
  return L;
}
function renderSummary() {
  const unit = unitPrice(), d = discount(S.qty), total = unit * S.qty * (1 - d);
  $('#sumLines').innerHTML = summaryLines().map(([a, b]) => `<div class="sum-line"><span>${a}</span><span>${b}</span></div>`).join('') +
    `<div class="sum-line"><span>Price per piece</span><span>${fmt(unit)}</span></div>` + (d ? `<div class="sum-line"><span>Quantity discount</span><span>– ${d * 100}%</span></div>` : '');
  $('#sumTotal').textContent = fmt(total);
  $('#sumQty').value = S.qty;
  $('#sumHint').textContent = S.qty < 5 ? 'Order 5+ pieces and save 10% · 10+ saves 15%' : `${d * 100}% quantity discount applied`;
}

/* --- Sync controls with state ---------------------------------------------------- */
function syncUI() {
  $$('[data-garment]').forEach(b => b.classList.toggle('is-on', b.dataset.garment === S.garment));
  $$('[data-size]').forEach(b => b.classList.toggle('is-on', b.dataset.size === S.size));
  $$('[data-fabric]').forEach(b => b.classList.toggle('is-on', b.dataset.fabric === S.fabric));
  $$('[data-gcolor]').forEach(b => b.classList.toggle('is-on', b.dataset.gcolor === S.color));
  $('#colorName').textContent = 'Selected: ' + COLORS[S.color].n;
  $$('[data-font]').forEach(b => b.classList.toggle('is-on', b.dataset.font === S.font));
  $$('[data-tcolor]').forEach(b => b.classList.toggle('is-on', b.dataset.tcolor === S.textColor));
  $$('[data-motif]').forEach(b => b.classList.toggle('is-on', S.art?.type === 'motif' && S.art.key === b.dataset.motif));
  $$('[data-place="text"] .place-opt').forEach(b => b.classList.toggle('is-on', b.dataset.p === S.textPlace));
  $$('[data-place="art"] .place-opt').forEach(b => b.classList.toggle('is-on', b.dataset.p === S.artPlace));
  $('#txtSizeV').textContent = S.textSize + ' pt'; $('#artSizeV').textContent = S.artSize + ' px';
  // state labels on step heads
  const lbl = [GARMENTS[S.garment].label, S.size, FABRICS[S.fabric].label.split(' ')[0] + ' ' + (FABRICS[S.fabric].label.split(' ')[1] || ''), COLORS[S.color].n, S.text.trim() || (S.art ? 'Artwork' : '—'), PLACES[S.textPlace]];
  $$('.step').forEach((el, i) => $('[data-state]', el).textContent = (S.done.has(i) || i === 0) ? lbl[i] : '');
  renderPreview(); renderSummary(); refreshHeights();
}

/* --- Events -------------------------------------------------------------------------- */
function bind() {
  const root = $('#steps');
  root.addEventListener('click', e => {
    const t = e.target.closest('button, label'); if (!t) return;
    const step = t.closest('.step');
    if (t.matches('.step-head')) return openStep(Number(step.dataset.step) === S.open ? -1 : Number(step.dataset.step));
    if (t.matches('[data-next]')) { S.done.add(S.open); syncUI(); openStep(S.open + 1); return step.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (t.matches('[data-prev]')) return openStep(S.open - 1);
    if (t.matches('[data-finish]')) { S.done.add(S.open); syncUI(); return $('.summary').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (t.dataset.garment) S.garment = t.dataset.garment;
    else if (t.dataset.size) S.size = t.dataset.size;
    else if (t.dataset.fabric) S.fabric = t.dataset.fabric;
    else if (t.dataset.gcolor) { S.color = t.dataset.gcolor; if (!S.manualText) S.textColor = luminance(COLORS[S.color].h) > .6 ? 'charcoal' : 'ivory'; }
    else if (t.dataset.font) S.font = t.dataset.font;
    else if (t.dataset.tcolor) { S.textColor = t.dataset.tcolor; S.manualText = true; }
    else if (t.dataset.motif) S.art = (S.art?.type === 'motif' && S.art.key === t.dataset.motif) ? null : { type: 'motif', key: t.dataset.motif };
    else if (t.closest('[data-place]') && t.dataset.p) {
      const which = t.closest('[data-place]').dataset.place; S[which === 'text' ? 'textPlace' : 'artPlace'] = t.dataset.p;
      S.view = t.dataset.p === 'back' ? 'back' : 'front';
    } else return;
    syncUI();
  });
  $('#txtIn').addEventListener('input', e => { S.text = e.target.value; syncUI(); });
  $('#txtSize').addEventListener('input', e => { S.textSize = Number(e.target.value); syncUI(); });
  $('#artSize').addEventListener('input', e => { S.artSize = Number(e.target.value); syncUI(); });
  $('#artIn').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 5 * 1024 * 1024) { NK.toast('Please choose a file under 5 MB'); return; }
    const r = new FileReader();
    r.onload = () => { S.art = { type: 'upload', src: r.result, name: f.name }; const box = $('#artFile'); box.classList.add('show'); $('img', box).src = r.result; $('span', box).textContent = f.name; syncUI(); };
    r.readAsDataURL(f);
  });
  $('#artRm').addEventListener('click', () => { S.art = null; $('#artFile').classList.remove('show'); $('#artIn').value = ''; syncUI(); });
  $$('[data-view]').forEach(b => b.addEventListener('click', () => { S.view = b.dataset.view; renderPreview(); }));
  $('#sumQty').closest('.qty').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    S.qty = Math.max(1, Math.min(50, S.qty + Number(b.dataset.q))); renderSummary();
  });
  $('#addCustom').addEventListener('click', () => {
    const unit = unitPrice(), d = discount(S.qty);
    const thumb = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440" width="400" height="440"><rect width="400" height="440" fill="#E9E1D5"/>${svgFor('front', false)}</svg>`);
    NK.cart.add({ key: 'custom-' + Date.now(), id: 0, name: `Custom ${GARMENTS[S.garment].label}`, price: Math.round(unit * (1 - d)), img: thumb, qty: S.qty,
      custom: [`Size ${S.size}`, FABRICS[S.fabric].label, COLORS[S.color].n, S.text.trim() ? `“${S.text.trim()}”` : null, S.art ? 'Artwork' : null].filter(Boolean) });
    NK.openCart();
  });
  $('#quoteBtn').addEventListener('click', () => {
    $('#quoteSummary').innerHTML = summaryLines().map(([a, b]) => `<div class="sum-line"><span>${a}</span><span>${b}</span></div>`).join('') + `<div class="sum-line"><span>Estimate</span><span>${$('#sumTotal').textContent}</span></div>`;
    NK.openModal($('#quoteModal'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildSteps(); bind(); $('#txtIn').value = S.text; syncUI(); openStep(0);
  // wait for webfonts so heights are right
  if (document.fonts) document.fonts.ready.then(refreshHeights);
});
})();
