<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Angebotsdetails und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- base -->
      <div class="form-section">
        <div class="form-section-title">📌 Abgebot Title</div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input v-model="offers.title" type="text" class="form-input" />
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-group">
          <label class="form-label">Angebotsnummer</label>
          <input v-model="offers.id" type="text" class="form-input" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Angebotsdatum</label>
            <input v-model="offers.date" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Angebot Gültigkeits</label>
            <input v-model="offers.valid_days" type="text" class="form-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Von</label>
            <input v-model="offers.service_period_start" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Bis</label>
            <input v-model="offers.service_period_end" type="date" class="form-input" />
          </div>
        </div>
      </div>

      <!--selected-customer -->
      <SelectedCustomer store-name="offersPreview" @get-selected-customer="getSelectedCustomer" />

      <!-- contact person -->
      <ContactPerson store-name="offersPreview" @get-contact-person="getContactPerson" />

      <!-- currency -->
      <Currency store-name="offersPreview" @get-currency="getCurrency" />

      <!-- legal validity -->
      <div class="form-section">
        <div class="form-section-title">
          <span>👤 Rechtsgültigkeit</span>
          <label for="rechtsgültigkeit-checkbox" class="switch">
            <input
              id="rechtsgültigkeit-checkbox"
              v-model="offers.is_legal_validity"
              type="checkbox"
              class="switch-checkbox"
            />
            <span class="slider round"></span>
          </label>
        </div>
      </div>

      <!-- payment terms -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Anzahlung (bereits bezahlt)</label>
            <input
              v-model.number="offers.paid_amount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="offers.payment_terms" type="number" class="form-input" />
          </div>
        </div>
      </div>

      <!-- positions -->
      <Positions store-name="offersPreview" @get-positions="getPositions" />
      <button class="back-btn" @click="storePreview(offers, 'offers', 'setOffersPreview')">
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
  name: 'CreateOffer',
  components: {
    SelectedCustomer,
    ContactPerson,
    Currency,
    Positions
  },
  inject: ['storePreview'],
  data() {
    return {
      title: 'Angebot erstellen',
      offers: {
        title: 'Mein erstes Angebot',
        id: '1',
        date: '2024-12-15',
        valid_days: '',
        service_period_start: '',
        service_period_end: '',
        paid_amount: 0,
        payment_terms: 14,
        is_legal_validity: false,
        positions: [],
        currency: '',
        selected_customer: {},
        contact_person: {}
      }
    }
  },
  mounted() {
    if (this.$store?.state?.offersPreview) {
      const preview = this.$store.state.offersPreview
      if (preview) this.offers = preview
    }
  },
  methods: {
    getSelectedCustomer(customer) {
      if (!customer) return
      this.offers.selected_customer = customer
    },
    getContactPerson(contact_person) {
      if (!contact_person) return
      this.offers.contact_person = contact_person
    },
    getCurrency(currency) {
      if (!currency) return
      this.offers.currency = currency
    },
    getPositions(positions) {
      if (!positions) return
      // this.offer.positions = positions
    }
  }
}
</script>
