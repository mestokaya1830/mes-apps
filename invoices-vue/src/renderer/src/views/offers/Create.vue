<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝 {{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie das Angebot und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- Base -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-group">
          <label class="form-label">Angebotsnummer <span class="stars">*</span></label>
          <input v-model="offer.id" type="text" class="form-input" readonly />
          <small class="form-hint">Format: AN-YYYY-XXXX (automatisch generiert)</small>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Angebotsdatum <span class="stars">*</span></label>
            <input
              ref="date"
              v-model="offer.date"
              type="date"
              class="form-input"
              required
              @input="error.date = ''"
            />
            <div v-if="error.date" class="error">{{ error.date }}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Gültigkeitsdatum <span class="stars">*</span></label>
            <input
              ref="valid_until"
              v-model="offer.valid_until"
              type="date"
              class="form-input"
              required
              @input="error.valid_until = ''"
            />
            <div v-if="error.valid_until" class="error">{{ error.valid_until }}</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Betreff / Beschreibung</label>
          <input
            v-model="offer.subject"
            type="text"
            class="form-input"
            placeholder="z.B. Webentwicklung Projekt XYZ"
          />
        </div>
      </div>

      <!-- Customer -->
      <div v-if="offer.customer" class="form-section">
        <div class="form-section-title">👤 Kundendaten</div>
        <div v-if="offer.customer?.id" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr. <span class="stars">*</span></label>
            <input v-model="offer.customer.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Firmname <span class="stars">*</span></label>
            <input v-model="offer.customer.company_name" type="text" class="form-input" readonly />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname <span class="stars">*</span></label>
              <input v-model="offer.customer.first_name" type="text" class="form-input" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname <span class="stars">*</span></label>
              <input v-model="offer.customer.last_name" type="text" class="form-input" readonly />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse <span class="stars">*</span></label>
            <input v-model="offer.customer.address" type="text" class="form-input" readonly />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ <span class="stars">*</span></label>
              <input v-model="offer.customer.postal_code" type="text" class="form-input" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt <span class="stars">*</span></label>
              <input v-model="offer.customer.city" type="text" class="form-input" readonly />
            </div>
          </div>
        </div>
      </div>

      <!-- Legally Binding -->
      <div class="switch-container">
        <label for="is_legal" class="switch">
          <input id="is_legal" v-model="offer.is_legal" type="checkbox" />
          <span class="slider round"></span>
        </label>
        <div class="switch-text">
          <strong>Legally binding signature</strong>
        </div>
      </div>

      <!-- currency -->
      <div class="form-section">
        <div class="form-section-title">💰 Währung</div>
        <div class="form-group">
          <label class="form-label">Waehrung</label>
          <select v-model="offer.currency" class="form-input">
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

      <!-- Positionen -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="offer.positions && offer.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in offer.positions" :key="index" class="position-item">
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
            <div class="positions-total">
              <div class="positions-total-item">
                <label class="form-label">Vat Unit (€)</label>
                <div class="form-result-item">
                  {{ pos.vat_unit }}
                </div>
              </div>
              <div class="positions-total-item">
                <label class="form-label">Unit Total (€)</label>
                <div class="form-result-item">{{ pos.unit_total }}</div>
              </div>
            </div>
          </div>
        </div>
        <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
      </div>

      <!-- Vorschau Button -->
      <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
export default {
  name: 'CreateOffer',
  inject: ['formatCurrency', 'checkServiceDates'],
  data() {
    return {
      title: 'Angebot erstellen',
      error: {},
      offer: {
        id: 1,
        customer: null,
        date: '',
        valid_until: '',
        is_legal: 0,
        is_active: 1,
        subject: '',
        currency: 'EUR.de-DE',
        positions: [],
        paid_amount: 0
      }
    }
  },
  mounted() {
    this.getCustomer()
    this.getStore()
  },
  methods: {
    async getCustomer() {
      if (!this.$route.query.id) return
      try {
        const data = {
          id: this.$route.query.id,
          table_name: 'offers'
        }
        const result = await window.api.getCustomerById(data)
        console.log(result)
        if (!result.success) return
        this.offer.id = result.data.last_id
        this.offer.customer = result.data.customer
      } catch (error) {
        console.error(error)
      }
    },
    getStore() {
      if (store.state.offer) {
        this.offer = JSON.parse(JSON.stringify(store.state.offer))
      }
    },
    addPosition() {
      this.offer.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        unit: 'Stk',
        quantity: 1,
        price: 0,
        vat: 19
      })
    },
    deletePosition(index) {
      if (this.offer.positions.length > 0) {
        this.offer.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.offer.positions[index].vat || 0
      const base = quantity * price
      this.offer.positions[index].unit_total = base.toFixed(2)
      this.offer.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
    },

    async submitStore() {
      if (!this.offer) return
      if (!this.checkServiceDates(this.offer.date, this.offer.valid_until, 'date', 'valid_until'))
        return
      await store.setStore('offer', JSON.parse(JSON.stringify(this.offer)))
      this.$router.push('/offers/preview')
    }
  }
}
</script>
<style>
.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
/* EDITOR PANEL */
.editor-panel {
  width: 70%;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.editor-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.editor-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* FORM GROUPS */
.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row-4 {
  grid-template-columns: repeat(4, 1fr);
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
}

input:not([readonly]) {
  background: #fff;
}

/* POSITIONS */
.positions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.add-position-btn {
  display: flex;
  width: 100%;
  justify-content: center;
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 20px 0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-position-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 16px;
  cursor: pointer;
}

.positions-total {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.positions-total-item {
  margin-left: 16px;
}

.positions-total-item > div {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
}
/* SWITCH CONTROL */
.switch-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.switch-text {
  margin-left: 16px;
}
.switch {
  position: relative;
  display: inline-block;
  min-width: 50px;
  height: 28px;
  margin-left: 10px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 5px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
.stars {
  color: darkred;
  font-size: 16px;
}
</style>
