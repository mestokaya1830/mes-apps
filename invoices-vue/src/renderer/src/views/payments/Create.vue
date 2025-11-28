<template>
  <div>
    <!-- Zahlung erfassen Panel -->
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">💳 Zahlung erfassen</div>
        <div class="editor-subtitle">
          Erfassen Sie eingehende Zahlungen für die ausgewählte Rechnung
        </div>
      </div>

      <div>
        <!-- Rechnung auswählen (readonly) -->
        <div class="form-section">
          <div class="form-section-title">📄 Ausgewählte Rechnung</div>
          <div v-if="invoice" class="customer-details" style="margin-top: 16px">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnung-Nr.:</label>
                <label class="form-input">{{ formatRechnungId(invoice.id) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Kunden-Nr.:</label>
                <label class="form-input">{{
                  formatCustomerId(invoice.customer_id)
                }}</label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnungsdatum</label>
                <label class="form-input">{{ formatDate(invoice.date) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Fälligkeitsdatum</label>
                <label class="form-input">{{ formatDate(invoice.due_date) }}</label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-input">
                <div>
                  Gesamtsumme:
                  {{ formatCurrency(invoice.total, invoice.currency) }}
                </div>
                <div>
                  Teilbezahlt:
                  {{ formatCurrency(invoice.paid_amount, invoice.currency) }}
                </div>
                <div>
                  Offener Betrag:
                  {{ formatCurrency((invoice.total - invoice.paid_amount), invoice.currency) }}
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Zahlungsdetails -->
        <div class="form-section">
          <div class="form-section-title">💰 Zahlungsdetails</div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zahlungsdatum <span class="stars">*</span></label>
              <input v-model="payment.payment_date" type="date" class="form-input" />
              <small class="form-hint">Datum des Zahlungseingangs</small>
            </div>
            <div class="form-group">
              <label class="form-label">Betrag (€) <span class="stars">*</span></label>
              <input
                v-model.number="payment.amount"
                type="number"
                step="0.01"
                class="form-input"
                @input="checkAmount"
              />
              <small class="form-hint">Eingegangener Betrag</small>
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
                v-model="payment.reference"
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
              <input
                type="file"
                class="form-input"
                accept=".pdf,image/*"
                @change="loadImage"
              />
              <small class="form-hint">PDF, JPG, PNG</small>
            </div>
            <div class="form-group">
              <label class="form-label">Ausgewählte Bild</label>
              <img :src="selectedImage" alt="" class="payment-image" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Notizen (optional)</label>
            <textarea v-model="payment.notes" class="form-input" rows="3"></textarea>
          </div>
        </div>

        <!-- Zahlungsübersicht -->
        <!-- <div v-if="invoice" class="form-section">
          <div class="form-section-title">📊 Zahlungsübersicht</div>
          <div class="form-group">
            <div>
              Gesamtbetrag: {{ formatCurrency(invoice.invoice_total, invoice.invoice_currency) }}
            </div>
            <div>
              Bisher gezahlt:
              {{ formatCurrency(invoice.invoice_paid_amount, invoice.invoice_currency) }}
            </div>
            <div>
              Aktuelle Zahlung: {{ formatCurrency(payment.amount, invoice.invoice_currency) }}
            </div>
            <div>
              Verbleibender Betrag: {{ formatCurrency(remainingAmount, invoice.invoice_currency) }}
            </div>
            <div>
              Status:
              <span v-if="remainingAmount === invoice.invoice_total">Nicht bezahlt</span>
              <span v-else-if="remainingAmount > 0">Teilweise bezahlt</span>
              <span v-else>Vollständig bezahlt</span>
            </div>
          </div>
        </div> -->

        <!-- Aktionen -->
        <button class="preview-btn" @click="saveDocument">✅ Zahlung erfassen</button>
        <button class="btn btn-secondary" @click="formReset">❌ Abbrechen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      payment: {
        payment_date: '',
        amount: 0,
        payment_method: 'Überweisung',
        reference: '',
        notes: '',
        is_partially_paid: 0,
        is_paid: 0,
        file_name: ''
      },
      invoice: null,
      remainingAmount: 0,
      selectedImage: ''
    }
  },
  mounted() {
    this.getInvoice()
  },
  methods: {
    async getInvoice() {
      const id = this.$route.params.id
      try {
        const result = await window.api.getDocumentById(id, 'invoices')
        if (!result.rows) return
        this.invoice = {
          id: result.rows[0].invoice_id,
          customer_id: result.rows[0].invoice_customer_id,
          date: result.rows[0].invoice_date,
          due_date: result.rows[0].due_date,
          currency: result.rows[0].currency,
          paid_amount: result.rows[0].amount,
          total: result.rows[0].total 
        }
        console.log(this.invoice)
      } catch (error) {
        console.error(error)
      }
      console.log(this.invoice)
    },
    formatRechnungId(id) {
      if (!id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(id).padStart(5, '0')}`
    },
    checkAmount() {
      if (this.payment.amount > this.invoice.invoice_outstanding) {
        this.payment.amount = this.invoice.invoice_outstanding
        alert('Zahlung kann den offenen Betrag nicht überschreiten.')
      }
      if (this.payment.amount < this.invoice.invoice_outstanding) {
        this.payment.is_partially_paid = true
      }
      this.updateSummary()
    },
    updateSummary() {
      const alreadyPaid = this.invoice.invoice_paid_amount || 0
      const currentPayment = this.payment.amount || 0
      const total = this.invoice.invoice_total || 0
      this.remainingAmount = Math.max(total - (alreadyPaid + currentPayment), 0)
    },
    formReset() {
      this.payment.payment_date = ''
      this.payment.amount = 0
      this.payment.payment_method = 'Überweisung'
      this.payment.reference = ''
      this.payment.notes = ''
      this.payment.is_partially_paid = false
    },
    loadImage(event) {
      const file = event.target.files[0]
      if (!file) return

      //convert image-file to base64
      const reader = new FileReader()
      reader.onload = () => {
        this.selectedImage = reader.result
        const now = new Date()
        const dateStr =
          now.getFullYear() +
          (now.getMonth() + 1).toString().padStart(2, '0') +
          now.getDate().toString().padStart(2, '0') +
          now.getHours().toString().padStart(2, '0') +
          now.getMinutes().toString().padStart(2, '0')
        this.payment.file_name = `${this.invoice.invoice_id}-${dateStr}.${file.name.split('.')[1]}`
      }
      reader.readAsDataURL(file)
    },
    async saveDocument() {
      if (!this.payment.payment_date || !this.payment.amount) {
        alert('Bitte Zahlungsdatum und Betrag eingeben.')
        return
      }
      this.payment = {
        invoice_id: this.invoice.invoice_id,
        invoice_customer_id: this.invoice.invoice_customer_id,
        ...this.payment
      }
      const result = await window.api.savePayment(
        JSON.parse(JSON.stringify(this.payment)),
        this.payment.file_name,
        this.selectedImage
      )
      if (result.success) {
        this.$router.push('/invoices')
      }
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
