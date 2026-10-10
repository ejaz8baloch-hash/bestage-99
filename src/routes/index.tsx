import { useEffect, useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowDownRight, Search, SlidersHorizontal, X } from 'lucide-react'
import products, { CATEGORIES } from '@/data/products'
import type { Category } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { Marquee } from '@/components/Footer'
import { cdn, money } from '@/lib/format'

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
} as const
type Sort = keyof typeof SORTS

// Colour filter groups variants by swatch hex
const COLOR_FAMILIES = [
  { label: 'Tomato', hex: '#f2542d' },
  { label: 'Cobalt', hex: '#2b3fe0' },
  { label: 'Lime', hex: '#d4f04a' },
  { label: 'Oat', hex: '#efe4cc' },
  { label: 'Ink', hex: '#2a2433' },
  { label: 'Tangerine', hex: '#ff8a2a' },
  { label: 'Pink', hex: '#f6b8d0' },
  { label: 'Butter', hex: '#f7df7b' },
]

const PRICE_CEILING = Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 1000

interface ShopSearch {
  q?: string
  cat?: Category
  color?: string
  max?: number
  sale?: boolean
  sort?: Sort
}

export const Route = createFileRoute('/')({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    q: typeof s.q === 'string' && s.q ? s.q : undefined,
    cat: CATEGORIES.includes(s.cat as Category) ? (s.cat as Category) : undefined,
    color: COLOR_FAMILIES.some((c) => c.label === s.color) ? (s.color as string) : undefined,
    max: Number(s.max) > 0 ? Number(s.max) : undefined,
    sale: s.sale === true || s.sale === 'true' ? true : undefined,
    sort: typeof s.sort === 'string' && Object.hasOwn(SORTS, s.sort) ? (s.sort as Sort) : undefined,
  }),
  component: Home,
})

