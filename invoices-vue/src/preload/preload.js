import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
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
  deleteCustomer: async (data) => ipcRenderer.invoke('delete-customer', data),
  saveDocument: async (id, tableName, data) =>
    ipcRenderer.invoke('save-document', id, tableName, data),
  getDocument: async (data, tableName) => ipcRenderer.invoke('get-document', data, tableName),
  getDocumentById: async (data, id, tableName) =>
    ipcRenderer.invoke('get-document-by-id', data, id, tableName),
  documentFilter: async (data, value, tableName) =>
    ipcRenderer.invoke('document-filter', data, value, tableName),
  documentStatus: async (id, tableName, value) =>
    ipcRenderer.invoke('set-document-status', id, tableName, value),
  paidStatus: async (id, tableName, value) =>
    ipcRenderer.invoke('set-paid-status', id, tableName, value),
  documentReport: async (data, tableName, startDate, endDate) =>
    ipcRenderer.invoke('document-report', data, tableName, startDate, endDate),
  savePayment: (data, fileName, image_file) =>
    ipcRenderer.invoke('save-payment', data, fileName, image_file)
})
