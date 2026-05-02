import { useState, useRef, useEffect } from 'react'
import { Box, Input, Text, VStack, HStack, InputGroup } from '@chakra-ui/react'

const KIGALI_PLACES = [
  { name: 'Bumbogo',       rw: 'Bumbogo',          lat: -1.8700, lng: 30.0800, district: 'Gasabo' },
  { name: 'Gisozi',        rw: 'Gisozi',           lat: -1.9200, lng: 30.0750, district: 'Gasabo' },
  { name: 'Jabana',        rw: 'Jabana',           lat: -1.8900, lng: 30.0900, district: 'Gasabo' },
  { name: 'Jali',          rw: 'Jali',             lat: -1.9050, lng: 30.1100, district: 'Gasabo' },
  { name: 'Kacyiru',       rw: 'Kacyiru',          lat: -1.9300, lng: 30.0650, district: 'Gasabo' },
  { name: 'Kimihurura',    rw: 'Kimihurura',       lat: -1.9370, lng: 30.0780, district: 'Gasabo' },
  { name: 'Kimironko',     rw: 'Kimironko',        lat: -1.9350, lng: 30.1100, district: 'Gasabo' },
  { name: 'Kinyinya',      rw: 'Kinyinya',         lat: -1.9100, lng: 30.1200, district: 'Gasabo' },
  { name: 'Ndera',         rw: 'Ndera',            lat: -1.9100, lng: 30.1300, district: 'Gasabo' },
  { name: 'Nduba',         rw: 'Nduba',            lat: -1.8800, lng: 30.0600, district: 'Gasabo' },
  { name: 'Remera',        rw: 'Remera',           lat: -1.9490, lng: 30.1050, district: 'Gasabo' },
  { name: 'Rusororo',      rw: 'Rusororo',         lat: -1.8950, lng: 30.1000, district: 'Gasabo' },
  { name: 'Rutunga',       rw: 'Rutunga',          lat: -1.8850, lng: 30.0950, district: 'Gasabo' },
  { name: 'Gahanga',       rw: 'Gahanga',          lat: -1.9900, lng: 30.1100, district: 'Kicukiro' },
  { name: 'Gatenga',       rw: 'Gatenga',          lat: -1.9850, lng: 30.0800, district: 'Kicukiro' },
  { name: 'Gikondo',       rw: 'Gikondo',          lat: -1.9750, lng: 30.0700, district: 'Kicukiro' },
  { name: 'Kagarama',      rw: 'Kagarama',         lat: -1.9720, lng: 30.0780, district: 'Kicukiro' },
  { name: 'Kanombe',       rw: 'Kanombe',          lat: -1.9620, lng: 30.1350, district: 'Kicukiro' },
  { name: 'Kicukiro',      rw: 'Kicukiro',         lat: -1.9800, lng: 30.0900, district: 'Kicukiro' },
  { name: 'Kigarama',      rw: 'Kigarama',         lat: -1.9950, lng: 30.0950, district: 'Kicukiro' },
  { name: 'Masaka',        rw: 'Masaka',           lat: -2.0000, lng: 30.1200, district: 'Kicukiro' },
  { name: 'Niboye',        rw: 'Niboye',           lat: -1.9900, lng: 30.0750, district: 'Kicukiro' },
  { name: 'Nyarugunga',    rw: 'Nyarugunga',       lat: -1.9850, lng: 30.1050, district: 'Kicukiro' },
  { name: 'Gitega',        rw: 'Gitega',           lat: -1.9470, lng: 30.0600, district: 'Nyarugenge' },
  { name: 'Kanyinya',      rw: 'Kanyinya',         lat: -1.9600, lng: 30.0300, district: 'Nyarugenge' },
  { name: 'Kimisagara',    rw: 'Kimisagara',       lat: -1.9600, lng: 30.0420, district: 'Nyarugenge' },
  { name: 'Mageragere',    rw: 'Mageragere',       lat: -1.9700, lng: 30.0250, district: 'Nyarugenge' },
  { name: 'Muhima',        rw: 'Muhima',           lat: -1.9510, lng: 30.0560, district: 'Nyarugenge' },
  { name: 'Nyabugogo',     rw: 'Nyabugogo',        lat: -1.9550, lng: 30.0480, district: 'Nyarugenge' },
  { name: 'Nyakabanda',    rw: 'Nyakabanda',       lat: -1.9630, lng: 30.0470, district: 'Nyarugenge' },
  { name: 'Nyamirambo',    rw: 'Nyamirambo',       lat: -1.9700, lng: 30.0380, district: 'Nyarugenge' },
  { name: 'Nyarugenge',    rw: 'Nyarugenge',       lat: -1.9500, lng: 30.0540, district: 'Nyarugenge' },
  { name: 'Rwezamenyo',    rw: 'Rwezamenyo',       lat: -1.9650, lng: 30.0520, district: 'Nyarugenge' },
  { name: 'Kigali Centre', rw: 'Umujyi wa Kigali', lat: -1.9441, lng: 30.0619, district: 'Nyarugenge' },
]

