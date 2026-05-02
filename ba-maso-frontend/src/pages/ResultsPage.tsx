import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import RiskBadge from '../components/ui/RiskBadge'
import FloodAlertBanner from '../components/ui/FloodAlertBanner'
import AIChat from '../components/chat/AIChat'
import NavBar from '../components/ui/NavBar'

export default function ResultsPage() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { currentResult } = useAppStore()
  const lang = i18n.language as 'rw' | 'en'
  const [tab, setTab] = useState<'results' | 'chat'>('results')

  if (!currentResult) return (
    <div style={{ minHeight: '100vh', background: '#0b0f0c', display: 'flex', flexDirection: 'column' }}>
      <NavBar showBack />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 40 }}>🌍</span>
          <p style={{ color: 'rgba(232,245,238,0.3)', margin: 0 }}>No result — go check a location first</p>
          <button onClick={() => navigate('/')} style={{ padding: '8px 20px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(42,157,92,0.4)', color: '#2a9d5c', cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
            {lang === 'rw' ? 'Subira' : 'Go Home'}
          </button>
        </div>
      </div>
    </div>
  )

  const r = currentResult

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f0c', display: 'flex', flexDirection: 'column' }}>
      <NavBar showBack />
      <div style={{ flex: 1, maxWidth: 560, width: '100%', margin: '0 auto', padding: '16px 16px 32px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {([['results', lang === 'rw' ? 'Ibisubizo' : 'Results'],
             ['chat',    lang === 'rw' ? 'Baza AI'   : 'Ask AI']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: tab === key ? 'rgba(42,157,92,0.15)' : 'transparent',
              color: tab === key ? '#2a9d5c' : 'rgba(232,245,238,0.3)',
              fontSize: 12, fontWeight: 700, fontFamily: "'Sora',sans-serif", transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {tab === 'results' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <RiskBadge color={r.risk_color} score={r.risk_score} labelRw={r.risk_label_rw} labelEn={r.risk_label_en} lang={lang} />
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 9, color: '#2a9d5c', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{lang === 'rw' ? 'Ibisobanuro' : 'Explanation'}</div>
              <p style={{ fontSize: 13, color: 'rgba(232,245,238,0.75)', lineHeight: 1.7, margin: 0 }}>{lang === 'rw' ? r.explanation_rw : r.explanation_en}</p>
            </div>
            <FloodAlertBanner alert={r.flood_alert} lang={lang} />
            {r.factors.map(f => (
              <div key={f.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,245,238,0.7)' }}>{f.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: f.score === 0 ? '#22c55e' : f.score < f.weight * 50 ? '#f97316' : '#ef4444' }}>{f.score.toFixed(0)} pts</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (f.score / (f.weight * 100)) * 100)}%`, background: f.score === 0 ? '#22c55e' : f.score < f.weight * 50 ? '#f97316' : '#ef4444', borderRadius: 999 }} />
                </div>
                <p style={{ fontSize: 10, color: 'rgba(232,245,238,0.3)', margin: 0 }}>{lang === 'rw' ? f.label_rw : f.detail}</p>
              </div>
            ))}
            {r.safe_suggestions.map(s => (
              <div key={s.name} style={{ background: 'rgba(42,157,92,0.05)', border: '1px solid rgba(42,157,92,0.15)', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>{s.name}</span>
                  {s.distance_km && <span style={{ fontSize: 10, color: 'rgba(34,197,94,0.5)' }}>{s.distance_km} km</span>}
                </div>
                <p style={{ fontSize: 12, color: 'rgba(232,245,238,0.4)', margin: 0 }}>{lang === 'rw' ? s.description_rw : s.description_en}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'chat' && (
          <div style={{ height: '65vh', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden' }}>
            <AIChat />
          </div>
        )}
      </div>
    </div>
  )
}