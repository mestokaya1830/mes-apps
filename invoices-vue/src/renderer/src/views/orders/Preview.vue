<template>
  <div v-if="ordersPreview">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- Recipient & Order Details -->
        <div v-if="ordersPreview.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Kunde</div>
            <div class="company-name-subtitle">
              {{ ordersPreview.selected_customer.company_name }}
            </div>
            <div>{{ ordersPreview.selected_customer.address }}</div>
            <div>
              {{ ordersPreview.selected_customer.postal_code }}
              {{ ordersPreview.selected_customer.city }}<br />
              {{ ordersPreview.selected_customer.country }}
            </div>
          </div>

          <div class="invoice-details">
            <div class="section-title">Auftragsdaten</div>
            <div class="meta-row">
              <span class="meta-label">Auftrags-Nr.:</span>
              <span class="meta-value">{{ formatAuftragId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(ordersPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(ordersPreview.selected_customer.id)
              }}</span>
            </div>

            <!-- Leistungszeitraum -->
            <div
              v-if="ordersPreview.service_period_start && ordersPreview.service_period_end"
              class="meta-row"
            >
              <span class="meta-label">Leistungszeitraum:</span>
              <span class="meta-value">
                {{ formatDate(ordersPreview.service_period_start) }} -
                {{ formatDate(ordersPreview.service_period_end) }}
              </span>
            </div>

            <!-- NEU: Liefertermin -->
            <div v-if="ordersPreview.delivery_date" class="meta-row">
              <span class="meta-label">Liefertermin:</span>
              <span class="meta-value">{{ formatDate(ordersPreview.delivery_date) }}</span>
            </div>

            <!-- NEU: Gültigkeit -->
            <div v-if="ordersPreview.validity_date" class="meta-row">
              <span class="meta-label">Gültig bis:</span>
              <span class="meta-value">{{ formatDate(ordersPreview.validity_date) }}</span>
            </div>

            <!-- Optional tax fields -->
            <div v-if="auth.tax_number" class="meta-row">
              <span class="meta-label">Steuernummer:</span>
              <span class="meta-value">{{ auth.tax_number }}</span>
            </div>
            <div v-if="auth.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ auth.vat_id }}</span>
            </div>
          </div>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          <template v-if="ordersPreview.selected_customer?.gender === 'f'">
            Sehr geehrte Frau {{ ordersPreview.selected_customer?.last_name }},
          </template>
          <template v-else-if="ordersPreview.selected_customer?.gender === 'm'">
            Sehr geehrter Herr {{ ordersPreview.selected_customer?.last_name }},
          </template>
          <template v-else> Sehr geehrte Damen und Herren, </template>
          <br /><br />
          vielen Dank für Ihren Auftrag. Hiermit bestätigen wir diesen wie folgt:
        </div>

        <!-- Positions Table -->
        <table class="positions-table">
          <thead>
            <tr>
              <th style="width: 5%">Pos.</th>
              <th style="width: 50%">Bezeichnung</th>
              <th class="center" style="width: 10%">Menge</th>
              <th class="right" style="width: 12%">Einzelpreis</th>
              <th class="center" style="width: 8%">MwSt.</th>
              <th class="right" style="width: 15%">Gesamt</th>
            </tr>
          </thead>

          <tbody v-if="ordersPreview.positions && ordersPreview.positions.length > 0">
            <tr v-for="(item, index) in ordersPreview.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
                <div
                  class="position-service-period"
                  v-if="item.service_period_start && item.service_period_end"
                >
                  Leistungszeitraum: {{ formatDate(item.service_period_start) }} -
                  {{ formatDate(item.service_period_end) }}
                </div>
              </td>
              <td class="center">{{ item.quantity }} {{ item.unit || 'Stk' }}</td>
              <td class="right">
                {{ formatCurrency(item.price, ordersPreview.currency) }}
              </td>
              <td class="center">{{ item.vat }}%</td>
              <td class="right">
                {{ formatCurrency(item.gross_amount || item.unit_total, ordersPreview.currency) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- NEU: Erweiterte Summary mit MwSt-Aufschlüsselung -->
        <div v-if="ordersPreview.summary" class="totals">
          <!-- Nettobetrag -->
          <div class="total-row">
            <span class="total-label">Summe Netto:</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.summary.subtotal, ordersPreview.currency)
            }}</span>
          </div>

          <!-- MwSt-Aufschlüsselung -->
          <div
            v-for="vat in ordersPreview.summary.vat_breakdown"
            :key="vat.rate"
            class="total-row vat-breakdown"
          >
            <span class="total-label">+ MwSt ({{ vat.rate }}%):</span>
            <span class="total-value">{{
              formatCurrency(vat.amount, ordersPreview.currency)
            }}</span>
          </div>

          <!-- Gesamtbetrag -->
          <div class="total-row total-gross">
            <span class="total-label">Gesamtbetrag (Brutto):</span>
            <span class="total-value total-value-highlight">{{
              formatCurrency(ordersPreview.summary.total, ordersPreview.currency)
            }}</span>
          </div>

          <!-- Kleinunternehmer Hinweis -->
          <div v-if="auth.is_kleinunternehmer" class="tax-note">
            <span class="tax-icon">ℹ️</span>
            <span>Gemäß §19 UStG wird keine Umsatzsteuer berechnet.</span>
          </div>
        </div>

        <!-- NEU: Zahlungs- und Lieferbedingungen -->
        <div v-if="hasPaymentOrDeliveryTerms" class="terms-section">
          <div class="section-title">Zahlungs- und Lieferbedingungen</div>

          <div class="terms-grid">
            <!-- Zahlungsbedingungen -->
            <div
              v-if="ordersPreview.payment && ordersPreview.payment.payment_terms"
              class="term-item"
            >
              <span class="term-label">Zahlungsbedingungen:</span>
              <span class="term-value">{{ getPaymentTermsText }}</span>
            </div>

            <!-- Zahlungsart -->
            <div
              v-if="ordersPreview.payment && ordersPreview.payment.payment_method"
              class="term-item"
            >
              <span class="term-label">Zahlungsart:</span>
              <span class="term-value">{{ ordersPreview.payment.payment_method }}</span>
            </div>

            <!-- Lieferbedingungen -->
            <div v-if="ordersPreview.delivery_terms" class="term-item">
              <span class="term-label">Lieferbedingungen:</span>
              <span class="term-value">{{ ordersPreview.delivery_terms }}</span>
            </div>

            <!-- Versandart -->
            <div v-if="ordersPreview.shipping_method" class="term-item">
              <span class="term-label">Versandart:</span>
              <span class="term-value">{{ ordersPreview.shipping_method }}</span>
            </div>
          </div>

          <!-- Zusätzliche Zahlungshinweise -->
          <div
            v-if="ordersPreview.payment && ordersPreview.payment.payment_conditions"
            class="payment-conditions"
          >
            {{ ordersPreview.payment.payment_conditions }}
          </div>
        </div>

        <!-- NEU: Kundennotiz -->
        <div v-if="ordersPreview.customer_notes" class="customer-notes">
          <div class="section-title">Hinweise</div>
          <div class="notes-content">{{ ordersPreview.customer_notes }}</div>
        </div>

        <!-- NEU: Besondere Hinweise -->
        <div v-if="ordersPreview.special_notes" class="special-notes">
          <div class="section-title">Besondere Hinweise</div>
          <div class="notes-content">{{ ordersPreview.special_notes }}</div>
        </div>

        <!-- Abschlusstext -->
        <div class="closing-text">
          Wir freuen uns auf die Zusammenarbeit und stehen für Rückfragen gerne zur Verfügung.
          <br /><br />
          Mit freundlichen Grüßen
        </div>

        <ContactPersonPreview :contactData="auth.contact_person" />
        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="ordersPreview.selected_customer"
        tableName="orders"
        :email="ordersPreview.selected_customer.email"
        :documentId="formatAuftragId"
        :invoicesData="ordersPreview"
      />
    </div>

    <router-link to="/orders/create" class="back-link">
      ← Zurück zur Auftragserstellung
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'

