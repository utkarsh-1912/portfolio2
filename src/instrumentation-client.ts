// Browser error monitoring. Inactive until NEXT_PUBLIC_SENTRY_DSN is set; the SDK is
// only downloaded when it is, so visitors don't pay ~90 kB of JavaScript for nothing.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
    import('@sentry/nextjs').then((Sentry) =>
        Sentry.init({
            dsn,
            environment: process.env.NODE_ENV,
            tracesSampleRate: 0,
            // Noise from browser extensions and the like
            ignoreErrors: ['ResizeObserver loop limit exceeded', 'ResizeObserver loop completed with undelivered notifications.'],
        })
    );
}
