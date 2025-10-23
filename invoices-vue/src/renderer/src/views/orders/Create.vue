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
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Anzahlung (bereits bezahlt)</label>
            <input
              v-model.number="orders.paid_amount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="orders.payment_terms" type="number" class="form-input" />
          </div>
        </div>
      </div>

      <!-- positions -->
      <Positions store-name="ordersPreview" @get-positions="getPositions" />

      <!-- preview -->
      <button class="back-btn" @click="storePreview(orders, 'orders', 'setOrdersPreview')">
        Preview
      </button>
    </div>
  </div>
</template>

<script>
import SelectedCustomer from '../../components/SelectedCustomer.vue'
import ContactPerson from '../../components/ContactPerson.vue'
import Currency from '../../components/Currency.vue'
import Positions from '../../components/Positions.vue'
export default {
  name: 'CreateOrder',
  components: {
    SelectedCustomer,
    ContactPerson,
    Currency,
    Positions
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
        paid_amount: 0,
        payment_terms: 14,
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
    this.getCustomers()
  },
  methods: {
    async getCustomers() {
      try {
        const response = await window.api.getCustomers()
        if (response.success) {
          this.customers = response.customers
        } else {
          console.error('Error fetching customers:', response.message)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    },
    getCustomerById() {
      const customer = this.customers.find((item) => item.id === this.customerList)
      if (customer) this.orders.selected_customer = { ...customer }
    },
    getSelectedCustomer(customer) {
      if (!customer) return
      this.orders.selected_customer = customer
    },
    getContactPerson(contact_person) {
      if (!contact_person) return
      this.orders.contact_person = contact_person
    },
    getCurrency(currency) {
      if (!currency) return
      this.orders.currency = currency
    },
    getPositions(positions) {
      if (!positions) return
      this.orders.positions = positions
    }
  }
}
</script>
