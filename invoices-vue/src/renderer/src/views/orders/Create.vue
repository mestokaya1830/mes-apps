<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">Bearbeiten Sie die Rechnung und sehen Sie die Vorschau live</div>
      </div>
  
      <!-- base -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Auftragsnummer</label>
            <input v-model="orders.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Rechnungsdatum</label>
            <input v-model="orders.date" type="date" class="form-input" />
          </div>
        </div>
  
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Von</label>
            <input v-model="orders.service_period_start" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Bis</label>
            <input v-model="orders.service_period_end" type="date" class="form-input" />
          </div>
        </div>
      </div>
      <!-- NEU: Gültigkeit & Liefertermin -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Angebot gültig bis</label>
          <input v-model="orders.validity_date" type="date" class="form-input" />
          <small class="form-hint">Optional: Gültigkeitsdatum des Angebots</small>
        </div>
        <div class="form-group">
          <label class="form-label">Voraussichtlicher Liefertermin</label>
          <input v-model="orders.delivery_date" type="date" class="form-input" />
          <small class="form-hint">Optional: Erwartetes Lieferdatum</small>
        </div>
      </div>
  
      <!-- customer -->
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
        <div v-if="orders.selected_customer.id" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr.</label>
            <input v-model="orders.selected_customer.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Firmname</label>
            <input
              v-model="orders.selected_customer.company_name"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname</label>
              <input
                v-model="orders.selected_customer.first_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname</label>
              <input
                v-model="orders.selected_customer.last_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input
              v-model="orders.selected_customer.address"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ</label>
              <input
                v-model="orders.selected_customer.postal_code"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt</label>
              <input
                v-model="orders.selected_customer.city"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
      <!-- currency -->
      <div class="form-section">
        <div class="form-section-title">💰 Währung</div>
        <div class="form-group">
          <label class="form-label">Waehrung</label>
          <select v-model="orders.currency" class="form-input">
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
      <!-- NEU: Zahlungs- und Lieferbedingungen -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungs- und Lieferbedingungen</div>
  
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Zahlungsbedingungen</label>
            <select v-model="orders.payment.payment_terms" class="form-input">
              <option :value="0">Sofort zahlbar</option>
              <option :value="7">Zahlbar innerhalb von 7 Tagen</option>
              <option :value="14">Zahlbar innerhalb von 14 Tagen</option>
              <option :value="30">Zahlbar innerhalb von 30 Tagen</option>
              <option value="vorkasse">Vorkasse</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsart</label>
            <select v-model="orders.payment.payment_method" class="form-input">
              <option value="">Nicht angegeben</option>
              <option value="Überweisung">Überweisung</option>
              <option value="Lastschrift">Lastschrift</option>
              <option value="PayPal">PayPal</option>
              <option value="Kreditkarte">Kreditkarte</option>
              <option value="Bar">Barzahlung</option>
            </select>
          </div>
        </div>
  
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Lieferbedingungen</label>
            <select v-model="orders.delivery_terms" class="form-input">
              <option value="">Nicht angegeben</option>
              <option value="Frei Haus">Frei Haus</option>
              <option value="Ab Werk">Ab Werk</option>
              <option value="CIF">CIF (Cost, Insurance, Freight)</option>
              <option value="FOB">FOB (Free on Board)</option>
              <option value="DDP">DDP (Delivered Duty Paid)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Versandart</label>
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
          <label class="form-label">Zusätzliche Zahlungshinweise</label>
          <textarea
            v-model="orders.payment.payment_conditions"
            class="form-input"
            rows="2"
            placeholder="z.B. 2% Skonto bei Zahlung innerhalb von 7 Tagen"
          ></textarea>
        </div>
      </div>
      <!-- positions -->
      <div class="form-section-title">📦 Positionen</div>
      <div v-if="orders.positions && orders.positions.length === 0">Keine Positionen vorhanden</div>
      <div v-else class="positions-editor">
        <div v-for="(pos, index) in orders.positions" :key="index" class="position-item">
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
                <option>Monat</option>
                <option>Jahr</option>
                <option>Pauschal</option>
                <option>m</option>
                <option>m²</option>
                <option>m³</option>
                <option>kg</option>
                <option>l</option>
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
                v-if="!orders.is_reverse_charge"
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
  
      <!-- NEU: Notizen -->
      <div class="form-section">
        <div class="form-section-title">📝 Notizen und Hinweise</div>
  
        <div class="form-group">
          <label class="form-label">Kundennotiz (erscheint auf Dokument)</label>
          <textarea
            v-model="orders.customer_notes"
            class="form-input"
            rows="3"
            placeholder="Dieser Text wird auf der Auftragsbestätigung angezeigt"
          ></textarea>
        </div>
  
        <div class="form-group">
          <label class="form-label">Interne Notiz (nicht sichtbar für Kunden)</label>
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
            placeholder="z.B. Sonderwünsche, Auftragsänderungen, etc."
          ></textarea>
        </div>
      </div>
  
      <!-- preview button -->
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
      orders: {
        id: '1',
        source_page: 'orders',
        date: new Date().toISOString().split('T')[0],
        service_period_start: '',
        service_period_end: '',
        validity_date: '',
        delivery_date: '',
        delivery_terms: '',
        shipping_method: '',
        verwendung: 'Nicht angegeben',
        selected_customer: {},
        currency: 'EUR.de-DE',
        customer_notes: '',
        internal_notes: '',
        special_notes: '',
        positions: [],
        payment: {
          paid_amount: 0,
          payment_terms: 14,
          payment_method: '',
          payment_conditions: ''
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
      if (customer) this.orders.selected_customer = customer
    },
    getStore() {
      if (store.state.orders) {
        this.orders = JSON.parse(JSON.stringify(store.state.orders))
      }
    },
    calculateReverseCharge() {
      this.orders.positions.forEach((item, index) => {
        const base = item.quantity * item.price

        if (this.orders.is_reverse_charge) {
          this.orders.positions[index].vat = 0
          this.orders.positions[index].vat_unit = 0
          this.orders.positions[index].unit_total = base.toFixed(2)
        } else {
          const vat = 19
          this.orders.positions[index].vat = vat
          this.orders.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
          this.orders.positions[index].unit_total = (base * (1 + vat / 100)).toFixed(2)
        }
      })
    },
    addPosition() {
      this.orders.positions.push({
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
      if (this.orders.positions.length > 0) {
        this.orders.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.orders.positions[index].vat || 0
      const base = quantity * price
      let total = 0
      if (this.orders.is_reverse_charge) {
        this.orders.positions[index].vat = 0
        this.orders.positions[index].vat_unit = 0
        this.orders.positions[index].unit_total = base.toFixed(2)
        return
      } else {
        total = base * (1 + vat / 100)
      }

      this.orders.positions[index].unit_total = total.toFixed(2)
      this.orders.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
    },
    setStore() {
      this.storePreview('setOrders', this.orders)
    }
  }
}
</script>
