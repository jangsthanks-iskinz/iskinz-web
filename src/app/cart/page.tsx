import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { CartContent } from './CartContent'

export default async function CartPage({ searchParams }: { searchParams: { add?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const service = createServiceClient()

  if (searchParams.add) {
    const { data: existing } = await service
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', searchParams.add)
      .single()

    if (existing) {
      await service.from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('user_id', user.id)
        .eq('product_id', searchParams.add)
    } else {
      await service.from('cart_items')
        .insert({ user_id: user.id, product_id: searchParams.add, quantity: 1 })
    }
  }

  const { data: initialItems } = await service
    .from('cart_items')
    .select('id, user_id, product_id, quantity, products(id, name_ko, name_en, image_url, price, sale_price)')
    .eq('user_id', user.id)

  return <CartContent initialItems={initialItems ?? []} />
}
