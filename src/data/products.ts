// Product catalog. Prices are in cents to keep math exact.

export type Category =
  | 'Footwear'
  | 'Outerwear'
  | 'Bags'
  | 'Audio'
  | 'Eyewear'
  | 'Home'
  | 'Headwear'

export interface ColorVariant {
  name: string
  hex: string
}

export interface Product {
  id: string
  name: string
  tagline: string
  category: Category
  price: number
  compareAt?: number
  images: Array<string>
  colors: Array<ColorVariant>
  sizes?: Array<string>
  soldOutSizes?: Array<string>
  badge?: string
  rating: number
  reviews: number
  description: string
  details: Array<string>
  /** Card background color behind the product shot */
  tone: string
}

export const CATEGORIES: Array<Category> = [
  'Footwear',
  'Outerwear',
  'Bags',
  'Audio',
  'Eyewear',
  'Home',
  'Headwear',
]

const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12']
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL']

const C = {
  tomato: { name: 'Tomato', hex: '#f2542d' },
  cobalt: { name: 'Cobalt', hex: '#2b3fe0' },
  lime: { name: 'Fizz Lime', hex: '#d4f04a' },
  cream: { name: 'Oat Milk', hex: '#efe4cc' },
  pink: { name: 'Bubblegum', hex: '#f6b8d0' },
  tangerine: { name: 'Tangerine', hex: '#ff8a2a' },
  ink: { name: 'Midnight Ink', hex: '#2a2433' },
  butter: { name: 'Butter', hex: '#f7df7b' },
}

const img = (slug: string) => [`/img/${slug}-1.png`, `/img/${slug}-2.png`]

