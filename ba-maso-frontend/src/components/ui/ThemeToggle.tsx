import { useEffect } from 'react'
import { IconButton } from '@chakra-ui/react'
import { useAppStore } from '../../store/useAppStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <IconButton
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      w="36px"
      h="36px"
      minW="36px"
      borderRadius="10px"
      border="1px solid var(--border)"
      bg="var(--bg-card)"
      color="var(--text)"
      fontSize="16px"
      flexShrink={0}
      transition="all 0.2s"
      _hover={{
        bg: 'var(--green-dim)',
        borderColor: 'var(--border-g)',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </IconButton>
  )
}