<template>
  <div  >
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
          <div v-if="selectedInvoice" class="customer-details" style="margin-top: 16px">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Kunde</label>
                <input type="text" class="form-input" :value="selectedInvoice.customer" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Fakturennummer</label>
                <input type="text" class="form-input" :value="selectedInvoice.id" readonly />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnungsdatum</label>
                <input type="text" class="form-input" :value="selectedInvoice.date" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Fälligkeitsdatum</label>
                <input type="text" class="form-input" :value="selectedInvoice.due_date" readonly />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnungsbetrag</label>
                <input
                  type="text"
                  class="form-input"
                  :value="`€${selectedInvoice.total.toFixed(2)}`"
                  readonly
                />
              </div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <input
                  type="text"
                  class="form-input"
                  :value="selectedInvoice.paid ? 'Bezahlt' : 'Offen'"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Zahlungsdetails -->
        <div class="form-section">
          <div class="form-section-title">💰 Zahlungsdetails</div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zahlungsdatum <span class="stars">*</span></label>
              <input type="date" class="form-input" v-model="payment.payment_date" />
              <small class="form-hint">Datum des Zahlungseingangs</small>
            </div>
            <div class="form-group">
              <label class="form-label">Betrag (€) <span class="stars">*</span></label>
              <input type="number" step="0.01" class="form-input" v-model.number="payment.amount" />
              <small class="form-hint">Eingegangener Betrag</small>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Zahlungsmethode</label>
            <select class="form-input" v-model="payment.payment_method">
              <option>Überweisung</option>
              <option>Bar</option>
              <option>PayPal</option>
              <option>Kreditkarte</option>
              <option>Lastschrift</option>
              <option>Scheck</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zahlungsreferenz</label>
              <input
                type="text"
                class="form-input"
                v-model="payment.reference"
                placeholder="z.B. Bankreferenz, Transaktions-ID"
              />
              <small class="form-hint">Optional: Referenznummer der Zahlung</small>
            </div>
            <div class="form-group">
              <label class="form-label">Belegnummer / Dokument</label>
              <input
                type="text"
                class="form-input"
                v-model="payment.document_number"
                placeholder="z.B. Überweisungsbeleg Nr."
              />
              <small class="form-hint">Optional: Beleg zur Nachverfolgung</small>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Notizen (optional)</label>
            <textarea
              class="form-input"
              rows="3"
              placeholder="z.B. Teilzahlung, verspätete Zahlung, etc."
              v-model="payment.notes"
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="payment.partial" />
              Teilzahlung
            </label>
          </div>
        </div>

        <!-- Aktionen -->
        <button @click="handleSubmit" class="preview-btn">✅ Zahlung erfassen</button>
        <button @click="handleCancel" class="btn btn-secondary" style="margin-left: 8px">
          ❌ Abbrechen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedInvoice: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      payment: {
        payment_date: '',
        amount: null,
        payment_method: 'Überweisung',
        reference: '',
        document_number: '',
        notes: '',
        partial: false
      }
    }
  },
  methods: {
    handleSubmit() {
      if (!this.payment.payment_date || !this.payment.amount) {
        alert('Bitte Zahlungsdatum und Betrag eingeben.')
        return
      }
      // Burada backend'e payment kaydı gönderebilirsin
      const payload = {
        invoice_id: this.selectedInvoice.id,
        ...this.payment
      }
      console.log('Payment submitted:', payload)
      alert('Zahlung erfasst!')
    },
    handleCancel() {
      // Formu temizleme veya sayfadan çıkma
      this.payment = {
        payment_date: '',
        amount: null,
        payment_method: 'Überweisung',
        reference: '',
        document_number: '',
        notes: '',
        partial: false
      }
    }
  }
}
</script>

<style>
.form-section {
  margin-top: 20px;
}
.form-section-title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 1.1rem;
}
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
.form-label {
  margin-bottom: 4px;
  font-weight: 500;
}
.form-input {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.stars {
  color: red;
}
.preview-btn {
  margin-top: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}
.preview-btn:hover {
  background-color: #45a049;
}
.btn-secondary {
  margin-top: 16px;
  background-color: #ccc;
  color: black;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #bbb;
}
</style>
