<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Angebotsdetails und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- Base -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-group">
          <label class="form-label">Angebotsnummer *</label>
          <input v-model="offers.id" type="text" class="form-input" readonly />
          <small class="form-hint">Format: ANG-YYYY-XXXX (automatisch generiert)</small>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Angebotsdatum *</label>
            <input v-model="offers.date" type="date" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Gültig bis *</label>
            <input v-model="offers.valid_until" type="date" class="form-input" required />
            <small class="form-hint">Standard: 30 Tage ab Angebotsdatum</small>
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
            <input v-model="offers.selected_customer.id" type="text" class="form-input" readonly />
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
      <!-- Tax -->
      <div class="form-section">
        <div class="form-section-title">💼 Steueroptionen</div>
        <div class="form-option">
          <label for="reverse-charge-checkbox" class="switch">
            <input
              id="reverse-charge-checkbox"
              v-model="offers.is_reverse_charge"
              type="checkbox"
              class="switch-checkbox"
              @change="calculateReverseCharge"
            />
            <span class="slider round"></span>
          </label>
          <div class="option-text">
            <strong>Reverse-Charge-Verfahren</strong>
            <small>Steuerschuldnerschaft des Leistungsempfängers (§13b UStG)</small>
          </div>
        </div>

        <div class="form-option">
          <label for="kleinunternehmer-checkbox" class="switch">
            <input
              id="kleinunternehmer-checkbox"
              v-model="offers.is_kleinunternehmer"
              type="checkbox"
              class="switch-checkbox"
              @change="calculateKleinunternehmer"
            />
            <span class="slider round"></span>
          </label>
          <div class="option-text">
            <strong>Kleinunternehmerregelung (§19 UStG)</strong>
            <small>Keine Umsatzsteuer wird berechnet</small>
          </div>
        </div>

        <div class="form-option">
          <label for="legal-validity-checkbox" class="switch">
            <input
              id="legal-validity-checkbox"
              v-model="offers.is_legal_validity"
              type="checkbox"
              class="switch-checkbox"
            />
            <span class="slider round"></span>
          </label>
          <div class="option-text">
            <strong>Rechtsgültige Unterschrift erforderlich</strong>
          </div>
        </div>
      </div>
      <!-- currency -->
      <div class="form-section">
        <div class="form-section-title">💰 Währung</div>
        <div class="form-group">
          <label class="form-label">Waehrung</label>
          <select v-model="offers.currency" class="form-input">
            <option selected disabled>Wähle Waehrung</option>
            <option value="EUR.de-DE">EUR</option>
            <option value="USD.en-US">USD</option>
            <option value="GBP.en-GB">GBP</option>
            <option value="CHF.ch-CH">CHF</option>
            <option value="JPY.ja-JP">JPY</option>
            <option value="AUD.en-AU">AUD</option>
            <option value="CAD.en-CA">CAD</option>
            <option value="CNY.zh-CN">CNY</option>
            <option value="SEK.sv-SE">SEK</option>
            <option value="NZD.en-NZ">NZD</option>
          </select>
        </div>
      </div>
      <!-- positions -->
      <div class="form-section-title">📦 Positionen</div>
      <div v-if="offers.positions && offers.positions.length === 0">Keine Positionen vorhanden</div>
      <div v-else class="positions-editor">
        <div v-for="(pos, index) in offers.positions" :key="index" class="position-item">
          <div class="position-header">
            <span class="position-number">Position {{ index + 1 }}</span>
            <button class="delete-btn" @click="deletePosition(index)">🗑️ Löschen</button>
          </div>
          <div class="form-group">
            <label class="form-label">Bezeichnung</label>
            <input v-model="pos.title" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Beschreibung</label>
            <input v-model="pos.description" type="text" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Leistungszeitraum Von</label>
              <input v-model="pos.service_period_start" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Leistungszeitraum Bis</label>
              <input v-model="pos.service_period_end" type="date" class="form-input" />
            </div>
          </div>
          <div class="position-inputs">
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
              <input
                v-model.number="pos.quantity"
                type="number"
                class="form-input"
                @input="getUnitTotal(pos.quantity, pos.price, index)"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Preis (€)</label>
              <input
                v-model.number="pos.price"
                type="number"
                class="form-input"
                step="0.01"
                @input="getUnitTotal(pos.quantity, pos.price, index)"
              />
            </div>
            <div class="form-group">
              <label class="form-label">MwSt. (%)</label>
              <select
                v-if="!offers.is_reverse_charge"
                v-model.number="pos.vat"
                class="form-input"
                @change="getUnitTotal(pos.quantity, pos.price, index)"
              >
                <option :value="0">0</option>
                <option :value="7">7</option>
                <option :value="19">19</option>
              </select>
            </div>
          </div>
          <div class="form-result">
            <div>
              <label class="form-label">Vat Unit (€)</label>
              <div class="form-result-item">
                {{ pos.vat_unit }}
              </div>
            </div>
            <div>
              <label class="form-label">Unit Total (€)</label>
              <div class="form-result-item">{{ pos.unit_total }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsbedingungen</div>
        <div class="form-group">
          <label class="form-label">Zahlungsziel (Tage) *</label>
          <input
            v-model.number="offers.payment.payment_terms"
            type="number"
            class="form-input"
            required
          />
          <small class="form-hint"
            >Zahlbar innerhalb {{ offers.payment.payment_terms }} Tagen netto</small
          >
        </div>
        <div class="form-option">
          <label for="skonto-checkbox" class="switch">
            <input
              id="skonto-checkbox"
              v-model="offers.payment.has_skonto"
              type="checkbox"
              class="switch-checkbox"
            />
            <span class="slider round"></span>
          </label>
          <div class="option-text">
            <strong>Skonto gewähren</strong>
          </div>
        </div>
        <div v-if="offers.payment.has_skonto" class="form-row">
          <div class="form-group">
            <label class="form-label">Skonto (%)</label>
            <input
              v-model.number="offers.payment.skonto_percentage"
              type="number"
              step="0.1"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Skonto Frist (Tage)</label>
            <input v-model.number="offers.payment.skonto_days" type="number" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Zusätzliche Zahlungsbedingungen</label>
          <textarea
            v-model="offers.payment.payment_conditions"
            class="form-input"
            rows="3"
          ></textarea>
        </div>
      </div>
      <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>

      <!-- preview button -->
      <router-link to="/offers/preview" class="preview-btn" @click="setStore">
        👁️ Vorschau anzeigen
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'

export default {
  name: 'CreateOffer',
  inject: ['storePreview'],
  data() {
    return {
      title: 'Angebot erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      offers: {
        title: 'Mein erstes Angebot',
        id: '1',
        source_page: 'offers',
        date: new Date().toISOString().split('T')[0],
        valid_until: '',
        service_period_start: '',
        service_period_end: '',
        is_legal_validity: false,
        is_reverse_charge: false,
        is_kleinunternehmer: false,
        selected_customer: {},
        currency: 'EUR.de-DE',
        positions: [],
        payment: {
          paid_amount: 0,
          payment_terms: 14,
          payment_conditions: '',
          has_skonto: false,
          skonto_percentage: 2,
          skonto_days: 7
        }
      }
    }
  },
  mounted() {
    this.getStore()
    this.getCustomers()
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
    calculateReverseCharge() {
      this.offers.positions.forEach((item, index) => {
        const base = item.quantity * item.price

        if (this.offers.is_reverse_charge) {
          this.offers.positions[index].vat = 0
          this.offers.positions[index].vat_unit = 0
          this.offers.positions[index].unit_total = base.toFixed(2)
        } else {
          const vat = 19
          this.offers.positions[index].vat = vat
          this.offers.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
          this.offers.positions[index].unit_total = (base * (1 + vat / 100)).toFixed(2)
        }
      })
    },
    addPosition() {
      this.offers.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        service_period_start: '',
        service_period_end: '',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19,
        unit_total: 0
      })
    },
    deletePosition(index) {
      if (this.offers.positions.length > 0) {
        this.offers.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.offers.positions[index].vat || 0
      const base = quantity * price
      let total = 0
      if (this.offers.is_reverse_charge) {
        this.offers.positions[index].vat = 0
        this.offers.positions[index].vat_unit = 0
        this.offers.positions[index].unit_total = base.toFixed(2)
        return
      } else {
        total = base * (1 + vat / 100)
      }

      this.offers.positions[index].unit_total = total.toFixed(2)
      this.offers.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
    },
    setStore() {
      this.storePreview('setOffers', this.offers)
    }
  }
}
</script>
