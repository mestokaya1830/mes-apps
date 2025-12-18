<template>
  <div v-if="invoice && auth">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- customers -->
        <div v-if="invoice" class="recipient">
          <div class="recipient-address">
            <div class="recipient-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ invoice.customer.company_name }}
            </div>
            <div class="meta-label">{{ invoice.customer.address }}</div>
            <div class="meta-label">
              {{ invoice.customer.postal_code }}
              {{ invoice.customer.city }}<br />
              {{ invoice.customer.country }}
            </div>
          </div>

          <!-- recipient details -->
          <div class="recipient-details">
            <div class="recipient-title">Rechnungsdetails</div>

            <div class="meta-row">
              <span class="meta-label">Rechnung-Nr.:</span>
              <span class="meta-value">{{ formatInvoiceId(invoice.id) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(invoice.date) }}</span>
            </div>

            <!-- Service date -->
            <div v-if="invoice.service_date" class="meta-row">
              <span class="meta-label">Leistungsdatum:</span>
              <span class="meta-value">{{ formatDate(invoice.service_date) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{ formatCustomerId(invoice.customer.id) }}</span>
            </div>

            <div v-if="invoice.country === 'Germany' && invoice.tax_number" class="meta-row">
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ invoice.tax_number }}</span>
            </div>

            <div v-else-if="invoice.is_in_eu && invoice.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ invoice.vat_id }}</span>
            </div>

            <div v-else-if="!invoice.is_in_eu && invoice.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ invoice.vat_id }}</span>
            </div>
          </div>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          Sehr geehrter Kunde,<br />
          für die erbrachten Leistungen erlauben wir uns, Ihnen wie folgt in Rechnung zu stellen:
        </div>

        <!-- Positions Table -->
        <table class="positions-table">
          <thead>
            <tr>
              <th style="width: 5%">Pos.</th>
              <th style="width: 40%">Bezeichnung</th>
              <th class="center" style="width: 8%">Menge</th>
              <th class="center" style="width: 10%">Einheit</th>
              <th class="right" style="width: 12%">Einzelpreis</th>
              <th class="right" style="width: 10%">MwSt.</th>
              <th class="right" style="width: 15%">Gesamtpreis</th>
            </tr>
          </thead>
          <tbody v-if="invoice.positions && invoice.positions.length > 0">
            <tr v-for="(item, index) in invoice.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
                <div
                  v-if="item.service_period_start && item.service_period_end"
                  class="position-service-period"
                >
                  Leistungszeitraum: {{ formatDate(item.service_period_start) }} -
                  {{ formatDate(item.service_period_end) }}
                </div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ formatCurrency(item.price, invoice.currency) }}</td>
              <td class="right">
                {{ invoice.is_reverse_charge ? '0%' : item.vat + '%' }}
              </td>
              <td class="right">
                {{ formatCurrency(item.unit_total, invoice.currency) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- summary -->
        <div class="summary-section">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(invoice.net_total, invoice.currency)
            }}</span>
          </div>

          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(invoice.vat_total, invoice.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(invoice.gross_total, invoice.currency)
            }}</span>
          </div>

          <div class="preview-section">
            <div v-if="invoice.is_small_company" class="tax-note small-company">
              ⚠️ Gemäß <span>§19 UStG</span> wird keine Umsatzsteuer berechnet.
            </div>

            <div v-else-if="invoice.is_reverse_charge" class="tax-note">
              ⚠️ Reverse-Charge-Verfahren – Steuerschuldnerschaft des Leistungsempfängers (<span
                >§13b UStG</span
              >)
            </div>

            <div v-else-if="invoice.is_eu_delivery" class="tax-note">
              ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß
              <span>§4 Nr.1b UStG</span>
            </div>
          </div>
        </div>

        <!-- payment -->
        <div class="payment-terms-box">
          <div class="payment-terms-title">💳 Zahlungsbedingungen</div>

          <div class="payment-terms-content">
            <div v-if="invoice.payment_terms" class="payment-term-item">
              <strong>Zahlungsziel:</strong>
              {{ invoice.payment_terms }} Tage netto (fällig bis {{ formatDate(invoice.due_date) }})
            </div>

            <div v-if="invoice.early_payment_offer" class="payment-term-item skonto-highlight">
              <strong>💰 Skonto:</strong>
              {{ invoice.early_payment_percentage }}% Skonto bei Zahlung innerhalb von
              {{ invoice.early_payment_days }} Tagen (bis
              {{ formatDate(invoice.early_payment_deadline) }})
              <div class="skonto-amount">
                <span
                  >Skonto-Betrag:
                  {{ formatCurrency(invoice.early_payment_discount, invoice.currency) }}</span
                >
                <span
                  >Zahlbetrag:
                  {{ formatCurrency(invoice.gross_total_after_discount, invoice.currency) }}</span
                >
              </div>
            </div>

            <div v-if="invoice.payment_conditions" class="payment-term-item">
              <strong>Zusätzliche Bedingungen:</strong>
              <div class="payment-conditions-text">
                {{ invoice.payment_conditions }}
              </div>
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

      <InvoiceActions
        v-if="invoice"
        :tableData="invoice"
        :fileName="actionFileName"
        sourcePage="details"
      />

      <!-- payment list -->
      <div v-if="payments && payments.length" class="customer-grid">
        <table class="table-auto w-full border">
          <thead>
            <tr>
              <th class="payment-head">Zahlungs-ID</th>
              <th class="payment-head">Zahlungsdatum</th>
              <th class="payment-head">Rechnungssumme</th>
              <th class="payment-head">Rabatt</th>
              <th class="payment-head">Gesamtbetrag nach Rabatt</th>
              <th class="payment-head">Gezahlter Betrag</th>
              <th class="payment-head">Details</th>
            </tr>
          </thead>
          <tbody v-if="payments">
            <tr v-for="item in payments" :key="item.id">
              <td class="payment-row">{{ formatPaymentId(item.id) }}</td>
              <td class="payment-row">{{ formatDate(item.date) }}</td>
              <td class="payment-row">
                {{ formatCurrency(item.invoice.gross_total, item.invoice.currency) }}
              </td>
              <td class="payment-row">
                {{ formatCurrency(item.invoice.early_payment_discount, item.invoice.currency) }}
              </td>
              <td class="payment-row">
                {{ formatCurrency(item.invoice.gross_total_after_discount, item.invoice.currency) }}
              </td>
              <td class="payment-row">
                {{ formatCurrency(item.payment_amount, item.invoice.currency) }}
              </td>

              <td class="payment-row">
                <router-link :to="'/payments/details/' + item.id" class="action-btn details-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Details
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="outstanding">
          <label for="">Summe: </label>
          <span>
            {{ formatCurrency(invoice.gross_total, invoice.currency) }}
          </span>
          <label for=""> Bereitbezahlt: </label>
          <span>
            {{ formatCurrency(payment_total, invoice.currency) }}
          </span>
          <label for="">Restbetrag: </label>
          <span>
            {{ formatCurrency(invoice.gross_total - payment_total, invoice.currency) }}
          </span>
        </div>
      </div>

      <router-link :to="`/reminders/create/${invoice.id}`" class="btn create-reminder"
        >Mahnung erstellen</router-link
      >

      <!-- reminders list -->
      <div v-if="reminders && reminders.length" class="customer-grid">
        <table class="table-auto w-full border">
          <thead>
            <tr>
              <th class="payment-head">Mahnungs-ID</th>
              <th class="payment-head">Mahnungsdatum</th>
              <th class="payment-head">Mahnfrist</th>
              <th class="payment-head">Details</th>
            </tr>
          </thead>
          <tbody v-if="reminders">
            <tr v-for="item in reminders" :key="item.id">
              <td class="payment-row">{{ formatReminderId(item.id) }}</td>
              <td class="payment-row">{{ formatDate(item.date) }}</td>
              <td class="payment-row">
                {{ item.payment_deadline }}
              </td>

              <td class="payment-row">
                <router-link :to="'/reminders/details/' + item.id" class="action-btn details-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Details
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <router-link to="/invoices" class="back-link"> ← Zurück zur Rechnungsliste </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import InvoiceActions from '../../components/preview/InvoiceActions.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'

