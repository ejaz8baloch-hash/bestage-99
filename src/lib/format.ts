export function money(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

/** Optimized image URL via Netlify Image CDN */
export function cdn(src: string, w: number, h?: number) {
  const params = new URLSearchParams({ url: src, w: String(w), fm: 'webp', q: '80' })
  if (h) {
    params.set('h', String(h))
    params.set('fit', 'cover')
  }
  return `/.netlify/images?${params.toString()}`
}

export const FREE_SHIPPING_THRESHOLD = 7500
