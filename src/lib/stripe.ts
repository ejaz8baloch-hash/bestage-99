import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getProduct } from '@/data/products'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/format'

export const getStripeEnabled = createServerFn({ method: 'GET' }).handler(
  () => !!process.env.STRIPE_SECRET_KEY,
)

const cartSchema = z
  .array(
    z.object({
      productId: z.string(),
      color: z.string(),
      size: z.string().optional(),
      qty: z.number().int().min(1).max(10),
    }),
  )
  .min(1)
  .max(50)

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((lines: z.infer<typeof cartSchema>) => cartSchema.parse(lines))
  .handler(async ({ data: lines }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured')
    }
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const siteUrl = process.env.URL ?? process.env.SITE_URL ?? 'http://localhost:3000'

    // Prices always come from the server-side catalog, never from the client.
    const lineItems = lines.map((line) => {
      const product = getProduct(line.productId)
      if (!product) throw new Error(`Unknown product: ${line.productId}`)
      if (!product.colors.some((c) => c.name === line.color)) {
        throw new Error(`Invalid color for ${product.name}`)
      }
      if (product.sizes && (!line.size || !product.sizes.includes(line.size))) {
        throw new Error(`Invalid size for ${product.name}`)
      }
      const variant = [line.color, line.size && `Size ${line.size}`]
        .filter(Boolean)
        .join(' / ')
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.name} — ${variant}`,
            description: product.tagline,
            images: [`${siteUrl}${product.images[0]}`],
          },
          unit_amount: product.price,
        },
        quantity: line.qty,
      }
    })

    const subtotal = lines.reduce(
      (n, l) => n + (getProduct(l.productId)?.price ?? 0) * l.qty,
      0,
    )

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB'] },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free shipping' : 'Standard shipping',
            type: 'fixed_amount',
            fixed_amount: {
              amount: subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 695,
              currency: 'usd',
            },
          },
        },
      ],
      success_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })

    return session.url
  })
