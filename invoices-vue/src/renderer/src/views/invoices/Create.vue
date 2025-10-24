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

      <!-- events -->
      <Events store-name="invoicesPreview" @get-events="getEvents" />

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
import Events from '../../components/form/Events.vue'

export default {
  name: 'CreateInvoices',
  components: {
    SelectedCustomer,
    ContactPerson,
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
        verwendungzweck: '',
        selected_customer: {},
        contact_person: {},
        events: {}
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
      console.log(this.invoices)
    },
    getContectPerson(value) {
      this.invoices.contact_person = value //with emit from child component contact person
    },
    getEvents(value) {
      this.invoices.events = value //with emit from child component positions
    }
    // getSmallCompany(value) {
    //   this.events.invoices.is_small_company = value //with emit from child component small company
    // },
    // getCurrency(value) {
    //   this.invoices.events.currency = value //with emit from child component currency
    // },
    // getPaymentTerms(value) {
    //   this.invoices.events.payment = value //with emit from child component payment terms
    // }
  }
}
</script>
