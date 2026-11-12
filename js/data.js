/* ==========================================================================
   Nano Kids — product data (UI prototype; replace with real catalogue / API)
   All photography is hot-linked from Unsplash as placeholder imagery.
   ========================================================================== */

/** Build an Unsplash URL.  opts: {w,h,crop,fx,fy,fz} (fx/fy/fz = focal point + zoom) */
function img(id, w = 800, h = 1000, o = {}) {
  let u = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=${w}&h=${h}`;
  if (o.fz) u += `&crop=focalpoint&fp-x=${o.fx ?? .5}&fp-y=${o.fy ?? .5}&fp-z=${o.fz}`;
  else if (o.crop) u += `&crop=${o.crop}`;
  return u;
}

/* Photo library (id => short key) */
const PH = {
  red:'1471286174890-9c112ffca5b4', rain:'1503919545889-aef636e10ad4', fence:'1503919005314-30d93d07d823',
  floral:'1518831959646-742c3a14ebf7', navy:'1519238263530-99bdd11df2ea', wall:'1519457431-44ccd64a579b',
  bear:'1522771930-78848d9293e8', skate:'1596870230751-ebdfce98ec42', run:'1571210862729-78a52d3779a2',
  denim:'1514090458221-65bb69cf63e6', clip:'1503454537195-1dcabb73ffb9', future:'1536640712-4d4c36ff0e4e',
  vest:'1485546246426-74dc88dec4d9', sprink:'1489710437720-ebb67ec84dd2', read:'1472162072942-cd5147eb3902',
  dresses:'1560506840-ec148e82a604', towel:'1566004100631-35d015d6a491', sleep:'1544126592-807ade215a0b',
  shoe:'1470116892389-0de5d9770b2c', float:'1519689680058-324335c77eba', cam:'1516627145497-ae6968895b74',
  whisper:'1621452773781-0f992fd1f5cb', flattee:'1622290291468-a28f7a7dc6a8', body:'1622290319146-7b63df48a635',
  sweat:'1620799140408-edc6dcb6d633', dshirt:'1596755094514-f87e34085b2c', rack:'1604467794349-0b74285de7e7',
  hang:'1601924994987-69e26d50dc26', feet:'1555252333-9f8e92e65df9', two:'1503944583220-79d8926ad5e2'
};

/* Taxonomies */
const AGES = [
  { key:'newborn', label:'Newborn', range:'0 – 12 months', sizes:['0-3m','3-6m','6-12m'], img:'towel', fy:.4 },
  { key:'baby',    label:'Baby',    range:'1 – 3 years',   sizes:['12-18m','18-24m','2-3y'], img:'denim' },
  { key:'kids',    label:'Kids',    range:'4 – 8 years',   sizes:['4-5y','6-7y','7-8y'], img:'navy' },
  { key:'junior',  label:'Junior',  range:'9 – 14 years',  sizes:['9-10y','11-12y','13-14y'], img:'skate' }
];
const SEASONS = [
  { key:'summer', label:'Summer', note:'Breathable cottons, linens and lawn.', img:'sprink' },
  { key:'winter', label:'Winter', note:'Fleece, knits and quilted layers.', img:'rain' },
  { key:'spring', label:'Spring / Autumn', note:'Light layers for in-between weather.', img:'fence' },
  { key:'festive', label:'Festive / Eid', note:'Embroidered pieces for the big days.', img:'vest' }
];
const CATS = [
  { key:'dresses',  label:'Dresses & Frocks', img:'floral' },
  { key:'tops',     label:'Shirts & Tees',    img:'flattee' },
  { key:'trousers', label:'Trousers & Shorts',img:'run' },
  { key:'sets',     label:'Co-ord Sets',      img:'navy' },
  { key:'outerwear',label:'Outerwear',        img:'rain' },
  { key:'nightwear',label:'Nightwear',        img:'sleep' },
  { key:'ethnic',   label:'Ethnic Wear',      img:'vest' },
  { key:'accessories',label:'Accessories',    img:'shoe' }
];
const COLORS = {
  ivory:{n:'Ivory',h:'#F1EADD'}, sand:{n:'Sand',h:'#D8C6A5'}, terracotta:{n:'Terracotta',h:'#B8654A'},
  olive:{n:'Olive',h:'#7D7F5A'}, sage:{n:'Sage',h:'#A3AE95'}, navy:{n:'Navy',h:'#2C3A52'},
  charcoal:{n:'Charcoal',h:'#3A3835'}, rose:{n:'Dusty Rose',h:'#D3A9A0'}, mustard:{n:'Mustard',h:'#C9A04A'},
  denim:{n:'Denim',h:'#6F8BA4'}, brick:{n:'Brick',h:'#9A4331'}
};
const ALL_SIZES = AGES.flatMap(a => a.sizes);

/* Product factory */
let _pid = 0;
function P(name, cat, gender, ages, seasons, price, photo, colors, extra = {}) {
  _pid++;
  const fx = extra.fx ?? .5, fy = extra.fy ?? .35;
  return Object.assign({
    id: _pid, name, cat, gender, ages, seasons, price, colors,
    sizes: ages.flatMap(a => AGES.find(x => x.key === a).sizes),
    photo,
    // main + hover (zoomed detail) + gallery crops built from the same photograph
    img: img(PH[photo], 700, 875),
    img2: img(PH[photo], 700, 875, { fx, fy: fy + .22, fz: 1.9 }),
    gallery: [
      img(PH[photo], 1000, 1250),
      img(PH[photo], 1000, 1250, { fx, fy, fz: 1.6 }),
      img(PH[photo], 1000, 1250, { fx, fy: fy + .3, fz: 2.1 }),
      img(PH[photo], 1000, 1250, { crop: 'entropy' })
    ],
    rating: 4.5 + ((_pid * 7) % 5) / 10, reviews: 8 + (_pid * 13) % 90
  }, extra);
}

const PRODUCTS = [
  P('Boxy Cotton Tee',            'tops',     'boys',   ['kids'],           ['summer'],            1890, 'red',     ['terracotta','ivory','sage'], { tag:'New', fy:.3, desc:'A relaxed, slightly boxy tee cut from 180 gsm combed cotton jersey. Pre-washed for softness, with a ribbed crew neck that keeps its shape.' }),
  P('Hooded Rain Mac',            'outerwear','unisex', ['baby','kids'],    ['winter','spring'],   5490, 'rain',    ['mustard','navy'], { tag:'Bestseller', fy:.3, desc:'A water-repellent hooded mac with taped seams, a soft cotton lining and storm cuffs. Roomy enough for a jumper underneath.' }),
  P('Utility Field Jacket',       'outerwear','boys',   ['kids','junior'],  ['spring','winter'],   6290, 'fence',   ['sand','olive','navy'], { tag:'New', fy:.4, desc:'A four-pocket field jacket in washed cotton twill with a corduroy collar. Built for playgrounds, trains and long walks.' }),
  P('Garden Smock Dress',         'dresses',  'girls',  ['kids'],           ['spring','summer'],   4290, 'floral',  ['ivory','rose','sage'], { tag:'New', fy:.3, desc:'A loose smocked dress in a soft cotton voile with a hand-finished hem and mother-of-pearl buttons at the back.' }),
  P('Knit Cardigan & Short Set',  'sets',     'boys',   ['kids'],           ['spring','winter'],   5890, 'navy',    ['navy','ivory'], { tag:'Bestseller', fy:.3, desc:'A fine-gauge cotton cardigan paired with pleated shorts. A smart, easy set for school events and family gatherings.' }),
  P('Chambray Day Jacket',        'outerwear','girls',  ['kids','junior'],  ['spring'],            4990, 'wall',    ['denim','ivory'], { fy:.45, desc:'A lightweight chambray jacket with a boyish cut, tonal stitching and a washed finish that softens with every wear.' }),
  P('Teddy Hooded Romper',        'sets',     'unisex', ['newborn'],        ['winter'],            3990, 'bear',    ['sand','ivory'], { tag:'Bestseller', fy:.35, desc:'A teddy-fleece romper with a bear-ear hood, envelope shoulders and a two-way zip for easy changes.' }),
  P('Colour-block Track Jacket',  'outerwear','boys',   ['junior'],         ['spring','winter'],   6490, 'skate',   ['olive','navy'], { fy:.35, desc:'A relaxed-fit track jacket with contrast panels, a stand collar and ribbed cuffs. Cotton-rich, brushed on the inside.' }),
  P('Sprint Jersey Set',          'sets',     'boys',   ['kids','junior'],  ['summer'],            3990, 'run',     ['mustard','olive'], { fy:.4, desc:'A breathable top-and-short set for running, cycling and everything in between. Quick-dry with flat seams.' }),
  P('Check Shirt & Denim Set',    'sets',     'boys',   ['baby'],           ['spring','winter'],   4590, 'denim',   ['denim','ivory'], { fy:.35, desc:'A gingham cotton shirt layered with a soft washed-denim jacket. Elasticated waist, snap fastenings throughout.' }),
  P('Ruffle Sun Dress',           'dresses',  'girls',  ['baby','kids'],    ['summer'],            3790, 'clip',    ['mustard','ivory','rose'], { tag:'New', fy:.45, desc:'A sleeveless printed sun dress with flutter ruffles and a keyhole button back. Lined in cotton lawn.' }),
  P('Slogan Tee — Future',        'tops',     'unisex', ['kids'],           ['summer','spring'],   1990, 'future',  ['charcoal','ivory'], { fy:.4, desc:'A soft jersey tee with a quiet, screen-printed message across the chest. Water-based inks, no stiff plastisol feel.' }),
  P('Waistcoat Kurta Set',        'ethnic',   'boys',   ['kids','junior'],  ['festive','winter'],  8990, 'vest',     ['ivory','navy','sand'], { tag:'Festive', fy:.35, desc:'A cotton-silk kurta with a tailored embroidered waistcoat and straight pyjama. Our signature Eid set for little gentlemen.' }),
  P('Garden Party Set',           'sets',     'boys',   ['baby','kids'],    ['summer'],            3590, 'sprink',  ['mustard','sage'], { fy:.4, desc:'A printed cotton tee and drawstring shorts, made for sprinklers, sandpits and afternoon mischief.' }),
  P('Linen Short-sleeve Shirt',   'tops',     'boys',   ['kids','junior'],  ['summer'],            2990, 'read',    ['sand','sage','ivory'], { fy:.35, desc:'A breathable linen-cotton shirt with a camp collar and horn-effect buttons. Wrinkles beautifully, as it should.' }),
  P('Printed Lawn Frock',         'ethnic',   'girls',  ['baby','kids'],    ['summer','festive'],  4490, 'dresses', ['mustard','rose'], { tag:'Festive', fy:.35, desc:'A printed cotton lawn frock with a gathered skirt and contrast piping, finished with a small tie at the back.' }),
  P('Hooded Muslin Wrap',         'nightwear','unisex', ['newborn'],        ['summer','spring'],   2490, 'towel',   ['ivory','sand'], { fy:.4, desc:'A double-layer muslin wrap with a hood. Wash after wash, it only gets softer. Wonderful for swaddling and bath time.' }),
  P('Organic Sleepsuit',          'nightwear','unisex', ['newborn','baby'], ['winter','spring'],   2890, 'sleep',   ['ivory','sage','rose'], { tag:'Bestseller', fy:.4, desc:'A GOTS-certified organic cotton sleepsuit with fold-over mitts and a zip that opens from the ankle up.' }),
  P('Canvas Boat Shoes',          'accessories','unisex',['baby','kids'],   ['summer','spring'],   3290, 'shoe',    ['navy','sand'], { fy:.5, desc:'A first-pair boat shoe in washed canvas with a flexible rubber sole and a soft leather insole.' }),
  P('Sun-safe Swim Set',          'sets',     'unisex', ['newborn','baby'], ['summer'],            3190, 'float',   ['terracotta','sage'], { fy:.5, desc:'UPF 50+ swim top and shorts in a quick-dry stretch fabric. Gentle on skin, chlorine-resistant.' }),
  P('Pleated Pinafore',           'dresses',  'girls',  ['kids'],           ['spring','winter'],   4690, 'cam',     ['navy','olive'], { fy:.45, desc:'A cotton-twill pinafore with a pleated skirt and adjustable straps. Layer over tees and knits through the seasons.' }),
  P('Heavyweight Crewneck',       'tops',     'boys',   ['kids','junior'],  ['winter','spring'],   4290, 'whisper', ['brick','charcoal'], { fy:.45, desc:'A 380 gsm loopback sweatshirt with a ribbed crew, double-stitched seams and a roomy, easy fit.' }),
  P('Everyday Tee — Ivory',       'tops',     'unisex', ['baby','kids'],    ['summer','spring'],   1690, 'flattee', ['ivory','sand','sage'], { fy:.5, desc:'The tee we reach for most. Combed cotton jersey, tag-free, with a neck that does not sag.' }),
  P('Ribbed Bodysuit — Ivory',    'sets',     'unisex', ['newborn'],        ['summer','spring'],   1990, 'body',    ['ivory','rose','sage'], { fy:.5, desc:'A soft ribbed cotton bodysuit with envelope neck and three-snap closure. Sold individually or in sets of three.' }),
  P('Brushed Fleece Sweatshirt',  'tops',     'unisex', ['junior'],         ['winter'],            4490, 'sweat',   ['ivory','charcoal'], { fy:.5, desc:'A plush brushed-fleece sweatshirt with a dropped shoulder. Gets softer with every wash.' }),
  P('Washed Denim Shirt',         'tops',     'boys',   ['kids','junior'],  ['spring','winter'],   3490, 'dshirt',  ['denim'], { fy:.45, desc:'A stonewashed denim shirt with pearl snaps and a relaxed fit. A wardrobe constant from September to March.' }),
  P('Printed Pyjama Set',         'nightwear','unisex', ['baby','kids'],    ['summer','spring'],   3290, 'rack',    ['sage','ivory'], { fy:.35, desc:'A long-sleeve pyjama set in a printed cotton poplin. Piped edges, elasticated waist, wonderfully breathable.' }),
  P('Pastel Check Shirt',         'tops',     'boys',   ['kids'],           ['spring','summer'],   2790, 'hang',    ['sage','sand','rose'], { fy:.4, desc:'A crisp cotton shirt in a soft yarn-dyed check. Button-down collar, curved hem and a chest pocket.' }),
  P('Knit Booties & Mitts',       'accessories','unisex',['newborn'],       ['winter'],            1590, 'feet',    ['ivory','sand'], { fy:.55, desc:'A hand-finished knit set of booties and scratch mitts in merino-blend yarn. Packaged in a keepsake box.' }),
  P('Chikankari Kurta Set',       'ethnic',   'girls',  ['kids','junior'],  ['festive'],           9490, 'cam',     ['ivory','rose'], { tag:'Festive', fy:.4, desc:'A chikankari-embroidered cotton kurta with matching trousers and a light dupatta. Hand-finished by artisans in Lucknow-style stitch.' }),
  P('Denim Jogger Trousers',      'trousers', 'unisex', ['baby','kids'],    ['spring','winter'],   3190, 'denim',   ['denim','charcoal'], { fy:.8, desc:'Soft-washed stretch-denim joggers with a rib cuff and an elasticated waist. All the look of jeans, none of the fuss.' }),
  P('Cotton Twill Chinos',        'trousers', 'boys',   ['kids','junior'],  ['spring','summer','winter'],3490,'read',['sand','olive','navy'], { fy:.8, desc:'Classic slim chinos in stretch cotton twill with an adjustable inner waistband and reinforced knees.' }),
  P('Linen Drawstring Shorts',    'trousers', 'boys',   ['baby','kids'],    ['summer'],            2290, 'sprink',  ['sand','sage','terracotta'], { fy:.8, desc:'Easy pull-on shorts in a linen blend with a drawstring waist and deep side pockets.' }),
  P('Heritage Shalwar Kameez',    'ethnic',   'boys',   ['kids','junior'],  ['festive','summer'],  7490, 'two',     ['ivory','sage','sand'], { tag:'Festive', fy:.35, desc:'A classic shalwar kameez in washed wash-and-wear cotton with a mandarin collar and contrast button placket.' })
];

/** Helper lookups */
const byId = id => PRODUCTS.find(p => p.id === Number(id));