export default {
  name: 'OrdersPreview',
  components: {
    HeaderSidePreview,
    FooterSidePreview,
    ActionsButtonPreview,
    ContactPersonPreview
  },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate', 'formatNumber'],
  data() {
    return {
      title: 'Auftragsbestätigung',
      ordersPreview: null,
      auth: null
    }
  },
  computed: {
    formatAuftragId() {
      if (!this.ordersPreview.id) return ''
      const year = new Date().getFullYear()
      return `AUF-${year}-${String(this.ordersPreview.id).padStart(5, '0')}`
    },
    hasPaymentOrDeliveryTerms() {
      return (
        (this.ordersPreview.payment &&
          (this.ordersPreview.payment.payment_terms ||
            this.ordersPreview.payment.payment_method ||
            this.ordersPreview.payment.payment_conditions)) ||
        this.ordersPreview.delivery_terms ||
        this.ordersPreview.shipping_method
      )
    },
    getPaymentTermsText() {
      if (!this.ordersPreview.payment || !this.ordersPreview.payment.payment_terms) return ''

      const terms = this.ordersPreview.payment.payment_terms

      if (terms === 'vorkasse') return 'Vorkasse'
      if (terms === 0) return 'Sofort zahlbar'

      return `Zahlbar innerhalb von ${terms} Tagen`
    }
  },
  mounted() {
    this.getOrdersPreview()
    this.getAuth()
  },
  methods: {
    getOrdersPreview() {
      if (store.state.orders) {
        this.ordersPreview = store.state.orders
      } else {
        return this.ordersPreview
      }
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      } else {
        return this.auth
      }
    }
  }
}
</script>

