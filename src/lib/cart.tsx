import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getProduct } from '@/data/products'
import type { Product } from '@/data/products'

export interface CartLine {
  productId: string
  color: string
  size?: string
  qty: number
}

export interface ResolvedLine extends CartLine {
  key: string
  product: Product
  lineTotal: number
}

interface CartContextValue {
  lines: Array<ResolvedLine>
  count: number
  subtotal: number
  isOpen: boolean
  lastAdded: string | null
  open: () => void
  close: () => void
  add: (line: CartLine) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const STORAGE_KEY = 'static-bloom-cart'
const CartContext = createContext<CartContextValue | null>(null)

export const lineKey = (l: CartLine) =>
  `${l.productId}::${l.color}::${l.size ?? ''}`

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Array<CartLine>>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setRaw(JSON.parse(stored))
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(raw))
  }, [raw, hydrated])

  const add = useCallback((line: CartLine) => {
    const key = lineKey(line)
    setRaw((prev) => {
      const existing = prev.find((l) => lineKey(l) === key)
      if (existing) {
        return prev.map((l) =>
          lineKey(l) === key ? { ...l, qty: Math.min(l.qty + line.qty, 10) } : l,
        )
      }
      return [...prev, line]
    })
    setLastAdded(key)
    setIsOpen(true)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l) !== key)
        : prev.map((l) =>
            lineKey(l) === key ? { ...l, qty: Math.min(qty, 10) } : l,
          ),
    )
  }, [])

  const remove = useCallback((key: string) => {
    setRaw((prev) => prev.filter((l) => lineKey(l) !== key))
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const lines = raw.flatMap((l) => {
      const product = getProduct(l.productId)
      if (!product) return []
      return [{ ...l, key: lineKey(l), product, lineTotal: product.price * l.qty }]
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      isOpen,
      lastAdded,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQty,
      remove,
      clear: () => setRaw([]),
    }
  }, [raw, isOpen, lastAdded, add, setQty, remove])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
