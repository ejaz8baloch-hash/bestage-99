import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'
import type { Category } from '@/data/products'

const NAV: Array<[string, Category | undefined]> = [
  ['Shop all', undefined],
  ['Footwear', 'Footwear'],
  ['Audio', 'Audio'],
  ['Home', 'Home'],
]

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`}>
      <span className="relative grid size-9 place-items-center">
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 size-full text-tomato transition-transform duration-500 group-hover:rotate-90"
          aria-hidden
        >
          <path
            fill="currentColor"
            stroke="#1b1621"
            strokeWidth="2"
            d="M20 2c3 0 4 5 7 6s7-2 9 1-2 6-1 9 5 4 5 7-5 3-6 6 1 7-2 8-5-3-8-3-5 4-8 3-1-5-3-7-6-2-7-5 3-5 3-8-4-5-2-8 6 0 9-2 2-7 5-7z"
          />
        </svg>
        <span className="relative size-2.5 rounded-full border-2 border-ink bg-lime" />
      </span>
      <span className="font-display text-xl font-extrabold leading-none tracking-tight">
        static<span className="text-tomato">/</span>bloom
      </span>
    </Link>
  )
}

export function Header() {
  const { count, open } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 font-mono text-[11px] uppercase tracking-wider md:flex">
          {NAV.map(([label, cat]) => (
            <Link
              key={label}
              to="/"
              hash="shop"
              search={cat ? { cat } : {}}
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-ink hover:text-cream"
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={open}
          className="btn bg-lime px-4 py-2 text-sm"
          aria-label={`Open cart, ${count} items`}
        >
          <ShoppingBag className="size-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Bag</span>
          <span
            key={count}
            className="grid min-w-6 animate-pop place-items-center rounded-full bg-ink px-1.5 font-mono text-[11px] text-cream"
          >
            {count}
          </span>
        </button>
      </div>
    </header>
  )
}
