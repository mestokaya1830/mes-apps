<template>
  <div v-if="ordersPreview">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header section -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- Recipient and order details -->
        <div v-if="ordersPreview.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="recipient-title">Empfänger</div>
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

          <!-- recipient details -->
          <div class="recipient-details">
            <div class="recipient-title">Auftragsdetails</div>

            <div class="meta-row">
              <span class="meta-label">Auftrags-Nr.:</span>
              <span class="meta-value">{{ formattedOrderId }}</span>
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
            <div v-if="auth.tax_number" class="meta-row">
              <span class="meta-label">Tax Number:</span>
              <span class="meta-value">{{ auth.tax_number }}</span>
            </div>
            <div v-if="auth.vat_id" class="meta-row">
              <span class="meta-label">VAT ID:</span>
              <span class="meta-value">{{ auth.vat_id }}</span>
            </div>
            <div v-if="ordersPreview.customer_reference" class="meta-row">
              <span class="meta-label">Kundenreferenz:</span>
              <span class="meta-value">{{ ordersPreview.customer_reference }}</span>
            </div>

            <!-- Service period -->
            <div
              v-if="ordersPreview.service_period_start && ordersPreview.service_period_end"
              class="meta-row"
            >
              <span class="meta-label">Service Period:</span>
              <span class="meta-value">
                {{ formatDate(ordersPreview.service_period_start) }} -
                {{ formatDate(ordersPreview.service_period_end) }}
              </span>
            </div>
          </div>
        </div>
        <!-- Positions table -->
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
          <tbody v-if="ordersPreview.positions && ordersPreview.positions.length > 0">
            <tr v-for="(item, index) in ordersPreview.positions" :key="index">
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
              <td class="right">{{ formatCurrency(item.price, ordersPreview.currency) }}</td>
              <td class="right">
                {{ item.vat + '%' }}
              </td>
              <td class="right">
                {{ formatCurrency(item.unit_total, ordersPreview.currency) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- summary -->
        <div v-if="ordersPreview.summary" class="summary-section">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.summary.subtotal, ordersPreview.currency)
            }}</span>
          </div>

          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.summary.vat_amount, ordersPreview.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.summary.total, ordersPreview.currency)
            }}</span>
          </div>
        </div>

         <div class="form-section">
          <!-- Delivery date -->
          <div v-if="ordersPreview.delivery_date" class="meta-row">
            <span class="meta-label">Delivery Date:</span>
            <span class="meta-value">{{ formatDate(ordersPreview.delivery_date) }}</span>
          </div>

          <!-- Valid until -->
          <div v-if="ordersPreview.validity_date" class="meta-row">
            <span class="meta-label">Valid Until:</span>
            <span class="meta-value">{{ formatDate(ordersPreview.validity_date) }}</span>
          </div>

          <!-- Optional delivery address if different -->
          <div v-if="ordersPreview.delivery_address" class="meta-row">
            <span class="meta-label">Delivery Address:</span>
            <span class="meta-value">{{ ordersPreview.delivery_address }}</span>
          </div>
        </div>

        <!-- Payment and delivery terms -->
        <div v-if="ordersPreview" class="terms-section">
          <div class="section-title">Payment & Delivery Terms</div>
          <div class="terms-grid">
            <div v-if="ordersPreview.payment?.payment_terms" class="term-item">
              <span class="term-label">Payment Terms:</span>
              <span class="term-value">{{ paymentTermsText }}</span>
            </div>
            <div v-if="ordersPreview.payment?.payment_method" class="term-item">
              <span class="term-label">Payment Method:</span>
              <span class="term-value">{{ ordersPreview.payment.payment_method }}</span>
            </div>
            <div v-if="ordersPreview.delivery_terms" class="term-item">
              <span class="term-label">Delivery Terms:</span>
              <span class="term-value">{{ ordersPreview.delivery_terms }}</span>
            </div>
            <div v-if="ordersPreview.shipping_method" class="term-item">
              <span class="term-label">Shipping Method:</span>
              <span class="term-value">{{ ordersPreview.shipping_method }}</span>
            </div>
          </div>
          <div v-if="ordersPreview.payment?.payment_conditions" class="payment-conditions">
            {{ ordersPreview.payment.payment_conditions }}
          </div>
        </div>

        <!-- Closing text -->
        <div class="closing-text">
          {{ ordersPreview.closing_text }}
          <p>Mit freundlichen Grüßen,</p>
        </div>

        <!-- Contact person -->
        <ContactPersonPreview :contactData="auth.contact_person" />

        <!-- Bank information -->
        <div class="bank-box">
          <div class="bank-title">🏦 Bank Details</div>
          <div class="bank-info">
            <span class="bank-label">Bank:</span>
            <span class="bank-value">{{ auth.bank_name }}</span>
            <span class="bank-label">IBAN:</span>
            <span class="bank-value">{{ auth.iban }}</span>
            <span class="bank-label">BIC:</span>
            <span class="bank-value">{{ auth.bic }}</span>
            <span class="bank-label">Verwendungszweck:</span>
            <span class="bank-value">{{ ordersPreview.verwendungszweck }}</span>
          </div>
        </div>

        <!-- leagal validity -->
        <div v-if="ordersPreview.is_legal" class="pdf-footer">
          <label style="display: flex; align-items: center; gap: 8px">
            <input type="checkbox" checked disabled style="width: 16px; height: 16px" />
            Rechtsgültige Unterschrift erforderlich
          </label>

          <div
            class="signature-box"
            style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px"
          >
            <div class="signature-line">
              <div>_____________________________</div>
              <div class="signature-label">Ort, Datum</div>
            </div>
            <div class="signature-line">
              <div>_____________________________</div>
              <div class="signature-label">Unterschrift</div>
            </div>
          </div>
        </div>

        <!-- Footer with legal info / AGB notice -->
        <FooterSidePreview />
      </div>

      <!-- Actions -->
      <ActionsButtonPreview
        v-if="ordersPreview.selected_customer"
        tableName="orders"
        :email="ordersPreview.selected_customer.email"
        :documentId="formattedOrderId"
        :invoicesData="ordersPreview"
        clearStoreName="orders"
      />
    </div>

    <router-link to="/orders/create" class="back-link">
      ← Zurück zur Rechnungserstellung
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
  name: 'OrdersPreviewPage',
  components: {
    HeaderSidePreview,
    FooterSidePreview,
    ActionsButtonPreview,
    ContactPersonPreview
  },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Auftragsbestätigung',
      ordersPreview: null,
      auth: null
    }
  },
  computed: {
    // Format order ID like AUF-2025-00001
    formattedOrderId() {
      if (!this.ordersPreview.id) return ''
      const year = new Date().getFullYear()
      return `AUF-${year}-${String(this.ordersPreview.id).padStart(5, '0')}`
    },
    // Check if payment or delivery terms exist
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
    // Get readable payment terms text
    paymentTermsText() {
      if (!this.ordersPreview.payment?.payment_terms) return ''
      const terms = this.ordersPreview.payment.payment_terms
      if (terms === 'vorkasse') return 'Prepayment'
      if (terms === 0) return 'Due immediately'
      return `Due within ${terms} days`
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
      }
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      }
    }
  }
}
</script>

<style>
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

/* ---------- Payment & delivery ---------- */
.terms-section {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}
.recipient-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 16px;
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

/* ---------- Closing text ---------- */
.closing-text {
  margin: 40px 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin-left: 20px;
}

/* ---------- Bank info ---------- */
.bank-box {
  margin: 30px 0;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  background: #f8f9fa;
}
.bank-title {
  font-weight: 700;
  margin-bottom: 12px;
}
.bank-info {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
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
/* ---------- Responsive / print ---------- */
@media print {
  .terms-section,
  .positions-table {
    page-break-inside: avoid;
  }
  .positions-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
}
</style>
