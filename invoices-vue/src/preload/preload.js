import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  controlWindow: (data) => ipcRenderer.invoke('control-window', data),
  checkRegister: async (data) => ipcRenderer.invoke('check-register', data),
  register: async (data, image) => ipcRenderer.invoke('register', data, image),
  login: async (data) => ipcRenderer.invoke('login', data),
  emailVerfication: async (data) => ipcRenderer.invoke('email-verfication', data),
  resetPassword: async (data) => ipcRenderer.invoke('reset-password', data),
  updateUser: async (image, data) => ipcRenderer.invoke('update-user', image, data),
  getUser: async (data) => ipcRenderer.invoke('get-user', data),
  getCustomers: async (data) => ipcRenderer.invoke('get-customers', data),
  getCustomerById: async (data) => ipcRenderer.invoke('get-customer-by-id', data),
  customerDetails: async (id) => ipcRenderer.invoke('customer-details', id),
  addCustomer: async (id) => ipcRenderer.invoke('add-customer', id),
  updateCustomer: async (data) => ipcRenderer.invoke('update-customer', data),
  deleteCustomer: async (data) => ipcRenderer.invoke('delete-customer', data),
  getLogoPath: async (data) => ipcRenderer.invoke('get-logo-path', data)
})
