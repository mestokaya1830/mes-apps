const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

require("./backend/app.js");

function createWindow() {
  let win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration in the renderer for security
      contextIsolation: true, // Isolate context between preload and renderer to prevent prototype pollution
      sandbox: true, // Enable Chromium's sandbox for renderer process isolation
      enableRemoteModule: false, // Disable remote module to avoid potential security risks
      webSecurity: true, // Enable web security features like same-origin policy and CSP enforcement
      allowRunningInsecureContent: false, // Prevent loading of insecure (HTTP) content on secure (HTTPS) pages
      preload: path.join(__dirname, "preload.js"), // Load preload script with controlled API exposure
    },
  });

  Menu.setApplicationMenu(null); // hide menu bar
  win.loadFile("index.html");
  win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });
}
app.enableSandbox();
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//add customer
ipcMain.handle("add-customer", async (event, data) => {
  try {
    const res = await fetch("http://localhost:3000/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return data;
  } catch (error) {
    console.error("New customer could not be added:", error);
    throw error;
  }
});

//get customers
ipcMain.handle("get-customers", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/customers");
    const customers = await res.json();
    return customers;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

//delete customer
ipcMain.handle("delete-customer", async (event, id) => {
  try {
    await fetch(`http://localhost:3000/api/customers/${id}`, {
      method: "DELETE"
    });
    return { success: true };
  } catch (error) {
    console.error("Customer could not be deleted:", error);
    throw error;
  }
});

//edit customer
ipcMain.handle("edit-customer", async (event, id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/customers/${id}`);
    const customer = await res.json();
    return customer;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

//update customer
ipcMain.handle("update-customer", async (event, data) => {
  try {
    const res = await fetch(`http://localhost:3000/api/customers/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});