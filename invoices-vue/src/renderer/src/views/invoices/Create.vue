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
          <label class="form-label">Verwendungzweck</label>
          <input v-model="invoices.verwendung" type="text" class="form-input" />
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
      <PaymentTerms store-name="invoicesPreview" @get-payment-terms="getPaymentTerms" />

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
import PaymentTerms from '../../components/form/PaymentTerms.vue'

export default {
  name: 'CreateInvoices',
  components: {
    SelectedCustomer,
    ContactPerson,
    Currency,
    SmallCompany,
    Positions,
    PaymentTerms
  },
  inject: ['storePreview'],
  data() {
    return {
      title: 'Rechnung erstellen',
      invoices: {
        id: 1,
        date: '',
        is_small_company: false,
        service_period_start: '',
        service_period_end: '',
        verwendungzweck: '',
        selected_customer: {},
        contact_person: {},
        currency: '',
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
      this.invoices.selected_customer = value //with emit from child component selected customer
    },
    getContectPerson(value) {
      this.invoices.contact_person = value //with emit from child component contact person
    },
    getSmallCompany(value) {
      this.invoices.is_small_company = value //with emit from child component small company
    },
    getCurrency(value) {
      this.invoices.currency = value //with emit from child component currency
    },
    getPositions(value) {
      this.invoices.positions = value //with emit from child component positions
    },
    getPaymentTerms(value) {
      this.invoices.payment = value //with emit from child component payment terms
    }
  }
}
</script>
