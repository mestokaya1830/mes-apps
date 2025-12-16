<template>
  <div>
    <div v-if="reminder && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- customers -->
        <div class="recipient">
          <div class="recipient-address">
            <div class="recipient-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ reminder.customer.company_name }}
            </div>
            <div class="meta-label">{{ reminder.customer.address }}</div>
            <div class="meta-label">
              {{ reminder.customer.postal_code }}
              {{ reminder.customer.city }}<br />
              {{ reminder.customer.country }}
            </div>
          </div>
          <!-- recipient details -->
          <div class="recipient-details">
            <div class="recipient-title">Rechnungsdetails</div>

            <div class="meta-row">
              <span class="meta-label">Mahnung-Nr.:</span>
              <span class="meta-value">{{ formatReminderId(reminder.id) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Rechnung-Nr.:</span>
              <span class="meta-value">{{ formatInvoiceId(reminder.invoice_id) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(reminder.date) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{ formatCustomerId(reminder.customer.id) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ reminder.customer.vat_id || '' }}</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div>
          <p class="greeting">Sehr geehrte Damen und Herren,</p>
          <p v-if="reminder?.intro_text">{{ reminder.intro_text }}</p>
        </div>

        <!-- remeinders Details -->
        <div class="reminders-card">
          <h3 class="reminders-title">📄 Offene Rechnung(en)</h3>

          <div class="info-row">
            <span>Rechnungsnummer</span>
            <span>{{ formatInvoiceId(reminder.invoice.id) }}</span>
          </div>

          <div class="info-row">
            <span>Rechnungsdatum</span>
            <span>{{ formatDate(reminder.invoice.date) }}</span>
          </div>

          <div class="info-row">
            <span>Fälligkeitsdatum</span>
            <span>{{ formatDate(reminder.invoice.due_date) }}</span>
          </div>

          <div class="info-row">
            <span>Betrag</span>
            <span>{{ formatCurrency(reminder.invoice.gross_total) }}</span>
          </div>

          <div class="info-row muted">
            <span>Mahngebühr</span>
            <span>{{ formatCurrency(reminder.reminder_fee) }}</span>
          </div>

          <div class="info-row muted">
            <span>Verzugszinsen</span>
            <span>{{ formatCurrency(reminder.late_interest) }}</span>
          </div>

          <div class="info-row total">
            <span>Offener Gesamtbetrag</span>
            <span>
              {{ formatCurrency(setTotalAmount, reminder.invoice.currency) }}
            </span>
          </div>
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
            <span class="bank-value">Zahlungsziel: {{ reminder.payment_deadline }}</span>
          </div>
        </div>

        <!-- Warning Box -->
        <div v-if="reminder?.level >= 2" class="warning-box">
          <div v-if="reminder.level === '2'">
            <strong>⚠️ Wichtiger Hinweis:</strong><br />
            <p>{{ reminder.warning_text }}</p>
          </div>
          <div v-if="reminder.level === '3'">
            <strong>🚨 Letzte Mahnung:</strong><br />
            <p>{{ reminder.warning_text }}</p>
          </div>
        </div>

        <div class="reminder-content">
          <p v-if="reminder?.closing_text">{{ reminder.closing_text }}</p>
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
      <ActionsButtonPreview v-if="reminder" :tableData="reminder" sourcePage="details" />
    </div>
    <router-link v-if="reminder" :to="`/reminders/create/${reminder.invoice_id}`" class="back-link">
      ← Zurück zur Rechnungserstellung
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import ActionsButtonPreview from '../../components/reminders/ActionsButtonPreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'

export default {
  name: 'ReminderDetails',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    ActionsButtonPreview,
    FooterSidePreview
  },
  inject: [
    'formatCustomerId',
    'formatInvoiceId',
    'formatReminderId',
    'formatDate',
    'formatCurrency'
  ],
  data() {
    return {
      title: 'Mahnungsdetails',
      reminder: null,
      auth: null
    }
  },
  computed: {
    setTotalAmount() {
      if (!this.reminder) return
      return (
        this.reminder.invoice.gross_total + this.reminder.reminder_fee + this.reminder.late_interest
      )
    }
  },
  mounted() {
    this.getreminder()
    this.getAuth()
  },
  methods: {
    async getreminder() {
      const result = await window.api.getReminderById(this.$route.params.id)
      this.reminder = {
        ...result.rows,
        invoice: JSON.parse(result.rows.invoice),
        customer: JSON.parse(result.rows.customer)
      }
      console.log('reminder Data:', this.reminder)
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    }
  }
}
</script>
<style>
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
.reminders-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.reminders-title {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f1f5f9;
}

.info-row span:last-child {
  font-weight: 500;
  white-space: nowrap;
}

/* Daha az önemli satırlar */
.info-row.muted {
  color: #6b7280;
  font-size: 13px;
}

/* Toplam */
.info-row.total {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 2px solid #e5e7eb;
  font-weight: 600;
  font-size: 15px;
}

.info-row.total span:last-child {
  color: #0369a1;
}
</style>
