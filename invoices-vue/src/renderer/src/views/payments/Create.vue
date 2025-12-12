<template>
  <div>
    <div v-if="payment" class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">💳 {{ title }}</div>
        <div class="editor-subtitle">
          Erfassen Sie eingehende Zahlungen für die ausgewählte Rechnung
        </div>
      </div>

      <div>
        <!-- Invoice Information -->
        <div class="form-section">
          <div class="form-section-title">📄 Ausgewählte Rechnung</div>
          <div class="customer-details" style="margin-top: 16px">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnung-Nr.:</label>
                <label class="form-input">{{ formatInvoiceId(payment.invoice.id) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Kunden-Nr.:</label>
                <label class="form-input">{{
                  formatCustomerId(payment.invoice.customer_id)
                }}</label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnungsdatum</label>
                <label class="form-input">{{ formatDate(payment.invoice.date) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Fälligkeitsdatum</label>
                <label class="form-input">{{ formatDate(payment.invoice.due_date) }}</label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-input">
                <div>
                  Gesamtsumme:
                  {{ formatCurrency(payment.invoice.gross_total, payment.invoice.currency) }}
                </div>
                <div>
                  Bereits gezahlt:
                  {{ formatCurrency(payment.payment_total, payment.invoice.currency) }}
                </div>
                <div>
                  Offener Betrag: {{ formatCurrency(outstanding, payment.invoice.currency) }}
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Counterparty Information -->
        <div class="form-section">
          <div class="form-section-title">🏦 Gegenpartei Informationen</div>
          <div class="form-row">
            <div class="form-group">
              <IbanComponent
                v-model:localNamePartner="payment.counterparty_name"
                v-model:iban="payment.counterparty_iban"
                v-model:bic="payment.counterparty_bic"
                @ibanValid="ibanValid = $event"
                @bicValid="bicValid = $event"
                @update:bank="payment.counterparty_bank = $event"
              />
            </div>
          </div>
        </div>

        <!-- Currency -->
        <div class="form-section">
          <div class="form-section-title">💰 Währung</div>
          <div class="form-group">
            <label class="form-label">Währung</label>
            <select v-model="payment.invoice.currency" class="form-input">
              <option v-for="currency in currencies" :key="currency" :value="currency">
                {{ currency.split('.')[0] }}
              </option>
            </select>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="form-section">
          <div class="form-section-title">💰 Zahlungsdetails</div>

          <div class="form-group">
            <label class="form-label">Zahlungsdatum *</label>
            <input
              v-model="payment.payment_date"
              type="date"
              class="form-input"
              @change="checkEarlyPayment"
            />
            <small class="form-hint">Datum des Zahlungseingangs</small>
          </div>

          <div class="form-group">
            <label class="form-label">Betrag (€) *</label>
            <input
              ref="payment_amount"
              v-model.number="payment.payment_amount"
              type="number"
              class="form-input"
              min="0"
              step="0.01"
              :disabled="isPaymentAmountDisabled"
              @input="calculateOutstanding"
            />
            <small v-if="paymentAmountError" class="form-warning">
              Der Zahlungsbetrag darf den Rechnungsbetrag nicht überschreiten.
            </small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <small class="form-label">Rabatt</small>
              <small>{{ is_early_paid ? payment.invoice.early_payment_discount : 0 }}</small>
            </div>
            <div class="form-group">
              <small class="form-label">Offener Betrag</small>
              <small>{{ formatCurrency(outstanding, payment.invoice.currency) }}</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zahlungsmethode</label>
              <select v-model="payment.payment_method" class="form-input">
                <option v-for="method in paymentMethods" :key="method" :value="method">
                  {{ method }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Zahlungsreferenz</label>
              <input
                v-model="payment.payment_reference"
                type="text"
                class="form-input"
                placeholder="z.B. Bankreferenz, Transaktions-ID"
              />
              <small class="form-hint">Optional</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Beleg / Zahlungsnachweis (optional)</label>
              <input type="file" class="form-input" accept=".pdf,image/*" @change="loadImage" />
              <small class="form-hint">PDF, JPG, PNG</small>
            </div>

            <div class="form-group">
              <label class="form-label">Ausgewählte Datei</label>
              <img
                v-if="selectedImage"
                :src="selectedImage"
                alt="Payment proof"
                class="payment-image"
              />
              <div v-else>{{ payment.file_name || 'Keine Datei ausgewählt' }}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Notizen (optional)</label>
            <textarea v-model="payment.notes" class="form-input" rows="3"></textarea>
          </div>
        </div>

        <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store/store'
import IbanComponent from '../../components/IbanComponent.vue'

export default {
  name: 'PaymentCapture',

  components: {
    IbanComponent
  },

  inject: ['formatInvoiceId', 'formatCustomerId', 'formatDate', 'formatCurrency'],

  data() {
    return {
      title: 'Zahlung erfassen',
      payment: null,
      selectedImage: '',
      paymentAmountError: false,
      isPaymentAmountDisabled: false,
      is_early_paid: false,
      outstanding: 0,
      ibanValid: false,
      bicValid: false,
      isCalculating: false,
      currencies: [
        'EUR.de-DE',
        'USD.en-US',
        'GBP.en-GB',
        'CHF.ch-CH',
        'JPY.ja-JP',
        'AUD.en-AU',
        'CAD.en-CA',
        'CNY.zh-CN',
        'SEK.sv-SE',
        'NZD.en-NZ'
      ],
      paymentMethods: ['Überweisung', 'Bar', 'PayPal', 'Kreditkarte', 'Lastschrift', 'Scheck']
    }
  },

  computed: {
    invoiceGrossTotal() {
      return this.payment?.invoice?.gross_total || 0
    },

    invoicePaidTotal() {
      return this.payment?.payment_total || 0
    },

    remainingAmount() {
      return this.invoiceGrossTotal - this.invoicePaidTotal
    }
  },

  mounted() {
    this.initializePayment()
  },

  methods: {
    async initializePayment() {
      const storedPayment = store.state.payment

      if (storedPayment) {
        this.loadFromStore(storedPayment)
      } else {
        await this.loadFromDatabase()
      }
    },

    loadFromStore(storedPayment) {
      this.payment = JSON.parse(JSON.stringify(storedPayment))
      this.payment.payment_total = this.payment.payment_total_from_db || 0
      this.selectedImage = this.payment.image_file
      this.calculateOutstanding()
    },

    async loadFromDatabase() {
      const id = this.$route.params.id
      if (!id) return

      try {
        const result = await window.api.getInvoiceById({
          id,
          table_name: 'payments'
        })

        if (!result?.rows) return

        this.payment = this.createPaymentObject(result)
        this.outstanding = this.remainingAmount
      } catch (error) {
        console.error('Error loading invoice:', error)
      }
    },

    createPaymentObject(result) {
      return {
        id: result.payment_id + 1,
        customer_id: result.rows.customer_id,
        payment_date: '',
        payment_amount: 0,
        payment_total: result.payment_total,
        payment_method: 'Überweisung',
        payment_reference: '',
        counterparty_name: '',
        counterparty_iban: '',
        counterparty_bic: '',
        counterparty_bank: '',
        notes: '',
        file_name: '',
        payment_total_from_db: result.payment_total,
        invoice: result.rows
      }
    },

    loadImage(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        this.selectedImage = reader.result
        const timestamp = Date.now()
        const extension = file.name.split('.').pop()
        this.payment.file_name = `${this.payment.id}-${timestamp}.${extension}`
      }
      reader.readAsDataURL(file)
    },

    calculateOutstanding() {
      if (!this.payment || this.isCalculating) return

      const gross = this.invoiceGrossTotal
      const paid = this.invoicePaidTotal
      const amount = Number(this.payment.payment_amount) || 0

      let outstanding = this.is_early_paid ? 0 : gross - (paid + amount)

      this.outstanding = outstanding.toFixed(2)
      this.paymentAmountError = paid + amount > gross
    },

    checkEarlyPayment() {
      if (!this.payment) return

      this.isCalculating = true

      const paymentDate = this.payment.payment_date ? new Date(this.payment.payment_date) : null
      const dueDate = this.payment.invoice.due_date ? new Date(this.payment.invoice.due_date) : null

      const earlyDays = this.payment.invoice.early_payment_days || 0
      const earlyDiscount = this.payment.invoice.early_payment_discount || 0

      let isEarly = false

      if (paymentDate && dueDate) {
        const earlyPaymentDate = new Date(paymentDate)
        earlyPaymentDate.setDate(earlyPaymentDate.getDate() + earlyDays)
        isEarly = earlyPaymentDate <= dueDate
      }

      this.is_early_paid = isEarly
      this.isPaymentAmountDisabled = isEarly

      if (isEarly) {
        const calculatedAmount = this.remainingAmount - earlyDiscount
        this.payment.payment_amount = Math.max(0, calculatedAmount).toFixed(2)
        this.outstanding = 0
      } else {
        this.payment.payment_amount = ''
        this.outstanding = this.remainingAmount.toFixed(2)
      }

      this.$nextTick(() => {
        this.isCalculating = false
        this.calculateOutstanding()
      })
    },

    validatePayment() {
      const amount = Number(this.payment.payment_amount)

      if (!amount || amount <= 0) {
        this.$refs.payment_amount?.focus()
        return false
      }

      const totalAfterPayment = this.invoicePaidTotal + amount

      if (totalAfterPayment > this.invoiceGrossTotal) {
        this.$refs.payment_amount?.focus()
        this.paymentAmountError = true
        return false
      }

      this.paymentAmountError = false
      return true
    },

    async submitStore() {
      if (!this.validatePayment()) return

      const totalAfterPayment = this.invoicePaidTotal + Number(this.payment.payment_amount)

      this.payment.image_file = this.selectedImage
      this.payment.payment_total = totalAfterPayment

      if (totalAfterPayment >= this.invoiceGrossTotal) {
        this.payment.invoice.payment_status = 'paid'
      }

      await store.setStore('payment', JSON.parse(JSON.stringify(this.payment)))
      this.$router.push('/payments/preview')
    }
  }
}
</script>

<style>
/* Genel Form */
.payment-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.form-warning {
  color: #d32f2f;
  display: block;
  margin-top: 4px;
}
.form-section {
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.form-section-title {
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: #1f2937;
}

/* Satır ve grup düzeni */
.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Label */
.form-label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

/* Bilgilendirici alanlar */
.info-block {
  background-color: #f3f4f6; /* açık gri arka plan */
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  color: #111827;
  line-height: 1.5;
  margin-bottom: 12px;
}

/* Ödeme özet paneli */
.payment-summary {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px 20px;
  margin-top: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.payment-summary div {
  margin-bottom: 6px;
  font-size: 0.95rem;
  color: #374151;
}

/* Öne çıkan rakamlar */
.payment-summary .highlight {
  font-weight: 600;
  color: #111827;
}

/* Butonlar */
.preview-btn {
  margin-top: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.preview-btn:hover {
  background-color: #45a049;
}

.btn-secondary {
  margin-top: 16px;
  background-color: #e5e7eb;
  color: #111827;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}

/* Özel: Stars */
.stars {
  color: red;
}
.payment-image {
  width: 100px;
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

.form-warning {
  color: red;
  margin-top: 10px;
}
</style>
