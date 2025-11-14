<template>
  <div v-if="invoice && auth">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- customers -->
        <div v-if="invoice.customer" class="recipient">
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
              <span class="meta-value">{{ formatRechnungId }}</span>
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

            <div
              v-if="invoice.customer.country === 'Germany' && invoice.customer.tax_number"
              class="meta-row"
            >
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ invoice.customer.tax_number }}</span>
            </div>

            <div v-else-if="invoice.customer.is_in_eu && invoice.customer.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ invoice.customer.vat_id }}</span>
            </div>

            <div v-else-if="!invoice.customer.is_in_eu && invoice.customer.vat_id" class="meta-row">
              <span class="meta-label">VAT ID:</span>
              <span class="meta-value">{{ invoice.customer.vat_id }}</span>
            </div>
          </div>
        </div>

        <div v-if="invoice.payment.payment_reference" class="subject-line">
          <strong>Betreff:</strong> {{ invoice.payment_reference }}
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
        <div v-if="invoice.summary" class="summary-section">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(invoice.summary.subtotal, invoice.currency)
            }}</span>
          </div>

          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(invoice.summary.vat_amount, invoice.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(invoice.summary.total, invoice.currency)
            }}</span>
          </div>

          <div
            v-if="invoice.payment && invoice.payment.paid_amount && invoice.payment.paid_amount > 0"
            class="total-row paid"
          >
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value">
              - {{ formatCurrency(invoice.payment.paid_amount, invoice.currency) }}
            </span>
          </div>

          <div
            v-if="invoice.summary && invoice.summary.outstanding > 0"
            class="total-row outstanding"
          >
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{
              formatCurrency(invoice.summary.outstanding, invoice.currency)
            }}</span>
          </div>

          <div class="preview-section">
            <div v-if="invoice.tax_options.is_small_company" class="tax-note small-company">
              ⚠️ Gemäß <span>§19 UStG</span> wird keine Umsatzsteuer berechnet.
            </div>

            <div v-else-if="invoice.tax_options.is_reverse_charge" class="tax-note">
              ⚠️ Reverse-Charge-Verfahren – Steuerschuldnerschaft des Leistungsempfängers (<span
                >§13b UStG</span
              >)
            </div>

            <div v-else-if="invoice.tax_options.is_eu_delivery" class="tax-note">
              ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß
              <span>§4 Nr.1b UStG</span> (Europa içi)
            </div>
          </div>
        </div>

        <!-- payment -->
        <div v-if="invoice.payment" class="payment-terms-box">
          <div class="payment-terms-title">💳 Zahlungsbedingungen</div>

          <div class="payment-terms-content">
            <div v-if="invoice.payment.payment_terms" class="payment-term-item">
              <strong>Zahlungsziel:</strong>
              {{ invoice.payment.payment_terms }} Tage netto (fällig bis
              {{ calculateDueDate(invoice.date, invoice.payment.payment_terms) }})
            </div>

            <div v-if="invoice.payment.has_skonto" class="payment-term-item skonto-highlight">
              <strong>💰 Skonto:</strong>
              {{ invoice.payment.skonto_percentage }}% Skonto bei Zahlung innerhalb von
              {{ invoice.payment.skonto_days }} Tagen (bis
              {{ calculateDueDate(invoice.date, invoice.payment.skonto_days) }})
              <div class="skonto-amount">
                Skonto-Betrag:
                {{ formatCurrency(calculateSkontoAmount(), invoice.currency) }}
                = Zahlbetrag:
                {{ formatCurrency(calculateAmountWithSkonto(), invoice.currency) }}
              </div>
            </div>

            <div v-if="invoice.payment.payment_conditions" class="payment-term-item">
              <strong>Zusätzliche Bedingungen:</strong>
              <div class="payment-conditions-text">
                {{ invoice.payment.payment_conditions }}
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
            <span class="bank-label">Verwen..:</span>
            <span class="bank-value">{{ invoice.payment.verwendungszweck }}</span>
          </div>
        </div>

        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="invoice.customer"
        :documentId="formatRechnungId"
        :email="invoice.customer.email"
        dataName="invoices"
        :dbData="invoice"
      />
    </div>
    <router-link to="/invoices" class="back-link"> ← Zurück zur Rechnungsliste </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'

export default {
  name: 'invoice',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    ActionsButtonPreview,
    FooterSidePreview
  },
  inject: ['formatCustomerId', 'formatDate', 'formatValidDays', 'formatCurrency'],
  data() {
    return {
      title: 'Rechnungs-Vorschau',
      invoice: null,
      auth: null
    }
  },
  computed: {
    formatRechnungId() {
      if (!this.invoice || !this.invoice.id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(this.invoice.id).padStart(5, '0')}`
    },
    logoSrc() {
      const logo = this.auth.logo
      if (!logo) return null
      if (typeof logo === 'string') {
        if (logo.startsWith('data:image')) return logo
        return `data:image/png;base64,${logo}`
      }
      try {
        let binary = ''
        const bytes = new Uint8Array(Object.values(logo))
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
        return `data:image/png;base64,${window.btoa(binary)}`
      } catch (error) {
        console.error(error)
        return null
      }
    }
  },
  mounted() {
    this.getInvoice()
    this.getAuth()
  },
  methods: {
    async getInvoice() {
      const id = this.$route.params.id
      try {
        const result = await window.api.getDocumentById(id, 'invoices')
        this.invoice = {
          ...result.rows,
          customer: JSON.parse(result.rows.customer),
          positions: JSON.parse(result.rows.positions),
          payment: JSON.parse(result.rows.payment),
          summary: JSON.parse(result.rows.summary)
        }
        console.log(this.invoice)
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
    },
    calculateDueDate(invoiceDate, days) {
      if (!invoiceDate || !days) return ''
      const date = new Date(invoiceDate)
      date.setDate(date.getDate() + days)
      return this.formatDate(date.toISOString().split('T')[0])
    },
    calculateSkontoAmount() {
      if (!this.invoice?.summary?.total || !this.invoice?.payment?.skonto_percentage) {
        return 0
      }
      const outstanding = this.invoice.summary.outstanding || this.invoice.summary.total
      return (outstanding * this.invoice.payment.skonto_percentage) / 100
    },
    calculateAmountWithSkonto() {
      if (!this.invoice?.summary?.total) return 0
      const outstanding = this.invoice.summary.outstanding || this.invoice.summary.total
      return outstanding - this.calculateSkontoAmount()
    }
  }
}
</script>
<style>
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
