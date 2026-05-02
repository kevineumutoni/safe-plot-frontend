import { HStack, Button } from '@chakra-ui/react'
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
    <HStack
      display="inline-flex"
      bg="var(--input-bg)"
      border="1px solid var(--input-border)"
      borderRadius="10px"
      p="2px"
      gap={0}
    >
      {(['rw', 'en'] as Language[]).map(lang => (
        <Button
          key={lang}
          onClick={() => toggle(lang)}
          size="xs"
          px={3}
          py={1}
          borderRadius="8px"
          border="none"
          bg={language === lang ? 'var(--green)' : 'transparent'}
          color={language === lang ? 'white' : 'var(--text-dim)'}
          fontSize="11px"
          fontWeight={700}
          letterSpacing="0.08em"
          fontFamily="'JetBrains Mono', monospace"
          transition="all 0.15s"
          _hover={{ bg: language === lang ? 'var(--green)' : 'rgba(255,255,255,0.05)' }}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </HStack>
  )
}