<template>
  <div>
    <!-- Payment Capture Panel -->
    <div v-if="payment" class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">💳 {{ title }}</div>
        <div class="editor-subtitle">
          Erfassen Sie eingehende Zahlungen für die ausgewählte Rechnung
        </div>
      </div>

      <div>
        <!-- 1️⃣ Invoice Information (readonly) -->
        <div class="form-section">
          <div class="form-section-title">📄 Ausgewählte Rechnung</div>
          <div class="customer-details" style="margin-top: 16px">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnung-Nr.:</label>
                <label class="form-input">{{ formatInvoiceId(payment.invoice_id) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Kunden-Nr.:</label>
                <label class="form-input">{{
                  formatCustomerId(payment.invoice_customer_id)
                }}</label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnungsdatum</label>
                <label class="form-input">{{ formatDate(payment.invoice_date) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Fälligkeitsdatum</label>
                <label class="form-input">{{ formatDate(payment.invoice_due_date) }}</label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-input">
                <div>
                  Gesamtsumme:
                  {{ formatCurrency(payment.invoice_gross_total, payment.invoice_currency) }}
                </div>
                <div>
                  Bereits gezahlt:
                  {{ formatCurrency(payment.payment_total, payment.invoice_currency) }}
                </div>
                <div>
                  Offener Betrag:
                  {{ formatCurrency(payment.outstanding, payment.invoice_currency) }}
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- 2️⃣ Counterparty Information -->
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
                @update:bank="setBank"
              />
            </div>
          </div>
        </div>

        <!-- 3️⃣ Currency -->
        <div class="form-section">
          <div class="form-section-title">💰 Währung</div>
          <div class="form-group">
            <label class="form-label">Waehrung</label>
            <select v-model="payment.invoice_currency" class="form-input">
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

        <!-- 4️⃣ Payment Details -->
        <div class="form-section">
          <div class="form-section-title">💰 Zahlungsdetails</div>
          <div class="form-group">
            <label class="form-label">Zahlungsdatum *</label>
            <input
              v-model="payment.payment_date"
              type="date"
              class="form-input"
              @input="checkEarlyPayment"
            />
            <small class="form-hint">Datum des Zahlungseingangs</small>
          </div>

          <div class="form-group">
            <label class="form-label">Betrag (€) *</label>
            <input
              ref="payment_amount"
              v-model="payment.payment_amount"
              type="number"
              class="form-input"
              min="0"
              :disabled="isPaymentAmountDisabled"
              @input="checkEarlyPayment"
            />
            <small v-if="paymentAmountError" class="form-warning"
              >Der Zahlungsbetrag darf den Rechnungsbetrag nicht überschreiten.</small
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <small class="form-label">Rabbat</small>
              <small v-if="payment.is_early_paid">{{
                payment.invoice_early_payment_discount
              }}</small>
              <small v-else>0</small>
            </div>
            <div class="form-group">
              <small class="form-label">Offener Betrag</small>
              <small>{{ formatCurrency(payment.outstanding, payment.invoice_currency) }}</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zahlungsmethode</label>
              <select v-model="payment.payment_method" class="form-input">
                <option>Überweisung</option>
                <option>Bar</option>
                <option>PayPal</option>
                <option>Kreditkarte</option>
                <option>Lastschrift</option>
                <option>Scheck</option>
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
              <img v-if="selectedImage" :src="selectedImage" alt="" class="payment-image" />
              <div v-else>{{ payment.file_name }}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Notizen (optional)</label>
            <textarea v-model="payment.notes" class="form-input" rows="3"></textarea>
          </div>
        </div>

        <!-- 5️⃣ Preview / Submit -->
        <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store/store'
import IbanComponent from '../../components/IbanComponent.vue'

export default {
  components: {
    IbanComponent
  },
  inject: ['formatInvoiceId', 'formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Zahlung erfassen',
      payment: null,
      selectedImage: '',
      ibanError: '',
      handleIban: false,
      ibanCountryFlag: '',
      bicError: '',
      paymentAmountError: false,
      isPaymentAmountDisabled: false
    }
  },

  mounted() {
    this.getStore()
  },

  methods: {
    async getInvoice() {
      const id = this.$route.params.id
      if (!id) return
      try {
        const data = { id, table_name: 'payments' }
        const result = await window.api.getInvoiceById(data)
        if (!result.rows) return
        this.payment = {
          id: result.payment_id + 1,
          is_early_paid: false,
          payment_date: '',
          payment_amount: 0,
          payment_total: result.payment_total,
          payment_method: 'Überweisung',
          payment_reference: '',
          outstanding: 0,
          counterparty_name: '',
          counterparty_iban: '',
          counterparty_bic: '',
          counterparty_bank: '',
          notes: '',
          file_name: '',
          payment_status: 'partially_paid',
          invoice_id: result.rows.id,
          invoice_currency: result.rows.currency,
          invoice_customer_id: result.rows.customer_id,
          invoice_date: result.rows.date,
          invoice_due_date: result.rows.due_date,
          invoice_gross_total: result.rows.gross_total,
          invoice_total_after_discount: result.rows.total_after_discount,
          invoice_early_payment_days: result.rows.early_payment_days,
          invoice_early_payment_discount: result.rows.early_payment_discount,
          invoice_early_payment_percentage: result.rows.early_payment_percentage,
          payment_total_from_db: result.payment_total //claulation again for back from preview
        }
        //from payments db
        console.log('payments', result)
      } catch (error) {
        console.error(error)
      }
    },

    getStore() {
      // return this.getInvoice()
      if (!store.state.payment) return this.getInvoice()
      this.payment = JSON.parse(JSON.stringify(store.state.payment))

      //claulation again for back from preview
      this.payment.payment_total = this.payment.payment_total_from_db || 0
      this.selectedImage = this.payment.image_file
      console.log('store payment', this.payment)
    },

    loadImage(event) {
      const file = event.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        this.selectedImage = reader.result
        const timestamp = new Date().getTime()
        this.payment.file_name = `${this.payment.id}-${timestamp}.${file.name.split('.').pop()}`
      }
      reader.readAsDataURL(file)
    },
    calculateOutstanding() {
      if (!this.payment) return 0

      let gross = Number(this.payment.invoice_gross_total)
      let paid = Number(this.payment.payment_total)
      let amount = Number(this.payment.payment_amount)

      let outstanding

      if (this.payment.is_early_paid) {
        outstanding = gross - Number(this.payment.invoice_early_payment_discount) - (amount + paid)
      } else {
        outstanding = gross - (amount + paid)
      }

      this.payment.outstanding = outstanding.toFixed(2)
      return this.payment.outstanding
    },
    checkEarlyPayment() {
      if (!this.payment) return

      const hasDates = this.payment.payment_date && this.payment.invoice_due_date
      if (!hasDates) {
        this.payment.is_early_paid = false
        this.isPaymentAmountDisabled = false
        // this.payment.payment_amount = 0
        return
      }

      const paymentDate = new Date(this.payment.payment_date)
      const dueDate = new Date(this.payment.invoice_due_date)
      const earlyPaymentDate = new Date(paymentDate)

      earlyPaymentDate.setDate(
        earlyPaymentDate.getDate() + (this.payment.invoice_early_payment_days || 0)
      )

      const isEarly = earlyPaymentDate <= dueDate
      this.payment.is_early_paid = isEarly
      this.isPaymentAmountDisabled = isEarly

      if (isEarly) {
        this.payment.payment_amount =
          Number(this.payment.invoice_gross_total) -
          Number(this.payment.invoice_early_payment_discount) -
          Number(this.payment.payment_total)
      } else {
        this.payment.payment_amount = 0
      }
      this.calculateOutstanding()
    },
    checkInputPayment() {
      if (this.payment.payment_amount <= 0) {
        this.$refs.payment_amount.focus()
        return false
      }
      return true
    },
    setBank(bankName) {
      this.payment.counterparty_bank = bankName
    },
    async submitStore() {
      if (!this.checkInputPayment()) return
      this.payment.image_file = this.selectedImage
      this.payment.payment_total += this.payment.payment_amount
      if (this.payment.payment_total >= this.payment.invoice_gross_total) {
        this.payment.payment_status = 'paid'
        this.payment.is_partially_paid = 0
      }
      if (this.payment.payment_total > this.payment.invoice_gross_total) {
        this.$refs.payment_amount.focus()
        this.paymentAmountError = true
        return
      }
      await store.setStore('payment', JSON.parse(JSON.stringify(this.payment)))
      this.$router.push('/payments/preview')
    }
  }
}
</script>

<style>
/* Genel Form */
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
