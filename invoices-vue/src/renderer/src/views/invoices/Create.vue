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
          <label class="form-label">Leistungszeitraum</label>
          <input v-model="invoices.service_period" type="text" class="form-input" />
        </div>
      </div>

      <!-- customer -->
      <SelectedCustomer store-name="invoicesPreview" @get-selected-customer="getSelectedCustomer" />

      <!-- contact person -->
      <ContactPerson store-name="invoicesPreview" @get-contect-person="getContectPerson" />

      <!-- small company -->
      <SmallCompany store-name="invoicesPreview" @get-small-company="getSmallCompany" />

      <!-- currency -->
      <Currency store-name="invoicesPreview" @get-currency="getCurrency" />

      <!-- payment terms -->
      <PaymenTerms store-name="invoicesPreview" @get-payment-terms="getPaymentTerms" />

      <!-- positions -->
      <Positions store-name="invoicesPreview" @get-positions="getPositions" />

      <!-- preview -->
      <button class="back-btn" @click="storePreview(invoices, 'invoices', 'setInvoicesPreview')">
        Vorschau
      </button>
    </div>
  </div>
</template>

<script>
import SelectedCustomer from '../../components/form/SelectedCustomer.vue'
import ContactPerson from '../../components/form/ContactPerson.vue'
import Currency from '../../components/form/Currency.vue'
import SmallCompany from '../../components/form/SmallCompany.vue'
import Positions from '../../components/form/Positions.vue'
import PaymenTerms from '../../components/form/PaymenTerms.vue'

export default {
  name: 'CreateInvoices',
  components: {
    SelectedCustomer,
    ContactPerson,
    Currency,
    SmallCompany,
    Positions,
    PaymenTerms
  },
  inject: ['storePreview'],
  data() {
    return {
      title: 'Rechnung erstellen',
      invoices: {
        id: 1,
        date: '',
        service_period: 'Okt - Dez 2024',
        verwendung: 'Nicht angegeben',
        selected_customer: {},
        contact_person: {},
        currency: '',
        is_small_company: false,
        positions: [],
        payment: {}
      }
    }
  },
  mounted() {
    if (this.$store?.state?.invoicesPreview) {
      const preview = this.$store.state.invoicesPreview
      if (preview) this.invoices = preview
    } else {
      return this.invoices
    }
  },
  methods: {
    getSelectedCustomer(value) {
      if (!value) return
      this.invoices.selected_customer = value //with emit from child component selected customer
    },
    getContectPerson(value) {
      if (!value) return
      this.invoices.contact_person = value //with emit from child component contact person
    },
    getSmallCompany(value) {
      if (!value) return
      this.invoices.is_small_company = value //with emit from child component small company
    },
    getCurrency(value) {
      if (!value) return
      this.invoices.currency = value //with emit from child component currency
    },
    getPositions(value) {
      if (!value) return
      // this.invoices.positions = value //with emit from child component positions
    },
    getPaymentTerms(value) {
      if (!value) return
      this.invoices.payment = value //with emit from child component payment terms
    }
  }
}
</script>
