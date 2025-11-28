<template>
  <div>
    <div class="preview-panel" v-if="remeinderPreview && auth">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth"/>

        <!-- customers -->
        <div v-if="remeinderPreview" class="recipient">
          <div class="recipient-address">
            <div class="recipient-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ remeinderPreview.selected_invoice.customer.company_name }}
            </div>
            <div class="meta-label">{{ remeinderPreview.selected_invoice.customer.address }}</div>
            <div class="meta-label">
              {{ remeinderPreview.selected_invoice.customer.postal_code }}
              {{ remeinderPreview.selected_invoice.customer.city }}<br />
              {{ remeinderPreview.selected_invoice.customer.country }}
            </div>
          </div>
          <!-- recipient details -->
          <div class="recipient-details">
            <div class="recipient-title">Rechnungsdetails</div>

            <div class="meta-row">
              <span class="meta-label">Mahnung-Nr.:</span>
              <span class="meta-value">{{ formatRemeinderId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Rechnung-Nr.:</span>
              <span class="meta-value">{{ formatInvoiceId }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(remeinderPreview.date) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(remeinderPreview.selected_invoice.customer.id)
              }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{
                remeinderPreview.selected_invoice.customer.vat_id
              }}</span>
            </div>
          </div>
        </div>

        Subject
        <!-- <div class="subject">{{ remeinderPreview.subject }}</div> -->

        <!-- Content -->
        <div>
          <p class="greeting">Sehr geehrte Damen und Herren,</p>
          <p v-if="remeinderPreview?.intro_text">{{ remeinderPreview.intro_text }}</p>
        </div>

        <!-- remeinders Details -->
        <div class="remeinders-details">
          <h3>📄 Offene Rechnung(en)</h3>
          <table class="remeinders-table">
            <thead>
              <tr>
                <th>Rechnungsnummer</th>
                <th>Rechnungsdatum</th>
                <th>Fälligkeitsdatum</th>
                <th>Betrag</th>
              </tr>
            </thead>
            <!-- <tbody>
              <tr v-for="item in remeinderPreview" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ formatDate(item.due_date) }}</td>
                <td>{{ formatCurrency(item.amount) }}</td>
              </tr>
              <tr v-if="item.reminder_fee > 0">
                <td colspan="3">Mahngebühr:</td>
                <td>{{ formatCurrency(item.remeinder_fee) }}</td>
              </tr>
              <tr v-if="item.late_fee > 0">
                <td colspan="3">Verzugszinsen:</td>
                <td>{{ formatCurrency(item.late_fee) }}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">Offener Gesamtbetrag:</td>
                <td>{{ formatCurrency(getTotalAmount()) }}</td>
              </tr>
            </tbody> -->
          </table>
        </div>

        <!-- Bank Info -->
        <div v-if="auth" class="bank-box">
          <div class="bank-title">🏦 Bankverbindung</div>
          <div class="bank-info">
            <span class="bank-label">Bank:</span>
            <span class="bank-value">{{ auth.bank_name }}</span>
            <span class="bank-label">IBAN:</span>
            <span class="bank-value">{{ auth.iban }}</span>
            <span class="bank-label">BIC:</span>
            <span class="bank-value">{{ auth.bic }}</span>
            <span class="bank-label">Verwen..:</span>
            <span class="bank-value">{{
              remeinderPreview.selected_invoice.payment.verwendungszweck
            }}</span>
            <span class="bank-value">Zahlungsziel: {{ remeinderPreview.payment_deadline }}</span>
          </div>
        </div>

        <!-- Warning Box (für 2. und 3. remeinderPreview) -->
        <div v-if="remeinderPreview?.level >= 2" class="warning-box">
          <div v-if="remeinderPreview.level === 2">
            <strong>⚠️ Wichtiger Hinweis:</strong><br />
            <p>{{ remeinderPreview.warning_text }}</p>
          </div>
          <div v-if="remeinderPreview.level === 3">
            <strong>🚨 Letzte remeinderPreview:</strong><br />
            <p>{{ remeinderPreview.warning_text }}</p>
          </div>
        </div>

        <div class="remeinderPreview-content">
          <p v-if="remeinderPreview?.closing_text">
            {{ remeinderPreview.closing_text }}
          </p>
        </div>

        <!-- Closing -->
        <div class="closing">
          <p>Mit freundlichen Grüßen</p>
          <br />
          <p v-if="auth">
            <strong>{{ auth.company_name }}</strong>
          </p>
        </div>
        <!-- Contact Person -->
        <ContactPersonPreview :contactData="auth.contact_person" />

        <!-- Footer -->
        <FooterSidePreview />
      </div>
      <ActionsButtonPreview
        v-if="remeinderPreview.selected_invoice.customer"
        tableName="remeinders"
        :tableData="remeinderPreview"
        sourcePage="preview"
      />
    </div>
    <router-link to="/remeinders/create" class="back-link">
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
  name: 'RemeinderPreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    ActionsButtonPreview,
    FooterSidePreview
  },
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Mahnungs Vorschau',
      remeinderPreview: null,
      auth: null
    }
  },
  computed: {
    formatInvoiceId() {
      if (!this.remeinderPreview || !this.remeinderPreview.id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(this.remeinderPreview.selected_invoice.id).padStart(5, '0')}`
    },
    formatRemeinderId() {
      if (!this.remeinderPreview || !this.remeinderPreview.id) return ''
      const year = new Date().getFullYear()
      return `MAH-${year}-${String(this.remeinderPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getRemeinderPreview()
    this.getAuth()
  },
  methods: {
    getRemeinderPreview() {
      if (store.state.remeinders) {
        this.remeinderPreview = store.state.remeinders
        console.log(this.remeinderPreview)
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
</style>
