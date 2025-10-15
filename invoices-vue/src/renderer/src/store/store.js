import { createStore } from 'vuex'
import VuexPersist from 'vuex-persist'
const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage
})

export default createStore({
  state: {
    auth: '',
    invoicePreview: '',
    offerPreview: '',
    orderPreview: ''
  },
  mutations: {
    setAuth(state, payload) {
      state.auth = payload
    },
    setInvoicePreview(state, payload) {
      state.invoicePreview = payload
    },
    setOfferPreview(state, payload) {
      state.offerPreview = payload
    },
    setOrderPreview(state, payload) {
      state.orderPreview = payload
    }
  },
  actions: {},
  getters: {},
  modules: {},
  plugins: [vuexLocalStorage.plugin]
})
