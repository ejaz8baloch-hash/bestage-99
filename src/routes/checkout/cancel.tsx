import { Link, createFileRoute } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/checkout/cancel')({
  component: CheckoutCancel,
})

function CheckoutCancel() {
  const { open, count } = useCart()

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg animate-rise rounded-[2rem] border-2 border-ink bg-paper p-10 text-center shadow-hard-lg">
        <div className="mx-auto mb-6 grid size-24 rotate-6 place-items-center rounded-full border-2 border-ink bg-pink">
          <ShoppingBag className="size-11" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-none sm:text-5xl">
          No worries.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-ink-soft">
          Checkout was cancelled and nothing was charged. Your bag is right
          where you left it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {count > 0 && (
            <button onClick={open} className="btn bg-cobalt px-6 py-3 text-paper">
              Open my bag ({count})
            </button>
          )}
          <Link to="/" hash="shop" className="btn bg-paper px-6 py-3">
            Back to the shop
          </Link>
        </div>
      </div>
    </div>
  )
}
