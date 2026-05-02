import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import type { Language } from '../../types'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useAppStore()

  const toggle = (lang: Language) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--input-bg)',
      border: '1px solid var(--input-border)',
      borderRadius: 10, padding: 2,
    }}>
      {(['rw', 'en'] as Language[]).map(lang => (
        <button
          key={lang}
          onClick={() => toggle(lang)}
          style={{
            padding: '4px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer',
            background: language === lang ? 'var(--green)' : 'transparent',
            color: language === lang ? 'white' : 'var(--text-dim)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            fontFamily: "'JetBrains Mono', monospace",
            transition: 'all 0.15s',
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}