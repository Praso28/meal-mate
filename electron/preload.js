const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // API for communicating with the main process
  api: {
    // Get app version from main process
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    
    // Add more methods as needed for your application
  }
});
