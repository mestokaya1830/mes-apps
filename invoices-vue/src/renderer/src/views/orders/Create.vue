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

      <!-- contact person -->
      <ContactPerson store-name="ordersPreview" @get-contact-person="getContactPerson" />

      <!-- currency -->
      <Currency store-name="ordersPreview" @get-currency="getCurrency" />

      <!-- payment terms -->
      <PaymenTerms store-name="ordersPreview" @get-payment-terms="getPaymentTerms" />

      <!-- positions -->
      <Positions store-name="ordersPreview" @get-positions="getPositions" />

      <!-- preview -->
      <button class="back-btn" @click="storePreview(orders, 'orders', 'setOrdersPreview')">
        Vorschau
      </button>
    </div>
  </div>
</template>

<script>
import SelectedCustomer from '../../components/form/SelectedCustomer.vue'
import ContactPerson from '../../components/form/ContactPerson.vue'
import Currency from '../../components/form/Currency.vue'
import Positions from '../../components/form/Positions.vue'
import PaymenTerms from '../../components/form/PaymenTerms.vue'

export default {
  name: 'CreateOrder',
  components: {
    SelectedCustomer,
    ContactPerson,
    Currency,
    Positions,
    PaymenTerms
  },
  inject: ['storePreview'],
  data() {
    return {
      title: 'Auftrag erstellen',
      orders: {
        id: '1',
        date: '',
        service_period_start: '',
        service_period_end: '',
        verwendung: 'Nicht angegeben',
        payment: {},
        positions: [],
        currency: '',
        selected_customer: {},
        contact_person: {}
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
      if (!value) return
      this.orders.selected_customer = value
    },
    getContactPerson(value) {
      if (!value) return
      this.orders.contact_person = value
    },
    getCurrency(value) {
      if (!value) return
      this.orders.currency = value
    },
    getPositions(value) {
      if (!value) return
      // this.orders.positions = value
    },
    getPaymentTerms(value) {
      if (!value) return
      this.orders.payment = value
    }
  }
}
</script>
