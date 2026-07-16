import { Link } from 'react-router-dom'
import { APP_CONFIG } from '@/config'

export function TerminosPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <Link to="/" className="text-ivory-muted no-underline hover:text-gold-soft">
        ← Volver
      </Link>
      <h1 className="font-display mt-6 text-4xl text-ivory">Términos de uso</h1>
      <div className="mt-6 space-y-4 text-ivory-muted">
        <p>Autora Oculta es un producto digital educativo. Al completar la compra, recibes acceso a contenidos digitales según las condiciones informadas en el checkout.</p>
        <p>El acceso es personal e intransferible. Queda prohibida la redistribución o reventa del material sin autorización.</p>
        <p>El producto ofrece herramientas y orientación para la creación de proyectos narrativos digitales. No garantiza ingresos, ventas o resultados financieros.</p>
        <p>Los pagos y reembolsos se rigen por las condiciones de la plataforma de checkout, incluyendo la garantía de prueba vigente.</p>
        <p>
          Contacto: <a href={`mailto:${APP_CONFIG.CONTACT_EMAIL}`}>{APP_CONFIG.CONTACT_EMAIL}</a>
        </p>
      </div>
    </div>
  )
}

export function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <Link to="/" className="text-ivory-muted no-underline hover:text-gold-soft">
        ← Volver
      </Link>
      <h1 className="font-display mt-6 text-4xl text-ivory">Política de privacidad</h1>
      <div className="mt-6 space-y-4 text-ivory-muted">
        <p>Podemos recopilar datos de contacto y compra procesados por la plataforma de pago, así como datos de navegación y parámetros UTM cuando se utilizan herramientas de análisis.</p>
        <p>Utilizamos la información para entregar acceso, brindar soporte y medir el rendimiento de campañas, cuando corresponda.</p>
        <p>La aplicación puede utilizar cookies o píxeles de terceros si están configurados en el archivo de configuración.</p>
        <p>
          Para ejercer derechos de acceso o eliminación, escribe a{' '}
          <a href={`mailto:${APP_CONFIG.CONTACT_EMAIL}`}>{APP_CONFIG.CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  )
}
