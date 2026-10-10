# Static Bloom

A bold, mobile-friendly online store for **Static Bloom**, a fictional brand of loud everyday goods: chunky sneakers, glossy puffers, wobbly mugs, blob lamps and more.

## Features

- **Landing page:** an asymmetric hero, a scrolling marquee, and category shortcuts.
- **Shop grid:** live text search, plus filters for category, colour, max price and sale items, and four sort orders. Filters are kept in the URL, so a filtered view can be shared or bookmarked.
- **Product pages:** a gallery with thumbnails, swipe and hover zoom; colour and size variants with sold-out sizes; a quantity picker; add to bag; accordions; reviews; related products; and a sticky add-to-bag bar on mobile.
- **Bag drawer:** change quantities, remove items, and watch a free-shipping progress bar. The bag is saved in the browser.
- **Stripe Checkout:** prices are checked on the server against the catalog. Shipping is charged as a flat rate, or free over $75.

## Tech

TanStack Start (React 19, TanStack Router), Vite 7, Tailwind CSS 4, Stripe, and lucide-react icons. It is deployed on Netlify, and images are resized through the Netlify Image CDN. The product photos were generated with Gemini through Netlify AI Gateway and are stored in `public/img`.

## Running locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

To turn on checkout, set `STRIPE_SECRET_KEY`. Without it, the store works normally and the checkout button reads "Checkout opens soon".

## Editing products

Every product is in `src/data/products.ts`: names, prices in cents, colours, sizes, sold-out sizes, badges, copy and image paths.
