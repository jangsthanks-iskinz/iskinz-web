'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

export default function AdminCategoriesPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', name_en: '', parent_id: '' })
  const [editForm, setEditForm] = useState({ name: '', name_en: '', parent_id: '', is_active: true })
  const [showNewForm, setShowNewForm] = useState(false)

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (data) setCategories(data)
  }

  useEffect(() => { fetchCategories() }, [])

  const parentCategories = categories.filter(c => !c.parent_id)
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId)

  async function handleAdd() {
    if (!newCategory.name) return
    setLoading(true)
    const maxOrder = categories.filter(c => c.parent_id === (newCategory.parent_id || null)).length
    await supabase.from('categories').insert({
      name: newCategory.name,
      name_en: newCategory.name_en || null,
      parent_id: newCategory.parent_id || null,
      sort_order: maxOrder + 1,
      is_active: true,
    })
    setNewCategory({ name: '', name_en: '', parent_id: '' })
    setShowNewForm(false)
    await fetchCategories()
    setLoading(false)
  }

  async function handleEdit(c: any) {
    setEditingId(c.id)
    setEditForm({ name: c.name, name_en: c.name_en ?? '', parent_id: c.parent_id ?? '', is_active: c.is_active })
  }

  async function handleSave(id: string) {
    setLoading(true)
    await supabase.from('categories').update({
      name: editForm.name,
      name_en: editForm.name_en || null,
      parent_id: editForm.parent_id || null,
      is_active: editForm.is_active,
    }).eq('id', id)
    setEditingId(null)
    await fetchCategories()
    setLoading(false)
  }

  async function handleDelete(id: string, name: string) {
    const children = getChildren(id)
    if (children.length > 0) {
      alert(`"${name}"에 하위 카테고리가 있어요. 하위 카테고리를 먼저 삭제해주세요.`)
      return
    }
    if (!window.confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return
    setLoading(true)
    await supabase.from('categories').delete().eq('id', id)
    await fetchCategories()
    setLoading(false)
  }

  async function handleToggleActive(id: string, current: boolean) {
    await supabase.from('categories').update({ is_active: !current }).eq('id', id)
    await fetchCategories()
  }

  async function handleMoveUp(id: string, parentId: string | null) {
    const siblings = categories
      .filter(c => (c.parent_id ?? null) === (parentId ?? null))
      .sort((a, b) => a.sort_order - b.sort_order)
    const idx = siblings.findIndex(c => c.id === id)
    if (idx === 0) return
    const prev = siblings[idx - 1]
    const curr = siblings[idx]
    await supabase.from('categories').update({ sort_order: prev.sort_order }).eq('id', curr.id)
    await supabase.from('categories').update({ sort_order: curr.sort_order }).eq('id', prev.id)
    await fetchCategories()
  }

  async function handleMoveDown(id: string, parentId: string | null) {
    const siblings = categories
      .filter(c => (c.parent_id ?? null) === (parentId ?? null))
      .sort((a, b) => a.sort_order - b.sort_order)
    const idx = siblings.findIndex(c => c.id === id)
    if (idx === siblings.length - 1) return
    const next = siblings[idx + 1]
    const curr = siblings[idx]
    await supabase.from('categories').update({ sort_order: next.sort_order }).eq('id', curr.id)
    await supabase.from('categories').update({ sort_order: curr.sort_order }).eq('id', next.id)
    await fetchCategories()
  }

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px', border: '1px solid #E8E4DD',
    borderRadius: 6, fontSize: 13, fontFamily: PRETENDARD,
    outline: 'none', background: '#fff', color: '#1e2025',
  }

  const CategoryRow = ({ c, depth = 0 }: { c: any, depth?: number }) => {
    const isEditing = editingId === c.id
    const children = getChildren(c.id)

    return (
      <>
        <tr className="border-t hover:bg-[#FAFAF7] transition-colors" style={{ borderColor: '#F0EDE8' }}>
          <td className="px-5 py-3 text-xs font-bold" style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>
            {depth === 0 ? '상위' : <span style={{ paddingLeft: 16, color: '#4a6fa5' }}>└ 하위</span>}
          </td>
          <td className="px-5 py-3">
            {isEditing ? (
              <input value={editForm.name} onChange={e => setEditForm(v => ({ ...v, name: e.target.value }))}
                style={{ ...inputStyle, width: 140 }} />
            ) : (
              <span style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, color: 'var(--navy)', paddingLeft: depth * 16 }}>
                {c.name}
              </span>
            )}
          </td>
          <td className="px-5 py-3">
            {isEditing ? (
              <input value={editForm.name_en} onChange={e => setEditForm(v => ({ ...v, name_en: e.target.value }))}
                placeholder="영문명" style={{ ...inputStyle, width: 160 }} />
            ) : (
              <span style={{ fontSize: 13, color: 'var(--text-2)', fontFamily: PRETENDARD }}>{c.name_en ?? '-'}</span>
            )}
          </td>
          <td className="px-5 py-3">
            <button onClick={() => handleToggleActive(c.id, c.is_active)}
              style={{
                padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                background: c.is_active ? 'rgba(74,124,89,0.12)' : 'rgba(184,74,74,0.12)',
                color: c.is_active ? '#4A7C59' : '#B84A4A',
                fontFamily: 'Montserrat, sans-serif',
              }}>
              {c.is_active ? '노출' : '비노출'}
            </button>
          </td>
          <td className="px-5 py-3">
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button onClick={() => handleMoveUp(c.id, c.parent_id ?? null)}
                style={{ padding: '4px 8px', background: '#F8F6F2', border: '1px solid #E8E4DD', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>↑</button>
              <button onClick={() => handleMoveDown(c.id, c.parent_id ?? null)}
                style={{ padding: '4px 8px', background: '#F8F6F2', border: '1px solid #E8E4DD', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>↓</button>
            </div>
          </td>
          <td className="px-5 py-3">
            <div style={{ display: 'flex', gap: 6 }}>
              {isEditing ? (
                <>
                  <button onClick={() => handleSave(c.id)} disabled={loading}
                    style={{ padding: '6px 12px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: PRETENDARD }}>
                    저장
                  </button>
                  <button onClick={() => setEditingId(null)}
                    style={{ padding: '6px 12px', background: '#F8F6F2', border: '1px solid #E8E4DD', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: PRETENDARD }}>
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(c)}
                    style={{ padding: '6px 12px', background: 'rgba(74,111,165,0.1)', color: '#4a6fa5', border: '1px solid rgba(74,111,165,0.3)', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: PRETENDARD }}>
                    수정
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)}
                    style={{ padding: '6px 12px', background: 'rgba(184,74,74,0.1)', color: '#B84A4A', border: '1px solid rgba(184,74,74,0.3)', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: PRETENDARD }}>
                    삭제
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
        {children.sort((a, b) => a.sort_order - b.sort_order).map(child => (
          <CategoryRow key={child.id} c={child} depth={1} />
        ))}
      </>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>카테고리 관리</h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>상품 카테고리 추가 및 관리</p>
        </div>
        <button onClick={() => setShowNewForm(true)}
          style={{ padding: '10px 20px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: PRETENDARD }}>
          + 카테고리 추가
        </button>
      </div>

      {/* 추가 폼 */}
      {showNewForm && (
        <div className="bg-white border p-6 mb-6" style={{ borderColor: '#E8E4DD', borderRadius: 8 }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>새 카테고리 추가</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8a9099', marginBottom: 6, fontFamily: PRETENDARD }}>카테고리명 *</label>
              <input value={newCategory.name} onChange={e => setNewCategory(v => ({ ...v, name: e.target.value }))}
                placeholder="예) 스킨부스터" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8a9099', marginBottom: 6, fontFamily: PRETENDARD }}>영문명</label>
              <input value={newCategory.name_en} onChange={e => setNewCategory(v => ({ ...v, name_en: e.target.value }))}
                placeholder="예) Skin Boosters" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8a9099', marginBottom: 6, fontFamily: PRETENDARD }}>상위 카테고리</label>
              <select value={newCategory.parent_id} onChange={e => setNewCategory(v => ({ ...v, parent_id: e.target.value }))}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' as const }}>
                <option value="">없음 (상위 카테고리)</option>
                {parentCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} disabled={loading || !newCategory.name}
              style={{ padding: '8px 20px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: PRETENDARD, opacity: !newCategory.name ? 0.5 : 1 }}>
              추가
            </button>
            <button onClick={() => { setShowNewForm(false); setNewCategory({ name: '', name_en: '', parent_id: '' }) }}
              style={{ padding: '8px 20px', background: '#F8F6F2', border: '1px solid #E8E4DD', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: PRETENDARD }}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-white border" style={{ borderColor: '#E8E4DD', borderRadius: 8, overflow: 'hidden' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F8F6F2' }}>
              {['구분', '카테고리명', '영문명', '노출상태', '순서', '관리'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-bold tracking-[1px] uppercase whitespace-nowrap"
                  style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parentCategories.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-3)' }}>등록된 카테고리가 없습니다</td></tr>
            ) : parentCategories.sort((a, b) => a.sort_order - b.sort_order).map(c => (
              <CategoryRow key={c.id} c={c} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
