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

      <!-- events -->
      <Events store-name="offersPreview" @get-events="getEvents" />

      <!-- preview -->
      <router-link to="/offers/preview" class="preview-btn" @click="setStore()">
        Vorschau
      </router-link>
    </div>
  </div>
</template>

<script>
import SelectedCustomer from '../../components/form/SelectedCustomer.vue'
import Events from '../../components/form/Events.vue'

export default {
  name: 'CreateOffer',
  components: {
    SelectedCustomer,
    Events
  },
  inject: ['storePreview'],
  data() {
    return {
      title: 'Angebot erstellen',
      offers: {
        title: 'Mein erstes Angebot',
        id: '1',
        source_page: 'offers',
        date: '2024-12-15',
        valid_days: '',
        is_legal_validity: false,
        selected_customer: {},
        contact_person: {},
        events: {}
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
    getEvents(value) {
      this.offers.events = value
    },
    setStore() {
      this.storePreview(this.offers, 'setOffersPreview')
    }
  }
}
</script>
