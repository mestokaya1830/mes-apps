<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">Bearbeiten Sie die Auftragsdaten und sehen Sie die Vorschau live</div>
      </div>

      <!-- Grunddaten -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Auftragsnummer *</label>
            <input v-model="orders.id" type="text" class="form-input" readonly />
          </div>

          <div class="form-group">
            <label class="form-label">Datum *</label>
            <input v-model="orders.date" type="date" class="form-input" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Von *</label>
            <input v-model="orders.service_period_start" type="date" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Leistungszeitraum Bis *</label>
            <input v-model="orders.service_period_end" type="date" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Status -->
      <div class="form-section">
        <div class="form-section-title">📌 Status</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="orders.status" class="form-input">
              <option value="pending">Ausstehend</option>
              <option value="approved">Genehmigt</option>
              <option value="rejected">Abgelehnt</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Status Datum</label>
            <input v-model="orders.status_date" type="date" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Bearbeitet von</label>
          <input v-model="orders.status_by" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Status Kommentar</label>
          <textarea v-model="orders.status_comments" class="form-input"></textarea>
        </div>
      </div>

      <!-- Cancellation -->
      <div class="form-section">
        <div class="form-section-title">❌ Stornierung</div>

        <div class="form-group">
          <label class="form-label">Storniert am</label>
          <input v-model="orders.cancelled_at" type="date" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Storniert von</label>
          <input v-model="orders.cancelled_by" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Stornierungsgrund</label>
          <textarea v-model="orders.cancellation_reason" rows="2" class="form-input"></textarea>
        </div>
      </div>

      <!-- Lieferdaten -->
      <div class="form-section">
        <div class="form-section-title">📦 Lieferung</div>

        <div class="form-group">
          <label class="form-label">Liefertermin</label>
          <input v-model="orders.delivery_date" type="date" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Lieferadresse</label>
          <textarea v-model="orders.delivery_address" rows="2" class="form-input"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ</label>
            <input v-model="orders.delivery_postal_code" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input v-model="orders.delivery_city" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Land</label>
            <input v-model="orders.delivery_country" type="text" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Zahlungsbedingungen -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlung & Versand</div>

        <div class="form-group">
          <label class="form-label">Zahlungsbedingungen</label>
          <input v-model="orders.payment_terms" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Zahlungsart</label>
          <input v-model="orders.payment_method" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Zahlungshinweise</label>
          <textarea v-model="orders.payment_conditions" class="form-input"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Währung</label>
          <input v-model="orders.currency" type="text" class="form-input" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Lieferbedingungen</label>
            <input v-model="orders.delivery_terms" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Versandart</label>
            <input v-model="orders.shipping_method" type="text" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Positionen -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>

        <div v-if="orders.positions.length === 0">Keine Positionen vorhanden</div>

        <div v-else>
          <div v-for="(pos, index) in orders.positions" :key="index" class="position-item">
            <div class="form-group">
              <label class="form-label">Bezeichnung</label>
              <input v-model="pos.title" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Beschreibung</label>
              <input v-model="pos.description" type="text" class="form-input" />
            </div>
          </div>
        </div>

        <button class="add-position-btn" @click="addPosition">➕ Position hinzufügen</button>
      </div>

      <!-- Texte -->
      <div class="form-section">
        <div class="form-section-title">📝 Notizen & Texte</div>

        <div class="form-group">
          <label class="form-label">Einleitungstext</label>
          <textarea v-model="orders.intro_text" rows="2" class="form-input"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Kundennotiz</label>
          <textarea v-model="orders.customer_notes" rows="3" class="form-input"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Interne Notiz</label>
          <textarea v-model="orders.internal_notes" rows="2" class="form-input"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Schlusstext</label>
          <textarea v-model="orders.closing_text" rows="3" class="form-input"></textarea>
        </div>
      </div>

      <!-- Send Info -->
      <div class="form-section">
        <div class="form-section-title">📨 Versand</div>

        <div class="form-group">
          <label class="form-label">Gesendet am</label>
          <input v-model="orders.sent_at" type="date" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Sendemethode</label>
          <input v-model="orders.sent_method" type="text" class="form-input" />
        </div>
      </div>

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
      error: {},
      orders: {
        id: '1',
        customer_id: null,
        customer: {},

        date: '',
        validity_date: '',
        service_period_start: '',
        service_period_end: '',
        delivery_date: '',

        status: 'pending',
        status_date: '',
        status_by: '',
        status_comments: '',

        is_active: 1,

        delivery_address: '',
        delivery_postal_code: '',
        delivery_city: '',
        delivery_country: 'Deutschland',

        payment_terms: 14,
        payment_method: '',
        payment_conditions: '',
        currency: 'EUR.de-DE',
        net_total: 0,
        vat_total: 0,
        gross_total: 0,

        delivery_terms: '',
        shipping_method: '',

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
.stars {
  color: darkred;
  font-size: 16px;
}
</style>
