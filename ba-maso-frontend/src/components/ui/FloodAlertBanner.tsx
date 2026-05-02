import type { FloodAlert } from '../../types'

const LEVEL = {
  none:      { icon: '🌤', bg: 'rgba(34,197,94,0.06)',  border: 'rgba(34,197,94,0.2)',  color: '#22c55e', labelRw: 'Nta nzitizi',  labelEn: 'No Alert'       },
  watch:     { icon: '⛅', bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.3)',  color: '#eab308', labelRw: 'Witondere',    labelEn: 'Flood Watch'    },
  warning:   { icon: '🌧', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.3)', color: '#f97316', labelRw: 'Iburira',      labelEn: 'Flood Warning'  },
  emergency: { icon: '⛈', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',  color: '#ef4444', labelRw: 'Ihutishe!',    labelEn: 'Emergency!'     },
}

export default function FloodAlertBanner({ alert, lang }: { alert: FloodAlert; lang: string }) {
  const cfg = LEVEL[alert.alert_level] ?? LEVEL.none
  const text = lang === 'rw' ? alert.interpretation_rw : alert.interpretation_en
  const label = lang === 'rw' ? cfg.labelRw : cfg.labelEn

  return (
    <div style={{
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 14, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{cfg.icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, letterSpacing: '0.04em' }}>
          {label}
        </span>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(232,245,238,0.7)', lineHeight: 1.6, margin: 0 }}>{text}</p>
      <p style={{ fontSize: 10, color: 'rgba(232,245,238,0.3)', marginTop: 6 }}>
        {lang === 'rw' ? 'Imvura' : 'Rainfall'}: {alert.rainfall_24h_mm}mm / 24h · {alert.rainfall_48h_mm}mm / 48h
      </p>
    </div>
  )
}