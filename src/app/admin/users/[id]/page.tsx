import { createServiceClient } from '@/lib/supabase/service'
import { UserDetailClient } from '@/components/admin/UserDetailClient'
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
      <UserDetailClient user={u} />
    </div>
  )
}
