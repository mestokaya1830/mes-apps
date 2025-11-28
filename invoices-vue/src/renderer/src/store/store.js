// src/stores/useStore.js
import { reactive, readonly } from 'vue'
import localforage from 'localforage'

localforage.config({
  name: 'myApp',
  storeName: 'appData'
})

const state = reactive({
  auth: null,
  invoice: null,
  offer: null,
  order: null,
  deliverie: null,
  remeinder: null,
  date_filter: null,
  _isClearing: false // IndexedDB temizleme işlemi için flag
})

// init: IndexedDB’den önceki verileri yükle
async function init() {
  try {
    const authStored = await localforage.getItem('auth')
    if (authStored) state.auth = authStored

    const invoice = await localforage.getItem('invoice')
    if (invoice) state.invoice = invoice

    const offer = await localforage.getItem('offer')
    if (offer) state.offer = offer

    const order = await localforage.getItem('order')
    if (order) state.order = order

    const deliverie = await localforage.getItem('deliverie')
    if (deliverie) state.deliverie = deliverie

    const remeinder = await localforage.getItem('remeinder')
    if (remeinder) state.remeinder = remeinder

    const date_filter = await localforage.getItem('date_filter')
    if (date_filter) state.date_filter = date_filter
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
