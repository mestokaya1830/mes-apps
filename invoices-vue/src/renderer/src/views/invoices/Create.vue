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
          <label class="form-label">Verwendungszweck</label>
          <input v-model="invoices.verwendungszweck" type="text" class="form-input" />
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
        <div v-if="invoices.selected_customer.id" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr.</label>
            <input
              v-model="invoices.selected_customer.id"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-group">
            <label class="form-label">Firmname</label>
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
            <label class="form-label">Adresse</label>
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
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">
          <span>👤 Umkehrung der Steuerschuldnerschaft</span>
          <label for="reverse_charge-checkbox" class="switch">
            <input
              id="reverse_charge-checkbox"
              v-model="invoices.is_reverse_charge"
              type="checkbox"
              class="switch-checkbox"
              @change="calculateReverseCharge()"
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
              v-model.number="invoices.payment.paid_amount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input
              v-model.number="invoices.payment.payment_terms"
              type="number"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Zahlungsbedingungen / Payment Terms</label>
          <textarea
            v-model="invoices.payment.payment_conditions"
            class="form-input payment-terms"
            placeholder="50 % Anzahlung bei Auftragserteilung, Restzahlung nach Abschluss. / 50% upfront, balance upon completion."
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
      <div class="form-section-title">📦 Positionen</div>
      <div v-if="invoices.positions && invoices.positions.length === 0">
        Keine Positionen vorhanden
      </div>
      <div v-else class="positions-editor">
        <div v-for="(pos, index) in invoices.positions" :key="index" class="position-item">
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
                <option>Stk</option>
                <option>Std</option>
                <option>Tag</option>
                <option>Pauschal</option>
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
      <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
      <!-- preview -->
      <router-link to="/invoices/preview" class="preview-btn" @click="setStore">
        Vorschau
      </router-link>
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
        id: 1,
        date: '',
        verwendungszweck: '',
        is_reverse_charge: false,
        selected_customer: {},
        currency: 'EUR.de-DE',
        positions: [],
        payment: {
          paid_amount: 0,
          payment_terms: 14,
          payment_conditions: ''
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
      if (customer) this.invoices.selected_customer = customer
    },
    getStore() {
      if (store.state.invoices) {
        this.invoices = JSON.parse(JSON.stringify(store.state.invoices))
      }
    },
    getSelectedCustomer(value) {
      this.invoices.selected_customer = value
    },

    calculateReverseCharge() {
      this.invoices.positions.forEach((item, index) => {
        const base = item.quantity * item.price

        if (this.invoices.is_reverse_charge) {
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
      if (this.invoices.is_reverse_charge) {
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
      this.storePreview('setInvoices', this.invoices)
      console.timeEnd('commit')
    }
  }
}
</script>
