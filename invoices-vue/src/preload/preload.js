import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  //window control
  controlWindow: (data) => ipcRenderer.invoke('control-window', data),

  //register
  register: async (image, data) => ipcRenderer.invoke('register', image, data),
  checkRegister: async (data) => ipcRenderer.invoke('check-register', data),

  //login and user
  login: async (data) => ipcRenderer.invoke('login', data),
  resetPassword: async (data) => ipcRenderer.invoke('reset-password', data),
  emailVerfication: async (data) => ipcRenderer.invoke('email-verfication', data),
  getUser: async (data) => ipcRenderer.invoke('get-user', data),
  updateUser: async (image, data) => ipcRenderer.invoke('update-user', image, data),

  //dashboard
  getDashboard: async (data) => ipcRenderer.invoke('get-dashboard', data),

  //customer
  addCustomer: async (data) => ipcRenderer.invoke('add-customer', data),
  getCustomers: async (data) => ipcRenderer.invoke('get-customers', data),
  getCustomerById: async (data, id) => ipcRenderer.invoke('get-customer-by-id', data, id),
  updateCustomerById: async (data, id) => ipcRenderer.invoke('update-customer-by-id', id, data),
  deleteCustomerById: async (data) => ipcRenderer.invoke('delete-customer-by-id', data),
  searchCustomer: async (data, term) => ipcRenderer.invoke('search-customer', data, term),

  //invoice
  saveDocument: async (id, tableName, data) =>
    ipcRenderer.invoke('save-document', id, tableName, data),
  getDocument: async (data, tableName) => ipcRenderer.invoke('get-document', data, tableName),
  getDocumentById: async (data, id, tableName) =>
    ipcRenderer.invoke('get-document-by-id', data, id, tableName),
  savePayment: (data, fileName, image_file) =>
    ipcRenderer.invoke('save-payment', data, fileName, image_file),
  setInvoiceStatus: async (id, value) => ipcRenderer.invoke('set-invoice-status', id, value),
  categoryFilter: async (data, tableName, category) =>
    ipcRenderer.invoke('category-filter', data, tableName, category),
  dateFilter: async (data, tableName, date) =>
    ipcRenderer.invoke('date-filter', data, tableName, date),

  documentReport: async (data, tableName, startDate, endDate) =>
    ipcRenderer.invoke('document-report', data, tableName, startDate, endDate)
})
