import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  controlWindow: (data) => ipcRenderer.invoke('control-window', data),
  login: async (data) => ipcRenderer.invoke('login', data),
  emailVerfication: async (data) => ipcRenderer.invoke('email-verfication', data),
  resetPassword: async (data) => ipcRenderer.invoke('reset-password', data),
  updateProfile: async (data) => ipcRenderer.invoke('update-profile', data),
  saveImage: async (base64Data, fileName) => ipcRenderer.invoke('save-image', base64Data, fileName),
  getCustomers: async (data) => ipcRenderer.invoke('get-customers', data),
  customerDetails: async (id) => ipcRenderer.invoke('customer-details', id),
  addCustomer: async (id) => ipcRenderer.invoke('add-customer', id),
  updateCustomer: async (data) => ipcRenderer.invoke('update-customer', data),
  deleteCustomer: async (data) => ipcRenderer.invoke('delete-customer', data)
})
