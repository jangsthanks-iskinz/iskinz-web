import { createClient } from '@supabase/supabase-js'

/* ─── Design tokens (홈페이지 동일) ─── */
const C = {
  charcoal:    '#1e2025',
  charcoalMid: '#2d3038',
  silver:      '#c8cdd4',
  silverLight: '#e8ebee',
  silverDark:  '#8a9099',
  accent:      '#4a6fa5',
  muted:       '#5a5f6a',
  warm:        '#b5a99a',
}
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF     = 'Cormorant Garamond, Georgia, serif'

type NewsFeedItem = {
  id: string
  date: string
  theme: string | null
  image_headline: string | null
  caption: string | null
  key_news: string[] | null
  image_path: string | null
  source: string
  published: boolean
  created_at: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function NewsFeed() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: items, error } = await supabase
    .from('news_feed')
    .select('id,date,theme,image_headline,caption,key_news,source')
    .eq('published', true)
    .order('date', { ascending: false })
    .limit(3)

  if (error || !items?.length) return null

  return (
    <section
      style={{
        background: C.charcoal,
        borderTop: `1px solid rgba(200,205,212,0.07)`,
        borderBottom: `1px solid rgba(200,205,212,0.07)`,
        padding: '72px 0',
      }}
    >
      <div className="container mx-auto px-6">

        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div style={{ width: 24, height: 1, background: C.accent }} />
            <span style={{
              fontFamily: CONDENSED,
              fontSize: 10,
              letterSpacing: '0.4em',
              textTransform: 'uppercase' as const,
              color: C.accent,
            }}>
              NEWS &amp; UPDATES
            </span>
          </div>
          <span style={{
            fontFamily: CONDENSED,
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: C.muted,
          }}>
            최신 3건
          </span>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(200,205,212,0.06)' }}>
          {items.map((item, idx) => (
            <article
              key={item.id}
              style={{
                background: C.charcoal,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 16,
                position: 'relative' as const,
              }}
            >
              {/* 상단: 뱃지 + 날짜 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                {item.theme ? (
                  <span style={{
                    fontFamily: CONDENSED,
                    fontSize: 9,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase' as const,
                    padding: '3px 8px',
                    background: 'rgba(74,111,165,0.12)',
                    color: C.accent,
                    border: `1px solid rgba(74,111,165,0.25)`,
                    flexShrink: 0,
                  }}>
                    {item.theme}
                  </span>
                ) : (
                  <span style={{ fontFamily: CONDENSED, fontSize: 9, color: C.muted, letterSpacing: '0.2em' }}>
                    {item.source ?? 'UPDATE'}
                  </span>
                )}
                <span style={{
                  fontFamily: CONDENSED,
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  color: C.muted,
                  flexShrink: 0,
                }}>
                  {formatDate(item.date)}
                </span>
              </div>

              {/* 강조선 */}
              {idx === 0 && (
                <div style={{ width: 20, height: 1, background: C.accent }} />
              )}

              {/* 제목 */}
              {item.image_headline && (
                <h3 style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)',
                  fontWeight: 400,
                  color: C.silverLight,
                  lineHeight: 1.35,
                  margin: 0,
                }}>
                  {item.image_headline}
                </h3>
              )}

              {/* 핵심 뉴스 bullet list */}
              {item.key_news && item.key_news.length > 0 && (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {item.key_news.map((news: string, ni: number) => (
                    <li
                      key={ni}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        fontSize: 12,
                        color: C.silverDark,
                        lineHeight: 1.55,
                      }}
                    >
                      <span style={{ color: C.accent, fontFamily: CONDENSED, flexShrink: 0, marginTop: 1 }}>—</span>
                      <span>{news}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* 캡션 (있을 경우) */}
              {item.caption && (
                <p style={{
                  fontSize: 11,
                  color: C.muted,
                  lineHeight: 1.65,
                  margin: 0,
                  paddingTop: 8,
                  borderTop: `1px solid rgba(200,205,212,0.07)`,
                  fontStyle: 'italic',
                }}>
                  {item.caption}
                </p>
              )}
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
