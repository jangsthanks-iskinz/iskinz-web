// ─── Product ───────────────────────────────────
export interface Product {
  id: string
  slug: string
  name_en: string
  name_ko: string
  category: '세럼' | '크림' | '앰플' | '토너' | '선케어' | '스킨부스터' | '더말필러' | '의료기기' | '더마코스메틱'
  description: string
  price: number
  price_original: number | null
  emoji: string
  image_url: string | null
  gradient_bg: string
  badges: string[]
  in_stock: boolean
  stock_qty: number
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Cart ───────────────────────────────────────
export interface CartItem {
  id: string
  slug: string
  name_ko: string
  price: number
  emoji: string
  quantity: number
}

// ─── Order ──────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  guest_email: string | null
  status: OrderStatus
  total_amount: number
  shipping_fee: number
  shipping_name: string
  shipping_phone: string
  shipping_zipcode: string
  shipping_address1: string
  shipping_address2: string | null
  payment_key: string | null
  payment_method: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
}

// ─── Checkout ───────────────────────────────────
export interface ShippingInfo {
  name: string
  phone: string
  zipcode: string
  address1: string
  address2: string
  email: string
}

// ─── Inquiry ────────────────────────────────────
export interface Inquiry {
  id: string
  name: string
  phone: string
  email: string
  inquiry_type: string | null
  message: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
}

// ─── Profile ────────────────────────────────────
export interface Profile {
  id: string
  name: string | null
  phone: string | null
  role: 'user' | 'vip' | 'partner' | 'admin'
  approved?: boolean
  hospital_name?: string | null
  email?: string | null
  created_at: string
  updated_at: string
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  preparing: '상품 준비 중',
  shipped: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소됨',
  refunded: '환불 완료',
}
