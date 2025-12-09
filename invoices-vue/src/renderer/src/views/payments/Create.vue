<template>
  <div>
    <!-- Zahlung erfassen Panel -->
    <div v-if="payment" class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">💳 {{ title }}</div>
        <div class="editor-subtitle">
          Erfassen Sie eingehende Zahlungen für die ausgewählte Rechnung
        </div>
      </div>

      <div>
        <!-- Rechnung auswählen (readonly) -->
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
                  Gesamtsumme: {{ formatCurrency(payment.invoice.gross_total, payment.currency) }}
                </div>
                <div>
                  Bereits gezahlt:
                  {{ formatCurrency(payment.previously_paid_amount, payment.currency) }}
                </div>
                <div>
                  Offener Betrag:
                  {{
                    formatCurrency(
                      payment.invoice.gross_total - (payment.previously_paid_amount || 0),
                      payment.currency
                    )
                  }}
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Gegenpartei Informationen -->
        <div class="form-section">
          <div class="form-section-title">🏦 Gegenpartei Informationen</div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Name der Gegenpartei</label>
              <input
                v-model="payment.counterparty_name"
                type="text"
                class="form-input"
                placeholder="z.B. Kunde / Lieferant"
              />
            </div>
            <div class="form-group">
              <label class="form-label">IBAN der Gegenpartei</label>
              <input
                v-model="payment.counterparty_iban"
                type="text"
                class="form-input"
                placeholder="DE00 0000 0000 0000 0000 00"
              />
            </div>
          </div>
        </div>

        <!-- Währung -->
        <div class="form-section">
          <div class="form-section-title">💰 Währung</div>
          <div class="form-group">
            <label class="form-label">Waehrung</label>
            <select v-model="payment.invoice.currency" class="form-input">
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

        <!-- Zahlungsdetails -->
        <div class="form-section">
          <div class="form-section-title">💰 Zahlungsdetails</div>

          <div class="form-group">
            <label class="form-label">Zahlungsdatum <span class="stars">*</span></label>
            <input
              v-model="payment.payment_date"
              type="date"
              class="form-input"
              @input="updateOutstandingAmount"
            />
            <small class="form-hint">Datum des Zahlungseingangs</small>
          </div>

          <div class="form-group">
            <label class="form-label">Betrag (€) <span class="stars">*</span></label>
            <input
              ref="paid_amount"
              v-model="payment.paid_amount"
              type="number"
              class="form-input"
              @input="updateOutstandingAmount"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <small class="form-label">Rabbat</small>
              <small v-if="payment.is_early_paid">{{ payment.invoice.early_payment_discount }}</small>
              <small v-else>0</small>
            </div>
            <div class="form-group">
              <small class="form-label">Offener Betrag</small>
              <small>{{ payment.outstanding_amount }}</small>
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

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zahlungsstatus:</label>
              <div>
                <span v-if="payment.is_paid">✔ Vollständig bezahlt</span>
                <span v-else-if="payment.is_partially_paid">⚠ Teilweise bezahlt</span>
              </div>
            </div>
          </div>
        </div>

        <!-- preview button -->
        <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store/store'
export default {
  inject: ['formatInvoiceId', 'formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Zahlung erfassen',
      payment: null,
      selectedImage: ''
    }
  },
  mounted() {
    this.getInvoice()
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
          payment_date: '',
          previously_paid_amount: result.previously_paid_amount || 0,
          paid_amount: 0,
          payment_method: 'Überweisung',
          payment_reference: '',
          payment_status: 'partially_paid',
          notes: '',
          is_early_paid: false,
          counterparty_name: '',
          counterparty_iban: '',
          file_name: '',
          invoice: result.rows
        }

        this.payment.outstanding_amount = (
          this.payment.invoice.gross_total - this.payment.previously_paid_amount
        ).toFixed(2)

        console.log('rows', this.payment)
        // console.log('payment', this.payment)
      } catch (error) {
        console.error(error)
      }
    },

    getStore() {
      if (!store.state.payment) return
      this.payment = JSON.parse(JSON.stringify(store.state.payment))
      this.selectedImage = this.payment.image_file
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
    updateOutstandingAmount() {
      if (!this.payment || !this.payment.invoice) return

      // Tarih kontrolü
      if (this.payment.payment_date && this.payment.invoice.due_date) {
        const paymentDate = new Date(this.payment.payment_date)
        const dueDate = new Date(this.payment.invoice.due_date)
        const earlyPaymentDate = new Date(paymentDate)
        earlyPaymentDate.setDate(
          earlyPaymentDate.getDate() + (this.payment.invoice.early_payment_days || 0)
        )
        this.payment.is_early_paid = earlyPaymentDate < dueDate
      }

      // Outstanding amount hesaplama
      const grossTotal = this.payment.invoice.gross_total || 0
      const paidAmount = Number(this.payment.paid_amount || 0)
      const earlyDiscount = this.payment.is_early_paid
        ? Number(this.payment.invoice.early_payment_discount || 0)
        : 0

      this.payment.outstanding_amount = (grossTotal - paidAmount - earlyDiscount).toFixed(2)
    },
    checkInputPayment() {
      if (!this.payment.paid_amount || this.payment.paid_amount <= 0) {
        this.$refs.paid_amount.focus()
        return false
      }
    },

    checkIsPaid() {
      if (this.payment.outstanding_amount == 0) {
        this.payment.is_paid = 1
        this.payment.is_partially_paid = 0
      } else if (this.payment.outstanding_amount < this.payment.invoice_total) {
        this.payment.is_paid = 0
        this.payment.is_partially_paid = 1
      } else {
        this.payment.is_paid = 0
        this.payment.is_partially_paid = 0
      }
    },

    async submitStore() {
      if (!this.checkInputPayment()) return
      this.checkIsPaid()
      this.payment.image_file = this.selectedImage
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
</style>
