<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">Bearbeiten Sie die Rechnung nach deutschen Standards</div>
      </div>
  
      <!-- Base -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-group">
          <label class="form-label">Rechnungsnummer *</label>
          <input v-model="invoices.id" type="text" class="form-input" readonly />
          <small class="form-hint">Format: RE-YYYY-XXXX (automatisch generiert)</small>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rechnungsdatum *</label>
            <input v-model="invoices.date" type="date" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungsdatum</label>
            <input v-model="invoices.service_date" type="date" class="form-input" />
            <small class="form-hint">Datum der Leistungserbringung</small>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Verwendungszweck / Betreff</label>
          <input
            v-model="invoices.verwendungszweck"
            type="text"
            class="form-input"
            placeholder="z.B. Webentwicklung Projekt XYZ"
          />
        </div>
      </div>
  
      <!-- Customers -->
      <div v-if="customers" class="form-section">
        <div class="form-section-title">👤 Kunde</div>
        <div class="form-group">
          <label class="form-label">Kundendaten *</label>
          <select v-model="customerList" class="form-input" @change="getCustomerById" required>
            <option selected disabled>Wähle Kunden</option>
            <option v-for="item in customers" :key="item.id" :value="item.id">
              {{ item.company_name ? item.company_name : item.first_name + ' ' + item.last_name }}
            </option>
          </select>
        </div>
        <div v-if="invoices.selected_customer.id" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr.</label>
            <input v-model="invoices.selected_customer.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Firmenname</label>
            <input
              v-model="invoices.selected_customer.company_name"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname</label>
              <input
                v-model="invoices.selected_customer.first_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname</label>
              <input
                v-model="invoices.selected_customer.last_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Anschrift</label>
            <input
              v-model="invoices.selected_customer.address"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ</label>
              <input
                v-model="invoices.selected_customer.postal_code"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt</label>
              <input
                v-model="invoices.selected_customer.city"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">USt-IdNr. (Kunde)</label>
            <input
              v-model="invoices.selected_customer.vat_id"
              type="text"
              class="form-input"
              readonly
            />
          </div>
        </div>
      </div>
  
      <!-- Wat -->
      <div class="form-section">
        <div class="form-section-title">💼 Steueroptionen</div>
  
        <div class="form-option">
          <label for="reverse-charge-checkbox" class="switch">
            <input
              id="reverse-charge-checkbox"
              v-model="invoices.is_reverse_charge"
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
              v-model="invoices.is_kleinunternehmer"
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
  
      <!-- Positions -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="invoices.positions && invoices.positions.length === 0" class="empty-state">
          Keine Positionen vorhanden
        </div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in invoices.positions" :key="index" class="position-item">
            <div class="position-header">
              <span class="position-number">Pos. {{ index + 1 }}</span>
              <button class="delete-btn" @click="deletePosition(index)">🗑️ Entfernen</button>
            </div>
            <div class="form-group">
              <label class="form-label">Bezeichnung *</label>
              <input v-model="pos.title" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Beschreibung</label>
              <textarea v-model="pos.description" class="form-input" rows="2"></textarea>
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
                <label class="form-label">Einheit *</label>
                <select v-model="pos.unit" class="form-input" required>
                  <option>Stk.</option>
                  <option>Std.</option>
                  <option>Tag</option>
                  <option>Monat</option>
                  <option>Pauschal</option>
                  <option>m²</option>
                  <option>kg</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Menge *</label>
                <input
                  v-model.number="pos.quantity"
                  type="number"
                  step="0.01"
                  class="form-input"
                  required
                  @input="calculatePosition(index)"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Einzelpreis (Netto) *</label>
                <input
                  v-model.number="pos.price"
                  type="number"
                  class="form-input"
                  step="0.01"
                  required
                  @input="calculatePosition(index)"
                />
              </div>
              <div class="form-group">
                <label class="form-label">MwSt. (%)</label>
                <select
                  v-model.number="pos.vat"
                  class="form-input"
                  :disabled="invoices.is_reverse_charge || invoices.is_kleinunternehmer"
                  @change="calculatePosition(index)"
                >
                  <option :value="0">0%</option>
                  <option :value="7">7%</option>
                  <option :value="19">19%</option>
                </select>
              </div>
            </div>
            <!-- <div class="form-result">
              <div class="result-item">
                <label class="form-label">Gesamtpreis (Netto)</label>
                <div class="result-value">{{ formatCurrency(pos.net_total) }}</div>
              </div>
              <div class="result-item">
                <label class="form-label">MwSt.-Betrag</label>
                <div class="result-value">{{ formatCurrency(pos.vat_amount) }}</div>
              </div>
              <div class="result-item">
                <label class="form-label">Gesamtpreis (Brutto)</label>
                <div class="result-value total">{{ formatCurrency(pos.gross_total) }}</div>
              </div>
            </div> -->
          </div>
        </div>
        <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
      </div>
  
      <!-- Summary -->
      <!-- <div v-if="invoices.positions.length > 0" class="form-section summary-section">
        <div class="form-section-title">💶 Gesamtsumme</div>
        <div class="summary-table">
          <div class="summary-row">
            <span>Summe Netto:</span>
            <strong>{{ formatCurrency(totals.net) }}</strong>
          </div>
          <div
            v-if="!invoices.is_kleinunternehmer && !invoices.is_reverse_charge"
            class="vat-breakdown"
          >
            <div v-for="(amount, rate) in totals.vatByRate" :key="rate" class="summary-row vat-row">
              <span>zzgl. {{ rate }}% MwSt.:</span>
              <span>{{ formatCurrency(amount) }}</span>
            </div>
          </div>
          <div v-if="invoices.is_kleinunternehmer" class="summary-row info-row">
            <span class="info-text">Gemäß §19 UStG wird keine Umsatzsteuer berechnet</span>
          </div>
          <div v-if="invoices.is_reverse_charge" class="summary-row info-row">
            <span class="info-text">Steuerschuldnerschaft des Leistungsempfängers (§13b UStG)</span>
          </div>
          <div class="summary-row total-row">
            <span>Rechnungsbetrag:</span>
            <strong>{{ formatCurrency(totals.gross) }}</strong>
          </div>
        </div>
      </div> -->
  
      <!-- Payment -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Bereits bezahlt (Anzahlung)</label>
            <input
              v-model.number="invoices.payment.paid_amount"
              type="number"
              step="0.01"
              class="form-input"
              @input="calculateOutstanding"
            />
            <small class="form-hint">Bereits geleistete Anzahlungen</small>
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage) *</label>
            <input
              v-model.number="invoices.payment.payment_terms"
              type="number"
              class="form-input"
              required
            />
            <small class="form-hint"
              >Zahlbar innerhalb {{ invoices.payment.payment_terms }} Tagen netto</small
            >
          </div>
        </div>
        <div class="form-option">
          <label for="skonto-checkbox" class="switch">
            <input
              id="skonto-checkbox"
              v-model="invoices.payment.has_skonto"
              type="checkbox"
              class="switch-checkbox"
            />
            <span class="slider round"></span>
          </label>
          <div class="option-text">
            <strong>Skonto gewähren</strong>
          </div>
        </div>
        <div v-if="invoices.payment.has_skonto" class="form-row">
          <div class="form-group">
            <label class="form-label">Skonto (%)</label>
            <input
              v-model.number="invoices.payment.skonto_percentage"
              type="number"
              step="0.1"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Skonto Frist (Tage)</label>
            <input v-model.number="invoices.payment.skonto_days" type="number" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Zusätzliche Zahlungsbedingungen</label>
          <textarea
            v-model="invoices.payment.payment_conditions"
            class="form-input"
            rows="3"
            placeholder="z.B. 50% Anzahlung bei Auftragserteilung, Restzahlung nach Abschluss."
          ></textarea>
        </div>
  
        <!-- Offener Betrag -->
        <!-- <div v-if="invoices.payment.paid_amount > 0" class="outstanding-box">
          <div class="outstanding-label">Offener Betrag:</div>
          <div class="outstanding-value">{{ formatCurrency(outstanding) }}</div>
        </div> -->
      </div>
  
      <!-- Buttons -->
      <div class="form-actions">
        <router-link to="/invoices/preview" class="preview-btn" @click="setStore">
          👁️ Vorschau anzeigen
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'

