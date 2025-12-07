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
          <div v-if="payment" class="customer-details" style="margin-top: 16px">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnung-Nr.:</label>
                <label class="form-input">{{ formatInvoiceId(payment.invoice_id) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Kunden-Nr.:</label>
                <label class="form-input">{{ formatCustomerId(payment.customer_id) }}</label>
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
                  Gesamtsumme: {{ formatCurrency(payment.invoice_total, payment.currency) }}
                </div>
                <div>
                  Bereits gezahlt:
                  {{ formatCurrency(paid_total_amount, payment.currency) }}
                </div>
                <div>
                  Offener Betrag: {{ formatCurrency(payment.outstanding_amount, payment.currency) }}
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Counterparty Info -->
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
        <!-- currency -->
        <div class="form-section">
          <div class="form-section-title">💰 Währung</div>
          <div class="form-group">
            <label class="form-label">Waehrung</label>
            <select v-model="payment.currency" class="form-input">
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
            <input v-model="payment.payment_date" type="date" class="form-input" />
            <small class="form-hint">Datum des Zahlungseingangs</small>
          </div>
          <div class="form-group">
            <label class="form-label">Betrag (€) <span class="stars">*</span></label>
            <input
              ref="paid_amount"
              v-model="payment.paid_amount"
              type="number"
              class="form-input"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <small class="form-label">Rechnungsbetrag</small>
              <small>{{ payment.invoice_total }}</small>
            </div>

            <div class="form-group">
              <small class="form-label">Bezahlter Betrag</small>
              <small>{{ payment.paid_amount }}</small>
            </div>

            <div class="form-group">
              <small class="form-label">Offener Betrag</small>
              <small>{{ checkOutstandingAmount }}</small>
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

          <div v-if="payment.is_paid || payment.is_partially_paid" class="form-row">
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
      payment: {
        invoice_id: this.$route.params.id,
        customer_id: '',
        invoice_date: '',
        invoice_due_date: '',
        currency: 'EUR.de-DE',
        payment_date: '',
        invoice_total: 0,
        paid_amount: 0,
        outstanding_amount: 0,
        payment_method: 'Überweisung',
        payment_reference: '',
        counterparty_name: '',
        counterparty_iban: '',
        notes: '',
        is_partially_paid: 1,
        is_paid: 0,
        file_name: ''
      },
      selectedImage: '',
      paid_total_amount: 0
    }
  },
  computed: {
    checkOutstandingAmount() {
      if (!this.payment.paid_amount || !this.payment.outstanding_amount) return
      if (this.payment.paid_amount > this.payment.outstanding_amount) return 0
      return (this.payment.outstanding_amount - this.payment.paid_amount).toFixed(2)
    }
  },
  mounted() {
    this.getInvoice()
  },
  methods: {
    async getInvoice() {
      // await store.clearStore('payment')
      const id = this.$route.params.id
      try {
        if (store.state.payment) {
          this.payment = JSON.parse(JSON.stringify(store.state.payment))
          this.selectedImage = this.payment.image_file
          this.payment.outstanding_amount = this.payment.invoice_total
          return
        }
        const result = await window.api.getInvoiceById(id)
        if (!result.rows) return
        this.payment.id = result.last_id + 1 
        this.payment.invoice_id = result.rows.id
        this.payment.customer_id = JSON.parse(result.rows.customer).id
        this.payment.invoice_date = result.rows.date
        this.payment.invoice_due_date = result.rows.due_date
        this.payment.currency = result.rows.currency
        this.payment.invoice_total = result.rows.gross_total || 0
        this.payment.paid_amount = 0
        this.payment.outstanding_amount = Number(result.rows.gross_total - 0).toFixed(2) //0 is paid_total and will come from the db

        if (!this.payment) return
        this.paid_total_amount = (
          this.payment.invoice_total - this.payment.outstanding_amount
        ).toFixed(2)
      } catch (error) {
        console.error(error)
      }
    },
    formReset() {
      this.payment = {
        payment_date: '',
        amount: 0,
        payment_method: 'Überweisung',
        payment_reference: '',
        counterparty_name: '',
        counterparty_iban: '',
        notes: '',
        is_partially_paid: 1,
        is_paid: 0,
        file_name: ''
      }
      this.selectedImage = ''
    },
    loadImage(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        this.selectedImage = reader.result
        const d = new Date()
        this.payment.file_name = `${this.payment.id}-${d.getTime()}.${file.name.split('.').pop()}`
      }
      reader.readAsDataURL(file)
    },
    summary() {
      if (!this.payment.paid_amount || this.payment.paid_amount == 0) {
        this.$refs.paid_amount.focus()
        return
      }
      if (this.payment.paid_amount > this.payment.outstanding_amount) {
        console.error('Zahlung kann den offenen Betrag nicht überschreiten.')
        this.$refs.paid_amount.focus()
        return
      }

      this.payment.outstanding_amount = Number(
        this.payment.outstanding_amount - this.payment.paid_amount
      ).toFixed(2)

      if (this.payment.outstanding_amount <= 0) this.payment.is_paid = 1
      this.payment.is_partially_paid += 1
      return true
    },
    async submitStore() {
      if (!this.summary()) return
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
</style>
