import { initGlitchTip, captureException } from './glitchtip';

describe('glitchtip', () => {
  const originalDsn = process.env.REACT_APP_GLITCHTIP_DSN;

  afterEach(() => {
    process.env.REACT_APP_GLITCHTIP_DSN = originalDsn;
  });

  it('initGlitchTip does not throw when DSN is unset', () => {
    delete process.env.REACT_APP_GLITCHTIP_DSN;
    expect(() => initGlitchTip()).not.toThrow();
  });

  it('captureException does not throw when DSN is unset', () => {
    delete process.env.REACT_APP_GLITCHTIP_DSN;
    expect(() => captureException(new Error('ignored'))).not.toThrow();
  });
});
