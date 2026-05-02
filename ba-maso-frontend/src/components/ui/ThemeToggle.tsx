import { useAppStore } from '../../store/useAppStore'
import { useEffect } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore()

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 36, height: 36, borderRadius: 10,
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        transition: 'all 0.2s',
        color: 'var(--text)',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--green-dim)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-g)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}