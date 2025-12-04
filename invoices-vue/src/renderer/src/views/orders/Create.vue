<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Auftragsdaten und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- Base -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Auftragsnummer <span class="stars">*</span></label>
            <input v-model="orders.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Datum <span class="stars">*</span></label>
            <input v-model="orders.date" type="date" class="form-input" />
          </div>
          <div v-if="error.date" class="error">{{ error.date }}</div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Von <span class="stars">*</span></label>
            <input v-model="orders.service_period_start" type="date" class="form-input" />
          </div>
          <div v-if="error.service_period_start" class="error">{{ error.service_period_start }}</div>
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Bis <span class="stars">*</span></label>
            <input v-model="orders.service_period_end" type="date" class="form-input" />
          </div>
          <div v-if="error.service_period_end" class="error">{{ error.service_period_end }}</div>
        </div>
      </div>

      <!-- Customer Selection -->
      <div v-if="customers" class="form-section">
        <div class="form-section-title">👤 Kunde</div>
        <div class="form-group">
          <label class="form-label">Kundenauswahl</label>
          <select v-model="customerList" class="form-input" @change="getCustomerById">
            <option selected disabled>Wähle Kunden</option>
            <option v-for="item in customers" :key="item.id" :value="item.id">
              {{ item.company_name ? item.company_name : item.first_name + ' ' + item.last_name }}
            </option>
          </select>
        </div>

        <div v-if="orders.selected_customer.id" class="customer-details">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Kunden-Nr. <span class="stars">*</span></label>
              <input
                v-model="orders.selected_customer.id"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Firma <span class="stars">*</span></label>
              <input
                v-model="orders.selected_customer.company_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname <span class="stars">*</span></label>
              <input
                v-model="orders.selected_customer.first_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname <span class="stars">*</span></label>
              <input
                v-model="orders.selected_customer.last_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse <span class="stars">*</span></label>
            <input
              v-model="orders.selected_customer.address"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ <span class="stars">*</span></label>
              <input
                v-model="orders.selected_customer.postal_code"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt <span class="stars">*</span></label>
              <input
                v-model="orders.selected_customer.city"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Land <span class="stars">*</span></label>
              <input
                v-model="orders.selected_customer.country"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">E-Mail <span class="stars">*</span></label>
            <input
              v-model="orders.selected_customer.email"
              type="email"
              class="form-input"
              readonly
            />
          </div>
        </div>
      </div>

      <!-- Customer Reference -->
      <div class="form-section">
        <div class="form-section-title">📌 Kundenreferenz</div>
        <div class="form-group">
          <label class="form-label">Kundenreferenz</label>
          <input
            v-model="orders.customer_reference"
            type="text"
            class="form-input"
            placeholder="Müşteri referans numarası"
          />
          <small class="form-hint">Optional</small>
        </div>
      </div>

      <!-- Validity & Delivery Date -->
      <div class="form-section">
        <div class="form-section-title">📅 Gültigkeit & Lieferdatum</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Gültig bis</label>
            <input v-model="orders.validity_date" type="date" class="form-input" />
            <small class="form-hint">Optional</small>
          </div>
          <div class="form-group">
            <label class="form-label">Liefertermin</label>
            <input v-model="orders.delivery_date" type="date" class="form-input" />
            <small class="form-hint">Optional</small>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Lieferadresse <span class="stars">*</span></label>
          <textarea
            v-model="orders.delivery_address"
            rows="2"
            class="form-input"
            placeholder="Lieferadresse eingeben"
          ></textarea>
          <small class="form-hint">Optional</small>
        </div>
      </div>

      <!-- Legally Binding -->
      <div class="switch-container">
        <label for="is_legal" class="switch">
          <input id="is_legal" v-model="orders.is_legal" type="checkbox" />
          <span class="slider round"></span>
        </label>
        <div class="switch-text">
          <strong>Legally binding signature</strong>
        </div>
      </div>

      <!-- Currency -->
      <div class="form-section">
        <div class="form-section-title">💰 Währung</div>
        <div class="form-group">
          <label class="form-label">Währung</label>
          <select v-model="orders.currency" class="form-input">
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

      <!-- Payment Terms -->
      <div class="form-section">
        <label class="form-label">💬 Verwendungszweck <span class="stars">*</span></label>
        <input
          v-model="orders.payment.verwendungszweck"
          type="text"
          class="form-input"
          required
          placeholder="Bitte geben Sie den Verwendungszweck an (z.B. Rechnungsnummer RE-2025-00001)"
        />
      </div>
      <!-- Payment & Delivery Terms -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungs- und Lieferbedingungen</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Zahlungsbedingungen <span class="stars">*</span></label>
            <select v-model="orders.payment.payment_terms" class="form-input">
              <option :value="0">Sofort zahlbar</option>
              <option :value="7">Zahlbar innerhalb von 7 Tagen</option>
              <option :value="14">Zahlbar innerhalb von 14 Tagen</option>
              <option :value="30">Zahlbar innerhalb von 30 Tagen</option>
              <option value="vorkasse">Vorkasse</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsart <span class="stars">*</span></label>
            <select v-model="orders.payment.payment_method" class="form-input">
              <option value="">Nicht angegeben</option>
              <option value="Überweisung">Überweisung</option>
              <option value="Lastschrift">Lastschrift</option>
              <option value="PayPal">PayPal</option>
              <option value="Kreditkarte">Kreditkarte</option>
              <option value="Bar">Bar</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Lieferbedingungen <span class="stars">*</span></label>
            <select v-model="orders.delivery_terms" class="form-input">
              <option value="">Nicht angegeben</option>
              <option value="Frei Haus">Frei Haus</option>
              <option value="Ab Werk">Ab Werk</option>
              <option value="CIF">CIF</option>
              <option value="FOB">FOB</option>
              <option value="DDP">DDP</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Versandart <span class="stars">*</span></label>
            <select v-model="orders.shipping_method" class="form-input">
              <option value="">Nicht angegeben</option>
              <option value="DHL">DHL</option>
              <option value="DPD">DPD</option>
              <option value="UPS">UPS</option>
              <option value="Selbstabholung">Selbstabholung</option>
              <option value="Spedition">Spedition</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Zusätzliche Zahlungshinweise <span class="stars">*</span></label>
          <textarea
            v-model="orders.payment.payment_conditions"
            class="form-input"
            rows="2"
            placeholder="z.B. 2% Skonto bei Zahlung innerhalb von 7 Tagen"
          ></textarea>
        </div>
      </div>

      <!-- Positions -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="orders.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in orders.positions" :key="index" class="position-item">
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
            <div class="form-row form-row-4">
              <div class="form-group">
                <label class="form-label">Einheit</label>
                <select v-model="pos.unit" class="form-input">
                  <option value="Stk">Stk</option>
                  <option value="Std">Std</option>
                  <option value="Tag">Tag</option>
                  <option value="Monat">Monat</option>
                  <option value="Jahr">Jahr</option>
                  <option value="Pauschal">Pauschal</option>
                  <option value="m">m</option>
                  <option value="m²">m²</option>
                  <option value="m³">m³</option>
                  <option value="kg">kg</option>
                  <option value="l">l</option>
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
        <button class="add-position-btn" @click="addPosition">➕ Position hinzufügen</button>
      </div>

      <!-- Notes -->
      <div class="form-section">
        <div class="form-section-title">📝 Notizen & Hinweise</div>
        <div class="form-group">
          <label class="form-label">Kundennotiz</label>
          <textarea
            v-model="orders.customer_notes"
            class="form-input"
            rows="3"
            placeholder="Dieser Text wird auf der Auftragsbestätigung angezeigt"
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Interne Notiz</label>
          <textarea
            v-model="orders.internal_notes"
            class="form-input"
            rows="2"
            placeholder="Nur für interne Zwecke"
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Besondere Hinweise</label>
          <textarea
            v-model="orders.special_notes"
            class="form-input"
            rows="2"
            placeholder="z.B. Sonderwünsche, Auftragsänderungen"
          ></textarea>
        </div>
      </div>

      <!-- Closing Text -->
      <div class="form-section">
        <div class="form-section-title">📝 Schlussbemerkung / Closing Text <span class="stars">*</span></div>
        <div class="form-group">
          <textarea
            v-model="orders.closing_text"
            class="form-input"
            rows="3"
            placeholder="Hier können Sie Ihren Schlusstext eingeben"
          ></textarea>
          <small class="form-hint">Optional</small>
        </div>
      </div>
      <!-- Preview Button -->
      <router-link to="/orders/preview" class="preview-btn" @click="setStore">
        👁️ Vorschau anzeigen
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'

