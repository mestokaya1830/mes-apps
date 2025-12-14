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
              <th class="payment-head">Ausstehend</th>
              <th class="payment-head">Details</th>
            </tr>
          </thead>
          <tbody v-if="payments">
            <tr v-for="item in payments" :key="item.id">
              <td class="payment-row">{{ formatPaymentId(item.id) }}</td>
              <td class="payment-row">{{ formatDate(item.payment_date) }}</td>
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
                {{ formatCurrency(item.invoice.outstanding, item.invoice.currency) }}
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
        <router-link :to="`/reminders/create/${invoice.id}`">Mahnung erstellen</router-link>
      </div>
      <ActionsButtonPreview v-if="invoice" :tableData="invoice" sourcePage="details" />
    </div>
    <router-link to="/invoices" class="back-link"> ← Zurück zur Rechnungsliste </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/invoices/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/invoices/ContactPersonPreview.vue'
import ActionsButtonPreview from '../../components/invoices/ActionsButtonPreview.vue'
import FooterSidePreview from '../../components/invoices/FooterSidePreview.vue'

export default {
  name: 'InvoicesDetails',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    ActionsButtonPreview,
    FooterSidePreview
  },
  inject: [
    'formatPaymentId',
    'formatInvoiceId',
    'formatCustomerId',
    'formatDate',
    'formatCurrency'
  ],
  data() {
    return {
      title: 'Rechnung',
      invoice: null,
      payments: [],
      total_paid_amount: 0,
      auth: null
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
        // this.total_paid_amount = Number(result.total_paid_amount).toFixed(2)
        console.log('Invoice Data:', this.invoice)
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
<style>
.payment-head {
  font-weight: 600;
  color: var(--lightColor);
  font-size: 14px;
}
.payment-row {
  font-weight: 600;
  color: var(--midColor);
  font-size: 12px;
}
.custom-row {
  display: flex;
  flex-direction: column;
  height: auto;
}
/* PREVIEW PANEL */
.preview-panel {
  width: 100%;
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

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  margin: 0 10px;
}
.btn-payment {
  background: #3b82f6;
  color: white;
  width: 100%;
  margin-bottom: 20px;
}
.btn-cancel {
  background: #ef4444;
  color: white;
  margin-left: auto;
  margin-top: 10px;
}
.btn-text {
  text-decoration: none !important;
  box-shadow: none;
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

/* FORM GROUPS */
.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row-4 {
  grid-template-columns: repeat(4, 1fr);
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  margin-top: 1rem;
}

/* Tablo başlıkları */
thead th {
  background-color: #f3f3f3;
  color: #333;
  font-weight: bold;
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid #ccc;
}

/* Tablo hücreleri */
tbody td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

/* Satır hover efekti */
tbody tr:hover {
  background-color: #fafafa;
}

/* Buton basit stil */
button {
  padding: 4px 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

/* Buton hover efekti */
button:hover {
  background-color: #0056b3;
}

/* Responsive küçük ekranlar için */
@media (max-width: 768px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    display: none;
  }

  tbody tr {
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    padding: 8px;
    border-radius: 4px;
  }

  tbody td {
    display: flex;
    justify-content: space-between;
    padding: 6px 8px;
  }

  tbody td::before {
    content: attr(data-label);
    font-weight: bold;
    flex-basis: 50%;
  }
}
</style>