interface Place { name: string; rw: string; lat: number; lng: number; district: string }
interface Props { lang: string; onSelect: (place: Place) => void }

export default function SearchBar({ lang, onSelect }: Props) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<Place[]>([])
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(
      KIGALI_PLACES.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.rw.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      ).slice(0, 6)
    )
  }, [query])

  const handleSelect = (place: Place) => {
    setQuery(lang === 'rw' ? place.rw : place.name)
    setResults([])
    setFocused(false)
    onSelect(place)
  }

  return (
    <Box position="relative" width="100%" maxW="340px">
      <InputGroup>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          bg="rgba(11,15,12,0.92)"
          backdropFilter="blur(12px)"
          border="1px solid"
          borderColor={focused ? 'rgba(42,157,92,0.5)' : 'rgba(255,255,255,0.1)'}
          borderRadius="12px"
          px={3}
          py={2}
          transition="border-color 0.2s"
          boxShadow={focused ? '0 0 0 3px rgba(42,157,92,0.1)' : '0 4px 20px rgba(0,0,0,0.4)'}
          width="100%"
        >
          <Text fontSize="14px" opacity={0.5} userSelect="none">🔍</Text>
          <Input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={lang === 'rw'
              ? 'Shakisha ahantu... (Bumbogo, Remera...)'
              : 'Search a place... (Bumbogo, Remera...)'}
            border="none"
            outline="none"
            bg="transparent"
            color="#e8f5ee"
            fontSize="13px"
            fontFamily="'Sora', sans-serif"
            p={0}
            height="auto"
            _placeholder={{ color: 'rgba(232,245,238,0.35)' }}
            _focus={{ boxShadow: 'none', border: 'none' }}
          />
          {query && (
            <Box
              as="button"
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
              bg="transparent"
              border="none"
              cursor="pointer"
              color="rgba(232,245,238,0.3)"
              fontSize="16px"
              lineHeight={1}
              p={0}
              flexShrink={0}
              _hover={{ color: 'rgba(232,245,238,0.7)' }}
            >×</Box>
          )}
        </Box>
      </InputGroup>

      {results.length > 0 && focused && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          bg="rgba(11,15,12,0.97)"
          backdropFilter="blur(16px)"
          border="1px solid rgba(42,157,92,0.2)"
          borderRadius="12px"
          overflow="hidden"
          zIndex={2000}
          boxShadow="0 16px 40px rgba(0,0,0,0.6)"
        >
          <VStack gap={0} align="stretch">
            {results.map((place, i) => (
              <Box
                key={place.name}
                onMouseDown={() => handleSelect(place)}
                px={4}
                py="10px"
                cursor="pointer"
                borderBottom={i < results.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                transition="background 0.1s"
                _hover={{ bg: 'rgba(42,157,92,0.08)' }}
              >
                <Box>
                  <Text fontSize="13px" fontWeight={600} color="#e8f5ee">
                    {lang === 'rw' ? place.rw : place.name}
                  </Text>
                  <Text fontSize="10px" color="rgba(232,245,238,0.35)" mt="1px">
                    {place.district} · {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                  </Text>
                </Box>
                <Text fontSize="10px" color="#2a9d5c" fontWeight={700} ml={2}>→</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  )
}