export default {
  name: 'CreateOrder',
  inject: ['storePreview'],
  data() {
    return {
      title: 'Auftrag erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      error: {},
      orders: {
        id: '1',
        date: '',
        currency: 'EUR.de-DE',
        is_legal: 0,
        is_active: 1,
        service_period_start: '',
        service_period_end: '',
        validity_date: '',
        delivery_date: '',
        delivery_terms: '',
        shipping_method: '',
        customer_reference: '',
        customer_notes: '',
        internal_notes: '',
        special_notes: '',
        closing_text: '',
        selected_customer: {},
        positions: [],
        payment: {
          paid_amount: 0,
          payment_terms: 14,
          payment_method: '',
          payment_conditions: '',
          verwendungszweck: 'Nicht angegeben'
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
        if (response.success) this.customers = response.customers
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    },
    getCustomerById() {
      const customer = this.customers.find((item) => item.id === this.customerList)
      if (customer) this.orders.selected_customer = customer
    },
    getStore() {
      if (store.state.orders) this.orders = JSON.parse(JSON.stringify(store.state.orders))
    },
    addPosition() {
      this.orders.positions.push({
        title: 'Neue Position',
        description: '',
        service_period_start: '',
        service_period_end: '',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19,
        vat_unit: 0,
        unit_total: 0
      })
    },
    deletePosition(index) {
      if (this.orders.positions.length > 0) this.orders.positions.splice(index, 1)
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.orders.positions[index].vat || 0
      const base = quantity * price
      this.orders.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
      this.orders.positions[index].unit_total = (base * (1 + vat / 100)).toFixed(2)
    },
    setStore() {
      if (this.orders) {
        this.orders.is_legal = Number(this.orders.is_legal)
        this.storePreview('orders', this.orders)
      }
    }
  }
}
</script>
<style>
/* Mevcut stiller korunmuştur */
</style>

<style>
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
.stars{
  color: darkred;
  font-size: 16px;
}
</style>
