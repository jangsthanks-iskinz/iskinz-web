'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function EditUserForm({ user }: { user: any }) {
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

  const labelStyle = { color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }
  const inputClass = "text-sm border px-3 py-1.5 flex-1 outline-none"
  const inputStyle = { borderColor: 'var(--border)', color: 'var(--text-1)' }

  // 주소 표시: (우편번호) 주소 상세주소
  const addressDisplay = [
    form.postcode ? `(${form.postcode})` : '',
    form.address,
    form.address_detail,
  ].filter(Boolean).join(' ') || '-'

  return (
    <>
      <div className="divide-y" style={{ borderColor: '#F0EDE8' }}>

        {/* 회원 구분 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>회원 구분</span>
          {editing ? (
            <select className={inputClass} style={inputStyle} value={form.member_type} onChange={e => setForm({ ...form, member_type: e.target.value })}>
              <option value="">선택</option>
              {['대표원장', '개원예정의', '봉직의', '의료기관 직원'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.member_type || '-'}</span>}
        </div>

        {/* 병원명 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>병원명</span>
          {editing ? <input className={inputClass} style={inputStyle} value={form.hospital_name} onChange={e => setForm({ ...form, hospital_name: e.target.value })} />
            : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.hospital_name || '-'}</span>}
        </div>

        {/* 성명 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>성명</span>
          {editing ? <input className={inputClass} style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.name || '-'}</span>}
        </div>

        {/* 휴대전화번호 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>휴대전화번호</span>
          {editing ? <input className={inputClass} style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.phone || '-'}</span>}
        </div>

        {/* 이메일 주소 (읽기전용) */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>이메일 주소</span>
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>{user.email ?? '-'}</span>
        </div>

        {/* 의사면허번호 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>의사면허번호</span>
          {editing ? <input className={inputClass} style={inputStyle} value={form.license_number} onChange={e => setForm({ ...form, license_number: e.target.value })} />
            : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.license_number || '-'}</span>}
        </div>

        {/* 사업자번호 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>사업자번호</span>
          {editing ? <input className={inputClass} style={inputStyle} value={form.business_number} onChange={e => setForm({ ...form, business_number: e.target.value })} />
            : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.business_number || '-'}</span>}
        </div>

        {/* 주소 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>주소</span>
          {editing ? (
            <div className="flex flex-col gap-1 flex-1">
              <input className={inputClass} style={inputStyle} placeholder="우편번호" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
              <input className={inputClass} style={inputStyle} placeholder="주소" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              <input className={inputClass} style={inputStyle} placeholder="상세주소" value={form.address_detail} onChange={e => setForm({ ...form, address_detail: e.target.value })} />
            </div>
          ) : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{addressDisplay}</span>}
        </div>

        {/* 세금계산서 이메일 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>세금계산서 이메일</span>
          {editing ? <input className={inputClass} style={inputStyle} value={form.tax_email} onChange={e => setForm({ ...form, tax_email: e.target.value })} />
            : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.tax_email || '-'}</span>}
        </div>

        {/* 마케팅 수신 동의 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>마케팅 수신 동의</span>
          {editing ? (
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-1)' }}>
              <input type="checkbox" checked={form.marketing_agreed} onChange={e => setForm({ ...form, marketing_agreed: e.target.checked })} />
              {form.marketing_agreed ? '동의' : '미동의'}
            </label>
          ) : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.marketing_agreed ? '동의' : '미동의'}</span>}
        </div>

        {/* 생년월일 */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>생년월일</span>
          {editing ? <input className={inputClass} style={inputStyle} placeholder="YYYY/MM/DD" value={form.birth_date} onChange={e => setForm({ ...form, birth_date: e.target.value })} />
            : <span className="text-sm" style={{ color: 'var(--text-1)' }}>{form.birth_date || '-'}</span>}
        </div>

        {/* 가입일 (읽기전용) */}
        <div className="flex items-center px-6 py-3.5">
          <span className="w-40 text-xs font-semibold flex-shrink-0" style={labelStyle}>가입일</span>
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>{user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}</span>
        </div>

      </div>

      {/* 하단 버튼 */}
      <div className="px-6 py-4 border-t flex gap-2 justify-end" style={{ borderColor: 'var(--border)' }}>
        {editing ? (
          <>
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
          </>
        ) : (
          <button onClick={() => setEditing(true)}
            className="px-4 py-2 text-[12px] font-bold border transition-all hover:opacity-70"
            style={{ borderColor: 'var(--navy)', color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
            회원정보 수정
          </button>
        )}
      </div>
    </>
  )
}