function Home() {
  return (
    <>
      <Hero />
      <Marquee
        items={['New drop: Orbit Sling', 'Hand-thrown in Porto', 'Free shipping over $75', 'Pebble Boom floats']}
        className="-rotate-1 bg-lime"
      />
      <CategoryStrip />
      <Shop />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="mr-2 inline-block size-2 rounded-full bg-tomato" />
            Autumn drop 03 · 12 objects
          </p>
          <h1
            className="font-display mt-5 animate-rise text-[clamp(3.2rem,9vw,7.5rem)] font-extrabold leading-[0.85]"
            style={{ animationDelay: '80ms' }}
          >
            Loud
            <br />
            goods for
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">quiet days.</span>
              <svg
                viewBox="0 0 300 30"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-[0.32em] w-full text-tomato"
                aria-hidden
              >
                <path
                  d="M2 20 Q 40 2 80 18 T 160 16 T 240 14 T 298 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p
            className="mt-7 max-w-md animate-rise text-lg text-ink-soft"
            style={{ animationDelay: '160ms' }}
          >
            Sneakers with wave-cut soles, mugs that wobble on purpose, a lamp
            shaped like a thought. Made in small batches, built to be used
            every day.
          </p>
          <div
            className="mt-8 flex animate-rise flex-wrap gap-3"
            style={{ animationDelay: '240ms' }}
          >
            <Link to="/" hash="shop" className="btn bg-tomato px-6 py-3.5 text-paper">
              Shop the drop <ArrowDownRight className="size-5" />
            </Link>
            <Link
              to="/products/$productId"
              params={{ productId: 'puddle-runner' }}
              className="btn bg-paper px-6 py-3.5"
            >
              Meet the Puddle Runner
            </Link>
          </div>
        </div>

        <div className="relative animate-rise" style={{ animationDelay: '120ms' }}>
          <div className="absolute -inset-3 -z-0 rotate-3 rounded-[2.5rem] bg-cobalt" />
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink shadow-hard-lg">
            <img
              src={cdn('/img/hero.png', 1200, 900)}
              srcSet={`${cdn('/img/hero.png', 700, 525)} 700w, ${cdn('/img/hero.png', 1200, 900)} 1200w`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="A colourful pile of Static Bloom products: red sneakers, a cobalt puffer, a lime sling bag and wobbly mugs"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -left-4 -top-6 grid size-28 animate-spin-slow place-items-center sm:-left-8 sm:size-32">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
              <defs>
                <path id="circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <circle cx="50" cy="50" r="49" fill="#d4f04a" stroke="#1b1621" strokeWidth="2" />
              <text className="font-mono" fontSize="9.5" fontWeight="700" letterSpacing="2">
                <textPath href="#circle">FREE SHIPPING · OVER $75 · </textPath>
              </text>
            </svg>
          </div>
          <div className="absolute -bottom-5 right-4 rotate-[-4deg] rounded-2xl border-2 border-ink bg-paper px-4 py-3 shadow-hard sm:right-8">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              Rated by 6,500+ humans
            </p>
            <p className="font-display text-2xl font-extrabold">4.7 / 5</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const CATEGORY_TONES = ['#f2542d', '#2b3fe0', '#d4f04a', '#f6b8d0', '#f7df7b', '#efe4cc', '#ff8a2a']

function CategoryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {CATEGORIES.map((cat, i) => {
          const sample = products.find((p) => p.category === cat)!
          return (
            <Link
              key={cat}
              to="/"
              hash="shop"
              search={{ cat }}
              className="group flex shrink-0 items-center gap-3 rounded-full border-2 border-ink bg-paper py-1.5 pl-1.5 pr-5 transition-transform hover:-rotate-2"
            >
              <span
                className="size-10 overflow-hidden rounded-full border-2 border-ink"
                style={{ background: CATEGORY_TONES[i] }}
              >
                <img
                  src={cdn(sample.images[0], 96, 96)}
                  alt=""
                  className="size-full object-cover transition-transform group-hover:scale-125"
                />
              </span>
              <span className="font-display text-lg font-bold">{cat}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Shop() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/' })
  const [query, setQuery] = useState(search.q ?? '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const update = (patch: Partial<ShopSearch>) =>
    navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
      resetScroll: false,
      hash: 'shop',
    })

  // Debounce the text search into the URL
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? '') !== query) update({ q: query || undefined })
    }, 220)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    setQuery(search.q ?? '')
  }, [search.q])

  const results = useMemo(() => {
    const q = search.q?.toLowerCase().trim()
    const family = COLOR_FAMILIES.find((c) => c.label === search.color)
    const list = products.filter((p) => {
      if (search.cat && p.category !== search.cat) return false
      if (search.sale && !p.compareAt) return false
      if (search.max && p.price > search.max) return false
      if (family && !p.colors.some((c) => c.hex === family.hex)) return false
      if (q) {
        const hay = [p.name, p.tagline, p.category, p.description, ...p.colors.map((c) => c.name)]
          .join(' ')
          .toLowerCase()
        if (!q.split(/\s+/).every((word) => hay.includes(word))) return false
      }
      return true
    })
    switch (search.sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating)
      default:
        return list
    }
  }, [search])

  const activeCount =
    (search.cat ? 1 : 0) + (search.color ? 1 : 0) + (search.max ? 1 : 0) + (search.sale ? 1 : 0)

  const clearAll = () => {
    setQuery('')
    navigate({ search: {}, replace: true, resetScroll: false, hash: 'shop' })
  }

  return (
    <section id="shop" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl font-extrabold leading-none sm:text-6xl">
          {search.cat ?? 'The whole shop'}
          <sup className="ml-2 align-top font-mono text-sm font-normal text-tomato">
            {results.length}
          </sup>
        </h2>
        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
          Sort
          <select
            value={search.sort ?? 'featured'}
            onChange={(e) =>
              update({ sort: e.target.value === 'featured' ? undefined : (e.target.value as Sort) })
            }
            className="rounded-full border-2 border-ink bg-paper px-3 py-2 font-sans text-sm font-semibold normal-case tracking-normal"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Search + filter toggle */}
      <div className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sneakers, lamps, “cobalt”…"
            aria-label="Search products"
            className="w-full rounded-full border-2 border-ink bg-paper py-3.5 pl-12 pr-12 text-base shadow-hard-sm outline-none transition-shadow placeholder:text-ink-soft/60 focus:shadow-hard"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className={`btn px-4 lg:hidden ${filtersOpen ? 'bg-ink text-cream' : 'bg-butter'}`}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="size-5" />
          {activeCount > 0 && <span className="font-mono text-xs">{activeCount}</span>}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="space-y-7 rounded-3xl border-2 border-ink bg-paper p-5 lg:sticky lg:top-24">
            <FilterGroup title="Category">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    active={search.cat === cat}
                    onClick={() => update({ cat: search.cat === cat ? undefined : cat })}
                  >
                    {cat}
                  </Chip>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Colour">
              <div className="flex flex-wrap gap-2">
                {COLOR_FAMILIES.map((c) => (
                  <button
                    key={c.label}
                    title={c.label}
                    aria-label={`Filter by ${c.label}`}
                    aria-pressed={search.color === c.label}
                    onClick={() =>
                      update({ color: search.color === c.label ? undefined : c.label })
                    }
                    className={`size-8 rounded-full border-2 border-ink transition-transform hover:scale-110 ${search.color === c.label ? 'scale-110 ring-2 ring-ink ring-offset-2 ring-offset-paper' : ''}`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title={`Up to ${money(search.max ?? PRICE_CEILING)}`}>
              <input
                type="range"
                min={2000}
                max={PRICE_CEILING}
                step={1000}
                value={search.max ?? PRICE_CEILING}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  update({ max: v >= PRICE_CEILING ? undefined : v })
                }}
                className="w-full accent-tomato"
                aria-label="Maximum price"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-soft">
                <span>$20</span>
                <span>{money(PRICE_CEILING)}</span>
              </div>
            </FilterGroup>

            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="font-display text-lg font-bold">On sale only</span>
              <input
                type="checkbox"
                checked={!!search.sale}
                onChange={(e) => update({ sale: e.target.checked || undefined })}
                className="peer sr-only"
              />
              <span className="relative h-7 w-12 rounded-full border-2 border-ink bg-cream transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:border-2 after:border-ink after:bg-paper after:transition-transform peer-checked:bg-tomato peer-checked:after:translate-x-5 peer-focus-visible:outline-3 peer-focus-visible:outline-cobalt" />
            </label>

            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="w-full font-mono text-[11px] uppercase tracking-wider underline underline-offset-4 hover:text-tomato"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 min-[480px]:grid-cols-2 xl:grid-cols-3">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-[2rem] border-2 border-dashed border-ink px-6 py-20 text-center">
              <div className="mb-6 grid size-24 -rotate-6 place-items-center rounded-full border-2 border-ink bg-pink shadow-hard">
                <Search className="size-10" />
              </div>
              <p className="font-display text-3xl font-extrabold">Nothing matches… yet</p>
              <p className="mt-2 max-w-sm text-ink-soft">
                Try a different word or loosen a filter. We restock in small
                batches, so check back soon.
              </p>
              <button onClick={clearAll} className="btn mt-6 bg-lime px-5 py-2.5">
                Reset the shop
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-soft">{title}</p>
      {children}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold transition-all ${active ? 'bg-ink text-cream' : 'bg-paper hover:-translate-y-0.5 hover:bg-butter'}`}
    >
      {children}
    </button>
  )
}
