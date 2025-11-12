<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝 {{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie das Angebot und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- Grunddaten -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-group">
          <label class="form-label">Angebotsnummer *</label>
          <input v-model="offers.id" type="text" class="form-input" readonly />
          <small class="form-hint">Format: AN-YYYY-XXXX (automatisch generiert)</small>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Angebotsdatum *</label>
            <input v-model="offers.date" type="date" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungsdatum</label>
            <input v-model="offers.service_date" type="date" class="form-input" />
            <small class="form-hint">Datum der Leistungserbringung</small>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Betreff / Beschreibung</label>
          <input
            v-model="offers.payment_reference"
            type="text"
            class="form-input"
            placeholder="z.B. Webentwicklung Projekt XYZ"
          />
        </div>
      </div>

      <!-- Kunde -->
      <div v-if="customers" class="form-section">
        <div class="form-section-title">👤 Kunde</div>
        <div class="form-group">
          <label class="form-label">Kundendaten</label>
          <select v-model="customerList" class="form-input" @change="getCustomerById">
            <option selected disabled>Wähle Kunden</option>
            <option v-for="item in customers" :key="item.id" :value="item.id">
              {{ item.company_name ? item.company_name : item.first_name + ' ' + item.last_name }}
            </option>
          </select>
        </div>
        <div v-if="offers.selected_customer.id" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr.</label>
            <input
              v-model="offers.selected_customer.id"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-group">
            <label class="form-label">Firmname</label>
            <input
              v-model="offers.selected_customer.company_name"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname</label>
              <input
                v-model="offers.selected_customer.first_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname</label>
              <input
                v-model="offers.selected_customer.last_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input
              v-model="offers.selected_customer.address"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ</label>
              <input
                v-model="offers.selected_customer.postal_code"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt</label>
              <input
                v-model="offers.selected_customer.city"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Positionen -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="offers.positions && offers.positions.length === 0">
          Keine Positionen vorhanden
        </div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in offers.positions" :key="index" class="position-item">
            <div class="positions-header">
              <span class="position-number">Position {{ index + 1 }}</span>
              <button class="delete-position-btn" @click="deletePosition(index)">🗑️ Löschen</button>
            </div>
            <div class="form-group">
              <label class="form-label">Bezeichnung</label>
              <input v-model="pos.title" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Beschreibung</label>
              <input v-model="pos.description" type="text" class="form-input" />
            </div>
            <div class="form-row form-row-4">
              <div class="form-group">
                <label class="form-label">Einheit</label>
                <select v-model="pos.unit" class="form-input">
                  <option value="Stk">Stk</option>
                  <option value="Std">Std</option>
                  <option value="Tag">Tag</option>
                  <option value="Monat">Monat</option>
                  <option value="Pauschal">Pauschal</option>
                  <option value="m²">m²</option>
                  <option value="kg">kg</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Menge</label>
                <input v-model.number="pos.quantity" type="number" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Preis (€)</label>
                <input v-model.number="pos.price" type="number" class="form-input" step="0.01" />
              </div>
              <div class="form-group">
                <label class="form-label">MwSt. (%)</label>
                <select v-model.number="pos.vat" class="form-input">
                  <option :value="0">0</option>
                  <option :value="7">7</option>
                  <option :value="19">19</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
      </div>

      

      <!-- Vorschau Button -->
      <router-link to="/offers/preview" class="preview-btn" @click="setStore">
        👁️ Vorschau anzeigen
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
export default {
  name: 'CreateOffers',
  data() {
    return {
      title: 'Angebot erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      offers: {
        id: 1,
        date: '',
        service_date: '',
        payment_reference: '',
        selected_customer: {},
        positions: []
      }
    }
  },
  mounted() {
    this.getCustomers()
    this.getStore()
  },
  methods: {
    async getCustomers() {
      try {
        const response = await window.api.getCustomers()
        if (response.success) {
          this.customers = response.customers
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    },
    getCustomerById() {
      const customer = this.customers.find((item) => item.id === this.customerList)
      if (customer) this.offers.selected_customer = customer
    },
    getStore() {
      if (store.state.offers) {
        this.offers = JSON.parse(JSON.stringify(store.state.offers))
      }
    },
    addPosition() {
      this.offers.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        unit: 'Stk',
        quantity: 1,
        price: 0,
        vat: 19
      })
    },
    deletePosition(index) {
      if (this.offers.positions.length > 0) {
        this.offers.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    setStore() {
      store.commit('setOffers', this.offers)
    }
  }
}
</script>

<style>
/* Basit stil ve grid yapıları önceki formdan alınabilir */
</style>
