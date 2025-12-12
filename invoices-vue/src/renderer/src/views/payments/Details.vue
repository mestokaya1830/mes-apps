<template>
  <div>
    <div v-if="payment && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />
        <!-- Modal -->
        <div>
          <div class="modal">
            <h3>Zahlungsdetails</h3>
            <table class="modal-table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{{ formatPaymentId(payment.id) }}</td>
                </tr>
                <tr>
                  <td>Rechnungs-ID</td>
                  <td>{{ formatInvoiceId(payment.invoice_id) }}</td>
                </tr>
                <tr>
                  <td>Kunden-ID</td>
                  <td>{{ formatCustomerId(payment.invoice_customer_id) }}</td>
                </tr>
                <tr>
                  <td>Rechnungsdatum</td>
                  <td>{{ formatDate(payment.invoice_date) }}</td>
                </tr>
                <tr>
                  <td>Fälligkeitsdatum</td>
                  <td>{{ formatDate(payment.invoice_due_date) }}</td>
                </tr>
                <tr>
                  <td>Zahlungsdatum</td>
                  <td>{{ formatDate(payment.payment_date) }}</td>
                </tr>
                <tr>
                  <td>Währung</td>
                  <td>{{ payment.invoice_currency }}</td>
                </tr>

                <tr>
                  <td>Rechnungssumme</td>
                  <td>
                    {{ formatCurrency(payment.invoice_gross_total, payment.currency) }}
                  </td>
                </tr>
                <tr v-if="payment.is_early_paid">
                  <td>Rabatt</td>
                  <td>
                    {{
                      formatCurrency(
                        payment.invoice_early_payment_discount,
                        payment.invoice_currency
                      )
                    }}
                  </td>
                </tr>
                <tr v-if="payment.is_early_paid">
                  <td>Gesamtbetrag nach Rabatt</td>
                  <td>
                    {{
                      formatCurrency(payment.invoice_total_after_discount, payment.invoice_currency)
                    }}
                  </td>
                </tr>

                <tr>
                  <td>Gezahlter Betrag</td>
                  <td>
                    {{ formatCurrency(payment.payment_amount, payment.invoice_currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Ausstehender Betrag</td>
                  <td>
                    {{ formatCurrency(payment.outstanding, payment.invoice_currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Zahlungsmethode</td>
                  <td>{{ payment.payment_method }}</td>
                </tr>
                <tr>
                  <td>Zahlungsreferenz</td>
                  <td>{{ payment.payment_reference }}</td>
                </tr>
                <tr>
                  <td>Name der Gegenpartei</td>
                  <td>{{ payment.counterparty_name }}</td>
                </tr>
                <tr>
                  <td>IBAN der Gegenpartei</td>
                  <td>{{ payment.counterparty_iban }}</td>
                </tr>
                <tr>
                  <td>Notizen</td>
                  <td>{{ payment.notes }}</td>
                </tr>
                <tr>
                  <td>Zahlungsstatus</td>
                  <td>{{ payment.payment_status }}</td>
                </tr>
                <tr>
                  <td>Dateiname</td>
                  <td>{{ payment.file_name }}</td>
                </tr>
                <tr>
                  <td>Erstellt am</td>
                  <td>{{ payment.created_at }}</td>
                </tr>
                <tr>
                  <td>Aktualisiert am</td>
                  <td>{{ payment.updated_at }}</td>
                </tr>
              </tbody>
            </table>
            <div v-if="payment.file_name" class="download-container">
              <img :src="`/uploads/payments/${payment.file_name}`" alt="No image" class="img" />
              <a :href="`/uploads/payments/${payment.file_name}`" :download="payment.file_name">
                <button class="btn-download">Datei herunterladen</button>
              </a>
            </div>
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

      <router-link :to="'/invoices/details/' + payment.invoice_id" class="back-link"
        >Zuruckzahlung</router-link
      >

      <!-- Actions Button -->
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
  computed: {
    outstanding() {
      return (
        this.payment.invoice_gross_total -
        (this.payment.payment_amount + Number(this.payment.total_paid_amount))
      ).toFixed(2)
    }
  },
  mounted() {
    this.getPayment()
    this.getAuth()
  },
  methods: {
    async getPayment() {
      console.log(this.$route.params.id)
      if (!this.$route.params.id) return
      try {
        const result = await window.api.getPaymentById(this.$route.params.id)
        if (!result.success) return
        this.payment = result.data.payment
        console.log(result)
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
.img {
  width: 200px;
  height: 140px;
}
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

.download-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}
.btn-download {
  margin-top: 1rem;
  padding: 6px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
