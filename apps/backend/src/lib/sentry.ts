import * as Sentry from '@sentry/node';

export function initSentry() {
    const dsn = process.env.SENTRY_DSN;
    if (!dsn) return;

    Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || 'development',
        sendDefaultPii: true,
        enableLogs: true,
        integrations: [
            Sentry.httpIntegration({ spans: true }),
            Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
        ],
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    });
}

export { Sentry };
