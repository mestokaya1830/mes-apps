<template>
  <div v-if="order" class="main-container">
    <div class="main-header">
      <h1 class="main-title">{{ title }}</h1>
      <router-link to="/orders" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill me-1 icons"></i>Zurück
      </router-link>
    </div>

    <!-- Grunddaten -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-pin-angle-fill me-2 form-title"></i>Grunddaten
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Auftragsnummer *</label>
          <input
            v-model="order.id"
            type="text"
            class="inputs"
            readonly
            placeholder="AU-20251205-001"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Datum *</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input v-model="order.date" type="date" class="inputs date" />
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Leistungszeitraum Von *</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input v-model="order.service_period_start" type="date" class="inputs date" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Leistungszeitraum Bis *</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input v-model="order.service_period_end" type="date" class="inputs date" />
          </div>
        </div>
      </div>
    </div>

    <!-- Kundendaten -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-person-fill me-2 form-icons"></i>Kundendaten
      </div>
      <div v-if="order.customer?.id" class="customer-details">
        <div class="form-group">
          <label class="form-label">Kunden-Nr. *</label>
          <input v-model="order.customer.id" type="text" class="inputs" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Firmname *</label>
          <input v-model="order.customer.company_name" type="text" class="inputs" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Vorname *</label>
            <input v-model="order.customer.first_name" type="text" class="inputs" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Nachname *</label>
            <input v-model="order.customer.last_name" type="text" class="inputs" readonly />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Adresse *</label>
          <input v-model="order.customer.address" type="text" class="inputs" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ *</label>
            <input v-model="order.customer.postal_code" type="text" class="inputs" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt *</label>
            <input v-model="order.customer.city" type="text" class="inputs" readonly />
          </div>
        </div>
      </div>
    </div>

    <!-- Subject -->
    <div class="form-group">
      <label class="form-label">Subject *</label>
      <input v-model="order.subject" type="text" class="inputs" />
    </div>

    <!-- Lieferdaten + Versand -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-box-seam me-2 form-title"></i>Lieferung & Versand
      </div>
      <div class="form-group">
        <label class="form-label">Lieferbedingungen</label>
        <input
          v-model="order.delivery_terms"
          type="text"
          class="inputs"
          placeholder="Lieferbedingungen eingeben"
        />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Versandart</label>
          <select v-model="order.shipping_method" class="inputs">
            <option value="" disabled>Bitte auswählen</option>
            <option value="dhl">DHL</option>
            <option value="hermes">Hermes</option>
            <option value="ups">UPS</option>
            <option value="dpd">DPD</option>
            <option value="gls">GLS</option>
            <option value="email">E-Mail</option>
            <option value="pickup">Selbstabholung</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Liefertermin</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input v-model="order.delivery_date" type="date" class="inputs date" />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Lieferadresse</label>
        <textarea v-model="order.delivery_address" rows="2" class="inputs"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">PLZ</label>
          <input v-model="order.delivery_postal_code" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Stadt</label>
          <input v-model="order.delivery_city" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Land</label>
          <input v-model="order.delivery_country" type="text" class="inputs" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Sendemethode</label>
          <input v-model="order.sent_method" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Gesendet am</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input v-model="order.sent_at" type="date" class="inputs date" />
          </div>
        </div>
      </div>
    </div>

    <!-- Zahlung & Währung -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-credit-card-2-front-fill me-2 form-title"></i>Zahlung & Währung
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Zahlungsbedingungen</label>
          <input v-model="order.payment_terms" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Zahlungsart</label>
          <select v-model="order.payment_method" class="inputs">
            <option value="" disabled>Bitte auswählen</option>
            <option>Überweisung</option>
            <option>Bar</option>
            <option>PayPal</option>
            <option>Kreditkarte</option>
            <option>Lastschrift</option>
            <option>Scheck</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Zahlungshinweise</label>
        <textarea v-model="order.payment_conditions" class="inputs"></textarea>
      </div>
      <div class="form-row">
         <div class="form-group">
          <label class="form-label">Zahlungsreferenz</label>
          <input v-model="order.payment_reference" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Währung</label>
          <select v-model="order.currency" class="inputs">
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
    </div>

    <!-- Positionen -->
    <div class="sections">
      <div class="sections-title"><i class="bi bi-box-seam me-2 form-title"></i>Positionen</div>
      <div v-if="order.positions && order.positions.length === 0">Keine Positionen vorhanden</div>
      <div v-else class="positions-editor">
        <div v-for="(pos, index) in order.positions" :key="index" class="position-item">
          <div class="positions-header">
            <span class="position-number">Position {{ index + 1 }}</span>
            <button class="delete-position-btn" @click="deletePosition(index)">
              <i class="bi bi-trash3 me-1"></i>Löschen
            </button>
          </div>
          <div class="form-group">
            <label class="form-label">Bezeichnung</label>
            <input v-model="pos.title" type="text" class="inputs" />
          </div>
          <div class="form-group">
            <label class="form-label">Beschreibung</label>
            <input v-model="pos.description" type="text" class="inputs" />
          </div>
          <div class="form-row form-row-4">
            <div class="form-group">
              <label class="form-label">Einheit</label>
              <select v-model="pos.unit" class="inputs">
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
                class="inputs"
                @input="getUnitTotal(pos.quantity, pos.price, index)"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Preis (€)</label>
              <input
                v-model.number="pos.price"
                type="number"
                class="inputs"
                step="0.01"
                @input="getUnitTotal(pos.quantity, pos.price, index)"
              />
            </div>
            <div class="form-group">
              <label class="form-label">MwSt. (%)</label>
              <select
                v-model.number="pos.vat"
                class="inputs"
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
      <button class="add-position-btn" @click="addPosition()">
        <i class="bi bi-plus-circle me-1 form-title"></i>Position hinzufügen
      </button>
    </div>

    <!-- Notizen & Texte -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-pencil-square me-2 form-title"></i>Notizen & Texte
      </div>
      <div class="form-group">
        <label class="form-label">Einleitungstext</label>
        <textarea v-model="order.intro_text" rows="2" class="inputs"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Kundennotiz</label>
        <textarea v-model="order.customer_notes" rows="3" class="inputs"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Interne Notiz</label>
        <textarea v-model="order.internal_notes" rows="2" class="inputs"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Schlusstext</label>
        <textarea v-model="order.closing_text" rows="3" class="inputs"></textarea>
      </div>
    </div>

    <!-- Vorschau Button -->
    <div class="sections container-2">
      <button class="btn btn-preview"><i class="bi bi-eye me-2 icons"></i>Vorschau anzeigen</button>
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
        id: '',
        customer_id: 0,
        customer: {},
        subject: '',
        date: '',
        validity_date: '',
        service_period_start: '',
        service_period_end: '',
        status: 'pending',
        status_by: '',
        status_date: '',
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
        const data = { id: this.$route.query.id, table_name: 'orders' }
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
      if (!store.state.order) return
      this.order = JSON.parse(JSON.stringify(store.state.order))
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
      await store.setStore('order', JSON.parse(JSON.stringify(this.order)))
      this.$router.push('/orders/preview')
    }
  }
}
</script>
