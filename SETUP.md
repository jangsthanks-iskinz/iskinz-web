# ISKINZ 배포 가이드

## 전체 순서 요약

```
1. GitHub 저장소 생성
2. Supabase 프로젝트 생성 + DB 스키마 실행
3. Resend 가입 + 도메인 인증
4. 토스페이먼츠 테스트 계정 확인
5. Vercel 배포 + 환경변수 설정
6. 가비아 DNS 설정 (iskinz.com, iskinz.co.kr)
7. 토스페이먼츠 URL 등록
```

---

## 1. 로컬 개발 시작

```bash
# iskinz-web 폴더로 이동
cd iskinz-web

# 의존성 설치
npm install

# 환경변수 파일 생성
cp .env.example .env.local
# .env.local을 열어서 실제 키값 입력

# 개발 서버 실행
npm run dev
# → http://localhost:3000
```

---

## 2. Supabase 설정

### 2-1. 프로젝트 생성
1. https://supabase.com → "New project"
2. 프로젝트명: `iskinz`, 지역: `Northeast Asia (Seoul)` 선택
3. DB 비밀번호 저장해두기

### 2-2. 스키마 실행
1. 대시보드 좌측 → **SQL Editor**
2. `supabase/schema.sql` 내용 전체 복사 → 붙여넣기 → **Run**
3. 완료 후 Table Editor에서 `products`, `orders`, `profiles`, `inquiries` 테이블 확인

### 2-3. 환경변수 복사
대시보드 좌측 → **Settings > API**에서:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role secret key

### 2-4. 이메일 인증 설정
대시보드 → **Authentication > Email Templates**
- 한국어로 템플릿 수정 (선택)

대시보드 → **Authentication > URL Configuration**
- Site URL: `https://iskinz.com`
- Redirect URLs: `https://iskinz.com/auth/callback`

---

## 3. Resend 이메일 설정

### 3-1. 가입 및 도메인 인증
1. https://resend.com 가입
2. 좌측 **Domains** → **Add Domain** → `iskinz.com` 입력
3. 아래 DNS 레코드가 생성됨 → 가비아에서 추가 필요:

```
# TXT 레코드 (SPF)
이름: @  (또는 resend._domainkey)
값:  Resend가 제공하는 값

# DKIM 레코드
이름: resend._domainkey
타입: TXT
값:  Resend가 제공하는 값
```

### 3-2. API 키 발급
좌측 **API Keys** → **Create API Key** → `.env.local`의 `RESEND_API_KEY`에 입력

---

## 4. 토스페이먼츠

### 테스트 단계 (지금 바로 가능)
https://developers.tosspayments.com 에서 무료 테스트 계정 생성:
- 테스트 클라이언트 키 → `NEXT_PUBLIC_TOSS_CLIENT_KEY`
- 테스트 시크릿 키 → `TOSS_SECRET_KEY`

테스트 카드 번호: `4242 4242 4242 4242`, 만료일 임의, CVC 임의

### 실서비스 전환 (사업자 등록 필요)
1. 토스페이먼츠 가맹점 신청 (사업자등록증 필요)
2. 심사 완료 후 라이브 키 발급
3. `.env.local` 및 Vercel 환경변수에서 `test_` → `live_` 키로 교체
4. 토스페이먼츠 대시보드 → **결제 URL 등록**:
   - 성공 URL: `https://iskinz.com/checkout/success`
   - 실패 URL: `https://iskinz.com/checkout/fail`

---

## 5. Vercel 배포

### 5-1. GitHub 저장소 생성
```bash
git init
git add .
git commit -m "feat: ISKINZ 초기 세팅"
git remote add origin https://github.com/[계정명]/iskinz-web.git
git push -u origin main
```

### 5-2. Vercel 연결
1. https://vercel.com → "Add New Project"
2. GitHub 저장소 선택 → **Import**
3. Framework: Next.js (자동 감지)
4. **Environment Variables** 탭 → `.env.example`의 모든 항목 입력

