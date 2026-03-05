/**
 * Electron Preload Script
 *
 * This script runs in the renderer process before the web page loads.
 * It exposes safe APIs to the renderer via contextBridge.
 */

import { contextBridge } from 'electron';

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Flag to indicate this is Electron environment
  isElectron: true,

  // Current platform
  platform: process.platform,

  // App version (will be available in production)
  version: process.env.npm_package_version || '0.0.0',

  // Add more APIs here as needed:
  // - File system operations
  // - Native dialogs
  // - Notifications
  // - etc.
});

// TypeScript declaration for window.electron (matches src/lib/electron.ts)
declare global {
  interface Window {
    electron?: {
      isElectron: boolean;
      platform: string;
      version: string;
    };
  }
}
