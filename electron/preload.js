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

// Add debugging code to help diagnose CSS loading issues
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  // Check if stylesheets are loaded
  const stylesheets = document.styleSheets;
  console.log(`Number of stylesheets: ${stylesheets.length}`);

  for (let i = 0; i < stylesheets.length; i++) {
    try {
      console.log(`Stylesheet ${i}: ${stylesheets[i].href}`);
    } catch (e) {
      console.log(`Error accessing stylesheet ${i}: ${e.message}`);
    }
  }

  // Check for specific elements
  setTimeout(() => {
    const root = document.getElementById('root');
    console.log(`Root element children: ${root ? root.children.length : 'root not found'}`);
  }, 1000);
});
