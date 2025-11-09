// src/stores/useStore.js
import { reactive, readonly } from 'vue'
import localforage from 'localforage'

localforage.config({
  name: 'myApp',
  storeName: 'appData'
})

const state = reactive({
  auth: null,
  invoices: null,
  offers: null,
  orders: null,
  _isClearing: false // IndexedDB temizleme işlemi için flag
})

// init: IndexedDB’den önceki verileri yükle
async function init() {
  try {
    const authStored = await localforage.getItem('auth')
    if (authStored) state.auth = authStored

    const invoices = await localforage.getItem('invoices')
    if (invoices) state.invoices = invoices

    const offers = await localforage.getItem('offers')
    if (offers) state.offers = offers

    const orders = await localforage.getItem('orders')
    if (orders) state.orders = orders
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
  try {
    await localforage.removeItem('auth')
    state.auth = undefined
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
async function clearInvoices() {
  state._isClearing = true // Flag'i aç
  try {
    await localforage.removeItem('invoices')
    state.invoices = undefined
  } catch (err) {
    console.error('Failed to clear invoices:', err)
  }
}
async function setOffers(data) {
  state.offers = data
  try {
    await localforage.setItem('offers', data)
  } catch (err) {
    console.error('Failed to save offers:', err)
  }
}
async function setOrders(data) {
  state.orders = data
  try {
    await localforage.setItem('orders', data)
  } catch (err) {
    console.error('Failed to save orders:', err)
  }
}

export default {
  state: readonly(state),
  init,
  setAuth,
  clearAuth,
  setInvoices,
  clearInvoices,
  setOffers,
  setOrders
}