export default {
  name: 'CreateInvoices',
  inject: ['storePreview'],
  data() {
    return {
      title: 'Rechnung erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      invoices: {
        id: this.generateInvoiceNumber(),
        date: new Date().toISOString().split('T')[0],
        service_date: new Date().toISOString().split('T')[0],
        verwendungszweck: '',
        is_reverse_charge: false,
        is_kleinunternehmer: false,
        selected_customer: {},
        currency: 'EUR.de-DE',
        positions: [],
        payment: {
          paid_amount: 0,
          payment_terms: 14,
          has_skonto: false,
          skonto_percentage: 2,
          skonto_days: 7,
          payment_conditions: ''
        }
      },
      totals: {
        net: 0,
        vat: 0,
        gross: 0,
        vatByRate: {}
      },
      outstanding: 0
    }
  },
  mounted() {
    this.getCustomers()
    this.getStore()
  },
  methods: {
    generateInvoiceNumber() {
      const year = new Date().getFullYear()
      const random = Math.floor(Math.random() * 9999) + 1
      return `RE-${year}-${String(random).padStart(4, '0')}`
    },
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
      if (customer) this.invoices.selected_customer = customer
    },
    getStore() {
      if (store.state.invoices) {
        this.invoices = JSON.parse(JSON.stringify(store.state.invoices))
        this.calculateTotals()
      }
    },
    calculateReverseCharge() {
      if (this.invoices.is_reverse_charge) {
        this.invoices.is_kleinunternehmer = false
      }
      this.invoices.positions.forEach((pos, index) => {
        if (this.invoices.is_reverse_charge) {
          this.invoices.positions[index].vat = 0
        }
        this.calculatePosition(index)
      })
    },
    calculateKleinunternehmer() {
      if (this.invoices.is_kleinunternehmer) {
        this.invoices.is_reverse_charge = false
      }
      this.invoices.positions.forEach((pos, index) => {
        if (this.invoices.is_kleinunternehmer) {
          this.invoices.positions[index].vat = 0
        }
        this.calculatePosition(index)
      })
    },
    addPosition() {
      this.invoices.positions.push({
        title: 'Neue Position',
        description: '',
        service_period_start: '',
        service_period_end: '',
        quantity: 1,
        unit: 'Stk.',
        price: 0,
        vat: this.invoices.is_reverse_charge || this.invoices.is_kleinunternehmer ? 0 : 19,
        net_total: 0,
        vat_amount: 0,
        gross_total: 0
      })
    },
    deletePosition(index) {
      if (this.invoices.positions.length > 0) {
        this.invoices.positions.splice(index, 1)
        this.calculateTotals()
      }
    },
    calculatePosition(index) {
      const pos = this.invoices.positions[index]
      const netTotal = pos.quantity * pos.price
      const vatRate =
        this.invoices.is_reverse_charge || this.invoices.is_kleinunternehmer ? 0 : pos.vat
      const vatAmount = netTotal * (vatRate / 100)
      const grossTotal = netTotal + vatAmount

      this.invoices.positions[index].net_total = netTotal
      this.invoices.positions[index].vat_amount = vatAmount
      this.invoices.positions[index].gross_total = grossTotal

      this.calculateTotals()
    },
    calculateTotals() {
      let totalNet = 0
      let totalVat = 0
      let totalGross = 0
      const vatByRate = {}

      this.invoices.positions.forEach((pos) => {
        totalNet += pos.net_total || 0
        totalVat += pos.vat_amount || 0
        totalGross += pos.gross_total || 0

        if (pos.vat > 0 && !this.invoices.is_reverse_charge && !this.invoices.is_kleinunternehmer) {
          if (!vatByRate[pos.vat]) {
            vatByRate[pos.vat] = 0
          }
          vatByRate[pos.vat] += pos.vat_amount || 0
        }
      })

      this.totals = {
        net: totalNet,
        vat: totalVat,
        gross: totalGross,
        vatByRate
      }

      this.calculateOutstanding()
    },
    calculateOutstanding() {
      this.outstanding = this.totals.gross - (this.invoices.payment.paid_amount || 0)
    },
    setStore() {
      this.storePreview('setInvoices', this.invoices)
    }
  }
}
</script>
