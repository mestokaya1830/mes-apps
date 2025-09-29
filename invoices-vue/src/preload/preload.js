import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  controlWindow: (data) => ipcRenderer.invoke('control-window', data),
  register: async (base64, data) => ipcRenderer.invoke('register', base64, data),
  login: async (data) => ipcRenderer.invoke('login', data),
  emailVerfication: async (data) => ipcRenderer.invoke('email-verfication', data),
  resetPassword: async (data) => ipcRenderer.invoke('reset-password', data),
  updateProfile: async (data) => ipcRenderer.invoke('update-profile', data),
  // saveImage: async (file, fileName) => ipcRenderer.invoke('save-image', file, fileName),
  getCustomers: async (data) => ipcRenderer.invoke('get-customers', data),
  customerDetails: async (id) => ipcRenderer.invoke('customer-details', id),
  addCustomer: async (id) => ipcRenderer.invoke('add-customer', id),
  updateCustomer: async (data) => ipcRenderer.invoke('update-customer', data),
  deleteCustomer: async (data) => ipcRenderer.invoke('delete-customer', data)
})
