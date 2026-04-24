import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, phone, hospital_name, member_type, birth_date, license_number, business_number, postcode, address, address_detail, tax_email, marketing_agreed } = body
    if (!email) return NextResponse.json({ ok: false }, { status: 400 })
    const supabase = createServiceClient()
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const authUser = users.find((u: any) => u.email === email)
    if (!authUser) return NextResponse.json({ ok: false, message: 'user not found' }, { status: 404 })
    const { error } = await supabase
      .from('profiles')
      .update({
        email, name,
        phone: phone || null,
        hospital_name: hospital_name || null,
        member_type: member_type || null,
        birth_date: birth_date || null,
        license_number: license_number || null,
        business_number: business_number || null,
        postcode: postcode || null,
        address: address || null,
        address_detail: address_detail || null,
        tax_email: tax_email || null,
        marketing_agreed: marketing_agreed || false,
      })
      .eq('id', authUser.id)
    if (error) return NextResponse.json({ ok: false }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
