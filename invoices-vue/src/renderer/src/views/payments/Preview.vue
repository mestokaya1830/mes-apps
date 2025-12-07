<template>
  <div>
    <div v-if="paymentPreview && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />
        <!-- Modal -->
        <div>
          <div class="modal">
            <h3>Payment Details</h3>
            <table class="modal-table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{{ paymentPreview.id }}</td>
                </tr>
                <tr>
                  <td>Invoice ID</td>
                  <td>{{ paymentPreview.invoice_id }}</td>
                </tr>
                <tr>
                  <td>Customer ID</td>
                  <td>{{ paymentPreview.customer_id }}</td>
                </tr>
                <tr>
                  <td>Invoice Date</td>
                  <td>{{ paymentPreview.invoice_date }}</td>
                </tr>
                <tr>
                  <td>Invoice Due Date</td>
                  <td>{{ paymentPreview.invoice_due_date }}</td>
                </tr>
                <tr>
                  <td>Invoice Total</td>
                  <td>
                    {{ formatCurrency(paymentPreview.invoice_total, paymentPreview.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Currency</td>
                  <td>{{ paymentPreview.currency }}</td>
                </tr>
                <tr>
                  <td>Payment Date</td>
                  <td>{{ formatDate(paymentPreview.paymentPreview_date) }}</td>
                </tr>
                <tr>
                  <td>Paid Amount</td>
                  <td>
                    {{ formatCurrency(paymentPreview.paid_amount, paymentPreview.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Outstanding Amount</td>
                  <td>
                    {{ formatCurrency(paymentPreview.outstanding_amount, paymentPreview.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>{{ paymentPreview.payment_method }}</td>
                </tr>
                <tr>
                  <td>Payment Reference</td>
                  <td>{{ paymentPreview.payment_reference }}</td>
                </tr>
                <tr>
                  <td>Counterparty Name</td>
                  <td>{{ paymentPreview.counterparty_name }}</td>
                </tr>
                <tr>
                  <td>Counterparty IBAN</td>
                  <td>{{ paymentPreview.counterparty_iban }}</td>
                </tr>
                <tr>
                  <td>Notes</td>
                  <td>{{ paymentPreview.notes }}</td>
                </tr>
                <tr>
                  <td>Is Partially Paid</td>
                  <td>{{ paymentPreview.is_partially_paid }}</td>
                </tr>
                <tr>
                  <td>Is Paid</td>
                  <td>{{ paymentPreview.is_paid }}</td>
                </tr>
                <tr>
                  <td>File Name</td>
                  <td>{{ paymentPreview.file_name }}</td>
                </tr>
                <tr>
                  <td>Created At</td>
                  <td>{{ paymentPreview.created_at }}</td>
                </tr>
                <tr>
                  <td>Updated At</td>
                  <td>{{ paymentPreview.updated_at }}</td>
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

    <router-link
      v-if="paymentPreview"
      :to="`/payments/create/${paymentPreview.invoice_id}`"
      class="back-link"
    >
      ← Zurück zur Rechnungsdetails
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
      auth: null
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
      console.log('Payment Preview', this.paymentPreview)
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    }
  }
}
</script>

<style scoped>
.img {
  width: 100px;
  height: 100px;
}
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

/* PREVIEW PANEL */
.preview-panel {
  width: 80%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: auto;
  padding: 20px;
  top: 20px;
}

/* RECIPIENT */
.recipient {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.recipient-address {
  font-weight: 600;
  color: var(--lightColor);
  font-size: 12px;
}

/* META INFO */
.meta-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  margin-bottom: 4px;
}

.meta-label {
  font-weight: 600;
  color: var(--lightColor);
  font-size: 12px;
}

.meta-value {
  color: var(--midColor);
  font-size: 12px;
}

/* INTRO */
.intro-text {
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 10px;
}

/* BANK + CONTACT BOX */
.bank-box {
  background: #f1f5f9;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid transparent;
}

.bank-info {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 4px;
  line-height: 1.6;
  font-size: 12px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.bank-label {
  color: #444;
}

.bank-value {
  font-weight: 600;
  color: #333;
}

/* BACK LINK */
.back-link {
  display: inline-block;
  cursor: pointer;
  margin: 40px 0;
  font-size: 18px;
  color: #3b82f6;
  text-decoration: none;
  border: 1px solid #3b82f6;
  padding: 4px 8px;
  border-radius: 4px;
}
.back-link:hover {
  text-decoration: underline;
}

/* Positions Table */
.positions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  font-size: 10pt;
}

.positions-table thead {
  background: #f8f9fa;
}

.positions-table th {
  padding: 10px 8px;
  text-align: left;
  font-size: 9pt;
  font-weight: 700;
  text-transform: uppercase;
  color: #333;
}

.positions-table th.center,
.positions-table td.center {
  text-align: center;
}

.positions-table th.right,
.positions-table td.right {
  text-align: right;
}

.positions-table tbody tr {
  border-bottom: 1px solid #e9ecef;
}

.positions-table td {
  padding: 12px 8px;
  vertical-align: top;
}

.position-title {
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
}

.position-description {
  font-size: 9pt;
  color: #666;
  margin-top: 4px;
}

.position-service-period {
  font-size: 8pt;
  color: #888;
  margin-top: 4px;
  font-style: italic;
}

/* recipient Title */
.recipient-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 16px;
}

/* Summary Section */
.summary-section {
  display: flex;
  flex-direction: column;
  margin-left: auto;
  width: 300px;
  margin-bottom: 40px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 10pt;
}

.total-row.subtotal {
  font-size: 11pt;
  font-weight: 700;
}

.total-row.paid {
  color: #16a34a;
  font-weight: 700;
}

.total-row.outstanding {
  color: #dc2626;
  font-weight: 700;
}

.total-label {
  font-weight: 500;
}

.total-value {
  font-weight: 600;
  text-align: right;
}

/* Tax Notes */
.tax-note {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 9pt;
  line-height: 1.5;
}

.small-company {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
}

/* Subject Line */
.subject-line {
  margin: 20px 0;
  padding: 12px;
  background-color: #f8f9fa;
  border-left: 4px solid #0066cc;
  font-size: 14px;
}

/* Payment Terms */
.payment-terms-box {
  margin: 30px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.payment-terms-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #0066cc;
}

.payment-terms-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-term-item {
  font-size: 13px;
  line-height: 1.6;
  padding: 8px 0;
}

.payment-term-item strong {
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.skonto-highlight {
  background-color: #e7f3ff;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #0066cc;
}

.skonto-amount {
  margin-top: 8px;
  font-size: 12px;
  color: #0066cc;
  font-weight: 600;
}

.payment-conditions-text {
  margin-top: 6px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  white-space: pre-wrap;
  font-size: 12px;
  color: #666;
}
</style>
