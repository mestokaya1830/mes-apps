<template>
  <div v-if="invoice" class="main-container">
    <header class="main-header">
      <label>{{ title }}</label>
      <router-link to="/customers" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill me-1 icons"></i>Zurück
      </router-link>
    </header>

    <!-- Grunddaten -->
    <section class="sections">
      <div class="sections-title"><i class="bi bi-pin-angle-fill form-title"></i>Grunddaten</div>
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
    </section>

    <!-- Kundendaten -->
    <section v-if="invoice.customer" class="sections">
      <div class="sections-title"><i class="bi bi-person-fill icons"></i>Kundendaten</div>
      <div v-if="invoice.customer?.id" class="customer-details">
        <div class="form-group">
          <label class="form-label">Kunden-Nr. <span class="stars">*</span></label>
          <input v-model="invoice.customer.id" type="text" class="inputs" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Firmenname <span class="stars">*</span></label>
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
    </section>

    <!-- Steueroptionen -->
    <section class="sections">
      <div class="sections-title"><i class="bi bi-briefcase-fill icons"></i>Steueroptionen</div>
      <div class="sections">
        <div class="switch-container">
          <label for="is_small_company" class="switch">
            <input
              id="is_small_company"
              v-model="invoice.is_small_company"
              type="checkbox"
              @change="checkVatOptions('is_small_company')"
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
              @change="checkVatOptions('is_reverse_charge')"
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
              @change="checkVatOptions('is_eu_delivery')"
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
    </section>

    <!-- Währung -->
    <section class="sections">
      <div class="sections-title"><i class="bi bi-currency-exchange icons"></i>Währung</div>
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
    </section>

    <!-- Positionen -->
    <section class="sections positions-error">
      <div class="sections-title">
        <i class="bi bi-box-seam icons"></i>
        Positionen <span class="stars">*</span>
      </div>

      <div v-if="invoice.positions && invoice.positions.length === 0">
        Keine Positionen vorhanden
      </div>
      <div v-if="error.positions" class="error">
        {{ error.positions }}
      </div>
      <div v-else class="positions-editor">
        <div v-for="(item, index) in invoice.positions" :key="index" class="position-item">
          <div class="sections">
            <div class="positions-header">
              <span class="position-number"> Position {{ index + 1 }} </span>
              <button type="button" class="delete-position-btn" @click="deletePosition(index)">
                <i class="bi bi-trash3 me-1"></i>Löschen
              </button>
            </div>
            <!-- FORM FIELDS -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Leistungsdatum Von <span class="stars">*</span></label>
                <div class="date-wrapper">
                  <i class="bi bi-calendar3 calendar-icon"></i>
                  <input
                    :ref="`service_period_start_${index}`"
                    v-model="item.service_period_start"
                    type="date"
                    class="inputs date"
                    required
                    @input="error.service_period_start = ''"
                  />
                </div>
                <div v-if="error.service_period_start" class="error">
                  {{ error.service_period_start }}
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Leistungsdatum Bis <span class="stars">*</span></label>
                <div class="date-wrapper">
                  <i class="bi bi-calendar3 calendar-icon"></i>
                  <input
                    :ref="`service_period_end_${index}`"
                    v-model="item.service_period_end"
                    type="date"
                    class="inputs date"
                    required
                    @input="error.service_period_end = ''"
                  />
                </div>
                <div v-if="error.service_period_end" class="error">
                  {{ error.service_period_end }}
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Bezeichnung</label>
                <input
                  v-model="item.title"
                  type="text"
                  class="inputs"
                  placeholder="Produkt / Leistung"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Beschreibung</label>
                <input
                  v-model="item.description"
                  type="text"
                  class="inputs"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Menge</label>
                <input v-model.number="item.quantity" type="number" class="inputs" min="1" />
              </div>

              <div class="form-group">
                <label class="form-label">Einzelpreis</label>
                <input v-model.number="item.price" type="number" class="inputs" step="0.01" />
              </div>

              <div class="form-group">
                <label class="form-label">MwSt %</label>
                <select v-model.number="item.vat" class="inputs">
                  <option :value="0">0 %</option>
                  <option :value="7">7 %</option>
                  <option :value="19">19 %</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Gesamt</label>
                <input type="text" class="inputs" :value="positionTotal(item)" disabled />
              </div>
            </div>
          </div>
        </div>
        <div v-if="invoice.positions.length > 0" class="sections">
          <div class="btn-container">
            <div class="summary-item">
              <label class="form-label">Nettobetrag</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.net_total, invoice.currency) }}
              </div>
            </div>
            <div class="summary-item">
              <label class="form-label">MwSt Gesamt</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.vat_total, invoice.currency) }}
              </div>
            </div>
            <div class="summary-item">
              <label class="form-label">Bruttobetrag</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.gross_total, invoice.currency) }}
              </div>
            </div>
            <div class="summary-item">
              <label class="form-label">Rabatt</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.early_payment_discount, invoice.currency) }}
              </div>
            </div>
            <div class="summary-item">
              <label class="form-label">Endbetrag</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.gross_total_after_discount, invoice.currency) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="add-position-btn" @click="addPosition">
        <i class="bi bi-plus-circle icons"></i>
        Position hinzufügen
      </button>
    </section>

    <!-- Zahlungsinformationen -->
    <section class="sections">
      <div class="sections-title">
        <i class="bi bi-credit-card-2-front-fill icons"></i>Zahlungsinformationen
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
    </section>

    <section class="sections btn-container">
      <button class="btn btn-preview" @click="submitStore">
        <i class="bi bi-eye icons"></i>Vorschau anzeigen
      </button>
    </section>
  </div>
