import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: import.meta.env.MODE,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
})
