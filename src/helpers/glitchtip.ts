import * as Sentry from '@sentry/react';

const dsn = process.env.REACT_APP_GLITCHTIP_DSN?.trim();

/**
 * Initialize GlitchTip via the Sentry-compatible browser SDK.
 * No-ops when REACT_APP_GLITCHTIP_DSN is unset (local/CI default).
 */
export const initGlitchTip = (): void => {
  if (!dsn || process.env.NODE_ENV === 'test') {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    // Keep sampling low; GlitchTip free/self-host quotas vary.
    tracesSampleRate: 0.01,
    // GlitchTip does not support Sentry session tracking.
    autoSessionTracking: false
  });
};

export const captureException = (
  error: unknown,
  context?: Record<string, unknown>
): void => {
  if (!dsn || process.env.NODE_ENV === 'test') {
    return;
  }

  Sentry.captureException(error, context ? { extra: context } : undefined);
};
