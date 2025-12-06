<template>
  <div>
    <div v-if="order" class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Auftragsdaten und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- Grunddaten -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Auftragsnummer *</label>
            <input
              v-model="order.id"
              type="text"
              class="form-input"
              readonly
              placeholder="AU-20251205-001"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Datum *</label>
            <input v-model="order.date" type="date" class="form-input" placeholder="2025-12-05" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Von *</label>
            <input
              v-model="order.service_period_start"
              type="date"
              class="form-input"
              placeholder="2025-12-01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Bis *</label>
            <input
              v-model="order.service_period_end"
              type="date"
              class="form-input"
              placeholder="2025-12-10"
            />
          </div>
        </div>
      </div>

      <!-- Kundendaten -->
      <div class="form-section">
        <div class="form-section-title">👤 Kundendaten</div>
        <div v-if="order.customer?.id" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr. *</label>
            <input
              v-model="order.customer.id"
              type="text"
              class="form-input"
              readonly
              placeholder="CUST-1001"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Firmname *</label>
            <input
              v-model="order.customer.company_name"
              type="text"
              class="form-input"
              readonly
              placeholder="Beispiel GmbH"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname *</label>
              <input
                v-model="order.customer.first_name"
                type="text"
                class="form-input"
                readonly
                placeholder="Anna"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname *</label>
              <input
                v-model="order.customer.last_name"
                type="text"
                class="form-input"
                readonly
                placeholder="Müller"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse *</label>
            <input
              v-model="order.customer.address"
              type="text"
              class="form-input"
              readonly
              placeholder="Musterstraße 12"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ *</label>
              <input
                v-model="order.customer.postal_code"
                type="text"
                class="form-input"
                readonly
                placeholder="10115"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt *</label>
              <input
                v-model="order.customer.city"
                type="text"
                class="form-input"
                readonly
                placeholder="Berlin"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Suject *</label>
        <input v-model="order.subject" type="text" class="form-input" placeholder="Subject" />
      </div>

      <!-- Lieferdaten + Versand -->
      <div class="form-section">
        <div class="form-section-title">📦 Lieferung & Versand</div>
        <div class="form-group">
          <label class="form-label">Liefertermin</label>
          <input
            v-model="order.delivery_date"
            type="date"
            class="form-input"
            placeholder="2025-12-06"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Lieferadresse</label>
          <textarea
            v-model="order.delivery_address"
            rows="2"
            class="form-input"
            placeholder="Musterstraße 12, 10115 Berlin"
          ></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ</label>
            <input
              v-model="order.delivery_postal_code"
              type="text"
              class="form-input"
              placeholder="10115"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input
              v-model="order.delivery_city"
              type="text"
              class="form-input"
              placeholder="Berlin"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Land</label>
            <input
              v-model="order.delivery_country"
              type="text"
              class="form-input"
              placeholder="Deutschland"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Sendemethode</label>
            <input
              v-model="order.sent_method"
              type="text"
              class="form-input"
              placeholder="E-Mail"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Gesendet am</label>
            <input
              v-model="order.sent_at"
              type="date"
              class="form-input"
              placeholder="2025-12-05"
            />
          </div>
        </div>
      </div>

      <!-- Zahlung & Währung -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlung & Währung</div>
        <div class="form-group">
          <label class="form-label">Zahlungsbedingungen</label>
          <input
            v-model="order.payment_terms"
            type="text"
            class="form-input"
            placeholder="30 Tage netto"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Zahlungsart</label>
          <select v-model="order.payment_method" class="form-input">
            <option value="" disabled>Bitte auswhlen</option>
            <option>Überweisung</option>
            <option>Bar</option>
            <option>PayPal</option>
            <option>Kreditkarte</option>
            <option>Lastschrift</option>
            <option>Scheck</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Zahlungshinweise</label>
          <textarea
            v-model="order.payment_conditions"
            class="form-input"
            placeholder="Bitte auf das angegebene Konto überweisen."
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Währung</label>
          <select v-model="order.currency" class="form-input">
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
        <div class="form-group">
          <label class="form-label">Zahlungsreferenz</label>
          <input
            v-model="order.payment_reference"
            type="text"
            class="form-input"
            placeholder="z.B. Bankreferenz, Transaktions-ID"
          />
          <small class="form-hint">Optional</small>
        </div>
      </div>

      <!-- Positionen -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="order.positions && order.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in order.positions" :key="index" class="position-item">
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
                <div class="form-result-item">{{ pos.vat_unit || '0.00' }}</div>
              </div>
              <div class="positions-total-item">
                <label class="form-label">Unit Total (€)</label>
                <div class="form-result-item">{{ pos.unit_total || '0.00' }}</div>
              </div>
            </div>
          </div>
        </div>
        <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
      </div>

      <!-- Notizen & Texte -->
      <div class="form-section">
        <div class="form-section-title">📝 Notizen & Texte</div>
        <div class="form-group">
          <label class="form-label">Einleitungstext</label>
          <textarea
            v-model="order.intro_text"
            rows="2"
            class="form-input"
            placeholder="Vielen Dank für Ihre Bestellung."
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Kundennotiz</label>
          <textarea
            v-model="order.customer_notes"
            rows="3"
            class="form-input"
            placeholder="Bitte Lieferungen separat verpacken."
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Interne Notiz</label>
          <textarea
            v-model="order.internal_notes"
            rows="2"
            class="form-input"
            placeholder="Auftrag priorisieren."
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Schlusstext</label>
          <textarea
            v-model="order.closing_text"
            rows="3"
            class="form-input"
            placeholder="Wir freuen uns auf eine weitere Zusammenarbeit."
          ></textarea>
        </div>
      </div>

      <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'

