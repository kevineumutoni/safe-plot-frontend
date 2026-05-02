import { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button } from '@chakra-ui/react'
import KigaliMap from './KigaliMap'
import ResultPanel from './ResultPanel'
import NavBar from '../ui/NavBar'
import MapChatWidget from '../chat/MapChatWidget'
import { useAppStore } from '../../store/useAppStore'

export default function MapPage() {
  const { i18n } = useTranslation()
  const { currentResult } = useAppStore()
  const lang = i18n.language as 'rw' | 'en'

  const [showPanel, setShowPanel] = useState(false)
  const [isMobile,  setIsMobile]  = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleResultReady = useCallback(() => setShowPanel(true), [])
  const handleClose       = useCallback(() => setShowPanel(false), [])

  return (
    <Box
      height="100vh"
      bg="var(--bg, #0b0f0c)"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <NavBar />

      {/* Main area */}
      <Box flex={1} display="flex" overflow="hidden" position="relative">

        {/* Map */}
        <Box flex={1} position="relative" overflow="hidden" minW={0}>
          <KigaliMap
            lang={lang}
            onResultReady={handleResultReady}
            onClose={showPanel ? handleClose : undefined}
            hasResult={showPanel && !!currentResult}
          />
          <MapChatWidget lang={lang} />
        </Box>

        {/* Desktop sidebar */}
        {!isMobile && showPanel && currentResult && (
          <Box
            width="380px"
            flexShrink={0}
            bg="var(--bg2, #0f1510)"
            borderLeft="1px solid var(--border, rgba(255,255,255,0.07))"
            display="flex"
            flexDirection="column"
            position="relative"
            overflow="hidden"
          >
            <Button
              onClick={handleClose}
              title={lang === 'rw' ? 'Funga — subira ku makarita' : 'Close — back to map'}
              position="absolute"
              top="10px"
              right="10px"
              zIndex={30}
              width="32px"
              height="32px"
              minW="unset"
              borderRadius="full"
              bg="#22c55e"
              border="2px solid white"
              color="white"
              fontSize="18px"
              fontWeight={900}
              lineHeight={1}
              p={0}
              boxShadow="0 2px 12px rgba(34,197,94,0.5)"
              _hover={{ bg: '#ef4444' }}
            >×</Button>
            <ResultPanel lang={lang} />
          </Box>
        )}
      </Box>

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && currentResult && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          height="65vh"
          bg="rgba(11,15,12,0.98)"
          borderTop="1px solid rgba(255,255,255,0.1)"
          borderRadius="20px 20px 0 0"
          zIndex={800}
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Handle row */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            px={4}
            pt="10px"
            pb={1}
            flexShrink={0}
            position="relative"
          >
            <Box width="36px" height="3px" borderRadius="999px" bg="rgba(255,255,255,0.15)" />
            <Button
              onClick={handleClose}
              position="absolute"
              right="14px"
              width="32px"
              height="32px"
              minW="unset"
              borderRadius="full"
              bg="#22c55e"
              border="2px solid white"
              color="white"
              fontSize="18px"
              fontWeight={900}
              p={0}
              boxShadow="0 2px 10px rgba(34,197,94,0.4)"
              _hover={{ bg: '#ef4444' }}
            >×</Button>
          </Box>
          <Box flex={1} overflow="hidden">
            <ResultPanel lang={lang} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
