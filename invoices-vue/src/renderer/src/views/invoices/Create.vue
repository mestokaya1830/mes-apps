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
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Anzahlung (bereits bezahlt)</label>
            <input
              v-model.number="invoices.paid_amount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="invoices.payment_terms" type="number" class="form-input" />
          </div>
        </div>
      </div>

      <Positions store-name="invoicesPreview" @get-positions="getPositions" />

      <!-- preview -->
      <button class="back-btn" @click="storePreview(invoices, 'invoices', 'setInvoicesPreview')">
        Preview
      </button>
    </div>
  </div>
</template>

<script>
import SelectedCustomer from '../../components/SelectedCustomer.vue'
import ContactPerson from '../../components/ContactPerson.vue'
import Currency from '../../components/Currency.vue'
import SmallCompany from '../../components/SmallCompany.vue'
import Positions from '../../components/Positions.vue'

export default {
  name: 'CreateInvoices',
  components: {
    SelectedCustomer,
    ContactPerson,
    Currency,
    SmallCompany,
    Positions
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
        paid_amount: 0,
        payment_terms: 14,
        is_small_company: false,
        positions: [],
        currency: '',
        selected_customer: {},
        contact_person: {}
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
    }
  }
}
</script>
