<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Rechnung und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- Base -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-group">
          <label class="form-label">Rechnungsnummer <span class="stars">*</span></label>
          <input v-model="invoices.id" type="text" class="form-input" readonly />
          <small class="form-hint">Format: RE-YYYY-XXXX (automatisch generiert)</small>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Leistungsdatum <span class="stars">*</span></label>
            <input v-model="invoices.service_date" type="date" class="form-input" />
            <small class="form-hint">Datum der Leistungserbringung</small>
          </div>
          <div class="form-group">
            <label class="form-label">Rechnungsdatum <span class="stars">*</span></label>
            <input v-model="invoices.date" type="date" class="form-input" required />
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
        <div v-if="invoices.customer?.id" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr. <span class="stars">*</span></label>
            <input v-model="invoices.customer.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Firmname <span class="stars">*</span></label>
            <input
              v-model="invoices.customer.company_name"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname <span class="stars">*</span></label>
              <input
                v-model="invoices.customer.first_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname <span class="stars">*</span></label>
              <input
                v-model="invoices.customer.last_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse <span class="stars">*</span></label>
            <input v-model="invoices.customer.address" type="text" class="form-input" readonly />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ <span class="stars">*</span></label>
              <input
                v-model="invoices.customer.postal_code"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt <span class="stars">*</span></label>
              <input v-model="invoices.customer.city" type="text" class="form-input" readonly />
            </div>
          </div>
        </div>
      </div>

      <!-- Wat -->
      <div class="form-section">
        <div class="form-section-title">💼 Steueroptionen</div>
        <div class="form-section">
          <div class="switch-container">
            <label for="is_small_company" class="switch">
              <input
                id="is_small_company"
                v-model="invoices.tax_options.is_small_company"
                type="checkbox"
                @change="checkTaxOptions('is_small_company')"
              />
              <span class="slider round"></span>
            </label>
            <div class="switch-text">
              <strong>Kleinunternehmerregelung (§19 UStG)</strong>
              <small class="option-description">Keine Umsatzsteuer wird berechnet</small>
            </div>
          </div>
          <div class="switch-container">
            <label for="is_reverse_charge" class="switch">
              <input
                id="is_reverse_charge"
                v-model="invoices.tax_options.is_reverse_charge"
                type="checkbox"
                @change="checkTaxOptions('is_reverse_charge')"
              />
              <span class="slider round"></span>
            </label>
            <div class="switch-text">
              <strong>Reverse-Charge-Verfahren</strong>
              <small class="option-description"
                >Steuerschuldnerschaft des Leistungsempfängers (§13b UStG)</small
              >
            </div>
          </div>
          <div class="switch-container">
            <label for="is_eu_delivery" class="switch">
              <input
                id="is_eu_delivery"
                v-model="invoices.tax_options.is_eu_delivery"
                type="checkbox"
                @change="checkTaxOptions('is_eu_delivery')"
              />
              <span class="slider round"></span>
            </label>
            <div class="switch-text">
              <strong>Innergemeinschaftliche Lieferung</strong>
              <small class="option-description"
                >Steuerfrei gemäß §4 Nr.1b UStG (Europa içi, opsiyonel)</small
              >
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage) *</label>
            <input
              v-model.number="invoices.terms.payment_terms"
              type="number"
              class="form-input"
              required
            />
            <small class="form-hint"
              >Zahlbar innerhalb {{ invoices.terms.payment_terms }} Tagen netto</small
            >
          </div>
        </div>
        <div class="form-option">
          <label for="skonto-checkbox" class="switch">
            <input
              id="skonto-checkbox"
              v-model="invoices.terms.early_payment"
              type="checkbox"
              class="switch-checkbox"
            />
            <span class="slider round"></span>
          </label>
          <div class="option-text">
            <strong>Skonto gewähren</strong>
          </div>
        </div>
        <div v-if="invoices.terms.early_payment" class="form-row">
          <div class="form-group">
            <label class="form-label">Skonto (%)</label>
            <input
              v-model.number="invoices.terms.early_payment_percentage"
              type="number"
              step="0.1"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Skonto Frist (Tage)</label>
            <input v-model.number="invoices.terms.early_payment_days" type="number" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Zusätzliche Zahlungsbedingungen</label>
          <textarea
            v-model="invoices.terms.payment_conditions"
            class="form-input"
            rows="3"
            placeholder="z.B. 50% Anzahlung bei Auftragserteilung, Restzahlung nach Abschluss."
          ></textarea>
        </div>
      </div>

      <!-- currency -->
      <div class="form-section">
        <div class="form-section-title">💰 Währung</div>
        <div class="form-group">
          <label class="form-label">Waehrung</label>
          <select v-model="invoices.currency" class="form-input">
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
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="invoices.positions && invoices.positions.length === 0">
          Keine Positionen vorhanden
        </div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in invoices.positions" :key="index" class="position-item">
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
                <input
                  v-model="pos.service_period_start"
                  type="date"
                  class="form-input"
                  @change="validateServicePeriod(pos)"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Leistungszeitraum Bis</label>
                <input
                  v-model="pos.service_period_end"
                  type="date"
                  class="form-input"
                  @change="validateServicePeriod(pos)"
                />
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
                  v-if="!invoices.is_reverse_charge"
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

      <!-- preview button -->
      <router-link to="/invoices/preview" class="preview-btn" @click="setStore">
        👁️ Vorschau anzeigen
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
export default {
  name: 'CreateInvoices',
  inject: ['storePreview', 'validateServicePeriod'],
  data() {
    return {
      title: 'Rechnung erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      invoices: {
        id: 1,
        is_active: 1,
        date: '',
        service_date: '',
        currency: 'EUR.de-DE',
        terms: {
          payment_terms: 14,
          payment_conditions: '',
          early_payment: false,
          early_payment_percentage: 2,
          early_payment_days: 7
        },
        positions: [],
        customer: {},
        tax_options: {
          is_small_company: false,
          is_reverse_charge: false,
          is_eu_delivery: false
        }
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
      if (customer) this.invoices.customer = customer
    },
    getStore() {
      if (store.state.invoices) {
        this.invoices = JSON.parse(JSON.stringify(store.state.invoices))
      }
    },
    getSelectedCustomer(value) {
      this.invoices.customer = value
    },
    checkTaxOptions(current) {
      if (current) {
        for (const item in this.invoices.tax_options) {
          if (item !== current) {
            this.invoices.tax_options[item] = false
          }
        }
        this.calculateUmsatzsteuer()
      }
    },
    calculateUmsatzsteuer() {
      this.invoices.positions.forEach((item, index) => {
        const base = item.quantity * item.price

        if (
          this.invoices.tax_options.is_reverse_charge ||
          this.invoices.tax_options.is_small_company ||
          this.invoices.tax_options.is_eu_delivery
        ) {
          this.invoices.positions[index].vat = 0
          this.invoices.positions[index].vat_unit = 0
          this.invoices.positions[index].unit_total = base.toFixed(2)
        } else {
          const vat = 19
          this.invoices.positions[index].vat = vat
          this.invoices.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
          this.invoices.positions[index].unit_total = (base * (1 + vat / 100)).toFixed(2)
        }
      })
    },
    addPosition() {
      this.invoices.positions.push({
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
      if (this.invoices.positions.length > 0) {
        this.invoices.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.invoices.positions[index].vat || 0
      const base = quantity * price
      let total = 0
      if (
        this.invoices.tax_options.is_reverse_charge ||
        this.invoices.tax_options.is_small_company ||
        this.invoices.tax_options.is_eu_delivery
      ) {
        this.invoices.positions[index].vat = 0
        this.invoices.positions[index].vat_unit = 0
        this.invoices.positions[index].unit_total = base.toFixed(2)
        return
      } else {
        total = base * (1 + vat / 100)
      }

      this.invoices.positions[index].unit_total = total.toFixed(2)
      this.invoices.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
    },
    setStore() {
      console.time('commit')
      if (this.invoices) {
        this.storePreview('invoices', this.invoices)
      }
      console.timeEnd('commit')
    }
  }
}
</script>

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
.stars {
  color: darkred;
  font-size: 16px;
}
</style>
