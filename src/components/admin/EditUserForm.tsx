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

  const editableFields = [
    { label: '회원 구분', key: 'member_type', type: 'select', options: ['대표원장', '개원예정의', '봉직의', '의료기관 직원'] },
    { label: '성명', key: 'name', type: 'text' },
    { label: '생년월일', key: 'birth_date', type: 'text', placeholder: 'YYYY/MM/DD' },
    { label: '휴대폰번호', key: 'phone', type: 'text' },
    { label: '병원명', key: 'hospital_name', type: 'text' },
    { label: '의사면허번호', key: 'license_number', type: 'text' },
    { label: '사업자번호', key: 'business_number', type: 'text' },
    { label: '우편번호', key: 'postcode', type: 'text' },
    { label: '주소', key: 'address', type: 'text' },
    { label: '상세주소', key: 'address_detail', type: 'text' },
    { label: '세금계산서 이메일', key: 'tax_email', type: 'text' },
    { label: '마케팅 수신 동의', key: 'marketing_agreed', type: 'checkbox' },
  ]

  const readOnlyFields = [
    { label: '이메일', value: user.email },
    { label: '가입일', value: user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-' },
  ]

  async function handleSave() {
    setLoading(true)
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setEditing(false)
      router.refresh()
    } else {
      alert('저장 중 오류가 발생했습니다.')
    }
    setLoading(false)
  }

  function renderField(f: any) {
    if (!editing) {
      const val = f.type === 'checkbox'
        ? ((form as any)[f.key] ? '동의' : '미동의')
        : ((form as any)[f.key] || '-')
      return <span className="text-sm" style={{ color: 'var(--text-1)' }}>{val}</span>
    }
    if (f.type === 'select') {
      return (
        <select className="text-sm border px-3 py-1.5 flex-1 outline-none"
          style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
          value={(form as any)[f.key]}
          onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
          <option value="">선택</option>
          {f.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
      )
    }
    if (f.type === 'checkbox') {
      return (
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-1)' }}>
          <input type="checkbox" checked={(form as any)[f.key]}
            onChange={e => setForm({ ...form, [f.key]: e.target.checked })} />
          {(form as any)[f.key] ? '동의' : '미동의'}
        </label>
      )
    }
    return (
      <input className="text-sm border px-3 py-1.5 flex-1 outline-none"
        style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
        placeholder={f.placeholder ?? ''}
        value={(form as any)[f.key]}
        onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
    )
  }

  return (
    <>
      <div className="divide-y" style={{ borderColor: '#F0EDE8' }}>
        {editableFields.map(f => (
          <div key={f.key} className="flex items-center px-6 py-3.5">
            <span className="w-40 text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{f.label}</span>
            {renderField(f)}
          </div>
        ))}
        {readOnlyFields.map(f => (
          <div key={f.label} className="flex items-center px-6 py-3.5">
            <span className="w-40 text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{f.label}</span>
            <span className="text-sm" style={{ color: 'var(--text-3)' }}>{f.value ?? '-'}</span>
          </div>
        ))}
      </div>
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
