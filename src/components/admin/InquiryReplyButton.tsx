'use client'
import { useState } from 'react'

export function InquiryReplyButton({ inquiryId, customerEmail, customerName, inquiryType, originalMessage }: {
  inquiryId: string
  customerEmail: string
  customerName: string
  inquiryType: string
  originalMessage: string
}) {
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSend() {
    if (!reply.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/inquiries/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiryId, customerEmail, customerName, inquiryType, originalMessage, reply }),
    })
    if (res.ok) {
      setDone(true)
      setOpen(false)
    } else {
      alert('발송 중 오류가 발생했습니다.')
    }
    setLoading(false)
  }

  if (done) {
    return (
      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, letterSpacing: '0.2em', color: '#4A7C59' }}>
        ✓ 답변 발송 완료
      </span>
    )
  }

  return (
    <div>
      {!open ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={`mailto:${customerEmail}?subject=RE: [ISKINZ] ${inquiryType} 답변&body=%0A%0A%0A---- 원본 문의 ----%0A${encodeURIComponent(originalMessage)}`}
            style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4a6fa5', textDecoration: 'none', padding: '7px 14px', border: '1px solid rgba(74,111,165,0.3)', background: 'rgba(74,111,165,0.04)' }}>
            이메일 답장 →
          </a>
          <button onClick={() => setOpen(true)}
            style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1e2025', padding: '7px 14px', border: '1px solid #c8cdd4', background: 'white', cursor: 'pointer' }}>
            답변 작성 →
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="답변 내용을 입력하세요..."
            rows={5}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid #c8cdd4', fontSize: 13, fontFamily: "'Pretendard', sans-serif", resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ fontSize: 11, color: '#8a9099' }}>
            발신: ceo@iskinz.com → 수신: {customerEmail}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSend} disabled={loading || !reply.trim()}
              style={{ padding: '8px 20px', background: '#1e2025', color: '#e8ebee', border: 'none', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? '발송 중...' : '발송'}
            </button>
            <button onClick={() => { setOpen(false); setReply('') }}
              style={{ padding: '8px 16px', background: 'white', color: '#8a9099', border: '1px solid #c8cdd4', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