<style scoped>
.positions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: 9px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.positions-table thead {
  background: #f1f5f9;
}

.positions-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #333;
  border: 1px solid #e2e8f0;
}

.positions-table th.left,
.positions-table td.left {
  text-align: left;
}

.positions-table th.right,
.positions-table td.right {
  text-align: right;
}

.positions-table th.center,
.positions-table td.center {
  text-align: center;
}

.positions-table tbody tr {
  border-bottom: 1px solid #e9ecef;
}

.positions-table td {
  padding: 18px 16px;
  font-size: 14px;
  color: #1e293b;
}

.positions-table td.right {
  text-align: right;
  font-weight: 600;
}

.position-title {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.position-description {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  line-height: 1.4;
}

.position-service-period {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
  font-style: italic;
}

/* TOTALS */
.totals {
  margin-left: auto;
  width: 320px;
  margin-top: 40px;
  margin-bottom: 30px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 10px;
}

.total-row.vat-breakdown {
  padding-left: 16px;
  font-size: 13px;
  color: #64748b;
}

.total-row.total-gross {
  border-top: 2px solid #1e293b;
  margin-top: 8px;
  padding-top: 12px;
  font-weight: 700;
}

.total-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.total-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.total-value-highlight {
  font-size: 16px;
  color: #16a34a;
  font-weight: 700;
}

.tax-note {
  margin-top: 20px;
  padding: 16px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #92400e;
  align-items: flex-start;
}

.tax-icon {
  font-size: 18px;
  flex-shrink: 0;
}

/* NEU: Zahlungs- und Lieferbedingungen */
.terms-section {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.term-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.term-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.term-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

.payment-conditions {
  margin-top: 16px;
  padding: 12px;
  background: #fff;
  border-left: 3px solid #3b82f6;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

/* NEU: Notizen */
.customer-notes,
.special-notes {
  margin: 25px 0;
  padding: 20px;
  background: #f1f5f9;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.special-notes {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.notes-content {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Abschlusstext */
.closing-text {
  margin: 40px 0 30px 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
}

/* Intro Text */
.intro-text {
  margin: 30px 0;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.6;
}

/* Responsive adjustments */
@media print {
  .terms-section,
  .customer-notes,
  .special-notes {
    page-break-inside: avoid;
  }

  .positions-table {
    page-break-inside: auto;
  }

  .positions-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
}
</style>
