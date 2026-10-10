import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Plus, Star } from 'lucide-react'
import type { Product } from '@/data/products'
import { useCart } from '@/lib/cart'
import { cdn, money } from '@/lib/format'

const BADGE_STYLES: Record<string, string> = {
  Sale: 'bg-tomato text-paper',
  New: 'bg-lime',
  Bestseller: 'bg-cobalt text-paper',
  'Low stock': 'bg-butter',
  'Staff pick': 'bg-pink',
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { add } = useCart()
  const [hovered, setHovered] = useState(false)
  const needsSize = !!product.sizes

  return (
    <article
      className="group animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-[1.75rem] border-2 border-ink shadow-hard transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-hard-lg"
        style={{ background: product.tone }}
      >
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="block aspect-[4/5]"
        >
          <img
            src={cdn(product.images[0], 600, 750)}
            alt={product.name}
            loading={index < 4 ? 'eager' : 'lazy'}
            className={`absolute inset-0 size-full object-cover transition-all duration-500 ${hovered ? 'scale-105 opacity-0' : 'opacity-100'}`}
          />
          <img
            src={cdn(product.images[1], 600, 750)}
            alt=""
            loading="lazy"
            className={`absolute inset-0 size-full object-cover transition-all duration-500 ${hovered ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
          />
        </Link>

        {product.badge && (
          <span
            className={`absolute left-3 top-3 -rotate-3 rounded-full border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${BADGE_STYLES[product.badge] ?? 'bg-paper'}`}
          >
            {product.badge}
          </span>
        )}

        {needsSize ? (
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="btn absolute bottom-3 right-3 translate-y-0 bg-paper px-3 py-2 text-xs opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
          >
            Pick a size
          </Link>
        ) : (
          <button
            onClick={() =>
              add({ productId: product.id, color: product.colors[0].name, qty: 1 })
            }
            className="btn absolute bottom-3 right-3 bg-paper px-3 py-2 text-xs opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
            aria-label={`Quick add ${product.name}`}
          >
            <Plus className="size-3.5" strokeWidth={3} /> Quick add
          </button>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            {product.category}
          </p>
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="font-display text-xl font-extrabold leading-tight decoration-tomato decoration-[3px] underline-offset-4 hover:underline"
          >
            {product.name}
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex -space-x-1">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="size-4 rounded-full border-2 border-ink"
                  style={{ background: c.hex }}
                />
              ))}
            </div>
            <span className="flex items-center gap-0.5 font-mono text-[10px]">
              <Star className="size-3 fill-ink" /> {product.rating}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-xl font-extrabold">{money(product.price)}</p>
          {product.compareAt && (
            <p className="font-mono text-[11px] text-ink-soft line-through">
              {money(product.compareAt)}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
