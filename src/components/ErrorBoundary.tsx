import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Autora Oculta]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg px-5 py-20 text-center">
          <h1 className="font-display text-3xl text-ivory">Algo salió mal</h1>
          <p className="mt-3 text-ivory-muted">
            Recarga la página o vuelve al inicio para continuar.
          </p>
          <button
            type="button"
            className="mt-6 min-h-12 border border-gold/40 px-5 text-ivory"
            onClick={() => {
              this.setState({ hasError: false })
              window.location.href = '/'
            }}
          >
            Volver al inicio
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
