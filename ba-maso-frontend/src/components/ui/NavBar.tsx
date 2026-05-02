import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { useAppStore } from '../../store/useAppStore'

interface Props { showBack?: boolean }

export default function NavBar({ showBack }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { history } = useAppStore()

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0, zIndex: 10,
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: 'var(--green-glow)',
        }} />
        <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--text)' }}>
          Ba Maso
        </span>
        <span style={{
          padding: '2px 7px', borderRadius: 6,
          background: 'var(--green-dim)',
          border: '1px solid var(--border-g)',
          fontSize: 9, fontWeight: 700, color: 'var(--green)',
          letterSpacing: '0.08em',
        }}>KIGALI</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ThemeToggle />
        <LanguageToggle />
        {showBack ? (
          <NavBtn onClick={() => navigate(-1 as any)}>← {t('home')}</NavBtn>
        ) : (
          <>
            <NavBtn onClick={() => navigate('/search')}>{t('manual_entry')}</NavBtn>
            <NavBtn onClick={() => navigate('/history')}>
              {t('history')}
              {history.length > 0 && (
                <span style={{
                  marginLeft: 5, background: 'var(--green)', color: 'white',
                  borderRadius: '50%', width: 16, height: 16,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800,
                }}>{history.length}</span>
              )}
            </NavBtn>
          </>
        )}
      </div>
    </nav>
  )
}

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 8, border: 'none',
        background: 'transparent', color: 'var(--text-dim)',
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
        fontFamily: "'Sora', sans-serif", transition: 'all 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
    >
      {children}
    </button>
  )
}