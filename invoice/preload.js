const { contextBridge, ipcRenderer } = require("electron");

for (const type of ["chrome", "node", "electron"]) {
  console.log(`${type}:`, process.versions[type]);
}

contextBridge.exposeInMainWorld("customerApi", {
  addCustomer: async (data) => await ipcRenderer.invoke("add-customer", data),
  getCustomers: async (data) => await ipcRenderer.invoke("get-customers", data),
  deleteCustomer: async (data) => await ipcRenderer.invoke("delete-customer", data),
  editCustomer: async (data) => await ipcRenderer.invoke("edit-customer", data),
});
