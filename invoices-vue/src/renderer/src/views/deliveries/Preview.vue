<template>
  <div>
    <div v-if="deliveriesPreview" class="preview-panel" >
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- customers -->
        <div class="recipient">
          <div class="recipient-address">
            <div class="recipient-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ deliveriesPreview.selected_customer.company_name }}
            </div>
            <div class="meta-label">{{ deliveriesPreview.selected_customer.address }}</div>
            <div class="meta-label">
              {{ deliveriesPreview.selected_customer.postal_code }}
              {{ deliveriesPreview.selected_customer.city }}<br />
              {{ deliveriesPreview.selected_customer.country }}
            </div>
          </div>
          <!-- delivery Details -->
          <div v-if="deliveriesPreview" class="recipient-details">
            <div class="recipient-title">Deliverydetails</div>
            <div class="meta-row">
              <span class="meta-label">Lieferschein-Nr.:</span>
              <span class="meta-value">{{ formatDeliveryId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(deliveriesPreview.selected_customer.id)
              }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Auftrags-Nr.:</span>
              <span class="meta-value">{{ formatOrderId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(deliveriesPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Lieferreferenz:</span>
              <span class="meta-value">{{ deliveriesPreview.delivery_reference }}</span>
            </div>
          </div>
        </div>

        <!-- Positions -->
        <div class="positions-section" v-if="deliveriesPreview.positions.length">
          <table class="positions-table">
            <thead>
              <tr>
                <th class="col-pos">Pos.</th>
                <th class="col-description">Bezeichnung / Beschreibung</th>
                <th class="col-quantity">Menge</th>
                <th class="col-unit">Einheit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pos, index) in deliveriesPreview.positions" :key="index">
                <td class="col-pos">{{ index + 1 }}</td>
                <td class="col-description">
                  <strong>{{ pos.title }}</strong>
                  <p v-if="pos.description" class="description-text">{{ pos.description }}</p>
                </td>
                <td class="col-quantity">{{ pos.quantity }}</td>
                <td class="col-unit">{{ pos.unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Status & notes -->
        <div class="status-section">
          <p><strong>Status:</strong> {{ getStatusText(deliveriesPreview.delivery_status) }}</p>
          <p v-if="deliveriesPreview.delivered_by">
            <strong>Ausgeliefert von:</strong> {{ deliveriesPreview.delivered_by }}
          </p>
          <p v-if="deliveriesPreview.received_by">
            <strong>Empfangen von:</strong> {{ deliveriesPreview.received_by }}
          </p>
        </div>

        <div v-if="deliveriesPreview.note" class="notes-section">
          <h3>Bemerkungen:</h3>
          <p>{{ deliveriesPreview.note }}</p>
        </div>
        <!-- Contact Person -->
        <ContactPersonPreview :contactData="auth.contact_person" />
        <!-- Signatures -->
        <div class="signatures-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <p>Unterschrift Lieferant</p>
            <p class="signature-date">Datum: {{ formatDate(deliveriesPreview.delivery_date) }}</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p>Unterschrift Empfänger</p>
            <p class="signature-date">Datum: _______________</p>
          </div>
        </div>

        <FooterSidePreview />
      </div>
      <ActionsButtonPreview
        v-if="deliveriesPreview"
        tableName="deliveries"
        :tableData="deliveriesPreview"
        sourcePage="preview"
      />
    </div>

    <router-link to="/deliveries/create" class="back-link">
      ← Zurück zur Rechnungserstellung
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
export default {
  name: 'PreviewDelivery',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    ActionsButtonPreview,
    FooterSidePreview
  },
  inject: ['formatCustomerId', 'formatDate', 'formatValidDays', 'formatCurrency'],
  data() {
    return {
      deliveriesPreview: null,
      auth: null
    }
  },
  computed: {
    formatDeliveryId() {
      if (!this.deliveriesPreview || !this.deliveriesPreview.id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(this.deliveriesPreview.id).padStart(5, '0')}`
    },
    formatOrderId() {
      if (!this.deliveriesPreview || !this.deliveriesPreview.id) return ''
      const year = new Date().getFullYear()
      return `AUF-${year}-${String(this.deliveriesPreview.order_id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getDeliveriesPreview()
    this.getAuth()
  },
  methods: {
    getDeliveriesPreview() {
      if (store.state.deliveries) {
        this.deliveriesPreview = store.state.deliveries
        console.log(this.deliveriesPreview)
      }
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      } else {
        console.warn('No auth data in store')
      }
    },
    getStatusText(status) {
      const statusMap = {
        pending: '⏳ Ausstehend',
        in_transit: '🚚 In Transit',
        delivered: '✅ Geliefert',
        cancelled: '❌ Storniert'
      }
      return statusMap[status] || status
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

.signatures-section{
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 40px;
  gap: 20px;
}
</style>