const products: Array<Product> = [
  {
    id: 'puddle-runner',
    name: 'Puddle Runner',
    tagline: 'A wavy foam sole that bounces back on wet pavement.',
    category: 'Footwear',
    price: 14800,
    images: img('puddle-runner'),
    colors: [C.tomato, C.cobalt, C.lime],
    sizes: SHOE_SIZES,
    soldOutSizes: ['12'],
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 1284,
    tone: '#f7df7b',
    description:
      'The Puddle Runner is our love letter to rainy commutes. A 38mm wave-cut foam sole flexes in every direction, while brushed suede overlays are treated to shrug off puddles. It looks loud and walks quiet.',
    details: [
      'Water-repellent suede and ripstop upper',
      '38mm wave-cut EVA midsole',
      'Recycled rubber outsole with puddle-grip lugs',
      'Runs true to size; half sizes size up',
    ],
  },
  {
    id: 'gumdrop-puffer',
    name: 'Gumdrop Puffer',
    tagline: 'Glossy, cropped, and warm down to −12°C.',
    category: 'Outerwear',
    price: 22600,
    compareAt: 26800,
    images: img('gumdrop-puffer'),
    colors: [C.cobalt, C.tomato, C.ink],
    sizes: APPAREL_SIZES,
    soldOutSizes: ['XS'],
    badge: 'Sale',
    rating: 4.7,
    reviews: 412,
    tone: '#f6b8d0',
    description:
      'Shaped like a gumdrop, insulated like a sleeping bag. The Gumdrop Puffer is filled with 700-fill recycled down and wrapped in a high-shine shell that catches every streetlight. The chunky contrast zipper pull is easy to grab with gloves on.',
    details: [
      '700-fill responsibly sourced recycled down',
      'High-gloss recycled nylon shell',
      'Cropped boxy fit — size down for a closer cut',
      'Two hand-warmer pockets and one secret phone pocket',
    ],
  },
  {
    id: 'orbit-sling',
    name: 'Orbit Sling',
    tagline: 'A crescent bag that fits the essentials, plus snacks.',
    category: 'Bags',
    price: 6400,
    images: img('orbit-sling'),
    colors: [C.lime, C.tomato, C.ink],
    badge: 'New',
    rating: 4.9,
    reviews: 238,
    tone: '#f2542d',
    description:
      'The Orbit Sling curves around your body so it never swings into anyone on the train. Inside: a contrast-color lining so nothing gets lost, a key leash, and a padded slot sized for a phone or a small paperback.',
    details: [
      '4.2L capacity, 31 × 16 × 9 cm',
      'Recycled 420D nylon with TPU coating',
      'Adjustable webbing strap, wear crossbody or on the hip',
      'Key leash + padded inner pocket',
    ],
  },
  {
    id: 'wobble-mugs',
    name: 'Wobble Mug Set',
    tagline: 'Four hand-thrown mugs with squiggle handles.',
    category: 'Home',
    price: 4200,
    images: img('wobble-mugs'),
    colors: [
      { name: 'Party Mix', hex: '#f2542d' },
      { name: 'All Cobalt', hex: '#2b3fe0' },
      { name: 'All Oat', hex: '#efe4cc' },
    ],
    rating: 4.6,
    reviews: 591,
    tone: '#d4f04a',
    description:
      'Every Wobble Mug is thrown by hand in a small studio in Porto, so no two rims wobble the same way. The squiggle handle fits two fingers comfortably and makes them easy to find in a crowded cupboard.',
    details: [
      'Set of 4, 340ml each',
      'Stoneware with food-safe glaze',
      'Dishwasher and microwave safe',
      'Made in Portugal',
    ],
  },
  {
    id: 'loudmouth-headphones',
    name: 'Loudmouth Cans',
    tagline: 'Pillow-soft over-ears with 46 hours of battery.',
    category: 'Audio',
    price: 18900,
    images: img('loudmouth-headphones'),
    colors: [C.cream, C.ink, C.lime],
    badge: 'Staff pick',
    rating: 4.7,
    reviews: 873,
    tone: '#2b3fe0',
    description:
      'Loudmouth Cans pair oversized memory-foam cushions with 40mm drivers tuned for warm bass and clear vocals. Active noise cancelling quiets the bus; transparency mode lets the barista back in.',
    details: [
      '46 hours playback, 10-minute quick charge = 5 hours',
      'Hybrid active noise cancelling',
      'Bluetooth 5.4 with multipoint pairing',
      'Folds flat into the included puffy case',
    ],
  },
  {
    id: 'squint-shades',
    name: 'Squint Shades',
    tagline: 'Chunky acetate ovals with polarized lenses.',
    category: 'Eyewear',
    price: 8700,
    images: img('squint-shades'),
    colors: [C.tangerine, C.cobalt, C.lime],
    rating: 4.5,
    reviews: 167,
    tone: '#efe4cc',
    description:
      'Squint Shades are cut from 9mm plant-based acetate, which is thick enough to feel like a toy and tough enough to sit on (we tested). Polarized CR-39 lenses cut glare without dulling colour.',
    details: [
      'Plant-based acetate frame',
      'Polarized CR-39 lenses, UV400',
      'Five-barrel hinges',
      'Includes a squishy carry pouch',
    ],
  },
  {
    id: 'blob-lamp',
    name: 'Blob Lamp',
    tagline: 'A frosted glass blob that glows like a sunset.',
    category: 'Home',
    price: 13200,
    images: img('blob-lamp'),
    colors: [C.cobalt, C.tomato, C.cream],
    badge: 'Low stock',
    rating: 4.9,
    reviews: 96,
    tone: '#f2542d',
    description:
      'Each Blob Lamp shade is mouth-blown into a mould and then shaped by hand while still molten, so yours will have its own slightly different silhouette. The ceramic base comes in three glazes, and the dimmer is built into the cord.',
    details: [
      'Mouth-blown frosted glass shade',
      'Glazed ceramic base, 34 cm tall',
      'Inline dimmer, 2m fabric cord',
      'Warm 2200K LED bulb included',
    ],
  },
  {
    id: 'tangerine-cap',
    name: 'Corduroy Cap',
    tagline: 'Fat-wale cord, six panels, zero logos.',
    category: 'Headwear',
    price: 3400,
    images: img('tangerine-cap'),
    colors: [C.tangerine, C.cobalt, C.cream],
    rating: 4.6,
    reviews: 344,
    tone: '#2b3fe0',
    description:
      'A soft, unstructured six-panel cap in chunky 8-wale corduroy. The contrast brim adds a pop, and the brass slider strap fits most heads without fuss.',
    details: [
      '100% cotton 8-wale corduroy',
      'Unstructured crown, pre-curved brim',
      'Adjustable brass slider strap',
      'One size fits most',
    ],
  },
  {
    id: 'pebble-boom',
    name: 'Pebble Boom',
    tagline: 'A pocket speaker that sounds three sizes bigger.',
    category: 'Audio',
    price: 7600,
    images: img('pebble-boom'),
    colors: [C.lime, C.tomato, C.cream],
    badge: 'New',
    rating: 4.4,
    reviews: 209,
    tone: '#f6b8d0',
    description:
      'Pebble Boom fits in your palm and fills a picnic. A passive radiator gives it surprising bass, it is IP67 so it can survive the pool, and two can pair up for stereo.',
    details: [
      '18 hours playback',
      'IP67 dust and waterproof — it floats',
      'Stereo pairing with a second Pebble',
      'Removable rubber carry strap',
    ],
  },
  {
    id: 'static-beanie',
    name: 'Static Beanie',
    tagline: 'Fuzzy mohair stripes with a deep fold-over cuff.',
    category: 'Headwear',
    price: 2900,
    images: img('static-beanie'),
    colors: [
      { name: 'Tomato Stripe', hex: '#f2542d' },
      { name: 'Lime Stripe', hex: '#d4f04a' },
      { name: 'Cobalt Stripe', hex: '#2b3fe0' },
    ],
    rating: 4.8,
    reviews: 452,
    tone: '#d4f04a',
    description:
      'The Static Beanie is knit from a mohair–wool blend so fuzzy it looks slightly out of focus. A deep cuff keeps your ears warm, and it is soft enough not to itch.',
    details: [
      '40% mohair, 40% merino, 20% recycled nylon',
      'Chunky rib knit with deep cuff',
      'Hand wash cold, dry flat',
      'One size fits most',
    ],
  },
  {
    id: 'cargo-tote',
    name: 'Cargo Tote',
    tagline: 'Heavy canvas, six pockets, carries a week of groceries.',
    category: 'Bags',
    price: 5800,
    images: img('cargo-tote'),
    colors: [C.cream, C.ink, C.pink],
    rating: 4.7,
    reviews: 318,
    tone: '#f2542d',
    description:
      'Our Cargo Tote is made from 18oz waxed canvas with oversized utility pockets on both sides. The webbing handles are stitched all the way down to the base so it can carry a lot without sagging.',
    details: [
      '18oz waxed cotton canvas',
      '22L capacity, six exterior pockets',
      'Reinforced webbing handles',
      'Magnetic snap closure',
    ],
  },
  {
    id: 'chunky-clog',
    name: 'Marshmallow Clog',
    tagline: 'A puffy padded clog on a cloud of a platform.',
    category: 'Footwear',
    price: 11200,
    compareAt: 12800,
    images: img('chunky-clog'),
    colors: [C.cobalt, C.butter, C.ink],
    sizes: SHOE_SIZES,
    soldOutSizes: ['6', '7'],
    badge: 'Sale',
    rating: 4.6,
    reviews: 527,
    tone: '#f7df7b',
    description:
      'Marshmallow Clogs are quilted, padded, and propped on a 45mm cushioned platform. Slip them on for coffee runs; stay in them all day. The squiggle tread is grippy on wet tiles.',
    details: [
      'Water-resistant padded nylon upper',
      '45mm lightweight platform sole',
      'Squiggle-tread rubber outsole',
      'Whole sizes only; between sizes, size up',
    ],
  },
]

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

export default products
