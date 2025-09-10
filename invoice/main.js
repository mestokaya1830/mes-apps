const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

// backend
require("./backend/app.js");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.webContents.openDevTools();
  Menu.setApplicationMenu(null);
  win.loadFile("index.html"); // Renderer (UI)
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
