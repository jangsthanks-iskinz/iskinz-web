'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import { ApproveButton } from '@/components/admin/ApproveButton'

export function UserDetailClient({ user }: { user: any }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    member_type: user.member_type ?? '',
    name: user.name ?? '',
    birth_date: user.birth_date ?? '',
    phone: user.phone ?? '',
    hospital_name: user.hospital_name ?? '',
    license_number: user.license_number ?? '',
    business_number: user.business_number ?? '',
    postcode: user.postcode ?? '',
    address: user.address ?? '',
    address_detail: user.address_detail ?? '',
    tax_email: user.tax_email ?? '',
    marketing_agreed: user.marketing_agreed ?? false,
  })

  async function handleSave() {
    setLoading(true)
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setEditing(false); router.refresh() }
    else alert('저장 중 오류가 발생했습니다.')
    setLoading(false)
  }

  const L = { color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }
  const IC = "text-sm border px-3 py-1.5 flex-1 outline-none"
  const IS = { borderColor: 'var(--border)', color: 'var(--text-1)' }
  const addr = [form.postcode ? `(${form.postcode})` : '', form.address, form.address_detail].filter(Boolean).join(' ') || '-'

  function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="flex items-center px-6 py-3.5 border-b" style={{ borderColor: '#F0EDE8' }}>
        <span className="w-44 text-xs font-semibold flex-shrink-0" style={L}>{label}</span>
        {children}
      </div>
    )
  }

  return (
    <div className="bg-white border" style={{ borderColor: 'var(--border)' }}>

      {/* 헤더: 이름+상태(왼) / 승인취소+회원정보수정(오) 가로 병렬 */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: '#F8F6F2' }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-base" style={{ color: 'var(--navy)' }}>{user.name ?? '-'}</span>
          <span className="inline-block text-[10px] font-bold px-2.5 py-1"
            style={{
              background: user.approved ? 'rgba(74,124,89,0.12)' : 'rgba(198,160,82,0.12)',
              color: user.approved ? '#4A7C59' : '#8B6914',
              fontFamily: 'Montserrat, sans-serif',
            }}>
            {user.approved ? '완료' : '대기'}
          </span>
        </div>
        <div className="flex gap-2">
          <ApproveButton userId={user.id} approved={user.approved ?? false} userEmail={user.email} userName={user.name} />
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="px-3 py-1.5 text-[11px] font-bold border transition-all hover:opacity-70"
              style={{ borderColor: 'var(--navy)', color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
              회원정보 수정
            </button>
          )}
        </div>
      </div>

      {/* 폼 */}
      <Row label="회원 구분">
        {editing ? (
          <select className={IC} style={IS} value={form.member_type} onChange={e => setForm({ ...form, member_type: e.target.value })}>
            <option value="">선택</option>
            {['대표원장', '개원예정의', '봉직의', '의료기관 직원'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.member_type || '-'}</span>}
      </Row>

      <Row label="병원명">
        {editing ? <input className={IC} style={IS} value={form.hospital_name} onChange={e => setForm({ ...form, hospital_name: e.target.value })} />
          : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.hospital_name || '-'}</span>}
      </Row>

      <Row label="성명">
        {editing ? <input className={IC} style={IS} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.name || '-'}</span>}
      </Row>

      <Row label="휴대전화번호">
        {editing ? <input className={IC} style={IS} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.phone || '-'}</span>}
      </Row>

      <Row label="이메일 주소">
        <span className="text-sm" style={{ color: 'var(--text-3)' }}>{user.email ?? '-'}</span>
      </Row>

      <Row label="의사면허번호">
        {editing ? <input className={IC} style={IS} value={form.license_number} onChange={e => setForm({ ...form, license_number: e.target.value })} />
          : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.license_number || '-'}</span>}
      </Row>

      <Row label="사업자번호">
        {editing ? <input className={IC} style={IS} value={form.business_number} onChange={e => setForm({ ...form, business_number: e.target.value })} />
          : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.business_number || '-'}</span>}
      </Row>

      <Row label="주소">
        {editing ? (
          <div className="flex flex-col gap-1 flex-1">
            <input className={IC} style={IS} placeholder="우편번호" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
            <input className={IC} style={IS} placeholder="주소" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            <input className={IC} style={IS} placeholder="상세주소" value={form.address_detail} onChange={e => setForm({ ...form, address_detail: e.target.value })} />
          </div>
        ) : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{addr}</span>}
      </Row>

      <Row label="세금계산서 이메일">
        {editing ? <input className={IC} style={IS} value={form.tax_email} onChange={e => setForm({ ...form, tax_email: e.target.value })} />
          : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.tax_email || '-'}</span>}
      </Row>

      <Row label="마케팅 수신 동의">
        {editing ? (
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-1)' }}>
            <input type="checkbox" checked={form.marketing_agreed} onChange={e => setForm({ ...form, marketing_agreed: e.target.checked })} />
            {form.marketing_agreed ? '동의' : '미동의'}
          </label>
        ) : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.marketing_agreed ? '동의' : '미동의'}</span>}
      </Row>

      <Row label="생년월일">
        {editing ? <input className={IC} style={IS} placeholder="YYYY/MM/DD" value={form.birth_date} onChange={e => setForm({ ...form, birth_date: e.target.value })} />
          : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.birth_date || '-'}</span>}
      </Row>

      <Row label="가입일">
        <span className="text-sm" style={{ color: 'var(--text-3)' }}>{user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}</span>
      </Row>

      {/* 하단: 회원삭제(왼) / 저장+취소(오른쪽, 수정중일때만) */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
        <DeleteUserButton userId={user.id} userName={user.name} />
        {editing && (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} disabled={loading}
              className="px-4 py-2 text-[12px] font-bold border transition-all hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text-2)', fontFamily: 'Montserrat, sans-serif' }}>
              취소
            </button>
            <button onClick={handleSave} disabled={loading}
              className="px-4 py-2 text-[12px] font-bold transition-all hover:opacity-70 disabled:opacity-40"
              style={{ background: 'var(--navy)', color: 'white', fontFamily: 'Montserrat, sans-serif' }}>
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
