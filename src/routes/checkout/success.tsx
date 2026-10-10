import { useEffect } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/checkout/success')({
  component: CheckoutSuccess,
})

function CheckoutSuccess() {
  const { clear } = useCart()

  useEffect(() => {
    clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="relative w-full max-w-lg animate-rise rounded-[2rem] border-2 border-ink bg-paper p-10 text-center shadow-hard-lg">
        <div className="mx-auto mb-6 grid size-24 -rotate-6 animate-pop place-items-center rounded-full border-2 border-ink bg-lime">
          <Check className="size-12" strokeWidth={3} />
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-none sm:text-5xl">
          It's on its way!
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-ink-soft">
          Thanks for shopping loud. A receipt is heading to your inbox, and
          we'll send tracking as soon as your parcel leaves the studio.
        </p>
        <Link to="/" hash="shop" className="btn mt-8 bg-tomato px-6 py-3 text-paper">
          Keep browsing
        </Link>
      </div>
    </div>
  )
}
