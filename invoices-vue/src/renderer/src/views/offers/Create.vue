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

      <!-- positions -->
      <Positions store-name="offersPreview" @get-positions="getPositions" />

      <!-- preview -->
      <button class="back-btn" @click="storePreview(offers, 'offers', 'setOffersPreview')">
        Vorschau
      </button>
    </div>
  </div>
</template>

<script>
import SelectedCustomer from '../../components/form/SelectedCustomer.vue'
import ContactPerson from '../../components/form/ContactPerson.vue'
import Positions from '../../components/form/Positions.vue'

export default {
  name: 'CreateOffer',
  components: {
    SelectedCustomer,
    ContactPerson,
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
        payment: {},
        is_legal_validity: false,
        positions: [],
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
    getSelectedCustomer(value) {
      this.offers.selected_customer = value
    },
    getContactPerson(value) {
      this.offers.contact_person = value
    },
    // getPositions(value) {
    //   this.offers.positions = value
    // },
  }
}
</script>
