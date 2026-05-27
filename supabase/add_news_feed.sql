-- ================================================================
-- news_feed 테이블 추가 마이그레이션
-- Supabase 대시보드 > SQL Editor에서 실행하세요
-- ================================================================

CREATE TABLE IF NOT EXISTS news_feed (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date           DATE NOT NULL DEFAULT current_date,
  theme          TEXT,
  image_headline TEXT,
  caption        TEXT,
  key_news       JSONB,       -- ["뉴스1", "뉴스2", "뉴스3"]
  image_path     TEXT,        -- generated_posts/ 경로
  source         TEXT DEFAULT 'instagram_bot',
  published      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 공개 읽기 허용
ALTER TABLE news_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_feed_public_read" ON news_feed
  FOR SELECT USING (TRUE);
