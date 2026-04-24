import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })

  const body = await req.json()
  const service = createServiceClient()
  const { error } = await service.from('profiles').update({
    name: body.name,
    hospital_name: body.hospitalName,
    phone: body.phone,
    birth_date: body.birthDate,
    license_number: body.licenseNumber,
    business_number: body.businessNumber,
    postcode: body.postcode,
    address: body.address,
    address_detail: body.addressDetail,
    tax_email: body.taxEmail,
    member_type: body.memberType,
  }).eq('id', user.id)

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