export default {
  name: 'InvoicesDetails',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    InvoiceActions,
    FooterSidePreview
  },
  inject: [
    'formatPaymentId',
    'formatInvoiceId',
    'formatCustomerId',
    'formatReminderId',
    'formatDate',
    'formatCurrency'
  ],
  data() {
    return {
      title: 'Rechnungdetails',
      invoice: null,
      payments: [],
      reminders: [],
      payment_total: 0,
      auth: null
    }
  },
  computed: {
    actionFileName() {
      if (!this.invoice) return
      return this.formatInvoiceId(this.invoice.id)
    }
  },
  mounted() {
    this.getInvoice()
    this.getAuth()
  },
  methods: {
    async getInvoice() {
      const id = this.$route.params.id
      if (!id) return
      try {
        const data = {
          id: id,
          table_name: 'invoices'
        }
        const result = await window.api.getInvoiceById(data)
        if (!result.success) return
        this.invoice = {
          ...result.rows,
          customer: JSON.parse(result.rows.customer),
          positions: JSON.parse(result.rows.positions)
        }
        this.payments = result.payments.map((item) => {
          return {
            ...item,
            invoice: JSON.parse(item.invoice)
          }
        })
        this.payment_total = result.payment_total
        this.reminders = result.reminders
        console.log('result:', result)
        console.log('invoice Data:', this.payments)
      } catch (error) {
        console.error(error)
      }
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      } else {
        console.warn('No auth data in store')
      }
    }
  }
}
</script>
