/**
 * Electron Main Process
 *
 * This is the entry point for the Electron application.
 * It creates the browser window and handles app lifecycle events.
 */

import { app, BrowserWindow, Menu, shell, session, systemPreferences, ipcMain } from 'electron';
import path from 'path';

// Note: __dirname is provided by esbuild banner in build.mjs
// It points to electron/dist in both dev and production

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Vite dev server URL for Electron (port 5100, separate from web dev on 5000)
// Use 127.0.0.1 instead of localhost - on Mac, localhost resolves to IPv6 but Vite listens on IPv4
const VITE_DEV_SERVER_URL = 'http://127.0.0.1:5100';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Modern frameless look (optional - can be changed)
    titleBarStyle: 'hiddenInset', // macOS: shows traffic lights
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#f8fafc', // Match light theme background
    show: false, // Don't show until ready
  });

  // Remove default menu (or create minimal one)
  createAppMenu();

  // Load the app
  if (isDev) {
    // Development: load from Vite dev server
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from built files
    // app.getAppPath() returns the root of app.asar, where dist/ is located
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
    console.log('Loading index.html from:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle external links - open in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Clean up on close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createAppMenu() {
  // Minimal menu - only App name and Edit (for Cmd+C/V shortcuts on Mac)
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App lifecycle events
app.whenReady().then(async () => {
  // Request microphone access on macOS
  if (process.platform === 'darwin') {
    const micStatus = systemPreferences.getMediaAccessStatus('microphone');
    console.log('[Electron] Microphone access status:', micStatus);

    if (micStatus !== 'granted') {
      const granted = await systemPreferences.askForMediaAccess('microphone');
      console.log('[Electron] Microphone access granted:', granted);
    }
  }

  // Set up permission handler for microphone access
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    // Allow microphone and other media permissions
    const allowedPermissions = ['media', 'mediaKeySystem', 'geolocation', 'notifications'];
    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      callback(true); // Allow all permissions for now
    }
  });

  // Also handle permission check requests
  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    // Allow all permission checks
    return true;
  });

  // IPC handler to open system preferences for microphone access
  ipcMain.handle('open-system-preferences', () => {
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone');
  });

  createWindow();

  // macOS: re-create window when clicking dock icon
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: prevent navigation to external URLs in main window
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, url) => {
    // Allow navigation within the app
    if (!url.startsWith(VITE_DEV_SERVER_URL) && !url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
});
