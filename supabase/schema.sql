-- ================================================================
-- ISKINZ Supabase 데이터베이스 스키마
-- Supabase 대시보드 > SQL Editor에 붙여넣고 실행하세요
-- ================================================================

-- UUID 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────────
-- PRODUCTS
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name_en       TEXT NOT NULL,
  name_ko       TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('세럼','크림','앰플','토너','선케어')),
  description   TEXT,
  price         INTEGER NOT NULL CHECK (price > 0),
  price_original INTEGER,
  emoji         TEXT,
  image_url     TEXT,
  gradient_bg   TEXT,
  badges        TEXT[] DEFAULT '{}',
  in_stock      BOOLEAN DEFAULT TRUE,
  stock_qty     INTEGER DEFAULT 999,
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- PROFILES (auth.users 확장)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT,
  phone      TEXT,
  role       TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 회원가입 시 자동으로 profiles 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────────
-- ORDERS
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      TEXT UNIQUE NOT NULL,
  user_id           UUID REFERENCES profiles(id),
  guest_email       TEXT,
  status            TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','paid','preparing','shipped','delivered','cancelled','refunded')),
  total_amount      INTEGER NOT NULL CHECK (total_amount >= 0),
  shipping_fee      INTEGER DEFAULT 0,
  -- 배송지 스냅샷
  shipping_name     TEXT NOT NULL DEFAULT '',
  shipping_phone    TEXT NOT NULL DEFAULT '',
  shipping_zipcode  TEXT NOT NULL DEFAULT '',
  shipping_address1 TEXT NOT NULL DEFAULT '',
  shipping_address2 TEXT,
  -- 결제 정보
  payment_key       TEXT,
  payment_method    TEXT,
  paid_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- ORDER ITEMS
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price   INTEGER NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  subtotal     INTEGER NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- INQUIRIES
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT NOT NULL,
  inquiry_type TEXT,
  message      TEXT NOT NULL,
  status       TEXT DEFAULT 'unread' CHECK (status IN ('unread','read','replied')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- updated_at 자동 갱신 함수 & 트리거
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  FOR t IN SELECT unnest(ARRAY['products','profiles','orders']) LOOP
    EXECUTE format('
      CREATE TRIGGER set_updated_at_%s
      BEFORE UPDATE ON %s
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
      t, t);
  END LOOP;
END $$;

-- ────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────────
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- products: 누구나 읽기 가능 (활성 제품만)
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = TRUE);

-- profiles: 본인만 읽기/수정
CREATE POLICY "profiles_own_select" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- orders: 본인 주문만 조회
CREATE POLICY "orders_own_select" ON orders
  FOR SELECT USING (auth.uid() = user_id);
-- Service Role은 RLS 우회 (API Route에서 createServiceClient 사용)

-- order_items: 본인 주문 아이템만 조회
CREATE POLICY "order_items_own_select" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- inquiries: 누구나 삽입 가능 (문의 제출)
CREATE POLICY "inquiries_insert_any" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

-- ────────────────────────────────────────────────────────────────
-- SEED DATA (초기 제품 6종)
-- ────────────────────────────────────────────────────────────────
INSERT INTO products (slug, name_en, name_ko, category, description, price, price_original, emoji, gradient_bg, badges, sort_order)
VALUES
  ('intelligent-serum-z', 'Intelligent Serum Z', '인텔리전트 세럼 Z', '세럼',
   '3중 히알루론산과 나이아신아마이드 10% 복합체로 피부 깊은 곳까지 집중 수분 공급과 톤 개선',
   89000, 110000, '💎', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', ARRAY['BEST','NEW'], 1),

  ('cell-repair-cream', 'Cell Repair Cream', '셀 리페어 크림', '크림',
   '특허 성분 ISK-Complex™ 함유, 손상된 피부 장벽을 집중 복구하는 메디컬 등급 크림',
   72000, NULL, '🌿', 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', ARRAY['임상인증'], 2),

  ('brightening-ampoule', 'Brightening Ampoule', '브라이트닝 앰플', '앰플',
   '비타민 C 유도체 20% 고농도 처방으로 칙칙한 피부톤을 환하게 개선하는 집중 앰플',
   65000, 78000, '✨', 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', ARRAY['SALE'], 3),

  ('uv-shield-spf50', 'UV Shield SPF50+', 'UV 쉴드 SPF50+', '선케어',
   'PA++++ 자외선 차단과 동시에 피부 보습까지 챙기는 물리적·화학적 복합 자외선 차단제',
   42000, NULL, '☀️', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', ARRAY['NEW'], 4),

  ('pore-refine-toner', 'Pore Refine Toner', '포어 리파인 토너', '토너',
   'BHA 2% + 판테놀 복합체로 모공을 정돈하고 피부결을 매끄럽게 케어하는 저자극 토너',
   38000, NULL, '💧', 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', ARRAY['베스트'], 5),

  ('peptide-ampoule-pro', 'Peptide Ampoule Pro', '펩타이드 앰플 프로', '앰플',
   '6종 기능성 펩타이드 복합 처방으로 피부 탄력을 회복하고 주름을 케어하는 안티에이징 앰플',
   95000, 115000, '🔬', 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', ARRAY['PREMIUM','SALE'], 6)
ON CONFLICT (slug) DO NOTHING;
