export function ApproveNotifyEmail(data: { name: string; email: string; approved: boolean }) {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', background: '#f5f4f1', padding: '40px 20px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', background: '#fff', border: '1px solid #c8cdd4' }}>
          <div style={{ background: '#1e2025', padding: '24px 32px' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#fff', margin: 0, letterSpacing: 4 }}>ISKINZ</p>
            <p style={{ fontSize: 10, color: '#8a9099', margin: '4px 0 0', letterSpacing: 3, textTransform: 'uppercase' }}>
              {data.approved ? 'Membership Approved' : 'Membership Revoked'}
            </p>
          </div>
          <div style={{ padding: '32px' }}>
            <p style={{ fontSize: 16, color: '#1e2025', marginBottom: 8 }}>{data.name} 원장님</p>
            {data.approved ? (
              <>
                <p style={{ fontSize: 14, color: '#3a3d44', lineHeight: 1.7, marginBottom: 20 }}>
                  ISKINZ 병원 회원 승인이 완료되었습니다.<br />
                  이제 제품 가격 정보 조회 및 주문이 가능합니다.
                </p>
                <a href="https://iskinz.com"
                  style={{ display: 'inline-block', padding: '12px 28px', background: '#1e2025', color: '#e8ebee', textDecoration: 'none', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
                  ISKINZ 바로가기 →
                </a>
              </>
            ) : (
              <p style={{ fontSize: 14, color: '#3a3d44', lineHeight: 1.7 }}>
                회원 승인이 취소되었습니다. 문의사항이 있으시면 ceo@iskinz.com으로 연락 주세요.
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
