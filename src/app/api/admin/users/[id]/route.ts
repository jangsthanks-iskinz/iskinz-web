import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServiceClient()
  const body = await req.json()
  const { error } = await supabase.from('profiles').update({
    name: body.name,
    phone: body.phone,
    hospital_name: body.hospital_name,
    license_number: body.license_number,
    business_number: body.business_number,
    postcode: body.postcode,
    address: body.address,
    address_detail: body.address_detail,
    tax_email: body.tax_email,
  }).eq('id', params.id)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
