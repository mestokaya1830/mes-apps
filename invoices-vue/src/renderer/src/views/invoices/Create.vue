<template>
  <div v-if="invoice" class="main-container">
    <div class="main-header">
      <h1 class="main-title">{{ title }}</h1>
       <router-link to="/invoices" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill me-1 icons"></i>Zurück
      </router-link>
    </div>

    <!-- Grunddaten -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-pin-angle-fill me-2 form-title"></i>Grunddaten
      </div>
      <div class="form-group">
        <label class="form-label">Rechnungsnummer <span class="stars">*</span></label>
        <input v-model="invoice.id" type="text" class="inputs" readonly />
        <small class="form-hint">Format: RE-YYYY-XXXX (automatisch generiert)</small>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Leistungsdatum <span class="stars">*</span></label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input
              ref="service_date"
              v-model="invoice.service_date"
              type="date"
              class="inputs date"
              required
              @input="error.service_date = ''"
            />
          </div>
          <div v-if="error.service_date" class="error">{{ error.service_date }}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Rechnungsdatum <span class="stars">*</span></label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input
              ref="date"
              v-model="invoice.date"
              type="date"
              class="inputs date"
              required
              @input="error.date = ''"
            />
          </div>
          <div v-if="error.date" class="error">{{ error.date }}</div>
        </div>
      </div>
    </div>

    <!-- Kundendaten -->
    <div v-if="invoice.customer" class="sections">
      <div class="sections-title">
        <i class="bi bi-person-fill me-2 icons"></i>Kundendaten
      </div>
      <div v-if="invoice.customer?.id" class="customer-details">
        <div class="form-group">
          <label class="form-label">Kunden-Nr. <span class="stars">*</span></label>
          <input v-model="invoice.customer.id" type="text" class="inputs" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Firmname <span class="stars">*</span></label>
          <input v-model="invoice.customer.company_name" type="text" class="inputs" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Vorname <span class="stars">*</span></label>
            <input v-model="invoice.customer.first_name" type="text" class="inputs" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Nachname <span class="stars">*</span></label>
            <input v-model="invoice.customer.last_name" type="text" class="inputs" readonly />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Adresse <span class="stars">*</span></label>
          <input v-model="invoice.customer.address" type="text" class="inputs" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ <span class="stars">*</span></label>
            <input v-model="invoice.customer.postal_code" type="text" class="inputs" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt <span class="stars">*</span></label>
            <input v-model="invoice.customer.city" type="text" class="inputs" readonly />
          </div>
        </div>
      </div>
    </div>

    <!-- Steueroptionen -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-briefcase-fill me-2 icons"></i>Steueroptionen
      </div>
      <div class="sections">
        <div class="switch-container">
          <label for="is_small_company" class="switch">
            <input
              id="is_small_company"
              v-model="invoice.is_small_company"
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
              v-model="invoice.is_reverse_charge"
              type="checkbox"
              @change="checkTaxOptions('is_reverse_charge')"
            />
            <span class="slider round"></span>
          </label>
          <div class="switch-text">
            <strong>Reverse-Charge-Verfahren</strong>
            <small class="option-description">
              Steuerschuldnerschaft des Leistungsempfängers (§13b UStG)
            </small>
          </div>
        </div>
        <div class="switch-container">
          <label for="is_eu_delivery" class="switch">
            <input
              id="is_eu_delivery"
              v-model="invoice.is_eu_delivery"
              type="checkbox"
              @change="checkTaxOptions('is_eu_delivery')"
            />
            <span class="slider round"></span>
          </label>
          <div class="switch-text">
            <strong>Innergemeinschaftliche Lieferung</strong>
            <small class="option-description">
              Steuerfrei gemäß §4 Nr.1b UStG (Europa içi, opsiyonel)
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Währung -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-currency-exchange me-2 icons"></i>Währung
      </div>
      <div class="form-group">
        <select v-model="invoice.currency" class="inputs">
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
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-box-seam me-2 icons"></i>Positionen
      </div>
      <div v-if="invoice.positions && invoice.positions.length === 0">
        Keine Positionen vorhanden
      </div>
      <div v-else class="positions-editor">
        <div v-for="(item, index) in invoice.positions" :key="index" class="position-item">
          <div class="positions-header">
            <span class="position-number">Position {{ index + 1 }}</span>
            <button class="delete-position-btn">
              <i class="bi bi-trash3 me-1"></i>Löschen
            </button>
          </div>
          <!-- form fields hier bleiben unverändert -->
        </div>
      </div>
      <button class="add-position-btn">
        <i class="bi bi-plus-circle me-1 icons"></i>Position hinzufügen
      </button>
    </div>

    <!-- Zahlungsinformationen -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-credit-card-2-front-fill me-2 icons"></i>Zahlungsinformationen
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Zahlungsziel (Tage) <span class="stars">*</span></label>
          <input v-model.number="invoice.payment_terms" type="number" class="inputs" required />
          <small class="form-hint">
            Zahlbar innerhalb {{ invoice.payment_terms }} Tagen netto
          </small>
        </div>

        <div class="switch-container">
          <label for="skonto-checkbox" class="switch">
            <input
              id="skonto-checkbox"
              v-model="invoice.early_payment_offer"
              type="checkbox"
              class="switch-checkbox"
            />
            <span class="slider round"></span>
          </label>
          <div class="switch-text">
            <i class="bi bi-percent me-1 icons"></i><strong>Skonto gewähren</strong>
          </div>
        </div>
      </div>

      <div v-if="invoice.early_payment_offer" class="form-row">
        <div class="form-group">
          <label class="form-label">Skonto (%)</label>
          <input
            v-model.number="invoice.early_payment_percentage"
            type="number"
            step="0.1"
            class="inputs"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Skonto Frist (Tage)</label>
          <input v-model.number="invoice.early_payment_days" type="number" class="inputs" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Zusätzliche Zahlungsbedingungen</label>
        <textarea
          v-model="invoice.payment_conditions"
          class="inputs"
          rows="3"
          placeholder="z.B. 50% Anzahlung bei Auftragserteilung, Restzahlung nach Abschluss."
        ></textarea>
      </div>

      <div v-if="invoice.positions" class="container-2">
        <div class="summary-item">
          <label class="form-label">Net Total (€)</label>
          <div class="form-result-item">{{ summary.net_total }}</div>
        </div>
        <div class="summary-item">
          <label class="form-label">Vat Total (€)</label>
          <div class="form-result-item">{{ summary.vat_total }}</div>
        </div>
        <div class="summary-item">
          <label class="form-label">Brutto Total (€)</label>
          <div class="form-result-item">{{ summary.gross_total }}</div>
        </div>
        <div class="summary-item">
          <label class="form-label">Rabatt (€)</label>
          <div class="form-result-item">{{ summary.early_payment_discount }}</div>
        </div>
        <div class="summary-item">
          <label class="form-label">Endpreis (€)</label>
          <div class="form-result-item">{{ summary.gross_total_after_discount }}</div>
        </div>
      </div>

    </div>
    <div class="form-actions btn-container">
      <button class="btn btn-preview" @click="submitStore">
        <i class="bi bi-eye me-2 icons"></i>Vorschau anzeigen
      </button>
    </div>
  </div>
