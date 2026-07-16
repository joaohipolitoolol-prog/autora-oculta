import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { QuizPage } from '@/pages/QuizPage'
import { ProcessingPage } from '@/pages/ProcessingPage'
import { ResultPage } from '@/pages/ResultPage'
import { PrivacidadPage, TerminosPage } from '@/pages/LegalPages'
import { MemberProvider } from '@/member/context/MemberContext'
import { MemberLayout } from '@/member/components/MemberLayout'
import { DashboardPage } from '@/member/pages/DashboardPage'
import { ProjectPage } from '@/member/pages/ProjectPage'
import {
  AnunciosPage,
  EjemploPage,
  IdentidadPage,
  MercadoPage,
  MethodPage,
  PublicarPage,
  UniversoPage,
  VentaPage,
} from '@/member/pages/MethodPages'
import { EstructuraPage } from '@/member/pages/EstructuraPage'
import { PersonajesPage } from '@/member/pages/PersonajesPage'
import { PromptsPage } from '@/member/pages/PromptsPage'
import { WorkspacePage } from '@/member/pages/WorkspacePage'
import { InstallPage } from '@/member/pages/InstallPage'
import { SearchPage } from '@/member/pages/SearchPage'
import { CapitulosPage } from '@/member/pages/CapitulosPage'
import { ProgresoPage } from '@/member/pages/ProgresoPage'
import { ConfiguracionPage } from '@/member/pages/ConfiguracionPage'
import { AyudaPage } from '@/member/pages/AyudaPage'
import { MasPage } from '@/member/pages/MasPage'
import { RecursosPage } from '@/member/pages/RecursosPage'
import { captureUtms } from '@/lib/storage'
import { initAnalytics, trackEvent } from '@/lib/analytics'

function RouteTracker() {
  const location = useLocation()
  useEffect(() => {
    trackEvent('PageView', { path: location.pathname + location.search })
  }, [location.pathname, location.search])
  return null
}

export default function App() {
  useEffect(() => {
    captureUtms()
    initAnalytics()
  }, [])

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouteTracker />
        <Routes>
          <Route
            path="/entregavel"
            element={
              <MemberProvider>
                <MemberLayout />
              </MemberProvider>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="proyecto" element={<ProjectPage />} />
            <Route path="metodo" element={<MethodPage />} />
            <Route path="mercado" element={<MercadoPage />} />
            <Route path="universo" element={<UniversoPage />} />
            <Route path="estructura" element={<EstructuraPage />} />
            <Route path="capitulos" element={<CapitulosPage />} />
            <Route path="personajes" element={<PersonajesPage />} />
            <Route path="prompts" element={<PromptsPage />} />
            <Route path="workspace" element={<WorkspacePage />} />
            <Route path="identidad" element={<IdentidadPage />} />
            <Route path="venta" element={<VentaPage />} />
            <Route path="publicar" element={<PublicarPage />} />
            <Route path="anuncios" element={<AnunciosPage />} />
            <Route path="recursos" element={<RecursosPage />} />
            <Route path="ejemplo" element={<EjemploPage />} />
            <Route path="plan7" element={<Navigate to="/entregavel/progreso" replace />} />
            <Route path="progreso" element={<ProgresoPage />} />
            <Route path="configuracion" element={<ConfiguracionPage />} />
            <Route path="ayuda" element={<AyudaPage />} />
            <Route path="mas" element={<MasPage />} />
            <Route path="instalar" element={<InstallPage />} />
            <Route path="menu" element={<Navigate to="/entregavel/mas" replace />} />
            <Route path="buscar" element={<SearchPage />} />
            <Route path="*" element={<Navigate to="/entregavel" replace />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/q" element={<Navigate to="/quiz" replace />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/procesando" element={<ProcessingPage />} />
            <Route path="/processando" element={<Navigate to="/procesando" replace />} />
            <Route path="/resultado" element={<ResultPage />} />
            <Route path="/desbloquear" element={<Navigate to="/resultado" replace />} />
            <Route path="/terminos" element={<TerminosPage />} />
            <Route path="/privacidad" element={<PrivacidadPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
