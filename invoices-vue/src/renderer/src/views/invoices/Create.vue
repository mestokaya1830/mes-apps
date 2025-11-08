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
            <label class="form-label">Rechnungs-Nr.</label>
            <input v-model="invoices.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Datum</label>
            <input v-model="invoices.date" type="date" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Verwendungszweck</label>
          <input v-model="invoices.verwendungszweck" type="text" class="form-input" />
        </div>
      </div>

      <!-- customer -->
      <SelectedCustomer
        v-if="invoices.selected_customer"
        store-name="invoicesPreview"
        :customerData="invoices.selected_customer"
        @get-selected-customer="getSelectedCustomer"
      />

      <!-- events -->
      <Events
        store-name="invoicesPreview"
        v-if="invoices.events"
        :eventsData="invoices.events"
        @get-events="getEvents"
      />

      <!-- preview -->
      <router-link to="/invoices/preview" class="preview-btn" @click="setStore()"
        >Vorschau</router-link
      >
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
import SelectedCustomer from '../../components/form/SelectedCustomer.vue'
import Events from '../../components/form/Events.vue'

export default {
  name: 'CreateInvoices',
  components: {
    SelectedCustomer,
    Events
  },
  inject: ['storePreview'],
  data() {
    return {
      title: 'Rechnung erstellen',
      invoices: {
        id: 1,
        source_page: 'invoices',
        date: '',
        verwendungszweck: '',
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
      if (store.state.invoices) {
        this.invoices = {
          selected_customer: store.state.invoices.selected_customer,
          events: store.state.invoices.events,
          ...store.state.invoices
        }
      } else {
        return this.invoices
      }
    },
    getSelectedCustomer(value) {
      this.invoices.selected_customer = value //with emit from child component selected customer
    },
    getContectPerson(value) {
      this.invoices.contact_person = value //with emit from child component contact person
    },
    getEvents(value) {
      this.invoices.events = value
    },
    setStore() {
      console.time('commit')
      this.storePreview('setInvoices', this.invoices)
      console.timeEnd('commit')
    }
  }
}
</script>
