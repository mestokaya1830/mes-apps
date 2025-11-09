<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Rechnung und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- base -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rechnungsnummer</label>
            <input v-model="orders.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Rechnungsdatum</label>
            <input v-model="orders.date" type="date" class="form-input" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Von</label>
            <input v-model="orders.service_period_start" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Bis</label>
            <input v-model="orders.service_period_end" type="date" class="form-input" />
          </div>
        </div>
      </div>

      <!-- customer -->
      <SelectedCustomer
        :customerData="orders.selected_customer"
        @get-selected-customer="getSelectedCustomer"
      />

      <!-- events -->
      <Events 
        eventType="orders" 
        :eventsData="orders.events"
        @get-events="getEvents" 
      />

      <!-- preview -->
      <router-link to="/orders/preview" class="preview-btn" @click="setStore">
        Vorschau
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
import SelectedCustomer from '../../components/form/SelectedCustomer.vue'
import Events from '../../components/form/Events.vue'

export default {
  name: 'CreateOrder',
  components: {
    SelectedCustomer,
    Events
  },
  inject: ['storePreview'],
  data() {
    return {
      title: 'Auftrag erstellen',
      orders: {
        id: '1',
        source_page: 'orders',
        date: '',
        service_period_start: '',
        service_period_end: '',
        verwendung: 'Nicht angegeben',
        selected_customer: null,
        events: null
      }
    }
  },
  mounted() {
    this.getStore()
  },

  methods: {
    getStore() {
      if (store.state.orders) {
        this.orders = {
          ...this.orders, // Önce varsayılanları koru
          ...store.state.orders, // Sonra store'dan gelenleri ekle
          selected_customer: store.state.orders.selected_customer || null,
          events: store.state.orders.events || null
        }
      }
    },
    getSelectedCustomer(value) {
      this.orders.selected_customer = value
    },
    getContactPerson(value) {
      this.orders.contact_person = value
    },
    getEvents(value) {
      this.orders.events = value
    },
    setStore() {
      this.storePreview('orders', this.orders)
    }
  }
}
</script>