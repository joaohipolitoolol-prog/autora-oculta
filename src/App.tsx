import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { HomePage } from '@/pages/HomePage'
import { QuizPage } from '@/pages/QuizPage'
import { ProcessingPage } from '@/pages/ProcessingPage'
import { ResultPage } from '@/pages/ResultPage'
import { PrivacidadPage, TerminosPage } from '@/pages/LegalPages'
import { captureUtms } from '@/lib/storage'
import { initAnalytics, trackEvent } from '@/lib/analytics'

function RouteTracker() {
  const location = useLocation()
  useEffect(() => {
    trackEvent('PageView', { path: location.pathname })
  }, [location.pathname])
  return null
}

export default function App() {
  useEffect(() => {
    captureUtms()
    initAnalytics()
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteTracker />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/processando" element={<ProcessingPage />} />
          <Route path="/resultado" element={<ResultPage />} />
          <Route path="/desbloquear" element={<Navigate to="/resultado" replace />} />
          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
