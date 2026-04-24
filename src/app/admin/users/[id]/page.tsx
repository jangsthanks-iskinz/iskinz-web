import { createServiceClient } from '@/lib/supabase/service'
import { ApproveButton } from '@/components/admin/ApproveButton'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import { EditUserForm } from '@/components/admin/EditUserForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient()
  const { data: u } = await supabase.from('profiles').select('*').eq('id', params.id).single()
  if (!u) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="text-sm no-underline" style={{ color: 'var(--text-2)' }}>← 회원 목록</Link>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>회원 상세 정보</h1>
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
        <EditUserForm user={u} />
      </div>
    </div>
  )
}