export default {
  name: 'CreateOrder',
  data() {
    return {
      title: 'Auftrag erstellen',
      error: {},
      order: {
        id: '1',
        customer_id: 0,
        customer: {},

        subject: '',

        date: '',
        validity_date: '',
        service_period_start: '',
        service_period_end: '',

        status: 'pending',
        status_date: '',
        status_by: '',
        status_comments: '',

        is_active: 1,

        delivery_terms: '',
        shipping_method: '',
        delivery_address: '',
        delivery_postal_code: '',
        delivery_city: '',
        delivery_country: 'Deutschland',
        delivery_date: '',

        payment_terms: 14,
        payment_method: '',
        payment_conditions: '',
        payment_reference: '',

        currency: 'EUR.de-DE',
        net_total: 0,
        vat_total: 0,
        gross_total: 0,

        positions: [],
        attachments: [],
        priority: '',
        internal_status_notes: '',

        intro_text: '',
        customer_notes: '',
        internal_notes: '',
        closing_text: '',

        sent_at: '',
        sent_method: '',

        created_at: '',
        updated_at: ''
      }
    }
  },
  mounted() {
    this.getStore()
    this.getCustomer()
  },
  methods: {
    async getCustomer() {
      if (!this.$route.query.id) return
      try {
        const data = {
          id: this.$route.query.id,
          table_name: 'orders'
        }
        const result = await window.api.getCustomerById(data)
        if (!result.success) return
        this.order.id = result.data.last_id == 0 ? 1 : result.data.last_id
        this.order.customer = result.data.customer
        this.order.customer_id = result.data.customer.id
      } catch (error) {
        console.error(error)
      }
    },
    getStore() {
      if (store.state.order) {
        this.order = JSON.parse(JSON.stringify(store.state.order))
      }
    },
    addPosition() {
      this.order.positions.push({
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
      if (this.order.positions.length > 0) this.order.positions.splice(index, 1)
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.order.positions[index].vat || 0
      const base = quantity * price
      this.order.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
      this.order.positions[index].unit_total = (base * (1 + vat / 100)).toFixed(2)
    },
    summary() {
      let netTotal = 0
      let vatTotal = 0

      this.order.positions.forEach((pos) => {
        const unitTotal = parseFloat(pos.unit_total || 0)
        const vatUnit = parseFloat(pos.vat_unit || 0)
        netTotal += unitTotal
        vatTotal += vatUnit
      })

      this.order.net_total = netTotal.toFixed(2)
      this.order.vat_total = vatTotal.toFixed(2)
      this.order.gross_total = (netTotal + vatTotal).toFixed(2)
    },
    async submitStore() {
      if (!this.order) return
      this.summary()
      console.log(this.order)
      await store.setStore('order', JSON.parse(JSON.stringify(this.order)))
      this.$router.push('/orders/preview')
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
.stars {
  color: darkred;
  font-size: 16px;
}
</style>
