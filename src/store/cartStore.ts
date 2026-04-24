import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (product: Pick<Product, 'id' | 'slug' | 'name_ko' | 'price' | 'emoji'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  totalCount: () => number
  totalAmount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem(product) {
        set(state => {
          const existing = state.items.find(i => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { id: product.id, slug: product.slug, name_ko: product.name_ko, price: product.price, emoji: product.emoji, quantity: 1 },
            ],
          }
        })
      },

      removeItem(id) {
        set(state => ({ items: state.items.filter(i => i.id !== id) }))
      },

      updateQty(id, qty) {
        if (qty <= 0) {
          get().removeItem(id)
          return
        }
        set(state => ({
          items: state.items.map(i => (i.id === id ? { ...i, quantity: qty } : i)),
        }))
      },

      clearCart() {
        set({ items: [] })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      totalCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      totalAmount() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    {
      name: 'iskinz-cart',
      // isOpen은 persist에서 제외 (페이지 새로고침 시 닫힌 상태로)
      partialize: state => ({ items: state.items }),
    }
  )
)
