import { createServiceClient } from '@/lib/supabase/service'
import { ApproveButton } from '@/components/admin/ApproveButton'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient()
  const { data: u } = await supabase.from('profiles').select('*').eq('id', params.id).single()
  if (!u) notFound()

  const fields = [
    { label: '회원 구분', value: u.member_type },
    { label: '성명', value: u.name },
    { label: '이메일', value: u.email },
    { label: '생년월일', value: u.birth_date },
    { label: '휴대폰번호', value: u.phone },
    { label: '병원명', value: u.hospital_name },
    { label: '의사면허번호', value: u.license_number },
    { label: '사업자번호', value: u.business_number },
    { label: '우편번호', value: u.postcode },
    { label: '주소', value: u.address },
    { label: '상세주소', value: u.address_detail },
    { label: '세금계산서 이메일', value: u.tax_email },
    { label: '마케팅 수신 동의', value: u.marketing_agreed ? '동의' : '미동의' },
    { label: '가입일', value: u.created_at ? new Date(u.created_at).toLocaleDateString('ko-KR') : '-' },
  ]

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users"
          className="text-sm no-underline"
          style={{ color: 'var(--text-2)' }}>
          ← 회원 목록
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
          회원 상세 정보
        </h1>
      </div>

      <div className="bg-white border mb-6" style={{ borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: '#F8F6F2' }}>
          <div className="flex items-center gap-3">
            <span className="font-bold text-base" style={{ color: 'var(--navy)' }}>{u.name ?? '-'}</span>
            <span className="inline-block text-[10px] font-bold px-2.5 py-1"
              style={{
                background: u.approved ? 'rgba(74,124,89,0.12)' : 'rgba(198,160,82,0.12)',
                color: u.approved ? '#4A7C59' : '#8B6914',
                fontFamily: 'Montserrat, sans-serif',
              }}>
              {u.approved ? '승인 완료' : '대기 중'}
            </span>
          </div>
          <div className="flex gap-2">
            <ApproveButton userId={u.id} approved={u.approved ?? false} userEmail={u.email} userName={u.name} />
            <DeleteUserButton userId={u.id} userName={u.name} />
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: '#F0EDE8' }}>
          {fields.map(f => (
            <div key={f.label} className="flex px-6 py-3.5">
              <span className="w-40 text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{f.label}</span>
              <span className="text-sm" style={{ color: 'var(--text-1)' }}>{f.value ?? '-'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
