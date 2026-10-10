# AGENTS.md

Static Bloom is a TanStack Start e-commerce storefront deployed on Netlify.

## Architecture

- `src/data/products.ts`: the static product catalog. It is the single source of truth for products. Prices are **integer cents**. Product `id` is a URL slug used by `/products/$productId`.
- `src/lib/cart.tsx`: the `CartProvider` and `useCart()` hook (React context). It saves to `localStorage` under `static-bloom-cart`. A cart line is identified by `productId::color::size`, and quantity is capped at 10.
- `src/lib/stripe.ts`: server functions `getStripeEnabled` and `createCheckoutSession`. Cart lines are validated with zod and re-priced from the catalog on the server. Never trust client prices.
- `src/lib/format.ts`: `money()` for display, `cdn()` for Netlify Image CDN URLs (always use it for images), and `FREE_SHIPPING_THRESHOLD`.
- `src/routes/__root.tsx`: the shell, which loads Google Fonts and renders Header, Footer, CartDrawer and the 404 page.
- `src/routes/index.tsx`: the hero, category strip and shop grid. Search and filter state lives in URL search params (`q, cat, color, max, sale, sort`) through `validateSearch`.
- `src/routes/products/$productId.tsx`: the product detail page (gallery, variants, add to bag, reviews, related products).
- `src/routes/checkout/{success,cancel}.tsx`: Stripe return pages. The success page clears the cart.
- `src/components/`: Header (with Logo), Footer (with Marquee), CartDrawer, ProductCard.

## Design system

- Colours are defined as Tailwind theme tokens in `src/styles.css`: `cream`, `paper`, `ink`, `tomato`, `cobalt`, `lime`, `pink`, `butter`.
- Fonts: Bricolage Grotesque (`font-display`), Instrument Sans (body) and Martian Mono (`font-mono`, used for small uppercase labels).
- Signature look: 2px ink borders, hard offset shadows (`shadow-hard*`), and the `.btn` class (it lifts on hover and presses in on click), plus slight rotations on stickers and badges.
- Animations: `animate-rise` (staggered entrance), `animate-pop`, `animate-marquee`, `animate-spin-slow`.

## Conventions

- Use the `@/` import alias for `src/`. Components are PascalCase.
- Product images live at `public/img/<slug>-1.png` (main) and `-2.png` (alternate view). Each product has a `tone` colour that is shown behind its images.
- There is no database. The catalog is static and the cart is client-side. If inventory or orders need to be stored later, use Netlify Database.