### 5-3. 배포 확인
- `https://iskinz-web.vercel.app` 처럼 임시 URL이 생성됨
- 정상 작동 확인 후 도메인 연결로 이동

---

## 6. 가비아 DNS 설정 (가비아 기준)

### iskinz.com 연결

1. https://www.gabia.com 로그인
2. My 가비아 → **도메인 관리** → `iskinz.com` 선택
3. **DNS 정보** → **DNS 관리** 클릭

#### A 레코드 (루트 도메인)
```
타입: A
호스트: @
값:    76.76.21.21
TTL:   3600 (또는 기본값)
```

#### CNAME 레코드 (www 서브도메인)
```
타입:  CNAME
호스트: www
값:    cname.vercel-dns.com
TTL:   3600
```

### iskinz.co.kr 연결 (iskinz.com으로 리다이렉트)

1. 가비아 → `iskinz.co.kr` DNS 관리
2. **동일하게** A 레코드와 CNAME 추가:
```
타입: A
호스트: @
값:    76.76.21.21

타입: CNAME
호스트: www
값:    cname.vercel-dns.com
```

3. Vercel 대시보드 → 해당 프로젝트 → **Settings > Domains**:
   - `iskinz.com` 추가 → Primary
   - `iskinz.co.kr` 추가
   - `www.iskinz.com` 추가 (자동 리다이렉트)
   - `www.iskinz.co.kr` 추가

> **주의**: DNS 전파에 최대 48시간이 걸릴 수 있습니다. 보통 1~2시간 내 완료.

---

## 7. Resend DNS 레코드 추가 (가비아)

Resend 도메인 인증 시 제공되는 레코드를 가비아 DNS에 추가:

```
타입: TXT
호스트: @
값:   v=spf1 include:amazonses.com ~all

타입: TXT
호스트: resend._domainkey
값:   (Resend가 제공하는 DKIM 값)
```

---

## 8. 관리자 계정 설정

1. 사이트에서 회원가입 (admin@iskinz.com으로)
2. Supabase Table Editor → `profiles` 테이블
3. 해당 row의 `role` 컬럼을 `admin`으로 수정
4. `/admin` 경로 접근 가능

---

## 9. 카카오 우편번호 API 연동 (선택)

`src/app/checkout/page.tsx`의 "주소 검색" 버튼 onClick에 연동:

```typescript
// public/index.html에 스크립트 추가 또는 next/script로 로드
// <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

declare const daum: any
new daum.Postcode({
  oncomplete(data: any) {
    setField('zipcode', data.zonecode)
    setField('address1', data.roadAddress)
  }
}).open()
```

---

## 파일 구조 요약

```
iskinz-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← 홈 (랜딩 페이지)
│   │   ├── checkout/page.tsx     ← 결제 (토스페이먼츠)
│   │   ├── checkout/success/     ← 결제 완료
│   │   ├── checkout/fail/        ← 결제 실패
│   │   ├── login/page.tsx        ← 로그인
│   │   ├── signup/page.tsx       ← 회원가입
│   │   ├── my/page.tsx           ← 마이페이지
│   │   ├── my/orders/page.tsx    ← 주문 내역
│   │   └── api/
│   │       ├── contact/route.ts         ← 문의 이메일
│   │       └── payments/confirm/route.ts ← 결제 승인
│   ├── components/
│   │   ├── layout/Navbar.tsx
│   │   ├── layout/Footer.tsx
│   │   ├── shop/CartSidebar.tsx
│   │   ├── shop/ProductCard.tsx
│   │   ├── shop/ProductsSection.tsx
│   │   └── home/ContactSection.tsx
│   ├── store/cartStore.ts         ← Zustand 장바구니
│   ├── lib/supabase/             ← DB 클라이언트
│   ├── lib/email.ts              ← Resend 이메일
│   └── emails/                   ← 이메일 템플릿
├── supabase/schema.sql           ← DB 스키마 (Supabase에서 실행)
├── vercel.json                   ← .co.kr → .com 리다이렉트
└── .env.example                  ← 환경변수 템플릿
```
