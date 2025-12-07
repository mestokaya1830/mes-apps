<template>
  <div>
    <div v-if="payment && auth" class="preview-panel">
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
                  <td>{{ payment.id }}</td>
                </tr>
                <tr>
                  <td>Invoice ID</td>
                  <td>{{ payment.invoice_id }}</td>
                </tr>
                <tr>
                  <td>Customer ID</td>
                  <td>{{ payment.customer_id }}</td>
                </tr>
                <tr>
                  <td>Invoice Date</td>
                  <td>{{ payment.invoice_date }}</td>
                </tr>
                <tr>
                  <td>Invoice Due Date</td>
                  <td>{{ payment.invoice_due_date }}</td>
                </tr>
                <tr>
                  <td>Invoice Total</td>
                  <td>
                    {{ formatCurrency(payment.invoice_total, payment.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Currency</td>
                  <td>{{ payment.currency }}</td>
                </tr>
                <tr>
                  <td>Payment Date</td>
                  <td>{{ formatDate(payment.payment_date) }}</td>
                </tr>
                <tr>
                  <td>Paid Amount</td>
                  <td>
                    {{ formatCurrency(payment.paid_amount, payment.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Outstanding Amount</td>
                  <td>
                    {{ formatCurrency(payment.outstanding_amount, payment.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>{{ payment.payment_method }}</td>
                </tr>
                <tr>
                  <td>Payment Reference</td>
                  <td>{{ payment.payment_reference }}</td>
                </tr>
                <tr>
                  <td>Counterparty Name</td>
                  <td>{{ payment.counterparty_name }}</td>
                </tr>
                <tr>
                  <td>Counterparty IBAN</td>
                  <td>{{ payment.counterparty_iban }}</td>
                </tr>
                <tr>
                  <td>Notes</td>
                  <td>{{ payment.notes }}</td>
                </tr>
                <tr>
                  <td>Is Partially Paid</td>
                  <td>{{ payment.is_partially_paid }}</td>
                </tr>
                <tr>
                  <td>Is Paid</td>
                  <td>{{ payment.is_paid }}</td>
                </tr>
                <tr>
                  <td>File Name</td>
                  <td>{{ payment.file_name }}</td>
                </tr>
                <tr>
                  <td>Created At</td>
                  <td>{{ payment.created_at }}</td>
                </tr>
                <tr>
                  <td>Updated At</td>
                  <td>{{ payment.updated_at }}</td>
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

      <ActionsButtonPreview v-if="payment" :tableData="payment" sourcePage="details" />
    </div>

    <!-- <router-link :to="`/invoices/details/${payment.invoice_id}`" class="back-link">
      ← Zurück zur Rechnungsdetails
    </router-link> -->
  </div>
</template>

<script>
import store from '../../store/store'
import HeaderSidePreview from '../../components/invoices/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/invoices/ContactPersonPreview.vue'
import ActionsButtonPreview from '../../components/payments/ActionsButtonPreview.vue'
import FooterSidePreview from '../../components/invoices/FooterSidePreview.vue'

export default {
  name: 'PaymentDetails',
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
      title: 'Zahlungdetails',
      payment: null,
      auth: null
    }
  },
  mounted() {
    this.getPayment()
    this.getAuth()
  },
  methods: {
    async getPayment() {
      if (!this.$route.params.id) return
      try {
        const result = await window.api.getPaymentById(this.$route.params.id)
        if (!result.success) return
        this.payment = result.rows
        console.log('payment-details', this.payment)
      } catch (error) {
        console.error(error)
      }
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    }
  }
}
</script>

<style scoped>
.preview-panel {
  width: 80%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: auto;
  padding: 20px;
  top: 20px;
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
