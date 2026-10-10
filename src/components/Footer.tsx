import { Logo } from '@/components/Header'

export function Marquee({
  items,
  className = '',
}: {
  items: Array<string>
  className?: string
}) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden border-y-2 border-ink py-3 ${className}`}>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-2xl font-extrabold uppercase">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            {t}
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              <path
                fill="currentColor"
                d="M10 0l2.6 7.4L20 10l-7.4 2.6L10 20l-2.6-7.4L0 10l7.4-2.6z"
              />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-ink text-cream">
      <Marquee
        items={['Free shipping over $75', '60-day returns', 'Carbon-neutral delivery', 'Small-batch makers']}
        className="border-cream/20 bg-tomato text-paper"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-cream/70">
            Everyday objects in colours that refuse to whisper. Designed in
            Lisbon, made with small workshops across Europe.
          </p>
        </div>
        <div className="font-mono text-xs uppercase tracking-wider">
          <p className="mb-3 text-lime">Help</p>
          <ul className="space-y-2 text-cream/70">
            <li>Shipping &amp; returns</li>
            <li>Size guide</li>
            <li>Track an order</li>
          </ul>
        </div>
        <div className="font-mono text-xs uppercase tracking-wider">
          <p className="mb-3 text-lime">Studio</p>
          <ul className="space-y-2 text-cream/70">
            <li>Our makers</li>
            <li>Journal</li>
            <li>hello@staticbloom.shop</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-cream/15 py-5 text-center font-mono text-[10px] uppercase tracking-widest text-cream/50">
        © 2026 Static Bloom Goods Co.
      </p>
    </footer>
  )
}
