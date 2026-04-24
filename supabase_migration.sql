-- ISKINZ Supabase 마이그레이션 SQL
-- Supabase Dashboard → SQL Editor 에서 실행하세요

-- 1. profiles 테이블 컬럼 추가
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS hospital_name  TEXT,
  ADD COLUMN IF NOT EXISTS approved       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email          TEXT,
  ADD COLUMN IF NOT EXISTS role           TEXT DEFAULT 'user';

-- role 기존 값 마이그레이션 (customer → user)
UPDATE profiles SET role = 'user' WHERE role = 'customer';

-- 2. 관리자 계정 설정 (이메일 주소를 실제 관리자 이메일로 변경하세요)
-- UPDATE profiles SET role = 'admin', approved = TRUE
-- WHERE id = (SELECT id FROM auth.users WHERE email = '관리자이메일@example.com');

-- 3. 기존 승인된 회원들 approved = true 로 일괄 설정 (선택)
-- UPDATE profiles SET approved = TRUE WHERE role IN ('admin', 'vip', 'partner');

-- 4. RLS Policy — admin은 모든 profiles 조회/수정 가능
CREATE POLICY IF NOT EXISTS "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admin can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 5. RLS Policy — admin은 모든 orders 조회/수정 가능
CREATE POLICY IF NOT EXISTS "Admin can read all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admin can update all orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
