import { createServiceClient } from '@/lib/supabase/server'

export default async function AdminInquiriesPage({ searchParams }: { searchParams: { type?: string } }) {
  const supabase = createServiceClient()
  const typeFilter = searchParams.type ?? 'all'

  let query = supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (typeFilter !== 'all') query = query.eq('inquiry_type', typeFilter)

  const { data: inquiries, error } = await query

  // 전체 카운트
  const { count: totalCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true })
  const { count: unreadCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread')

  const types = ['all', 'NCTF 135HA 구매 문의', '더말필러 구매 문의', '의료기기 문의', '병원 납품 상담', '브랜드 파트너십', 'Academy 신청', '기타 문의']

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8a9099', marginBottom: 4 }}>ADMIN</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.8rem', fontWeight: 300, color: '#1e2025' }}>문의 관리</h1>
          <p style={{ fontSize: 13, color: '#8a9099', marginTop: 4 }}>홈페이지 문의 폼으로 접수된 상담 내역</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ textAlign: 'center', background: 'white', border: '1px solid #c8cdd4', padding: '12px 20px' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.6rem', fontWeight: 300, color: '#1e2025' }}>{totalCount ?? 0}</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a9099' }}>전체</div>
          </div>
          <div style={{ textAlign: 'center', background: 'white', border: `1px solid ${(unreadCount ?? 0) > 0 ? '#b5a99a' : '#c8cdd4'}`, borderLeftWidth: (unreadCount ?? 0) > 0 ? 3 : 1, padding: '12px 20px' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.6rem', fontWeight: 300, color: (unreadCount ?? 0) > 0 ? '#b5a99a' : '#1e2025' }}>{unreadCount ?? 0}</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a9099' }}>미확인</div>
          </div>
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {types.map(t => (
          <a key={t} href={`/admin/inquiries?type=${encodeURIComponent(t)}`}
            style={{
              padding: '6px 14px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid',
              background: typeFilter === t ? '#1e2025' : 'white',
              color: typeFilter === t ? '#e8ebee' : '#8a9099',
              borderColor: typeFilter === t ? '#1e2025' : '#c8cdd4',
            }}>
            {t === 'all' ? '전체' : t}
          </a>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(184,74,74,0.06)', border: '1px solid rgba(184,74,74,0.3)', padding: '16px 20px', marginBottom: 16, fontSize: 13, color: '#B84A4A' }}>
          오류: {error.message}
        </div>
      )}

      {!inquiries || inquiries.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #c8cdd4', padding: '60px 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a9099' }}>문의 내역이 없습니다</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {inquiries.map((inq: any) => {
            const isUnread = inq.status === 'unread' || !inq.status
            return (
              <div key={inq.id} style={{ background: 'white', border: '1px solid #c8cdd4', borderLeftWidth: isUnread ? 3 : 1, borderLeftColor: isUnread ? '#b5a99a' : '#c8cdd4' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #e8ebee', background: '#f5f4f1', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    {isUnread && (
                      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '2px 7px', background: '#b5a99a', color: '#fff' }}>NEW</span>
                    )}
                    <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 8px', background: '#1e2025', color: '#e8ebee' }}>
                      {inq.inquiry_type || '기타'}
                    </span>
                    <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, letterSpacing: '0.1em', color: '#1e2025', fontWeight: 500 }}>{inq.name}</span>
                    <span style={{ fontSize: 12, color: '#4a6fa5' }}>{inq.email}</span>
                    {inq.phone && <span style={{ fontSize: 12, color: '#8a9099' }}>{inq.phone}</span>}
                  </div>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, color: '#8a9099', whiteSpace: 'nowrap' }}>
                    {new Date(inq.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {/* Message */}
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: 13, color: '#3a3d44', lineHeight: 1.8, fontWeight: 300, whiteSpace: 'pre-wrap', marginBottom: 14 }}>{inq.message}</p>
                  <a href={`mailto:${inq.email}?subject=RE: [ISKINZ] ${inq.inquiry_type || '문의'} 답변&body=%0A%0A%0A---- 원본 문의 ----%0A${encodeURIComponent(inq.message)}`}
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4a6fa5', textDecoration: 'none', padding: '7px 14px', border: '1px solid rgba(74,111,165,0.3)', background: 'rgba(74,111,165,0.04)' }}>
                    이메일 답장 →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p style={{ marginTop: 16, fontSize: 11, color: '#8a9099' }}>총 {inquiries?.length ?? 0}건 표시 중</p>
    </div>
  )
}