</template>

<script>
import store from '../../store/store.js'
export default {
  name: 'Createinvoice',
  inject: ['formatInvoiceId', 'checkPositionsDates', 'checkServiceDates', 'formatCurrency'],
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
        this.invoice.id = result.last_id + 1
        this.invoice.customer = result.rows
      } catch (error) {
        console.error(error)
      }
    },
    validateDates() {
      let isValid = true

      // Check (service date)
      if (!this.invoice.service_date) {
        this.error.service_date = 'Leistungsdatum ist erforderlich'
        this.$refs.service_date.focus()
        isValid = false
        return isValid
      }

      // Check (invoice date)
      if (!this.invoice.date) {
        this.error.date = 'Rechnungsdatum ist erforderlich'
        this.$refs.date.focus()
        isValid = false
        return isValid
      }

      // NEW: Invoice date cannot be before service date
      if (new Date(this.invoice.date) < new Date(this.invoice.service_date)) {
        this.error.date = 'Rechnungsdatum kann nicht vor dem Leistungsdatum liegen'
        this.$refs.date.focus()
        isValid = false
        return isValid
      }

      // Check dates in positions
      for (let i = 0; i < this.invoice.positions.length; i++) {
        const position = this.invoice.positions[i]

        // Check service period start date
        if (!position.service_period_start) {
          this.error.service_period_start = 'Leistungsdatum Von ist erforderlich'
          if (this.$refs[`service_period_start_${i}`]) {
            this.$refs[`service_period_start_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }

        // Check service period end date
        if (!position.service_period_end) {
          this.error.service_period_end = 'Leistungsdatum Bis ist erforderlich'
          if (this.$refs[`service_period_end_${i}`]) {
            this.$refs[`service_period_end_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }

        // NEW: End date cannot be before start date
        if (new Date(position.service_period_end) < new Date(position.service_period_start)) {
          this.error.service_period_end = 'Enddatum kann nicht vor dem Startdatum liegen'
          if (this.$refs[`service_period_end_${i}`]) {
            this.$refs[`service_period_end_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }
      }

      return isValid
    },
    positionTotal(item) {
      const net = item.quantity * item.price
      return (net * (1 + item.vat / 100)).toFixed(2)
    },
    checkVatOptions(current) {
      if (!this.invoice[current]) {
        this.calculateVatAsCompanyType()
        return
      }
      const vatOptions = ['is_small_company', 'is_reverse_charge', 'is_eu_delivery']
      vatOptions.forEach((option) => {
        if (option !== current) {
          this.invoice[option] = false
        }
      })
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
      const date = new Date(this.invoice.date)
      date.setDate(date.getDate() + this.invoice.payment_terms)
      this.invoice.due_date = date.toISOString().split('T')[0]

      if (!this.invoice.early_payment_offer) return
      const early_payment_deadline = new Date(this.invoice.date)
      early_payment_deadline.setDate(
        early_payment_deadline.getDate() + this.invoice.early_payment_days
      )
      this.invoice.early_payment_deadline = early_payment_deadline.toISOString().split('T')[0]
    },
    async submitStore() {
      if (!this.validateDates()) {
        return
      }

      // Check positions exist
      if (!this.invoice.positions || this.invoice.positions.length === 0) {
        this.error.positions = 'Mindestens eine Position ist erforderlich'
        this.$nextTick(() => {
          const positionsError = document.querySelector('.positions-error')
          if (positionsError) {
            positionsError.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
        return false
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
          this.invoice.service_date,
          this.invoice.date,
          'service_date',
          'date'
        )
      )
        return
      // if (!this.checkPositionsDates(this.invoice.positions)) return

      await store.setStore('invoice', JSON.parse(JSON.stringify(this.invoice)))
      this.$router.push('/invoices/preview')
    }
  }
}
</script>
