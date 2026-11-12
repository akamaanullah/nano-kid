# Nano Kids — front-end UI (HTML / CSS / vanilla JS)

Open `index.html` in a browser — no build step, no framework. UI only (no backend); forms show a success state.

## Pages
- `index.html` Home · `shop.html` Collection (live filters, sort, grid/list, quick view)
- `product.html?id=N` Product detail · `customize.html` Design-Your-Own studio (live SVG preview)
- `cart.html` + slide-out cart drawer (all pages) · `checkout.html` · `about.html` · `contact.html`

## Files
- `css/style.css` — the whole design system (tokens at the top: colours, fonts)
- `js/data.js` — product catalogue + photo library (edit/replace here)
- `js/main.js` — header/footer/cart drawer/search/wishlist/quick view + home, product, cart, checkout logic
- `js/shop.js`, `js/customize.js` — shop filtering and customize studio

## Customising
- Replace products in `js/data.js` (`PRODUCTS`), images are Unsplash placeholders (`PH` map) — swap with real product photos.
- Brand colours: `:root` in `css/style.css` (`--ivory`, `--ink`, `--accent`). Fonts: Cormorant Garamond + Manrope (Google Fonts).
- Cart & wishlist persist in `localStorage`. Promo code demo: `NANO10` (10% off). Currency PKR.
- Contact details in the footer (`js/main.js` → `footerHTML`) and `contact.html` are placeholders.
"# nano-kid" 
