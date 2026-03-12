import * as Sentry from '@sentry/react'
import { getTracePropagationTargets } from '../services/api'

const dsn = import.meta.env.VITE_SENTRY_DSN

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: import.meta.env.MODE,
  enableLogs: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  tracePropagationTargets: getTracePropagationTargets(),
  tracesSampleRate: 0.1,
})
