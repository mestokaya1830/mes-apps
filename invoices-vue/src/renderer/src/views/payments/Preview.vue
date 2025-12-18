<template>
  <div>
    <div v-if="paymentPreview && auth" class="preview-panel">
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
                  <td>{{ formatPaymentId(paymentPreview.id) }}</td>
                </tr>
                <tr>
                  <td>Rechnungs-ID</td>
                  <td>{{ formatInvoiceId(paymentPreview.invoice.id) }}</td>
                </tr>
                <tr>
                  <td>Kunden-ID</td>
                  <td>{{ formatCustomerId(paymentPreview.invoice.customer_id) }}</td>
                </tr>
                <tr>
                  <td>Rechnungsdatum</td>
                  <td>{{ formatDate(paymentPreview.invoice.date) }}</td>
                </tr>
                <tr>
                  <td>Fälligkeitsdatum</td>
                  <td>{{ formatDate(paymentPreview.invoice.due_date) }}</td>
                </tr>
                <tr>
                  <td>Zahlungsdatum</td>
                  <td>{{ formatDate(paymentPreview.date) }}</td>
                </tr>
                <tr>
                  <td>Währung</td>
                  <td>{{ paymentPreview.invoice.currency }}</td>
                </tr>
                <tr>
                  <td>Rechnungsbetrag</td>
                  <td>
                    {{
                      formatCurrency(
                        paymentPreview.invoice.gross_total,
                        paymentPreview.invoice.currency
                      )
                    }}
                  </td>
                </tr>
                <tr v-if="paymentPreview.invoice.is_early_paid">
                  <td>Rabatt</td>
                  <td>
                    {{
                      formatCurrency(
                        paymentPreview.invoice.early_payment_discount,
                        paymentPreview.invoice.currency
                      )
                    }}
                  </td>
                </tr>
                <tr v-if="paymentPreview.is_early_paid">
                  <td>Gesamtbetrag nach Rabatt</td>
                  <td>
                    {{
                      formatCurrency(
                        paymentPreview.invoice.gross_total_after_discount,
                        paymentPreview.invoice.currency
                      )
                    }}
                  </td>
                </tr>

                <tr>
                  <td>Bezahlter Betrag</td>
                  <td>
                    {{
                      formatCurrency(paymentPreview.payment_amount, paymentPreview.invoice.currency)
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Offener Betrag</td>
                  <td>
                    {{ formatCurrency(outstanding, paymentPreview.invoice.currency) }}
                  </td>
                </tr>
                <tr>
                  <td>Zahlungsmethode</td>
                  <td>{{ paymentPreview.payment_method }}</td>
                </tr>
                <tr>
                  <td>Zahlungsreferenz</td>
                  <td>{{ paymentPreview.payment_reference }}</td>
                </tr>
                <tr>
                  <td>Name der Gegenpartei</td>
                  <td>{{ paymentPreview.counterparty_name }}</td>
                </tr>
                <tr>
                  <td>IBAN der Gegenpartei</td>
                  <td>{{ paymentPreview.counterparty_iban }}</td>
                </tr>
                <tr>
                  <td>Notizen</td>
                  <td>{{ paymentPreview.notes }}</td>
                </tr>
                <tr>
                  <td>Zahlungsstatus</td>
                  <td>{{ paymentPreview.payment_status }}</td>
                </tr>
                <tr>
                  <td>Dateiname</td>
                  <td>{{ paymentPreview.file_name }}</td>
                </tr>
              </tbody>
            </table>
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

      <PaymentActions
        v-if="paymentPreview"
        :tableData="paymentPreview"
        :fileName="actionFileName"
        sourcePage="preview"
      />
    </div>

    <router-link
      v-if="paymentPreview"
      :to="`/payments/create/${paymentPreview.invoice.id}`"
      class="back-link"
    >
      ← Zurück zu den Rechnungsdetails
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/invoices/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/invoices/ContactPersonPreview.vue'
import PaymentActions from '../../components/preview/PaymentActions.vue'
import FooterSidePreview from '../../components/invoices/FooterSidePreview.vue'

export default {
  name: 'PaymentPreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    PaymentActions,
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
  computed: {
    outstanding() {
      if (!this.paymentPreview) return
      return this.paymentPreview.invoice.gross_total - this.paymentPreview.payment_amount
    },
    actionFileName() {
      if (!this.paymentPreview) return
      return this.formatPaymentId(this.paymentPreview.id)
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