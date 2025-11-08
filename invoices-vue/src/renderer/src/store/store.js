// src/stores/useStore.js
import { reactive, readonly } from 'vue'
import localforage from 'localforage'

localforage.config({
  name: 'myApp',
  storeName: 'appData'
})

const state = reactive({
  auth: null,
  invoices: null
})

// init: IndexedDB’den önceki verileri yükle
async function init() {
  try {
    const authStored = await localforage.getItem('auth')
    if (authStored) state.auth = authStored

    const invoices = await localforage.getItem('invoices')
    if (invoices) state.invoices = invoices
  } catch (err) {
    console.error('Failed to load stored data:', err)
  }
}

async function setAuth(user) {
  state.auth = user
  try {
    await localforage.setItem('auth', user)
  } catch (err) {
    console.error('Failed to save auth:', err)
  }
}
async function clearAuth() {
  state.auth = null
  try {
    await localforage.removeItem('auth')
  } catch (err) {
    console.error('Failed to clear auth:', err)
  }
}

async function setInvoices(data) {
  state.invoices = data
  try {
    await localforage.setItem('invoices', data)
  } catch (err) {
    console.error('Failed to save invoices:', err)
  }
}

export default {
  state: readonly(state),
  init,
  setAuth,
  clearAuth,
  setInvoices
}
