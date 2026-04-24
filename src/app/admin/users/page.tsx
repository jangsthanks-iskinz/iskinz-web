import { createServiceClient } from '@/lib/supabase/service'
import { ApproveButton } from '@/components/admin/ApproveButton'
import { RoleSelector } from '@/components/admin/RoleSelector'
import Link from 'next/link'

export default async function AdminUsersPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createServiceClient()
  const statusFilter = searchParams.status ?? 'all'

  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (statusFilter === 'pending') query = query.or('approved.eq.false,approved.is.null')
  else if (statusFilter === 'approved') query = query.eq('approved', true)

  const { data: users } = await query

  const tabs = [
    { key: 'all', label: '전체' },
    { key: 'pending', label: '승인 대기' },
    { key: 'approved', label: '승인 완료' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>회원 관리</h1>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>병원 회원 가입 승인 및 등급 관리</p>
      </div>

      <div className="flex gap-1 mb-6">
        {tabs.map(t => (
          <a key={t.key} href={`/admin/users?status=${t.key}`}
            className="px-5 py-2.5 text-[12px] font-bold no-underline transition-colors"
            style={{
              background: statusFilter === t.key ? 'var(--navy)' : 'white',
              color: statusFilter === t.key ? 'white' : 'var(--text-2)',
              fontFamily: 'Montserrat, sans-serif', letterSpacing: 1,
              border: '1px solid', borderColor: statusFilter === t.key ? 'var(--navy)' : 'var(--border)',
            }}>
            {t.label}
          </a>
        ))}
      </div>

      <div className="bg-white border" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8F6F2' }}>
                {['이름', '이메일', '병원명', '연락처', '등급', '승인 상태', '가입일', '관리'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold tracking-[1px] uppercase whitespace-nowrap"
                    style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!users || users.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-3)' }}>해당하는 회원이 없습니다</td></tr>
              ) : users.map((u: any) => (
                <tr key={u.id} className="border-t hover:bg-[#FAFAF7] transition-colors" style={{ borderColor: '#F0EDE8' }}>
                  <td className="px-5 py-4 font-semibold">
                    <Link href={`/admin/users/${u.id}`} className="no-underline hover:underline" style={{ color: 'var(--navy)' }}>{u.name ?? '-'}</Link>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <Link href={`/admin/users/${u.id}`} className="no-underline block" style={{ color: 'var(--text-2)' }}>{u.email ?? '-'}</Link>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <Link href={`/admin/users/${u.id}`} className="no-underline block" style={{ color: 'var(--text-2)' }}>{u.hospital_name ?? '-'}</Link>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <Link href={`/admin/users/${u.id}`} className="no-underline block" style={{ color: 'var(--text-2)' }}>{u.phone ?? '-'}</Link>
                  </td>
                  <td className="px-5 py-4">
                    <RoleSelector userId={u.id} currentRole={u.role ?? 'user'} />
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/users/${u.id}`} className="no-underline block">
                      <span className="inline-block text-[10px] font-bold px-2.5 py-1"
                        style={{
                          background: u.approved ? 'rgba(74,124,89,0.12)' : 'rgba(198,160,82,0.12)',
                          color: u.approved ? '#4A7C59' : '#8B6914',
                          fontFamily: 'Montserrat, sans-serif',
                        }}>
                        {u.approved ? '승인 완료' : '대기 중'}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <Link href={`/admin/users/${u.id}`} className="no-underline block" style={{ color: 'var(--text-3)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('ko-KR') : '-'}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <ApproveButton userId={u.id} approved={u.approved ?? false} userEmail={u.email} userName={u.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
