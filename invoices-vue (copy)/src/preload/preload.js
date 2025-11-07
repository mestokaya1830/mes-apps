import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  get: (key) => ipcRenderer.invoke('store-get', key),
  set: (key, value) => ipcRenderer.invoke('store-set', key, value),
  delete: (key) => ipcRenderer.invoke('store-delete', key),
  clear: () => ipcRenderer.invoke('store-clear'),

  controlWindow: (data) => ipcRenderer.invoke('control-window', data),
  checkRegister: async (data) => ipcRenderer.invoke('check-register', data),
  register: async (image, data) => ipcRenderer.invoke('register', image, data),
  login: async (data) => ipcRenderer.invoke('login', data),
  emailVerfication: async (data) => ipcRenderer.invoke('email-verfication', data),
  resetPassword: async (data) => ipcRenderer.invoke('reset-password', data),
  getUser: async (data) => ipcRenderer.invoke('get-user', data),
  updateUser: async (image, data) => ipcRenderer.invoke('update-user', image, data),
  getCustomers: async (data) => ipcRenderer.invoke('get-customers', data),
  getCustomerById: async (data) => ipcRenderer.invoke('get-customer-by-id', data),
  customerDetails: async (id) => ipcRenderer.invoke('customer-details', id),
  addCustomer: async (id) => ipcRenderer.invoke('add-customer', id),
  updateCustomer: async (data) => ipcRenderer.invoke('update-customer', data),
  deleteCustomer: async (data) => ipcRenderer.invoke('delete-customer', data)
})
