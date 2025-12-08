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
  getCustomerById: async (data) => ipcRenderer.invoke('get-customer-by-id', data),
  customerDetails: async (id) => ipcRenderer.invoke('customer-details', id),
  updateCustomerById: async (data) => ipcRenderer.invoke('update-customer-by-id', data),
  deleteCustomerById: async (id) => ipcRenderer.invoke('delete-customer-by-id', id),
  searchCustomers: async (data) => ipcRenderer.invoke('search-customers', data),

  //invoice
  addInvoice: async (data) => ipcRenderer.invoke('add-invoice', data),
  getInvoices: async (data) => ipcRenderer.invoke('get-invoices', data),
  getInvoiceById: async (data) => ipcRenderer.invoke('get-invoice-by-id', data),
  cancelInvoice: async (data) => ipcRenderer.invoke('cancel-invoice', data),
  filterInvoicesCategories: async (data) => ipcRenderer.invoke('flter-invoices-categories', data),
  searchInvoices: async (term) => ipcRenderer.invoke('search-invoices', term),
  filterInvoicesDate: async (date) => ipcRenderer.invoke('filter-invoices-date', date),

  //offer
  addOffer: async (data) => ipcRenderer.invoke('add-offer', data),
  getOffers: async (data) => ipcRenderer.invoke('get-offers', data),
  getOfferById: async (id) => ipcRenderer.invoke('get-offer-by-id', id),
  deleteOfferById: async (id) => ipcRenderer.invoke('delete-offer-by-id', id),
  updateOfferById: async (data) => ipcRenderer.invoke('update-offer-by-id', data),

  //order
  addOrder: async (data) => ipcRenderer.invoke('add-order', data),
  getOrders: async (data) => ipcRenderer.invoke('get-orders', data),
  getOrderById: async (id) => ipcRenderer.invoke('get-order-by-id', id),
  deleteOrderById: async (id) => ipcRenderer.invoke('delete-order-by-id', id),
  cancelOrder: async (data) => ipcRenderer.invoke('cancel-order', data),

  //payment
  addPayment: (data) => ipcRenderer.invoke('add-payment', data),
  getPaymentById: (id) => ipcRenderer.invoke('get-payment-by-id', id),
  deletePaymentById: (id) => ipcRenderer.invoke('delete-payment-by-id', id),
  // documentReport: async (data) => ipcRenderer.invoke('document-report', data)
})
