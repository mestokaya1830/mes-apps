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
  deliveries: null,
  remeinders: null,
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

    const deliveries = await localforage.getItem('deliveries')
    if (deliveries) state.deliveries = deliveries

    const remeinders = await localforage.getItem('remeinders')
    if (remeinders) state.remeinders = remeinders
  } catch (err) {
    console.error('Failed to load stored data:', err)
  }
}

// set store
async function setStore(store, data) {
  state[store] = data
  try {
    await localforage.setItem(store, data)
  } catch (err) {
    console.error('Failed to save ' + store + ':', err)
  }
}

//clear store
async function clearStore(store) {
  try {
    await localforage.removeItem(store)
    state[store] = undefined
  } catch (err) {
    console.error('Failed to clear ' + store + ':', err)
  }
}

export default {
  state: readonly(state),
  init,
  setStore,
  clearStore
}
