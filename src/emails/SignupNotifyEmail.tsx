export function SignupNotifyEmail(data: {
  name: string; email: string; hospitalName?: string; phone?: string
}) {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', background: '#f5f4f1', padding: '40px 20px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', background: '#fff', border: '1px solid #c8cdd4' }}>
          <div style={{ background: '#1e2025', padding: '24px 32px' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#fff', margin: 0, letterSpacing: 4 }}>ISKINZ</p>
            <p style={{ fontSize: 10, color: '#8a9099', margin: '4px 0 0', letterSpacing: 3, textTransform: 'uppercase' }}>New Member Approval Request</p>
          </div>
          <div style={{ padding: '32px' }}>
            <p style={{ fontSize: 14, color: '#1e2025', marginBottom: 24 }}>새 회원 승인 요청이 있습니다.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              {[
                ['이름', data.name],
                ['이메일', data.email],
                ['병원명', data.hospitalName ?? '-'],
                ['연락처', data.phone ?? '-'],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid #e8ebee' }}>
                  <td style={{ padding: '10px 0', color: '#8a9099', width: 80 }}>{label}</td>
                  <td style={{ padding: '10px 0', color: '#1e2025', fontWeight: 500 }}>{value}</td>
                </tr>
              ))}
            </table>
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #e8ebee' }}>
              <a href="https://iskinz.com/admin/users?status=pending"
                style={{ display: 'inline-block', padding: '12px 28px', background: '#1e2025', color: '#e8ebee', textDecoration: 'none', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
                관리자 페이지에서 승인하기 →
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
