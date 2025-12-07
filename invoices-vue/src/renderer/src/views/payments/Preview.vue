<template>
  <div>
    <div v-if="paymentPreview && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- Customer Info -->
        <div v-if="paymentPreview.customer" class="recipient">
          <div class="recipient-address">
            <div class="recipient-title">Empfänger</div>
            <div class="company-name-subtitle">{{ paymentPreview.customer.company_name }}</div>
            <div class="meta-label">{{ paymentPreview.customer.address }}</div>
            <div class="meta-label">
              {{ paymentPreview.customer.postal_code }} {{ paymentPreview.customer.city }}<br />
              {{ paymentPreview.customer.country }}
            </div>
          </div>

          <!-- Invoice Details -->
          <div class="recipient-details">
            <div class="recipient-title">Rechnungsdetails</div>
            <div class="meta-row">
              <span class="meta-label">Rechnung-Nr.:</span>
              <span class="meta-value">{{ formatInvoiceId(paymentPreview.id) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(paymentPreview.date) }}</span>
            </div>
            <div v-if="paymentPreview.service_date" class="meta-row">
              <span class="meta-label">Leistungsdatum:</span>
              <span class="meta-value">{{ formatDate(paymentPreview.service_date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{ formatCustomerId(paymentPreview.customer.id) }}</span>
            </div>
            <div
              v-if="
                paymentPreview.customer.country === 'Germany' && paymentPreview.customer.tax_number
              "
              class="meta-row"
            >
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ paymentPreview.customer.tax_number }}</span>
            </div>
            <div
              v-else-if="paymentPreview.customer.is_in_eu && paymentPreview.customer.vat_id"
              class="meta-row"
            >
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ paymentPreview.customer.vat_id }}</span>
            </div>
            <div
              v-else-if="!paymentPreview.customer.is_in_eu && paymentPreview.customer.vat_id"
              class="meta-row"
            >
              <span class="meta-label">VAT ID:</span>
              <span class="meta-value">{{ paymentPreview.customer.vat_id }}</span>
            </div>
          </div>
        </div>

        <!-- Payments Table -->
        <div
          v-if="paymentPreview.payments && paymentPreview.payments.length"
          class="payments-table-section"
        >
          <h3>Zahlungen</h3>
          <table class="payments-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Gezahlter Betrag</th>
                <th>Offener Betrag</th>
                <th>Zahlungsmethode</th>
                <th>Referenz</th>
                <th>Gegenpartei</th>
                <th>IBAN</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in paymentPreview.payments" :key="payment.id">
                <td>{{ formatDate(payment.payment_date) }}</td>
                <td>{{ formatCurrency(payment.paid_amount, payment.currency) }}</td>
                <td>{{ formatCurrency(payment.outstanding_amount, payment.currency) }}</td>
                <td>{{ payment.payment_method }}</td>
                <td>{{ payment.payment_reference }}</td>
                <td>{{ payment.counterparty_name }}</td>
                <td>{{ payment.counterparty_iban }}</td>
                <td>
                  <button @click="openPaymentModal(payment)">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal -->
        <div v-if="selectedPayment" class="modal-overlay" @click.self="closePaymentModal">
          <div class="modal">
            <h3>Payment Details</h3>
            <table class="modal-table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{{ selectedPayment.id }}</td>
                </tr>
                <tr>
                  <td>Invoice ID</td>
                  <td>{{ selectedPayment.invoice_id }}</td>
                </tr>
                <tr>
                  <td>Customer ID</td>
                  <td>{{ selectedPayment.customer_id }}</td>
                </tr>
                <tr>
                  <td>Invoice Date</td>
                  <td>{{ selectedPayment.invoice_date }}</td>
                </tr>
                <tr>
                  <td>Invoice Due Date</td>
                  <td>{{ selectedPayment.invoice_due_date }}</td>
                </tr>
                <tr>
                  <td>Invoice Total</td>
                  <td>
                    {{ formatCurrency(selectedPayment.invoice_total, selectedPayment.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Currency</td>
                  <td>{{ selectedPayment.currency }}</td>
                </tr>
                <tr>
                  <td>Payment Date</td>
                  <td>{{ formatDate(selectedPayment.payment_date) }}</td>
                </tr>
                <tr>
                  <td>Paid Amount</td>
                  <td>
                    {{ formatCurrency(selectedPayment.paid_amount, selectedPayment.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Outstanding Amount</td>
                  <td>
                    {{
                      formatCurrency(selectedPayment.outstanding_amount, selectedPayment.currency)
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>{{ selectedPayment.payment_method }}</td>
                </tr>
                <tr>
                  <td>Payment Reference</td>
                  <td>{{ selectedPayment.payment_reference }}</td>
                </tr>
                <tr>
                  <td>Counterparty Name</td>
                  <td>{{ selectedPayment.counterparty_name }}</td>
                </tr>
                <tr>
                  <td>Counterparty IBAN</td>
                  <td>{{ selectedPayment.counterparty_iban }}</td>
                </tr>
                <tr>
                  <td>Notes</td>
                  <td>{{ selectedPayment.notes }}</td>
                </tr>
                <tr>
                  <td>Is Partially Paid</td>
                  <td>{{ selectedPayment.is_partially_paid }}</td>
                </tr>
                <tr>
                  <td>Is Paid</td>
                  <td>{{ selectedPayment.is_paid }}</td>
                </tr>
                <tr>
                  <td>File Name</td>
                  <td>{{ selectedPayment.file_name }}</td>
                </tr>
                <tr>
                  <td>Created At</td>
                  <td>{{ selectedPayment.created_at }}</td>
                </tr>
                <tr>
                  <td>Updated At</td>
                  <td>{{ selectedPayment.updated_at }}</td>
                </tr>
              </tbody>
            </table>
            <button class="close-button" @click="closePaymentModal">Close</button>
          </div>
        </div>

        <!-- Contact Person -->
        <ContactPersonPreview :contactData="auth.contact_person" />

        <!-- Bank Info -->
        <div class="bank-box">
          <div class="bank-title">🏦 Bankverbindung</div>
          <div class="bank-info">
            <span class="bank-label">Bank:</span>
            <span class="bank-value">{{ auth.bank_name }}</span>
            <span class="bank-label">IBAN:</span>
            <span class="bank-value">{{ auth.iban }}</span>
            <span class="bank-label">BIC:</span>
            <span class="bank-value">{{ auth.bic }}</span>
          </div>
        </div>

        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="paymentPreview"
        :tableData="paymentPreview"
        sourcePage="preview"
      />
    </div>

    <router-link to="/invoices/create" class="back-link">
      ← Zurück zur Zahlungerstellung
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/invoices/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/invoices/ContactPersonPreview.vue'
import ActionsButtonPreview from '../../components/payments/ActionsButtonPreview.vue'
import FooterSidePreview from '../../components/invoices/FooterSidePreview.vue'

export default {
  name: 'PaymentPreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    ActionsButtonPreview,
    FooterSidePreview
  },
  inject: [
    'formatPaymentId',
    'formatCustomerId',
    'formatDate',
    'formatCurrency',
    'formatInvoiceId'
  ],
  data() {
    return {
      title: 'Zahlungbestätigung',
      paymentPreview: null,
      auth: null,
      selectedPayment: null
    }
  },
  mounted() {
    this.getPaymentPreview()
    this.getAuth()
  },
  methods: {
    getPaymentPreview() {
      if (!store.state.payment) return
      this.paymentPreview = store.state.payment
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    },
    openPaymentModal(payment) {
      this.selectedPayment = payment
    },
    closePaymentModal() {
      this.selectedPayment = null
    }
  }
}
</script>

<style scoped>
/* Payments Table */
.payments-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-family: Arial, sans-serif;
}
.payments-table th {
  background-color: #f3f3f3;
  font-weight: bold;
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid #ccc;
}
.payments-table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
.payments-table tbody tr:hover {
  background-color: #fafafa;
}
.payments-table button {
  padding: 4px 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.payments-table button:hover {
  background-color: #0056b3;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}
.modal-table td {
  padding: 6px;
  border-bottom: 1px solid #eee;
}
.close-button {
  margin-top: 1rem;
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.close-button:hover {
  background-color: #a71d2a;
}
</style>
