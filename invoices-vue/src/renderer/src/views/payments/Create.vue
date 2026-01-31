<template>
  <div v-if="payment" class="main-container">
    <div class="main-header">
      <label>💳 {{ title }}</label>
      <router-link to="/payments" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill me-1 icons"></i>Zurück
      </router-link>
    </div>

    <div>
      <!-- 1️⃣ Invoice Information (readonly) -->
      <div class="sections">
        <div class="sections-title">📄 Ausgewählte Rechnung</div>
        <div class="customer-details" style="margin-top: 16px">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Rechnung-Nr.:</label>
              <label class="inputs">{{ formatInvoiceId(payment.invoice.id) }}</label>
            </div>
            <div class="form-group">
              <label class="form-label">Kunden-Nr.:</label>
              <label class="inputs">{{ formatCustomerId(payment.invoice.customer_id) }}</label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Rechnungsdatum</label>
              <label class="inputs">{{ formatDate(payment.invoice.date) }}</label>
            </div>
            <div class="form-group">
              <label class="form-label">Fälligkeitsdatum</label>
              <label class="inputs">{{ formatDate(payment.invoice.due_date) }}</label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <div>
                Gesamtsumme:
                {{ formatCurrency(payment.invoice.gross_total, payment.invoice.currency) }}
              </div>
              <div>
                Bereits gezahlt:
                {{ formatCurrency(payment.payment_total, payment.invoice.currency) }}
              </div>
              <div>
                Offener Betrag:
                {{ formatCurrency(outstanding, payment.invoice.currency) }}
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- 2️⃣ Counterparty Information -->
      <div class="sections">
        <div class="sections-title">🏦 Gegenpartei Informationen</div>

        <IbanComponent
          v-model:localNamePartner="payment.counterparty_name"
          v-model:iban="payment.counterparty_iban"
          v-model:bic="payment.counterparty_bic"
          @ibanValid="ibanValid = $event"
          @bicValid="bicValid = $event"
          @update:bank="setBank"
        />
      </div>

      <!-- 3️⃣ Currency -->
      <div class="sections">
        <div class="sections-title">💰 Währung</div>
        <div class="form-group">
          <label class="form-label">Waehrung</label>
          <select v-model="payment.invoice.currency" class="inputs">
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
      <div class="sections">
        <div class="sections-title">💰 Zahlungsdetails</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Zahlungsdatum *</label>
            <!-- Payment Date Input -->
            <input
              ref="date"
              v-model="payment.date"
              type="date"
              class="inputs date"
              @change="checkEarlyPayment"
            />
            <small class="form-hint">Datum des Zahlungseingangs</small>
          </div>

          <div class="form-group">
            <label class="form-label">Betrag (€) *</label>
            <input
              ref="payment_amount"
              v-model="payment.payment_amount"
              type="number"
              class="inputs"
              min="0"
              :disabled="isPaymentAmountDisabled"
              @input="onAmountInput"
            />
            <small v-if="paymentAmountError" class="form-warning"
              >Der Zahlungsbetrag darf den Rechnungsbetrag nicht überschreiten.</small
            >
            <div class="payment-row">
              <div class="form-group">
                <small class="form-label">Rabbat</small>
                <small v-if="is_early_payment_selected">{{
                  payment.invoice.early_payment_discount
                }}</small>
                <small v-else>0</small>
              </div>
              <div class="form-group">
                <small class="form-label">Offener Betrag</small>
                <small>{{ formatCurrency(setOutstanding, payment.invoice.currency) }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Zahlungsmethode</label>
            <select v-model="payment.payment_method" class="inputs">
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
              class="inputs"
              placeholder="z.B. Bankreferenz, Transaktions-ID"
            />
            <small class="form-hint">Optional</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Beleg / Zahlungsnachweis (optional)</label>
            <input type="file" class="inputs" accept=".pdf,image/*" @change="loadImage" />
          </div>

          <div class="form-group">
            <label class="form-label">Ausgewählte Datei</label>
            <img v-if="selectedImage" :src="selectedImage" alt="" class="selected-image" />
            <div v-else>{{ payment.file_name }}</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Notizen (optional)</label>
          <textarea v-model="payment.notes" class="inputs" rows="3"></textarea>
        </div>
      </div>

      <!-- 5️⃣ Preview / Submit -->
      <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
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
      isPaymentAmountDisabled: false,
      is_early_payment_selected: false,
      outstanding: 0
    }
  },
  computed: {
    setOutstanding() {
      return this.outstanding - this.payment.payment_amount
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
          date: null,
          invoice_id: result.rows.id,
          customer_id: result.rows.customer_id,
          is_active: 1,
          payment_amount: '',
          payment_total: result.payment_total,
          payment_method: 'Überweisung',
          payment_reference: '',
          counterparty_name: '',
          counterparty_iban: '',
          counterparty_bic: '',
          counterparty_bank: '',
          notes: '',
          file_name: '',
          invoice: result.rows
        }
        this.outstanding = result.rows.gross_total - result.payment_total
      } catch (error) {
        console.error(error)
      }
    },

    async getStore() {
      // await store.clearStore('payment')
      if (!store.state.payment) return await this.getInvoice()
      this.payment = JSON.parse(JSON.stringify(store.state.payment))
      this.outstanding = this.payment.invoice.gross_total - this.payment.payment_total
      this.selectedImage = this.payment.image_file
      this.checkEarlyPayment()
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
    onAmountInput() {
      if (!this.isCalculating) {
        this.calculateOutstanding()
      }
    },

    calculateOutstanding() {
      if (!this.payment) return 0
      let gross = this.payment.invoice.gross_total
      let paid = this.payment.payment_total
      let amount = Number(this.payment.payment_amount) || 0

      let outstanding
      if (this.is_early_payment_selected) {
        outstanding = 0
      } else {
        outstanding = gross - (paid + amount)
      }
      return Number(outstanding.toFixed(2))
    },

    checkEarlyPayment() {
      if (!this.payment.invoice.early_payment_offer) return
      this.isCalculating = true

      const {
        early_payment_days: earlyDays = 0,
        gross_total: grossTotal = 0,
        gross_total_after_discount: earlyTotal = 0,
        date: invoiceDateRaw
      } = this.payment.invoice

      const invoiceDate = invoiceDateRaw && new Date(invoiceDateRaw)
      const paymentDate = this.payment.date && new Date(this.payment.date)

      const earlyPaymentDate = invoiceDate && new Date(invoiceDate)
      earlyPaymentDate?.setDate(earlyPaymentDate.getDate() + earlyDays)

      this.is_early_payment_selected = paymentDate <= earlyPaymentDate

      this.payment.invoice.early_paid_discount_applied = this.is_early_payment_selected
      this.isPaymentAmountDisabled = this.is_early_payment_selected
      this.outstanding = this.is_early_payment_selected ? earlyTotal : grossTotal

      if (this.is_early_payment_selected) {
        this.payment.payment_amount = earlyTotal
        this.payment.invoice.paid_at = paymentDate
      }

      this.$nextTick(() => {
        this.isCalculating = false // Flag'i kapat
        this.calculateOutstanding()
      })
    },

    setBank(bankName) {
      this.payment.counterparty_bank = bankName
    },
    checkPaymentAmount() {
      if (!this.payment.payment_amount || this.payment.payment_amount < 0) {
        this.$refs.payment_amount.focus()
        return false
      }
      return true
    },
    setPaymentStatus() {
      let result = this.calculateOutstanding()
      if (result === 0) {
        this.payment.invoice.payment_status = 'paid'
        return
      }
      this.payment.invoice.payment_status = 'partially_paid'
    },
    checkPaymentDate() {
      if (!this.payment.date) {
        this.$refs.date.focus()
        return
      }
      return true
    },
    async submitStore() {
      if (!this.checkPaymentDate()) return
      if (!this.checkPaymentAmount()) return
      if (this.setPaymentStatus()) return
      this.payment.image_file = this.selectedImage
      await store.setStore('payment', JSON.parse(JSON.stringify(this.payment)))
      this.$router.push('/payments/preview')
    }
  }
}
</script>
