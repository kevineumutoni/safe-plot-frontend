import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import RiskBadge from '../ui/RiskBadge'
import FloodAlertBanner from '../ui/FloodAlertBanner'
import AIChat from '../chat/AIChat'

const FACTOR_COLOR: Record<string, string> = {
  'Wetland Proximity':     '#38bdf8',
  'Flood Zone':            '#06b6d4',
  'Master Plan 2050 Zone': '#a78bfa',
  'Slope Risk':            '#fb923c',
  'Valley Elevation':      '#34d399',
}

interface Props { lang: string }

export default function ResultPanel({ lang }: Props) {
  const { currentResult } = useAppStore()
  const [tab, setTab] = useState<'results' | 'chat'>('results')

  if (!currentResult) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🌍</div>
          <p style={{ color: 'var(--text-faint)', fontSize: 13, fontWeight: 600, margin: 0 }}>
            {lang === 'rw' ? 'Kanda ku makarita urebe umutekano' : 'Click the map to check land safety'}
          </p>
        </div>
      </div>
    )
  }

  const r = currentResult
  const explanation = lang === 'rw' ? r.explanation_rw : r.explanation_en

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, padding: '12px 16px 0', flexShrink: 0, alignItems: 'center' }}>
        {([['results', lang === 'rw' ? 'Ibisubizo' : 'Results'],
           ['chat',    lang === 'rw' ? 'Baza AI'   : 'Ask AI']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === key ? 'var(--green-dim)' : 'transparent',
              color: tab === key ? 'var(--green)' : 'var(--text-faint)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
              fontFamily: "'Sora', sans-serif", transition: 'all 0.15s',
            }}
          >{label}</button>
        ))}
        <div style={{ flex: 1 }} />
        {r.district && (
          <span style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 600 }}>{r.district}</span>
        )}
      </div>

      {/* Results tab */}
      {tab === 'results' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <RiskBadge color={r.risk_color} score={r.risk_score} labelRw={r.risk_label_rw} labelEn={r.risk_label_en} lang={lang} />

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 9, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
              {lang === 'rw' ? 'Ibisobanuro' : 'Explanation'}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>{explanation}</p>
          </div>

          <FloodAlertBanner alert={r.flood_alert} lang={lang} />

          {/* Factors */}
          <div>
            <div style={{ fontSize: 9, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
              {lang === 'rw' ? "Impamvu z'Ingereko" : 'Risk Factors'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {r.factors.map(f => {
                const max = f.weight * 100
                const pct = Math.min(100, (f.score / max) * 100)
                const col = FACTOR_COLOR[f.name] || 'var(--green)'
                return (
                  <div key={f.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)' }}>{f.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{f.score.toFixed(0)} / {max.toFixed(0)}</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--border)', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 999, boxShadow: `0 0 6px ${col}60`, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--text-faint)', margin: 0, lineHeight: 1.4 }}>
                      {lang === 'rw' ? f.label_rw : f.detail}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Safe suggestions */}
          {r.safe_suggestions.length > 0 && (
            <div>
              <div style={{ fontSize: 9, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                {lang === 'rw' ? 'Ahantu Heza Hafi' : 'Safer Locations'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {r.safe_suggestions.map(s => (
                  <div key={s.name} style={{ background: 'var(--green-dim)', border: '1px solid var(--green-border)', borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-accent)' }}>{s.name}</span>
                      {s.distance_km && <span style={{ fontSize: 10, color: 'var(--green-accent-dim)', fontWeight: 600 }}>{s.distance_km} km</span>}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0, lineHeight: 1.5 }}>
                      {lang === 'rw' ? s.description_rw : s.description_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p style={{ fontSize: 9, color: 'var(--text-faint)', lineHeight: 1.6, margin: 0 }}>{r.data_source_note}</p>

          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', paddingBottom: 8 }}>
            {[`${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}`, r.district, new Date(r.checked_at).toLocaleTimeString()].filter(Boolean).map(v => (
              <span key={v} style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 9, color: 'var(--text-faint)' }}>{v}</span>
            ))}
          </div>
        </div>
      )}

      {tab === 'chat' && (
        <div style={{ flex: 1, overflow: 'hidden' }}><AIChat /></div>
      )}
    </div>
  )
}