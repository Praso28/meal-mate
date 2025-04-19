const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const { spawn } = require('child_process');
const fs = require('fs');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;
let backendProcess;

// Function to start the backend server
function startBackendServer() {
  log.info('Starting backend server...');

  // Get the path to the backend directory
  const backendPath = isDev
    ? path.join(__dirname, '../backend')
    : path.join(process.resourcesPath, 'backend');

  log.info(`Backend path: ${backendPath}`);

  // Check if the backend directory exists
  if (!fs.existsSync(backendPath)) {
    log.error(`Backend directory not found: ${backendPath}`);
    return null;
  }

  // Start the backend server
  const nodeExecutable = process.platform === 'win32' ? 'node.exe' : 'node';

  // In development, use nodemon for hot reloading
  if (isDev) {
    backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: backendPath,
      shell: true,
      env: process.env
    });
  } else {
    // In production, use node directly
    backendProcess = spawn(nodeExecutable, ['src/server.js'], {
      cwd: backendPath,
      shell: true,
      env: {
        ...process.env,
        PORT: 3000,
        NODE_ENV: 'production'
      }
    });
  }

  // Log backend output
  backendProcess.stdout.on('data', (data) => {
    log.info(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    log.error(`Backend error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    log.info(`Backend process exited with code ${code}`);
    backendProcess = null;
  });

  return backendProcess;
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Disable Content Security Policy for development
  // In a production app, you would want to set a proper CSP
  if (isDev) {
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({ responseHeaders: { ...details.responseHeaders } });
    });
  }

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:5173' // Vite dev server URL
    : `file://${path.join(__dirname, '../frontend/dist/index.html').replace(/\\/g, '/')}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();

  // Handle window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(() => {
  // In development mode, we'll start the backend server separately
  if (!isDev) {
    startBackendServer();

    // Wait a moment for the backend to start before creating the window
    setTimeout(() => {
      createWindow();
    }, 2000); // 2 seconds delay
  } else {
    // In development mode, create the window immediately
    createWindow();
  }

  // On macOS, recreate window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up the backend process when the app is about to quit
app.on('before-quit', () => {
  log.info('Cleaning up before quit...');

  if (backendProcess) {
    log.info('Terminating backend process...');

    // Kill the backend process
    if (process.platform === 'win32') {
      // On Windows, we need to kill the process tree
      spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t'], { shell: true });
    } else {
      // On Unix-like systems, we can just kill the process group
      backendProcess.kill('SIGTERM');
    }

    backendProcess = null;
  }
});

// Auto-update handling
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info);
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
  logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  log.info(logMessage);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info);
});

// Check for updates
app.on('ready', () => {
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// IPC handlers for communication between renderer and main process
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
