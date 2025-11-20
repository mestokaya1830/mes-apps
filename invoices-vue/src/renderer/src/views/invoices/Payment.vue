<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 20px">
    <!-- Zahlung erfassen Panel -->
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">💳 Zahlung erfassen</div>
        <div class="editor-subtitle">Erfassen Sie eingehende Zahlungen für offene Rechnungen</div>
      </div>

      <div>
        <!-- Rechnung auswählen -->
        <div class="form-section">
          <div class="form-section-title">📄 Rechnung auswählen</div>
          <div class="form-group">
            <label class="form-label"> Offene Rechnung <span class="stars">*</span> </label>
            <select v-model="payment.invoice_id" @change="handleInvoiceSelect" class="form-input">
              <option value="">Rechnung wählen...</option>
              <option v-for="invoice in invoices" :key="invoice.id" :value="invoice.id">
                {{ invoice.number }} - {{ invoice.customer }} (€{{ invoice.total.toFixed(2) }})
              </option>
            </select>
            <small class="form-hint">
              Wählen Sie die Rechnung, für die die Zahlung eingegangen ist
            </small>
          </div>

          <div v-if="selectedInvoice" class="customer-details" style="margin-top: 16px">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Kunde</label>
                <input type="text" class="form-input" :value="selectedInvoice.customer" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Rechnungsdatum</label>
                <input type="text" class="form-input" :value="selectedInvoice.date" readonly />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Fälligkeitsdatum</label>
                <input type="text" class="form-input" :value="selectedInvoice.due_date" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Rechnungsbetrag</label>
                <input
                  type="text"
                  class="form-input"
                  :value="`€${selectedInvoice.total.toFixed(2)}`"
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
              <label class="form-label"> Zahlungsdatum <span class="stars">*</span> </label>
              <input type="date" class="form-input" v-model="payment.payment_date" />
              <small class="form-hint">Datum des Zahlungseingangs</small>
            </div>
            <div class="form-group">
              <label class="form-label"> Betrag (€) <span class="stars">*</span> </label>
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

          <div class="form-group">
            <label class="form-label">Notizen (optional)</label>
            <textarea
              class="form-input"
              rows="3"
              placeholder="z.B. Teilzahlung, verspätete Zahlung, etc."
              v-model="payment.notes"
            ></textarea>
          </div>
        </div>

        <button @click="handleSubmit" class="preview-btn">✅ Zahlung erfassen</button>
      </div>
    </div>

    <!-- Erfasste Zahlungen Panel -->
    <div class="editor-panel" style="margin-top: 24px">
      <div class="editor-header">
        <div class="editor-title">📊 Erfasste Zahlungen</div>
        <div class="editor-subtitle">Übersicht aller erfassten Zahlungseingänge</div>
      </div>

      <div class="form-section">
        <p v-if="payments.length === 0" style="text-align: center; color: #6b7280; padding: 20px">
          Keine Zahlungen erfasst
        </p>
        <div v-else style="overflow-x: auto">
          <table style="width: 100%; border-collapse: collapse">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb">
                <th
                  style="
                    padding: 12px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4b5563;
                  "
                >
                  Rechnung
                </th>
                <th
                  style="
                    padding: 12px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4b5563;
                  "
                >
                  Kunde
                </th>
                <th
                  style="
                    padding: 12px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4b5563;
                  "
                >
                  Zahlungsdatum
                </th>
                <th
                  style="
                    padding: 12px;
                    text-align: right;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4b5563;
                  "
                >
                  Betrag
                </th>
                <th
                  style="
                    padding: 12px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4b5563;
                  "
                >
                  Methode
                </th>
                <th
                  style="
                    padding: 12px;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4b5563;
                  "
                >
                  Aktion
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pmt in payments" :key="pmt.id" style="border-bottom: 1px solid #e5e7eb">
                <td style="padding: 12px; font-size: 13px">{{ pmt.invoice_number }}</td>
                <td style="padding: 12px; font-size: 13px">{{ pmt.customer }}</td>
                <td style="padding: 12px; font-size: 13px">{{ pmt.payment_date }}</td>
                <td style="padding: 12px; font-size: 13px; text-align: right; font-weight: 600">
                  €{{ pmt.amount.toFixed(2) }}
                </td>
                <td style="padding: 12px; font-size: 13px">{{ pmt.payment_method }}</td>
                <td style="padding: 12px; text-align: center">
                  <button
                    @click="deletePayment(pmt.id)"
                    class="delete-position-btn"
                    style="font-size: 18px"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Invoices',
  data() {
    return {
      invoices: [],
      selectedInvoice: null,
      payment: {
        invoice_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        amount: 0,
        payment_method: 'Überweisung',
        notes: ''
      },
      payments: []
    }
  },
  mounted() {
    // Mock data
    this.invoices = [
      {
        id: 1,
        number: 'RE-2025-00001',
        date: '2025-01-15',
        customer: 'Max Mustermann GmbH',
        total: 1500.0,
        due_date: '2025-02-15'
      },
      {
        id: 2,
        number: 'RE-2025-00002',
        date: '2025-01-20',
        customer: 'Tech Solutions AG',
        total: 3200.0,
        due_date: '2025-02-20'
      },
      {
        id: 3,
        number: 'RE-2025-00003',
        date: '2025-01-25',
        customer: 'Design Studio Berlin',
        total: 850.0,
        due_date: '2025-02-25'
      }
    ]

    this.payments = [
      {
        id: 1,
        invoice_number: 'RE-2025-00001',
        payment_date: '2025-02-10',
        amount: 1500.0,
        payment_method: 'Überweisung',
        customer: 'Max Mustermann GmbH'
      }
    ]
  },
  methods: {
    handleInvoiceSelect() {
      const invoiceId = parseInt(this.payment.invoice_id)
      const invoice = this.invoices.find((inv) => inv.id === invoiceId)
      this.selectedInvoice = invoice
      this.payment.amount = invoice?.total || 0
    },
    handleSubmit() {
      if (!this.payment.invoice_id) {
        alert('Bitte wählen Sie eine Rechnung aus')
        return
      }

      const newPayment = {
        id: this.payments.length + 1,
        invoice_number: this.selectedInvoice.number,
        customer: this.selectedInvoice.customer,
        ...this.payment
      }

      this.payments.push(newPayment)

      // Reset form
      this.payment = {
        invoice_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        amount: 0,
        payment_method: 'Überweisung',
        notes: ''
      }
      this.selectedInvoice = null

      alert('Zahlung erfolgreich erfasst!')
    },
    deletePayment(id) {
      if (confirm('Möchten Sie diese Zahlung wirklich löschen?')) {
        this.payments = this.payments.filter((p) => p.id !== id)
      }
    }
  }
}
</script>

