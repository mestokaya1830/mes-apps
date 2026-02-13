<template>
  <div v-if="invoice && auth" class="main-container">
    <header class="main-header-right">
      <router-link to="/invoices" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons"></i>Zurück
      </router-link>
    </header>
    <div>
      <div class="printable">
        <HeaderSidePreview :title="title" :auth="auth" />

        <div v-if="invoice" class="recipient">
          <div class="recipient-address">
            <div class="recipient-title"><i class="bi bi-person-badge icons"></i>Empfänger</div>
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

          <div class="recipient-details">
            <div class="recipient-title">
              <i class="bi bi-file-earmark-text icons"></i>Rechnungsdetails
            </div>

            <div class="recipient-row">
              <span class="meta-label">Rechnung-Nr.:</span>
              <span class="meta-value">{{ formatInvoiceId(invoice.id) }}</span>
            </div>

            <div v-if="invoice.service_date" class="recipient-row">
              <span class="meta-label">Leistungsdatum:</span>
              <span class="meta-value">{{ formatDate(invoice.service_date) }}</span>
            </div>

            <div class="recipient-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(invoice.date) }}</span>
            </div>

            <div class="recipient-row">
              <span class="meta-label">Fälligkeitsdatum:</span>
              <span class="meta-value">{{ formatDate(invoice.due_date) }}</span>
            </div>

            <div class="recipient-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{ formatCustomerId(invoice.customer.id) }}</span>
            </div>

            <div v-if="invoice.country === 'Germany' && invoice.tax_number" class="recipient-row">
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ invoice.tax_number }}</span>
            </div>
            <div v-else-if="invoice.vat_id" class="recipient-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ invoice.vat_id }}</span>
            </div>
          </div>
        </div>

        <div class="intro-text">
          Sehr geehrter Kunde,<br />
          für die erbrachten Leistungen erlauben wir uns, Ihnen wie folgt in Rechnung zu stellen:
        </div>

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
              <i class="bi bi-exclamation-triangle-fill icons"></i> Gemäß <span>§19 UStG</span> wird
              keine Umsatzsteuer berechnet.
            </div>
            <div v-else-if="invoice.is_reverse_charge" class="tax-note">
              <i class="bi bi-info-circle-fill icons"></i> Reverse-Charge-Verfahren –
              Steuerschuldnerschaft des Leistungsempfängers (<span>§13b UStG</span>)
            </div>
            <div v-else-if="invoice.is_eu_delivery" class="tax-note">
              <i class="bi bi-globe icons"></i> Innergemeinschaftliche Lieferung – steuerfrei gemäß
              <span>§4 Nr.1b UStG</span>
            </div>
          </div>
        </div>

        <div class="preview-box">
          <div class="preview-box-title">
            <i class="bi bi-credit-card-fill icons"></i>Zahlungsbedingungen
          </div>
          <div class="preview-box-contentt">
            <div v-if="invoice.payment_terms" class="payment-term-item">
              <strong>Zahlungsziel:</strong> {{ invoice.payment_terms }} Tage (bis
              {{ formatDate(invoice.due_date) }})
            </div>
            <div v-if="invoice.early_payment_offer" class="payment-term-item skonto-highlight">
              <strong><i class="bi bi-piggy-bank-fill icons"></i> Skonto:</strong>
              {{ invoice.early_payment_percentage }}% Skonto bis
              {{ formatDate(invoice.early_payment_deadline) }}
            </div>
          </div>
        </div>

        <ContactPersonPreview :contactData="auth.contact_person" />

        <div class="preview-box">
          <div class="preview-box-title"><i class="bi bi-bank2 icons"></i>Bankverbindung</div>
          <div class="preview-box-content">
            <span class="preview-box-label">Bank:</span>
            <span class="preview-box-value">{{ auth.bank_name }}</span>
            <span class="preview-box-label">IBAN:</span> <span class="preview-box-value">{{ auth.iban }}</span>
            <span class="preview-box-label">BIC:</span> <span class="preview-box-value">{{ auth.bic }}</span>
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

      <div v-if="payments && payments.length" class="report-table-container">
        <h4 class="mb-3"><i class="bi bi-cash-stack icons"></i>Zahlungshistorie</h4>
        <table class="report-table">
          <thead>
            <tr>
              <th>Zahlungs-ID</th>
              <th>Zahlungsdatum</th>
              <th>Summe</th>
              <th>Gezahlter Betrag</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in payments" :key="item.id">
              <td>{{ formatPaymentId(item.id) }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ formatCurrency(item.invoice.gross_total, item.invoice.currency) }}</td>
              <td>{{ formatCurrency(item.payment_amount, item.invoice.currency) }}</td>
              <td>
                <router-link
                  :to="'/payments/details/' + item.id"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="bi bi-eye-fill"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <router-link :to="`/reminders/create/${invoice.id}`" class="btn btn-reminder">
          <i class="bi bi-bell-fill icons"></i> Mahnung erstellen
        </router-link>
      </div>

      <div v-if="reminders && reminders.length">
        <h4 class="mb-3"><i class="bi bi-exclamation-octagon-fill btn-reminder"></i>Mahnungen</h4>
        <table class="table-auto w-full border">
          <thead>
            <tr>
              <th class="payment-head">Mahnungs-ID</th>
              <th class="payment-head">Mahnungsdatum</th>
              <th class="payment-head">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reminders" :key="item.id">
              <td class="payment-row">{{ formatReminderId(item.id) }}</td>
              <td class="payment-row">{{ formatDate(item.date) }}</td>
              <td class="payment-row">
                <router-link
                  :to="'/reminders/details/' + item.id"
                  class="btn btn-sm btn-outline-secondary"
                >
                  <i class="bi bi-search icons"></i> Details
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
