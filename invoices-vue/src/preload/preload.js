import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  //window control
  controlWindow: (data) => ipcRenderer.invoke('control-window', data),

  //register
  checkRegister: async () => ipcRenderer.invoke('check-register'),
  register: async (data) => ipcRenderer.invoke('register', data),

  //login and user
  login: async (data) => ipcRenderer.invoke('login', data),
  resetPassword: async (data) => ipcRenderer.invoke('reset-password', data),
  emailVerfication: async (data) => ipcRenderer.invoke('email-verfication', data),
  getUser: async (data) => ipcRenderer.invoke('get-user', data),
  updateUser: async (data) => ipcRenderer.invoke('update-user', data),

  //dashboard
  getDashboard: async (data) => ipcRenderer.invoke('get-dashboard', data),

  //customer
  addCustomer: async (data) => ipcRenderer.invoke('add-customer', data),
  getCustomers: async (data) => ipcRenderer.invoke('get-customers', data),
  getCustomerById: async (id) => ipcRenderer.invoke('get-customer-by-id', id),
  customerDetails: async (id) => ipcRenderer.invoke('customer-details', id),
  updateCustomerById: async (data) => ipcRenderer.invoke('update-customer-by-id', data),
  deleteCustomerById: async (id) => ipcRenderer.invoke('delete-customer-by-id', id),
  searchCustomers: async (data) => ipcRenderer.invoke('search-customers', data),

  //invoice
  addInvoice: async (data) => ipcRenderer.invoke('add-invoice', data),
  getInvoices: async (data) => ipcRenderer.invoke('get-invoices', data),
  getInvoiceById: async (id) => ipcRenderer.invoke('get-invoice-by-id', id),
  setInvoiceStatus: async (data) => ipcRenderer.invoke('set-invoice-status', data),
  filterInvoicesCategories: async (data) => ipcRenderer.invoke('flter-invoices-categories', data),
  searchInvoices: async (term) => ipcRenderer.invoke('search-invoices', term),
  filterInvoicesDate: async (date) => ipcRenderer.invoke('filter-invoices-date', date),
  savePayment: (data) => ipcRenderer.invoke('save-payment', data),

  documentReport: async (data) => ipcRenderer.invoke('document-report', data)
})
