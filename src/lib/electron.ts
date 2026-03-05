/**
 * Electron environment detection utility
 *
 * This module provides functions to detect if the app is running in Electron.
 * In web mode (default), all checks return false - nothing changes.
 * In Electron mode, the environment variable VITE_IS_ELECTRON=true is set.
 */

// Type declaration for window.electron (will be set by Electron preload script)
declare global {
  interface Window {
    electron?: {
      isElectron: boolean;
      platform?: string;
      // Add more Electron API methods here as needed
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
