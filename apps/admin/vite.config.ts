import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableSentrySourceMaps = Boolean(
    env.SENTRY_AUTH_TOKEN && env.SENTRY_ORG && env.SENTRY_PROJECT,
  )

  return {
    plugins: [
      react(),
      ...(enableSentrySourceMaps
        ? [
            sentryVitePlugin({
              org: env.SENTRY_ORG,
              project: env.SENTRY_PROJECT,
              authToken: env.SENTRY_AUTH_TOKEN,
              release: env.SENTRY_RELEASE
                ? {
                    name: env.SENTRY_RELEASE,
                  }
                : undefined,
              sourcemaps: {
                filesToDeleteAfterUpload: ['dist/**/*.map'],
              },
            }),
          ]
        : []),
    ],
    build: {
      sourcemap: enableSentrySourceMaps ? 'hidden' : false,
    },
    server: {
      port: 5174,
      strictPort: true,
    },
  }
})
