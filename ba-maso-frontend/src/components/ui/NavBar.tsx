import { Box, HStack, Button, Text, Badge } from '@chakra-ui/react'
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
    <Box
      as="nav"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={5}
      py="10px"
      bg="var(--nav-bg)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid var(--border)"
      flexShrink={0}
      zIndex={10}
    >
      {/* Logo */}
      <HStack
        gap={2}
        cursor="pointer"
        onClick={() => navigate('/')}
      >
        <Box
          w="8px"
          h="8px"
          borderRadius="full"
          bg="var(--green)"
          boxShadow="var(--green-glow)"
        />
        <Text fontWeight={800} fontSize="17px" letterSpacing="-0.02em" color="var(--text)">
          Ba Maso
        </Text>
        <Badge
          px="7px"
          py="2px"
          borderRadius="6px"
          bg="var(--green-dim)"
          border="1px solid var(--border-g)"
          fontSize="9px"
          fontWeight={700}
          color="var(--green)"
          letterSpacing="0.08em"
          variant="outline"
        >
          KIGALI
        </Badge>
      </HStack>

      {/* Right controls */}
      <HStack gap={2}>
        <ThemeToggle />
        <LanguageToggle />

        {showBack ? (
          <NavBtn onClick={() => navigate(-1 as any)}>← {t('home')}</NavBtn>
        ) : (
          <>
            <NavBtn onClick={() => navigate('/search')}>{t('manual_entry')}</NavBtn>
            <NavBtn onClick={() => navigate('/history')}>
              <HStack gap={1} as="span">
                <span>{t('history')}</span>
                {history.length > 0 && (
                  <Box
                    as="span"
                    ml={1}
                    bg="var(--green)"
                    color="white"
                    borderRadius="full"
                    w="16px"
                    h="16px"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="9px"
                    fontWeight={800}
                  >
                    {history.length}
                  </Box>
                )}
              </HStack>
            </NavBtn>
          </>
        )}
      </HStack>
    </Box>
  )
}

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      px={3}
      borderRadius="8px"
      color="var(--text-dim)"
      fontSize="12px"
      fontWeight={600}
      fontFamily="'Sora', sans-serif"
      transition="all 0.15s"
      _hover={{ color: 'var(--text)', bg: 'transparent' }}
    >
      {children}
    </Button>
  )
}