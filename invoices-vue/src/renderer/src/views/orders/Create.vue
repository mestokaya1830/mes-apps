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
      <SelectedCustomer store-name="ordersPreview" @get-selected-customer="getSelectedCustomer" />

      <!-- events -->
      <Events store-name="ordersPreview" @get-events="getEvents" />

      <!-- preview -->
      <StorePreview :data="orders" store-link="orders" store-commit="setOrdersPreview" />
    </div>
  </div>
</template>

<script>
import SelectedCustomer from '../../components/form/SelectedCustomer.vue'
import Events from '../../components/form/Events.vue'
import StorePreview from '../../components/preview/StorePreview.vue'

export default {
  name: 'CreateOrder',
  components: {
    SelectedCustomer,
    Events,
    StorePreview
  },
  data() {
    return {
      title: 'Auftrag erstellen',
      orders: {
        id: '1',
        source_page: 'orders',
        date: '',
        verwendung: 'Nicht angegeben',
        selected_customer: {},
        contact_person: {},
        events: {}
      }
    }
  },
  mounted() {
    if (this.$store?.state?.ordersPreview) {
      const preview = this.$store.state.ordersPreview
      if (preview) this.orders = preview
    }
  },
  methods: {
    getSelectedCustomer(value) {
      this.orders.selected_customer = value
    },
    getContactPerson(value) {
      this.orders.contact_person = value
    },
    getEvents(value) {
      this.orders.events = value
    }
  }
}
</script>
