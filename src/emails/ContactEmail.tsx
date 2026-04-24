import {
  Html, Head, Body, Container, Section, Text, Hr, Heading,
} from '@react-email/components'

interface Props {
  name: string
  phone: string
  email: string
  inquiryType: string
  message: string
}

export function ContactEmail({ name, phone, email, inquiryType, message }: Props) {
  return (
    <Html lang="ko">
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', background: '#F8F9FC', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
          {/* Header */}
          <Section style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', padding: '32px 40px' }}>
            <Heading style={{ color: '#fff', margin: 0, fontFamily: 'Georgia, serif', fontSize: 28, letterSpacing: 4 }}>
              ISKINZ
            </Heading>
            <Text style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: 12, letterSpacing: 3 }}>
              NEW INQUIRY
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '40px' }}>
            <Heading as="h2" style={{ fontSize: 20, color: '#0F172A', margin: '0 0 24px' }}>
              새 문의가 접수되었습니다
            </Heading>

            {[
              { label: '이름', value: name },
              { label: '연락처', value: phone },
              { label: '이메일', value: email },
              { label: '문의 유형', value: inquiryType || '-' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', marginBottom: 12 }}>
                <Text style={{ width: 80, color: '#64748B', fontSize: 13, margin: 0, fontWeight: 600 }}>
                  {row.label}
                </Text>
                <Text style={{ flex: 1, color: '#0F172A', fontSize: 13, margin: 0 }}>
                  {row.value}
                </Text>
              </div>
            ))}

            <Hr style={{ margin: '20px 0', borderColor: '#E2E8F1' }} />

            <Text style={{ fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>문의 내용</Text>
            <Section style={{ background: '#F8F9FC', borderRadius: 10, padding: '16px 20px' }}>
              <Text style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>
                {message}
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ background: '#0D1120', padding: '24px 40px' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'center', margin: 0 }}>
              © 2024 ISKINZ. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ContactEmail
