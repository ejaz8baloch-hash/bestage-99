import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { FREE_SHIPPING_THRESHOLD, cdn, money } from '@/lib/format'
import { createCheckoutSession, getStripeEnabled } from '@/lib/stripe'

export function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQty, remove, lastAdded } = useCart()
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStripeEnabled()
      .then(setStripeEnabled)
      .catch(() => setStripeEnabled(false))
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1)

  const checkout = async () => {
    setCheckingOut(true)
    setError(null)
    try {
      const url = await createCheckoutSession({
        data: lines.map(({ productId, color, size, qty }) => ({
          productId,
          color,
          size,
          qty,
        })),
      })
      if (url) window.location.href = url
      else throw new Error('No checkout URL')
    } catch {
      setError('Checkout hiccuped. Give it another go in a moment.')
      setCheckingOut(false)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-paper transition-transform duration-500 ease-[cubic-bezier(0.2,0.9,0.2,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b-2 border-ink bg-butter px-5 py-4">
          <h2 className="font-display text-2xl font-extrabold">Your bag</h2>
          <button
            onClick={close}
            className="btn size-9 bg-paper"
            aria-label="Close bag"
          >
            <X className="size-4" strokeWidth={3} />
          </button>
        </div>

        {lines.length > 0 && (
          <div className="border-b-2 border-ink px-5 py-3">
            <p className="font-mono text-[11px] uppercase tracking-wider">
              {remaining > 0 ? (
                <>
                  <b>{money(remaining)}</b> away from free shipping
                </>
              ) : (
                <>Free shipping unlocked</>
              )}
            </p>
            <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-ink bg-cream">
              <div
                className="h-full rounded-full bg-tomato transition-[width] duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-5 grid size-24 rotate-6 place-items-center rounded-[2rem] border-2 border-ink bg-pink shadow-hard">
                <ShoppingBag className="size-10" strokeWidth={2} />
              </div>
              <p className="font-display text-2xl font-extrabold">
                Nothing in here yet
              </p>
              <p className="mt-2 max-w-60 text-ink-soft">
                Your bag is looking for something loud to carry.
              </p>
              <Link
                to="/"
                hash="shop"
                onClick={close}
                className="btn mt-6 bg-tomato px-5 py-2.5 text-paper"
              >
                Browse the shop <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.key}
                  className={`flex gap-4 rounded-2xl border-2 border-ink bg-paper p-3 ${line.key === lastAdded ? 'animate-rise' : ''}`}
                >
                  <Link
                    to="/products/$productId"
                    params={{ productId: line.productId }}
                    onClick={close}
                    className="shrink-0 overflow-hidden rounded-xl border-2 border-ink"
                    style={{ background: line.product.tone }}
                  >
                    <img
                      src={cdn(line.product.images[0], 160, 200)}
                      alt={line.product.name}
                      className="h-24 w-20 object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-display text-lg font-bold leading-tight">
                        {line.product.name}
                      </p>
                      <p className="font-bold">{money(line.lineTotal)}</p>
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                      {line.color}
                      {line.size && ` · Size ${line.size}`}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border-2 border-ink">
                        <button
                          onClick={() => setQty(line.key, line.qty - 1)}
                          className="grid size-7 place-items-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" strokeWidth={3} />
                        </button>
                        <span className="w-6 text-center font-mono text-xs">
                          {line.qty}
                        </span>
                        <button
                          onClick={() => setQty(line.key, line.qty + 1)}
                          disabled={line.qty >= 10}
                          className="grid size-7 place-items-center disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" strokeWidth={3} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(line.key)}
                        className="text-ink-soft transition-colors hover:text-tomato"
                        aria-label={`Remove ${line.product.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t-2 border-ink bg-cream px-5 py-5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-wider">
                Subtotal
              </span>
              <span className="font-display text-3xl font-extrabold">
                {money(subtotal)}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Shipping and taxes calculated at checkout.
            </p>
            {error && (
              <p className="mt-3 rounded-lg border-2 border-tomato bg-tomato/10 px-3 py-2 text-sm font-semibold text-tomato">
                {error}
              </p>
            )}
            <button
              onClick={checkout}
              disabled={checkingOut || stripeEnabled !== true}
              className="btn mt-4 w-full bg-cobalt py-3.5 text-lg text-paper"
            >
              {checkingOut
                ? 'Heading to checkout…'
                : stripeEnabled === false
                  ? 'Checkout opens soon'
                  : 'Check out'}
              {!checkingOut && <ArrowRight className="size-5" />}
            </button>
            {stripeEnabled === false && (
              <p className="mt-2 text-center text-xs text-ink-soft">
                Payments aren't switched on for this store yet.
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
