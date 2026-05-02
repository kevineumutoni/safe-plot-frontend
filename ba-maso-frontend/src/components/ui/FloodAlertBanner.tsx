import { Box, HStack, Text } from '@chakra-ui/react'
import type { FloodAlert } from '../../types'

const LEVEL = {
  none:      { icon: '🌤', bg: 'rgba(34,197,94,0.06)',  border: 'rgba(34,197,94,0.2)',  color: '#22c55e', labelRw: 'Nta nzitizi',  labelEn: 'No Alert'       },
  watch:     { icon: '⛅', bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.3)',  color: '#eab308', labelRw: 'Witondere',    labelEn: 'Flood Watch'    },
  warning:   { icon: '🌧', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.3)', color: '#f97316', labelRw: 'Iburira',      labelEn: 'Flood Warning'  },
  emergency: { icon: '⛈', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',  color: '#ef4444', labelRw: 'Ihutishe!',    labelEn: 'Emergency!'     },
}

export default function FloodAlertBanner({ alert, lang }: { alert: FloodAlert; lang: string }) {
  const cfg = LEVEL[alert.alert_level as keyof typeof LEVEL] ?? LEVEL.none
  const text = lang === 'rw' ? alert.interpretation_rw : alert.interpretation_en
  const label = lang === 'rw' ? cfg.labelRw : cfg.labelEn

  return (
    <Box
      bg={cfg.bg}
      border={`1px solid ${cfg.border}`}
      borderRadius="14px"
      p="14px 16px"
    >
      <HStack gap={2} mb={2}>
        <Text fontSize="lg">{cfg.icon}</Text>
        <Text
          fontSize="xs"
          fontWeight={700}
          color={cfg.color}
          letterSpacing="0.04em"
        >
          {label}
        </Text>
      </HStack>

      <Text fontSize="13px" color="rgba(232,245,238,0.7)" lineHeight={1.6} m={0}>
        {text}
      </Text>

      <Text fontSize="10px" color="rgba(232,245,238,0.3)" mt={2}>
        {lang === 'rw' ? 'Imvura' : 'Rainfall'}: {alert.rainfall_24h_mm}mm / 24h · {alert.rainfall_48h_mm}mm / 48h
      </Text>
    </Box>
  )
}