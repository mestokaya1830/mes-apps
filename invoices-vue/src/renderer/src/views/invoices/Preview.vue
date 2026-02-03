<template>
  <div v-if="invoicePreview && auth" class="main-container">
    <div class="printable">
      <HeaderSidePreview :title="title" :auth="auth" />

      <div v-if="invoicePreview.customer" class="recipient">
        <div class="recipient-address">
          <div class="recipient-title"><i class="bi bi-person-fill icons"></i>Empfänger</div>
          <div class="company-name-subtitle">
            {{ invoicePreview.customer.company_name }}
          </div>
          <div class="meta-label">{{ invoicePreview.customer.address }}</div>
          <div class="meta-label">
            {{ invoicePreview.customer.postal_code }}
            {{ invoicePreview.customer.city }}<br />
            {{ invoicePreview.customer.country }}
          </div>
        </div>
        <div class="recipient-details">
          <div class="recipient-title"><i class="bi bi-info-circle-fill icons"></i>Rechnungsdetails</div>

          <div class="meta-row">
            <span class="meta-label">Rechnung-Nr.:</span>
            <span class="meta-value">{{ formatInvoiceId(invoicePreview.id) }}</span>
          </div>

          <div v-if="invoicePreview.service_date" class="meta-row">
            <span class="meta-label">Leistungsdatum:</span>
            <span class="meta-value">{{ formatDate(invoicePreview.service_date) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ formatDate(invoicePreview.date) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Fälligkeitsdatum:</span>
            <span class="meta-value">{{ formatDate(invoicePreview.due_date) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Kunden-Nr.:</span>
            <span class="meta-value">{{ formatCustomerId(invoicePreview.customer.id) }}</span>
          </div>

          <div v-if="invoicePreview.customer.country === 'Germany' && invoicePreview.customer.tax_number" class="meta-row">
            <span class="meta-label">Steuer-Nr.:</span>
            <span class="meta-value">{{ invoicePreview.customer.tax_number }}</span>
          </div>

          <div v-else-if="invoicePreview.customer.vat_id" class="meta-row">
            <span class="meta-label">USt-IdNr.:</span>
            <span class="meta-value">{{ invoicePreview.customer.vat_id }}</span>
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

        <tbody v-if="invoicePreview.positions">
          <tr v-for="(item, index) in invoicePreview.positions" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="position-title">{{ item.title }}</div>
              <div v-if="item.description" class="position-description">
                {{ item.description }}
              </div>
              <div v-if="item.service_period_start && item.service_period_end" class="position-service-period">
                <i class="bi bi-calendar3 me-1"></i> {{ formatDate(item.service_period_start) }} - {{ formatDate(item.service_period_end) }}
              </div>
            </td>
            <td class="center">{{ item.quantity }}</td>
            <td class="center">{{ item.unit }}</td>
            <td class="right">{{ formatCurrency(item.price, invoicePreview.currency) }}</td>
            <td class="right">
              {{ invoicePreview.is_reverse_charge ? '0%' : item.vat + '%' }}
            </td>
            <td class="right">
              {{ formatCurrency(item.unit_total, invoicePreview.currency) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="summary-section">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">{{ formatCurrency(invoicePreview.net_total, invoicePreview.currency) }}</span>
        </div>

        <div class="total-row">
          <span class="total-label">MwSt.:</span>
          <span class="total-value">{{ formatCurrency(invoicePreview.vat_total, invoicePreview.currency) }}</span>
        </div>

        <div class="total-row subtotal">
          <span class="total-label">Rechnungsbetrag (brutto):</span>
          <span class="total-value">{{ formatCurrency(invoicePreview.gross_total, invoicePreview.currency) }}</span>
        </div>

        <div class="total-row paid text-success">
          <span class="total-label"><i class="bi bi-check-circle-fill me-1"></i> Bereits bezahlt:</span>
          <span class="total-value"> - {{ formatCurrency(0, invoicePreview.currency) }} </span>
        </div>

        <div class="total-row outstanding text-danger">
          <span class="total-label"><i class="bi bi-exclamation-circle-fill me-1"></i> Offener Betrag:</span>
          <span class="total-value">{{ formatCurrency(invoicePreview.gross_total, invoicePreview.currency) }}</span>
        </div>

        <div class="preview-section">
          <div v-if="invoicePreview.is_small_company" class="tax-note small-company">
            <i class="bi bi-info-square-fill me-1"></i> Gemäß <span>§19 UStG</span> wird keine Umsatzsteuer berechnet.
          </div>

          <div v-else-if="invoicePreview.is_reverse_charge" class="tax-note">
            <i class="bi bi-arrow-repeat me-1"></i> Reverse-Charge-Verfahren – Steuerschuldnerschaft des Leistungsempfängers (<span>§13b UStG</span>)
          </div>

          <div v-else-if="invoicePreview.is_eu_delivery" class="tax-note">
            <i class="bi bi-globe-europe-africa me-1"></i> Innergemeinschaftliche Lieferung – steuerfrei gemäß <span>§4 Nr.1b UStG</span>
          </div>
        </div>
      </div>

      <div class="payment-terms-box">
        <div class="payment-terms-title"><i class="bi bi-credit-card-2-back-fill icons"></i>Zahlungsbedingungen</div>
        <div class="payment-terms-content">
          <div v-if="invoicePreview.payment_terms" class="payment-term-item">
            <strong>Zahlungsziel:</strong> {{ invoicePreview.payment_terms }} Tage (bis {{ formatDate(invoicePreview.due_date) }})
          </div>

          <div v-if="invoicePreview.early_payment_offer" class="payment-term-item skonto-highlight">
            <strong><i class="bi bi-lightning-charge-fill me-1"></i> Skonto:</strong>
            {{ invoicePreview.early_payment_percentage }}% Skonto bis {{ formatDate(invoicePreview.early_payment_deadline) }}
          </div>
        </div>
      </div>

      <ContactPersonPreview :contactData="auth.contact_person" />

      <div class="bank-box">
        <div class="bank-title"><i class="bi bi-bank icons"></i>Bankverbindung</div>
        <div class="bank-info">
          <span class="bank-label">Bank:</span> <span class="bank-value">{{ auth.bank_name }}</span>
          <span class="bank-label">IBAN:</span> <span class="bank-value">{{ auth.iban }}</span>
          <span class="bank-label">BIC:</span> <span class="bank-value">{{ auth.bic }}</span>
        </div>
      </div>
      <FooterSidePreview />
    </div>

    <InvoiceActions v-if="invoicePreview" :tableData="invoicePreview" :fileName="actionFileName" sourcePage="preview" />
  </div>

  <router-link to="/invoices/create" class="back-link d-inline-flex align-items-center">
    <i class="bi bi-arrow-left icons"></i> Zurück zur Rechnungserstellung
  </router-link>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
import InvoiceActions from '../../components/preview/InvoiceActions.vue'

export default {
  name: 'InvoicePreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    FooterSidePreview,
    InvoiceActions
  },
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency', 'formatInvoiceId'],
  data() {
    return {
      title: 'Rechnungbestätigung',
      invoicePreview: null,
      auth: null
    }
  },
  computed: {
    actionFileName() {
      if (!this.invoicePreview) return
      return this.formatInvoiceId(this.invoicePreview.id)
    }
  },
  mounted() {
    this.getInvoicePreview()
    this.getAuth()
  },
  methods: {
    getInvoicePreview() {
      if (!store.state.invoice) return
      this.invoicePreview = store.state.invoice
      console.log('invoice-preview', this.invoicePreview)
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    }
  }
}
</script>