</template>


<script>
import store from '../../store/store.js'
export default {
  name: 'Createinvoice',
  inject: ['formatInvoiceId', 'checkPositionsDates', 'checkServiceDates'],
  data() {
    return {
      title: 'Rechnung erstellen',
      error: {},
      invoice: {
        id: 0,
        is_active: 1,
        customer_id: null,
        customer: null,

        service_date: null,
        date: null,
        due_date: null,

        currency: 'EUR.de-DE',

        payment_terms: 14,
        payment_conditions: 'z.B. 50% Anzahlung bei Auftragserteilung, Restzahlung nach Abschluss.',

        early_payment_offer: false,
        early_payment_days: 7,
        early_payment_percentage: 2,
        early_payment_discount: 0,
        early_payment_deadline: null,

        is_small_company: false,
        is_reverse_charge: false,
        is_eu_delivery: false,

        positions: [],
        net_total: 0,
        vat_total: 0,
        gross_total: 0,
        gross_total_after_discount: 0,

        payment_status: 'unpaid'
      }
    }
  },
  computed: {
    summary() {
      if (!this.invoice.positions) return
      const net_total = this.invoice.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
      const vat_total = this.invoice.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
      const gross_total = net_total + vat_total

      let early_payment_discount = 0
      if (this.invoice.early_payment_offer) {
        early_payment_discount = (gross_total * this.invoice.early_payment_percentage) / 100
      }
      return {
        net_total,
        vat_total,
        gross_total,
        early_payment_discount,
        gross_total_after_discount: gross_total - early_payment_discount
      }
    }
  },
  mounted() {
    this.getStore()
  },
  methods: {
    async getStore() {
      if (!store.state.invoice) return await this.getCustomer()
      this.invoice = JSON.parse(JSON.stringify(store.state.invoice))
    },
    async getCustomer() {
      if (!this.$route.query.id) return
      try {
        const data = {
          id: this.$route.query.id,
          table_name: 'invoices'
        }
        const result = await window.api.getCustomerById(data)
        if (!result.success) return
        this.invoice.id = result.data.last_id + 1
        this.invoice.customer = result.data.customer
      } catch (error) {
        console.error(error)
      }
    },
    checkTaxOptions(current) {
      if (!current) return
      for (const item in this.invoice[current]) {
        if (item !== current) {
          this.invoice[item] = 0
        }
      }
      this.calculateVatAsCompanyType()
    },
    calculateVatAsCompanyType() {
      if (!this.invoice.positions) return
      this.invoice.positions.forEach((item, index) => {
        const base = item.quantity * item.price

        if (
          this.invoice.is_reverse_charge ||
          this.invoice.is_small_company ||
          this.invoice.is_eu_delivery
        ) {
          this.invoice.positions[index].vat = 0
          this.invoice.positions[index].vat_unit = 0
          this.invoice.positions[index].unit_total = base.toFixed(2)
        } else {
          const vat = 19
          this.invoice.positions[index].vat = vat
          this.invoice.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
          this.invoice.positions[index].unit_total = (base * (1 + vat / 100)).toFixed(2)
        }
      })
    },
    addPosition() {
      if (!this.invoice.positions) return
      this.invoice.positions.push({
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
      this.error.positions = ''
    },
    deletePosition(index) {
      if (!this.invoice.positions) return
      if (this.invoice.positions.length > 0) {
        this.invoice.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.invoice.positions[index].vat || 0
      const base = quantity * price
      let total = 0
      if (
        this.invoice.is_reverse_charge ||
        this.invoice.is_small_company ||
        this.invoice.is_eu_delivery
      ) {
        this.invoice.positions[index].vat = 0
        this.invoice.positions[index].vat_unit = 0
        this.invoice.positions[index].unit_total = base.toFixed(2)
        return
      } else {
        total = base * (1 + vat / 100)
      }

      this.invoice.positions[index].unit_total = total.toFixed(2)
      this.invoice.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
    },
    setNewDates() {
      if (!this.invoice.date) return
      //due date
      const date = new Date(this.invoice.date)
      date.setDate(date.getDate() + this.invoice.payment_terms)
      this.invoice.due_date = date.toISOString().split('T')[0]

      //early payment date
      if (!this.invoice.early_payment_offer) return
      const early_payment_deadline = new Date(this.invoice.date)
      early_payment_deadline.setDate(
        early_payment_deadline.getDate() + this.invoice.early_payment_days
      )
      this.invoice.early_payment_deadline = early_payment_deadline.toISOString().split('T')[0]
    },
    async submitStore() {
      if (this.invoice.positions.length === 0) {
        this.error.positions = 'Es muss mindestens eine Position hinzugefügt werden.'
        return
      }
      this.setNewDates()
      this.invoice.customer_id = this.invoice.customer.id
      this.invoice.net_total = this.summary.net_total
      this.invoice.vat_total = this.summary.vat_total
      this.invoice.gross_total = this.summary.gross_total
      this.invoice.early_payment_discount = this.summary.early_payment_discount
      this.invoice.gross_total_after_discount = this.summary.gross_total_after_discount
      if (
        !this.checkServiceDates(
          //comt from app provider
          this.invoice.service_date,
          this.invoice.date,
          'service_date',
          'date'
        )
      )
        return
      if (!this.checkPositionsDates(this.invoice.positions)) return

      await store.setStore('invoice', JSON.parse(JSON.stringify(this.invoice)))
      this.$router.push('/invoices/preview')
    }
  }
}
</script>
