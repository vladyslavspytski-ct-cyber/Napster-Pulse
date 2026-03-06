/**
 * Electron environment detection utility
 *
 * This module provides functions to detect if the app is running in Electron.
 * In web mode (default), all checks return false - nothing changes.
 * In Electron mode, the environment variable VITE_IS_ELECTRON=true is set.
 */

/**
 * Base URL for web version of the app
 * Used in Electron to generate proper web links instead of file:// URLs
 * TODO: Update this when production domain is available
 */
export const WEB_BASE_URL = 'https://preview--interu-voice-interviews.lovable.app';

/**
 * Preview token for Lovable preview environment
 * TODO: Remove token when production domain is ready
 */
export const WEB_PREVIEW_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidWVGNUpmckRtZ1RYM2N2SmZ6MkpXUVV1M29FMiIsInByb2plY3RfaWQiOiJmZTdmNWIwNS1hZDg3LTQ5ZmMtOTQ5Yi1lMDExMzYwODkwNjgiLCJhY2Nlc3NfdHlwZSI6InByb2plY3QiLCJpc3MiOiJsb3ZhYmxlLWFwaSIsInN1YiI6ImZlN2Y1YjA1LWFkODctNDlmYy05NDliLWUwMTEzNjA4OTA2OCIsImF1ZCI6WyJsb3ZhYmxlLWFwcCJdLCJleHAiOjE3NzM0MTAxNzIsIm5iZiI6MTc3MjgwNTM3MiwiaWF0IjoxNzcyODA1MzcyfQ.s2tfEhwncMrjAxJpTzFQ9VhUhlnmumv1mDmPtT7U1MvaVKE8ejxgFYCtqhOdByNoNzswx2SIF7GqHmqN0BJaDSIQGLxzOo2WnV_JPCiMd18vq3hLsZ8QIjl_ufv0VqAeC8AxVWMzrgztoQDicZ1MfXDu0geCpw-eRJ10z7I4ekQeq668x-IyqlBmHHSbaKtCBH8mPRS5sd7Pkpz-QlEtUeBxa5bLzrtKsa6Ok8MQ-RMznU1AmXD1VdNAhjVVdcNeHTMPHdJ2FbCk0mQxHJhET5NnTOwkwC6DpqdR1VcqNXB4n1Hdat8XdhnYZlVOJVhnQcgEuCAPE-xkZzI1PUHQbEDg52l8TKrGxh-8QMnavfo0GoVLf_JHdBzzEgO3KUxMQtPrd5Ffx0KijZu3lTAiP4rk5sNRKcUP-6jqDp-9GmySAC-ll3nK6Eaw-VQT_enb1OL5dqT0-Lsf0gPH21uQ3h0cprO0HpmrjKUGp3rJspEdjjQbMB7IJ0lNkuQnlVBPsyh4xKzDErkqt-KdiI4scc4D4-Hd9Kx9fhlWAIx5HBbif1pX6uVTKUAKCHqsEnwU2zL3Pxro9jjcq8hh0Fr8GzyJ5gHuBOtHYigYlwI_XiAdmDGxMUz3J4yBfiofE6KtocQtmLLxt1oIWXyiPedQuPGScTcF2PZCtj8lXfa9S1M';

// Type declaration for window.electron (will be set by Electron preload script)
declare global {
  interface Window {
    electron?: {
      isElectron: boolean;
      platform?: string;
      openSystemPreferences?: () => Promise<void>;
    };
  }
}

/**
 * Check if the app is running in Electron environment
 *
 * Detection methods (in order of priority):
 * 1. window.electron object (set by Electron preload script at runtime) - MOST RELIABLE
 * 2. User agent check (Electron adds "Electron" to user agent)
 *
 * NOTE: We do NOT use VITE_IS_ELECTRON env variable for runtime detection
 * because the same Vite dev server serves both Electron and browser.
 * The env variable is only useful for build-time conditional compilation.
 *
 * @returns true if running in Electron, false otherwise
 */
export function isElectron(): boolean {
  // Method 1: Check for window.electron object (most reliable at runtime)
  // This is set by the preload script only in Electron
  if (typeof window !== 'undefined' && window.electron?.isElectron) {
    return true;
  }

  // Method 2: Check user agent (Electron adds "Electron" to user agent string)
  // This works even before preload script runs
  if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')) {
    return true;
  }

  return false;
}

/**
 * React hook for Electron detection
 *
 * Use this in components that need to conditionally render based on environment.
 * The value is stable and won't change during the component lifecycle.
 *
 * @example
 * const isDesktop = useIsElectron();
 * return isDesktop ? <DesktopNav /> : <WebNav />;
 */
export function useIsElectron(): boolean {
  // Since Electron state doesn't change during runtime,
  // we can call isElectron() directly without useState/useEffect
  return isElectron();
}

/**
 * Get the current platform when running in Electron
 *
 * @returns Platform string ('darwin', 'win32', 'linux') or undefined in web
 */
export function getElectronPlatform(): string | undefined {
  if (typeof window !== 'undefined' && window.electron?.platform) {
    return window.electron.platform;
  }
  return undefined;
}

/**
 * Check if running on macOS in Electron
 *
 * Uses multiple detection methods:
 * 1. window.electron.platform (most reliable, but may not be available immediately)
 * 2. User agent fallback (works immediately)
 *
 * This is important for UI layout - traffic lights need padding on macOS
 */
export function isMacOS(): boolean {
  // Only check if we're in Electron
  if (!isElectron()) {
    return false;
  }

  // Method 1: Check Electron platform (most reliable)
  const electronPlatform = getElectronPlatform();
  if (electronPlatform) {
    return electronPlatform === 'darwin';
  }

  // Method 2: Fallback to user agent detection
  // Electron on macOS includes "Macintosh" in user agent
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent;
    return ua.includes('Macintosh') || ua.includes('Mac OS');
  }

  return false;
}

/**
 * Check if running on Windows in Electron
 */
export function isWindows(): boolean {
  return getElectronPlatform() === 'win32';
}

/**
 * Check if running on Linux in Electron
 */
export function isLinux(): boolean {
  return getElectronPlatform() === 'linux';
}

/**
 * Open system preferences for microphone access (macOS only)
 * Used when unsigned Electron app cannot trigger system permission dialog
 */
export async function openSystemPreferences(): Promise<void> {
  if (typeof window !== 'undefined' && window.electron?.openSystemPreferences) {
    await window.electron.openSystemPreferences();
  }
}
