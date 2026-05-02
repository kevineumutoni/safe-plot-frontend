import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Apply saved theme before first render to avoid flash
const saved = localStorage.getItem('ba-maso-v3')
if (saved) {
  try {
    const parsed = JSON.parse(saved)
    const theme = parsed?.state?.theme ?? 'dark'
    document.documentElement.setAttribute('data-theme', theme)
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
} else {
  document.documentElement.setAttribute('data-theme', 'dark')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
)