import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Star,
  Truck,
} from 'lucide-react'
import products, { getProduct } from '@/data/products'
import type { Product } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { useCart } from '@/lib/cart'
import { FREE_SHIPPING_THRESHOLD, cdn, money } from '@/lib/format'

export const Route = createFileRoute('/products/$productId')({
  loader: ({ params }) => {
    const product = getProduct(params.productId)
    if (!product) throw notFound()
    return product
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Static Bloom` },
          { name: 'description', content: loaderData.tagline },
          { property: 'og:title', content: `${loaderData.name} — Static Bloom` },
          { property: 'og:image', content: cdn(loaderData.images[0], 1200) },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: ProductNotFound,
})

function ProductPage() {
  const product = Route.useLoaderData()
  // Remount the purchase panel when navigating between products
  return <ProductDetail key={product.id} product={product} />
}

function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart()
  const [color, setColor] = useState(product.colors[0].name)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)
  const buyRef = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) =>
      setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const addToBag = () => {
    if (product.sizes && !size) {
      setSizeError(true)
      buyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    add({ productId: product.id, color, size: size ?? undefined, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const savings = product.compareAt ? product.compareAt - product.price : 0
  const related = [
    ...products.filter((p) => p.category === product.category && p.id !== product.id),
    ...products.filter((p) => p.category !== product.category),
  ].slice(0, 4)

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          <Link to="/" hash="shop" className="flex items-center gap-1 hover:text-ink">
            <ArrowLeft className="size-3.5" /> Shop
          </Link>
          <span>/</span>
          <Link
            to="/"
            hash="shop"
            search={{ cat: product.category }}
            className="hover:text-ink"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <Gallery product={product} />

          <div className="lg:pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {product.badge && (
                <span className="-rotate-2 rounded-full border-2 border-ink bg-lime px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
              <a href="#reviews" className="flex items-center gap-1.5 text-sm font-semibold">
                <span className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(product.rating) ? 'fill-tomato text-tomato' : 'text-ink/30'}`}
                    />
                  ))}
                </span>
                {product.rating} · {product.reviews.toLocaleString()} reviews
              </a>
            </div>

            <h1 className="font-display mt-4 text-5xl font-extrabold leading-[0.9] sm:text-6xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-ink-soft">{product.tagline}</p>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl font-extrabold">{money(product.price)}</span>
              {product.compareAt && (
                <>
                  <span className="pb-1 font-mono text-sm text-ink-soft line-through">
                    {money(product.compareAt)}
                  </span>
                  <span className="mb-1 rotate-3 rounded-md border-2 border-ink bg-tomato px-2 py-0.5 font-mono text-[11px] font-bold text-paper">
                    Save {money(savings)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              or 4 payments of {money(Math.ceil(product.price / 4))}
            </p>

            <div ref={buyRef} className="mt-8 space-y-7">
              {/* Colour */}
              <fieldset>
                <legend className="mb-3 font-mono text-[11px] uppercase tracking-wider">
                  Colour — <span className="font-bold">{color}</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      aria-pressed={color === c.name}
                      aria-label={c.name}
                      title={c.name}
                      className={`relative size-12 rounded-full border-2 border-ink transition-transform hover:scale-105 ${color === c.name ? 'ring-[3px] ring-ink ring-offset-[3px] ring-offset-cream' : ''}`}
                      style={{ background: c.hex }}
                    >
                      {color === c.name && (
                        <Check
                          className="absolute inset-0 m-auto size-5 animate-pop"
                          strokeWidth={3.5}
                          color={['#2b3fe0', '#2a2433', '#f2542d'].includes(c.hex) ? '#fbf7ee' : '#1b1621'}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Size */}
              {product.sizes && (
                <fieldset>
                  <div className="mb-3 flex items-center justify-between">
                    <legend className="font-mono text-[11px] uppercase tracking-wider">
                      Size {size && <>— <span className="font-bold">{size}</span></>}
                    </legend>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft underline underline-offset-4">
                      Size guide
                    </span>
                  </div>
                  <div
                    className={`grid grid-cols-5 gap-2 sm:grid-cols-7 ${sizeError ? 'animate-[pop_0.3s]' : ''}`}
                  >
                    {product.sizes.map((s) => {
                      const soldOut = product.soldOutSizes?.includes(s)
                      return (
                        <button
                          key={s}
                          disabled={soldOut}
                          onClick={() => {
                            setSize(s)
                            setSizeError(false)
                          }}
                          aria-pressed={size === s}
                          className={`relative h-12 rounded-xl border-2 font-semibold transition-all ${
                            size === s
                              ? 'border-ink bg-ink text-cream shadow-hard-sm'
                              : soldOut
                                ? 'cursor-not-allowed border-ink/25 text-ink/35 line-through'
                                : sizeError
                                  ? 'border-tomato bg-paper hover:-translate-y-0.5'
                                  : 'border-ink bg-paper hover:-translate-y-0.5 hover:bg-butter'
                          }`}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>
                  {sizeError && (
                    <p className="mt-2 text-sm font-semibold text-tomato">
                      Pick a size first and we'll pop it in your bag.
                    </p>
                  )}
                </fieldset>
              )}

              {/* Quantity + add */}
              <div className="flex gap-3">
                <div className="flex items-center rounded-full border-2 border-ink bg-paper">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid size-12 place-items-center disabled:opacity-30"
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4" strokeWidth={3} />
                  </button>
                  <span className="w-6 text-center font-mono" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="grid size-12 place-items-center disabled:opacity-30"
                    disabled={qty >= 10}
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4" strokeWidth={3} />
                  </button>
                </div>
                <button
                  onClick={addToBag}
                  className={`btn flex-1 py-3.5 text-lg ${added ? 'bg-lime' : 'bg-tomato text-paper'}`}
                >
                  {added ? (
                    <>
                      <Check className="size-5 animate-pop" strokeWidth={3} /> Added to bag
                    </>
                  ) : (
                    <>Add to bag · {money(product.price * qty)}</>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2 rounded-2xl border-2 border-ink bg-paper p-3">
                <Truck className="mt-0.5 size-4 shrink-0" />
                <span>
                  Free shipping over {money(FREE_SHIPPING_THRESHOLD)}. Ships in 1–2 days.
                </span>
              </div>
              <div className="flex items-start gap-2 rounded-2xl border-2 border-ink bg-paper p-3">
                <RotateCcw className="mt-0.5 size-4 shrink-0" />
                <span>60-day returns, even if it's been worn once.</span>
              </div>
            </div>

            <div className="mt-8 divide-y-2 divide-ink border-y-2 border-ink">
              <Accordion title="The story" defaultOpen>
                <p className="leading-relaxed text-ink-soft">{product.description}</p>
              </Accordion>
              <Accordion title="Details & materials">
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-2 text-ink-soft">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-tomato" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Shipping & returns">
                <p className="leading-relaxed text-ink-soft">
                  Orders ship carbon-neutral from Lisbon within two business
                  days. Standard shipping is $6.95, or free over{' '}
                  {money(FREE_SHIPPING_THRESHOLD)}. Changed your mind? Send it
                  back within 60 days for a full refund.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <Reviews product={product} />

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
          Goes loud with
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Sticky mobile add-to-bag */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-paper p-3 transition-transform duration-300 lg:hidden ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center gap-3">
          <img
            src={cdn(product.images[0], 96, 96)}
            alt=""
            className="size-12 rounded-lg border-2 border-ink object-cover"
            style={{ background: product.tone }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display font-bold leading-tight">{product.name}</p>
            <p className="font-mono text-[10px] uppercase text-ink-soft">
              {color}
              {size && ` · ${size}`}
            </p>
          </div>
          <button
            onClick={addToBag}
            className={`btn px-4 py-2.5 text-sm ${added ? 'bg-lime' : 'bg-tomato text-paper'}`}
          >
            {added ? 'Added' : `Add · ${money(product.price * qty)}`}
          </button>
        </div>
      </div>
    </>
  )
}

function Gallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const touchX = useRef<number | null>(null)
  const count = product.images.length
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count)

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {/* Thumbnails */}
        <div className="flex gap-3 sm:flex-col">
          {product.images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`size-20 overflow-hidden rounded-2xl border-2 border-ink transition-all sm:size-24 ${i === index ? '-rotate-3 shadow-hard-sm' : 'opacity-60 hover:opacity-100'}`}
              style={{ background: product.tone }}
            >
              <img src={cdn(src, 200, 200)} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="relative flex-1">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-2 border-ink" style={{ background: product.tone }} />
          <div
            className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[2rem] border-2 border-ink bg-paper"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setZoom({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              })
            }}
            onMouseLeave={() => setZoom(null)}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return
              const dx = e.changedTouches[0].clientX - touchX.current
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
              touchX.current = null
            }}
          >
            {product.images.map((src, i) => (
              <img
                key={src}
                src={cdn(src, 1000, 1250)}
                srcSet={`${cdn(src, 600, 750)} 600w, ${cdn(src, 1000, 1250)} 1000w, ${cdn(src, 1400, 1750)} 1400w`}
                sizes="(min-width: 1024px) 45vw, 100vw"
                alt={i === 0 ? product.name : `${product.name}, view ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                style={
                  i === index && zoom
                    ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : { transform: 'scale(1)' }
                }
              />
            ))}

            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
              <button onClick={() => go(-1)} className="btn size-10 bg-paper" aria-label="Previous image">
                <ChevronLeft className="size-5" strokeWidth={3} />
              </button>
              <span className="rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-[11px]">
                {index + 1} / {count}
              </span>
              <button onClick={() => go(1)} className="btn size-10 bg-paper" aria-label="Next image">
                <ChevronRight className="size-5" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Accordion({
  title,
  children,
  defaultOpen,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details className="group py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-xl font-bold [&::-webkit-details-marker]:hidden">
        {title}
        <Plus className="size-5 transition-transform group-open:rotate-45" strokeWidth={3} />
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  )
}

const REVIEWERS = [
  { name: 'Marisol T.', city: 'Oakland', tone: '#f6b8d0' },
  { name: 'Kwame A.', city: 'Leeds', tone: '#d4f04a' },
  { name: 'Ines V.', city: 'Montréal', tone: '#f7df7b' },
]

function Reviews({ product }: { product: Product }) {
  const quotes = [
    `Wore the ${product.name} out of the box and got three compliments before lunch. Quality is way better than I expected for the price.`,
    `The colour is exactly like the photos, maybe even brighter. Packaging was plastic-free and had a little sticker, which my kid stole immediately.`,
    `Second one I've bought. Took a star off only because I want it in more colours. Please make more colours.`,
  ]
  const stars = [5, 5, 4]
  return (
    <section id="reviews" className="mt-24 scroll-mt-20 bg-cobalt py-16 text-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
            People are talking
          </h2>
          <p className="font-mono text-xs uppercase tracking-wider">
            {product.rating} average · {product.reviews.toLocaleString()} reviews
          </p>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
          {REVIEWERS.map((r, i) => (
            <figure
              key={r.name}
              className={`w-[85%] shrink-0 snap-center rounded-3xl border-2 border-ink bg-paper p-6 text-ink shadow-hard sm:w-auto ${i === 1 ? 'sm:translate-y-6 sm:rotate-1' : i === 2 ? 'sm:-rotate-1' : ''}`}
            >
              <div className="flex">
                {Array.from({ length: 5 }, (_, s) => (
                  <Star
                    key={s}
                    className={`size-4 ${s < stars[i] ? 'fill-tomato text-tomato' : 'text-ink/25'}`}
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-lg leading-snug">“{quotes[i]}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  className="grid size-10 place-items-center rounded-full border-2 border-ink font-display font-extrabold"
                  style={{ background: r.tone }}
                >
                  {r.name[0]}
                </span>
                <span>
                  <span className="block font-bold">{r.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                    {r.city} · Verified buyer
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <p className="font-display text-[8rem] font-extrabold leading-none text-tomato">404</p>
      <h1 className="font-display mt-2 text-3xl font-extrabold">This one got away</h1>
      <p className="mt-3 text-ink-soft">
        We couldn't find that product. It may have sold out or moved shelves.
      </p>
      <Link to="/" hash="shop" className="btn mt-8 bg-lime px-6 py-3">
        Back to the shop
      </Link>
    </div>
  )
}
