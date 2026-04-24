const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://iskinz.com'

export function SignupNotifyEmail(data: {
  name: string; email: string; hospitalName?: string; phone?: string;
  memberType?: string; birthDate?: string; licenseNumber?: string;
  businessNumber?: string; postcode?: string; address?: string; addressDetail?: string;
  approveToken?: string;
}) {
  const rows = [
    ['회원 구분', data.memberType],
    ['성명', data.name],
    ['이메일', data.email],
    ['생년월일', data.birthDate],
    ['휴대폰번호', data.phone],
    ['병원명', data.hospitalName],
    ['의사면허번호', data.licenseNumber],
    ['사업자번호', data.businessNumber],
    ['우편번호', data.postcode],
    ['주소', data.address],
    ['상세주소', data.addressDetail],
  ]

  const approveUrl = data.approveToken
    ? `${BASE_URL}/api/admin/users/approve-link?token=${data.approveToken}`
    : `${BASE_URL}/admin/users?status=pending`

  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', background: '#f5f4f1', padding: '40px 20px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', background: '#fff', border: '1px solid #c8cdd4' }}>
          <div style={{ background: '#1e2025', padding: '24px 32px' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#fff', margin: 0, letterSpacing: 4 }}>ISKINZ</p>
            <p style={{ fontSize: 10, color: '#8a9099', margin: '4px 0 0', letterSpacing: 3, textTransform: 'uppercase' }}>New Member Approval Request</p>
          </div>
          <div style={{ padding: '32px' }}>
            <p style={{ fontSize: 14, color: '#1e2025', marginBottom: 24 }}>신규 회원가입 승인 대기 중입니다. 아래 정보를 확인 후 승인해주세요.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <tbody>
                {rows.map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: '1px solid #e8ebee' }}>
                    <td style={{ padding: '10px 0', color: '#8a9099', width: 110, verticalAlign: 'top' }}>{label}</td>
                    <td style={{ padding: '10px 0', color: '#1e2025', fontWeight: 500 }}>{value ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '2px solid #1e2025', textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#8a9099', marginBottom: 16 }}>아래 버튼을 클릭하면 해당 회원이 즉시 승인됩니다. (1회용 링크)</p>
              <a href={approveUrl}
                style={{ display: 'inline-block', padding: '14px 36px', background: '#1e2025', color: '#ffffff', textDecoration: 'none', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                승인하기
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
