<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📦 {{ title }}</div>
        <div class="editor-subtitle">
          Erstellen Sie den Lieferschein und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- Grunddaten -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-group">
          <label class="form-label">Lieferschein-Nr. <span class="stars">*</span></label>
          <input v-model="deliveries.id" type="text" class="form-input" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Auftrags-Nr.</label>
            <input v-model="deliveries.order_id" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Lieferdatum <span class="stars">*</span></label>
            <input v-model="deliveries.date" type="date" class="form-input" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Lieferreferenz</label>
          <input v-model="deliveries.delivery_reference" type="text" class="form-input" />
        </div>
      </div>

      <!-- Kunde (Empfänger) -->
      <div v-if="customers" class="form-section">
        <div class="form-section-title">👤 Empfänger (Kunde)</div>
        <div class="form-group">
          <label class="form-label">Kundendaten <span class="stars">*</span></label>
          <select v-model="customerList" class="form-input" @change="getCustomerById">
            <option selected disabled>Wähle Kunden</option>
            <option v-for="item in customers" :key="item.id" :value="item.id">
              {{ item.company_name ? item.company_name : item.first_name + ' ' + item.last_name }}
            </option>
          </select>
        </div>
        <div v-if="deliveries.selected_customer" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr. <span class="stars">*</span></label>
            <input
              v-model="deliveries.selected_customer.id"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-group">
            <label class="form-label">Firmenname</label>
            <input
              v-model="deliveries.selected_customer.company_name"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname <span class="stars">*</span></label>
              <input
                v-model="deliveries.selected_customer.first_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname <span class="stars">*</span></label>
              <input
                v-model="deliveries.selected_customer.last_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse <span class="stars">*</span></label>
            <input
              v-model="deliveries.selected_customer.address"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ <span class="stars">*</span></label>
              <input
                v-model="deliveries.selected_customer.postal_code"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt <span class="stars">*</span></label>
              <input
                v-model="deliveries.selected_customer.city"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Lieferstatus -->
      <div class="form-section">
        <div class="form-section-title">📊 Lieferstatus</div>
        <div class="form-group">
          <label class="form-label">Status <span class="stars">*</span></label>
          <select v-model="deliveries.delivery_status" class="form-input" required>
            <option value="pending">⏳ Ausstehend</option>
            <option value="in_transit">🚚 In Transit</option>
            <option value="delivered">✅ Geliefert</option>
            <option value="cancelled">❌ Storniert</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Ausgeliefert von</label>
            <input v-model="deliveries.delivered_by" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Empfangen von</label>
            <input v-model="deliveries.received_by" type="text" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Positionen -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen (Gelieferte Artikel)</div>
        <div v-if="deliveries.positions.length === 0" class="empty-positions">
          Keine Positionen vorhanden
        </div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in deliveries.positions" :key="index" class="position-item">
            <div class="positions-header">
              <span class="position-number">Position {{ index + 1 }}</span>
              <button class="delete-position-btn" @click="deletePosition(index)">🗑️ Löschen</button>
            </div>
            <div class="form-group">
              <label class="form-label">Bezeichnung <span class="stars">*</span></label>
              <input v-model="pos.title" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Beschreibung</label>
              <textarea v-model="pos.description" class="form-input"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Menge <span class="stars">*</span></label>
                <input
                  v-model.number="pos.quantity"
                  type="number"
                  class="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Einheit <span class="stars">*</span></label>
                <select v-model="pos.unit" class="form-input" required>
                  <option value="Stk">Stück (Stk)</option>
                  <option value="Std">Stunden (Std)</option>
                  <option value="Tag">Tage</option>
                  <option value="Monat">Monate</option>
                  <option value="Pauschal">Pauschal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button class="add-position-btn" @click="addPosition">➕ Position hinzufügen</button>
      </div>

      <!-- Notizen -->
      <div class="form-section">
        <div class="form-section-title">📝 Notizen & Bemerkungen</div>
        <textarea v-model="deliveries.note" class="form-input" rows="4"></textarea>
      </div>

      <!-- Preview -->
      <router-link to="/deliveries/preview" class="preview-btn" @click="setStore"
        >👁️ Vorschau anzeigen</router-link
      >
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
export default {
  name: 'CreateDelivery',
  inject: ['storePreview'],
  data() {
    return {
      title: 'Lieferschein erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      deliveries: {
        id: '1',
        date: '',
        order_id: '',
        selected_customer: {},
        delivery_status: 'pending',
        delivered_by: '',
        delivery_reference: '',
        received_by: '',
        note: '',
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
      const response = await window.api.getCustomers()
      if (response.success) this.customers = response.customers
    },
    getCustomerById() {
      const customer = this.customers.find((item) => item.id === this.customerList)
      if (customer) this.deliveries.selected_customer = customer
      console.log(this.deliveries.selected_customer)
    },
    async getStore() {
      // await store.clearStore('deliveries')
      if (store.state.deliveries) {
        this.deliveries = JSON.parse(JSON.stringify(store.state.deliveries))
        console.log(this.deliveries)
      }
    },
    addPosition() {
      this.deliveries.positions.push({ title: '', description: '', quantity: 1, unit: 'Stk' })
    },
    deletePosition(i) {
      this.deliveries.positions.splice(i, 1)
    },
    setStore() {
      if (this.deliveries) {
        this.storePreview('deliveries', this.deliveries)
      }
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
