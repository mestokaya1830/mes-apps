import { createStore } from 'vuex'
import VuexPersist from 'vuex-persist'
const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage
})

export default createStore({
  state: {
    auth: '',
    invoicesPreview: null,
    offersPreview: null,
    ordersPreview: null
  },
  mutations: {
    setAuth(state, payload) {
      state.auth = payload
    },
    setInvoicesPreview(state, payload) {
      state.invoicesPreview = payload
    },
    setOffersPreview(state, payload) {
      state.offersPreview = payload
    },
    setOrdersPreview(state, payload) {
      state.ordersPreview = payload
    }
  },
  actions: {},
  getters: {},
  modules: {},
  plugins: [vuexLocalStorage.plugin]
})
