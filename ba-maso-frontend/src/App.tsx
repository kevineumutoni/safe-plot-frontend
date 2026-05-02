import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './i18n'
import './styles.css'
import MapPage from './components/map/MapPage'
import SearchPage  from './pages/SearchPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } } })

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
          <Routes>
            <Route path="/"        element={<MapPage />} />
            <Route path="/search"  element={<SearchPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  )
}