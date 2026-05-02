import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Box, VStack, HStack, Text } from '@chakra-ui/react'
import { useAppStore } from '../store/useAppStore'
import NavBar from '../components/ui/NavBar'

const RISK_COLOR: Record<string, string> = {
  GREEN:  '#22c55e',
  ORANGE: '#f97316',
  RED:    '#ef4444',
}

export default function HistoryPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { history, clearHistory, setCurrentResult } = useAppStore()
  const lang = i18n.language as 'rw' | 'en'

  return (
    <Box minH="100vh" bg="#0b0f0c" display="flex" flexDirection="column">
      <NavBar showBack />

      <Box flex={1} maxW="480px" w="100%" mx="auto" p="24px 16px">

        {/* Header row */}
        <HStack justify="space-between" align="center" mb={5}>
          <Text fontSize="22px" fontWeight={800} m={0} letterSpacing="-0.02em">
            {t('history')}
          </Text>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                padding: '6px 12px', borderRadius: 8,
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.08)',
                color: '#ef4444', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Sora', sans-serif",
              }}
            >
              Clear
            </button>
          )}
        </HStack>

        {history.length === 0 ? (
          <VStack gap={4} pt="60px">
            <Text color="rgba(232,245,238,0.2)" m={0}>{t('no_history')}</Text>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '8px 20px', borderRadius: 10,
                background: 'transparent',
                border: '1px solid rgba(42,157,92,0.4)',
                color: '#2a9d5c', cursor: 'pointer',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {t('check_button')}
            </button>
          </VStack>
        ) : (
          <VStack gap={2} align="stretch">
            {history.map(item => {
              const col = RISK_COLOR[item.risk_color] ?? '#2a9d5c'
              return (
                <Box
                  key={item.check_id}
                  onClick={() => { setCurrentResult(item); navigate('/results') }}
                  bg="rgba(255,255,255,0.02)"
                  border="1px solid rgba(255,255,255,0.06)"
                  borderRadius="14px"
                  p="14px 16px"
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{
                    bg: 'rgba(42,157,92,0.05)',
                    borderColor: 'rgba(42,157,92,0.2)',
                  }}
                >
                  <HStack justify="space-between" mb={2}>
                    <Box
                      as="span"
                      px="10px"
                      py="3px"
                      borderRadius="999px"
                      bg={`${col}15`}
                      border={`1px solid ${col}40`}
                      fontSize="11px"
                      fontWeight={700}
                      color={col}
                    >
                      {lang === 'rw' ? item.risk_label_rw : item.risk_label_en}
                    </Box>
                    <Text fontSize="10px" color="rgba(232,245,238,0.2)">
                      {new Date(item.saved_at).toLocaleDateString()}
                    </Text>
                  </HStack>

                  <HStack gap={1} flexWrap="wrap">
                    {[item.district, item.sector, `Score: ${item.risk_score}/100`]
                      .filter(Boolean)
                      .map(v => (
                        <Box
                          key={v}
                          as="span"
                          px="8px"
                          py="2px"
                          borderRadius="6px"
                          border="1px solid rgba(255,255,255,0.07)"
                          fontSize="10px"
                          color="rgba(232,245,238,0.25)"
                        >
                          {v}
                        </Box>
                      ))}
                  </HStack>
                </Box>
              )
            })}
          </VStack>
        )}
      </Box>
    </Box>
  )
}