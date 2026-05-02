import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import NavBar from '../components/ui/NavBar'

const RISK_COLOR: Record<string, string> = { GREEN: '#22c55e', ORANGE: '#f97316', RED: '#ef4444' }

export default function HistoryPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { history, clearHistory, setCurrentResult } = useAppStore()
  const lang = i18n.language as 'rw' | 'en'

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f0c', display: 'flex', flexDirection: 'column' }}>
      <NavBar showBack />
      <div style={{ flex: 1, maxWidth: 480, width: '100%', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{t('history')}</h1>
          {history.length > 0 && (
            <button onClick={clearHistory} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'rgba(232,245,238,0.2)', margin: '0 0 16px' }}>{t('no_history')}</p>
            <button onClick={() => navigate('/')} style={{ padding: '8px 20px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(42,157,92,0.4)', color: '#2a9d5c', cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
              {t('check_button')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map(item => {
              const col = RISK_COLOR[item.risk_color] ?? '#2a9d5c'
              return (
                <div
                  key={item.check_id}
                  onClick={() => { setCurrentResult(item); navigate('/results') }}
                  style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(42,157,92,0.05)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(42,157,92,0.2)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, background: `${col}15`, border: `1px solid ${col}40`, fontSize: 11, fontWeight: 700, color: col }}>
                      {lang === 'rw' ? item.risk_label_rw : item.risk_label_en}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(232,245,238,0.2)' }}>{new Date(item.saved_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {[item.district, item.sector, `Score: ${item.risk_score}/100`].filter(Boolean).map(v => (
                      <span key={v} style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)', fontSize: 10, color: 'rgba(232,245,238,0.25)' }}>{v}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}