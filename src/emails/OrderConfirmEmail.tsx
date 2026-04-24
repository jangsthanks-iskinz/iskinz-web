import {
  Html, Head, Body, Container, Section, Text, Hr, Heading,
} from '@react-email/components'
import type { Order } from '@/types'

interface Props { order: Order }

export function OrderConfirmEmail({ order }: Props) {
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
              ORDER CONFIRMED
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '40px' }}>
            <Heading as="h2" style={{ fontSize: 20, color: '#0F172A', margin: '0 0 8px' }}>
              주문이 완료되었습니다 ✅
            </Heading>
            <Text style={{ color: '#64748B', fontSize: 14, margin: '0 0 24px' }}>
              감사합니다. 주문이 정상적으로 접수되었습니다.
            </Text>

            {/* Order Number */}
            <Section style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
              <Text style={{ margin: 0, fontSize: 12, color: '#06B6D4', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                주문번호
              </Text>
              <Text style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: 1 }}>
                {order.order_number}
              </Text>
            </Section>

            {/* Shipping */}
            <Heading as="h3" style={{ fontSize: 14, color: '#0F172A', fontWeight: 700, marginBottom: 12 }}>배송지</Heading>
            {[
              { label: '받는 분', value: order.shipping_name },
              { label: '연락처', value: order.shipping_phone },
              { label: '주소', value: `(${order.shipping_zipcode}) ${order.shipping_address1} ${order.shipping_address2 ?? ''}` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', marginBottom: 8 }}>
                <Text style={{ width: 70, color: '#64748B', fontSize: 13, margin: 0, fontWeight: 600 }}>{row.label}</Text>
                <Text style={{ flex: 1, color: '#0F172A', fontSize: 13, margin: 0 }}>{row.value}</Text>
              </div>
            ))}

            <Hr style={{ margin: '20px 0', borderColor: '#E2E8F1' }} />

            {/* Order Items */}
            {order.order_items?.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ margin: 0, fontSize: 13, color: '#0F172A' }}>
                  {item.product_name} × {item.quantity}
                </Text>
                <Text style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  ₩{item.subtotal.toLocaleString()}
                </Text>
              </div>
            ))}

            <Hr style={{ margin: '16px 0', borderColor: '#E2E8F1' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>총 결제 금액</Text>
              <Text style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                ₩{order.total_amount.toLocaleString()}
              </Text>
            </div>
          </Section>

          {/* Footer */}
          <Section style={{ background: '#0D1120', padding: '24px 40px' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'center', margin: 0 }}>
              © 2024 ISKINZ · contact@iskinz.com · 문의: 02-0000-0000
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmEmail
