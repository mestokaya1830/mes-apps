<template>
  <div v-if="paymentPreview && auth" class="main-container">
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
              <tr v-if="paymentPreview.invoice.early_paid_discount_applied">
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
              <tr v-if="paymentPreview.invoice.early_paid_discount_applied">
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
              <tr>
                <td>Staus</td>
                <td>
                  <h2>{{ paymentPreview.invoice.payment_status }}</h2>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Contact Person -->
      <ContactPersonPreview :contactData="auth.contact_person" />

      <!-- Bank Info -->
      <div class="preview-box">
       <div class="preview-box-title"><i class="bi bi-bank2 icons"></i>Bankverbindung</div>
        <div class="bank-info">
          <span class="preview-box-label">Bank:</span>
          <span class="preview-box-value">{{ auth.bank_name }}</span>
          <span class="preview-box-label">IBAN:</span>
          <span class="preview-box-value">{{ auth.iban }}</span>
          <span class="preview-box-label">BIC:</span>
          <span class="preview-box-value">{{ auth.bic }}</span>
        </div>
      </div>
      <FooterSidePreview />
    </div>

    <div class="btn-container">
       <button class="btn btn-primary" @click="savePayment">
        <i class="bi bi-floppy-fill icons"></i>
        <span>Speichern</span>
      </button>
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
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'

export default {
  name: 'PaymentPreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
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
      if (this.paymentPreview.invoice.early_paid_discount_applied) {
        return (
          this.paymentPreview.invoice.gross_total_after_discount -
          this.paymentPreview.payment_amount
        )
      } else {
        return this.paymentPreview.invoice.gross_total - this.paymentPreview.payment_amount
      }
    },
    actionFileName() {
      if (!this.paymentPreview) return
      return this.formatPaymentId(this.paymentPreview.id)
    }
  },
  mounted() {
    this.getPaymentPreview()
  },
  methods: {
    getPaymentPreview() {
      if (!store.state.payment && !store.state.auth) return
      this.paymentPreview = store.state.payment
      this.auth = store.state.auth
    },
    async savePayment() {
      if (this.paymentPreview) {
        const result = await window.api.addPayment(JSON.parse(JSON.stringify(this.paymentPreview)))
        if (!result.success) return
        await store.clearStore('payment')
        this.$router.push('/invoices')
      }
    }
  }
}
</script>