<style>
.editor-panel {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.editor-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.editor-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-input[readonly] {
  background: #f3f4f6;
  color: #6b7280;
}

.form-hint {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
}

.customer-details {
  background: white;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.preview-btn {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  background: #2196f3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.preview-btn:hover {
  background: #1976d2;
}

.delete-position-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  transition: color 0.2s ease;
}

.delete-position-btn:hover {
  color: #dc2626;
}

.stars {
  color: darkred;
  font-size: 16px;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}
</style>
<!-- <template>
  <div class="form-group">
    <label class="form-label">Zahlungsmethode <span class="stars">*</span></label>
    <select v-model="payment.payment_method" class="form-input" required>
      <option value="" disabled>Zahlungsmethode wählen...</option>
      <option v-for="method in paymentMethods" :key="method.value" :value="method.value">
        {{ method.label }}
      </option>
    </select>
    <small class="form-hint">Wie wurde die Zahlung eingegangen?</small>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payment: {
        payment_method: 'Überweisung'
      },
      paymentMethods: [
        { value: 'Überweisung', label: 'Überweisung (Banküberweisung)' },
        { value: 'Lastschrift', label: 'Lastschrift (SEPA Direct Debit)' },
        { value: 'Bar', label: 'Bar (Barzahlung)' },
        { value: 'EC-Karte', label: 'EC-Karte / Girocard' },
        { value: 'Kreditkarte', label: 'Kreditkarte (Visa/Mastercard)' },
        { value: 'PayPal', label: 'PayPal' },
        { value: 'Sofortüberweisung', label: 'Sofortüberweisung / Klarna' },
        { value: 'Scheck', label: 'Scheck' }
      ]
    }
  }
}
</script> -->
