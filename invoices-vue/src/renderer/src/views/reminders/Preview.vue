<template>
  <div v-if="reminderPreview && auth" class="editor-panel">
    <div class="printable">
      <!-- Header -->
      <HeaderSidePreview :title="title" :auth="auth" />

      <!-- customers -->
      <div class="recipient">
        <div class="recipient-address">
          <div class="recipient-title">Empfänger</div>
          <div class="company-name-subtitle">
            {{ reminderPreview.customer.company_name }}
          </div>
          <div class="meta-label">{{ reminderPreview.customer.address }}</div>
          <div class="meta-label">
            {{ reminderPreview.customer.postal_code }}
            {{ reminderPreview.customer.city }}<br />
            {{ reminderPreview.customer.country }}
          </div>
        </div>
        <!-- recipient details -->
        <div class="recipient-details">
          <div class="recipient-title">Rechnungsdetails</div>

          <div class="meta-row">
            <span class="meta-label">Mahnung-Nr.:</span>
            <span class="meta-value">{{ formatReminderId(reminderPreview.id) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Rechnung-Nr.:</span>
            <span class="meta-value">{{ formatInvoiceId(reminderPreview.invoice_id) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ formatDate(reminderPreview.date) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Kunden-Nr.:</span>
            <span class="meta-value">{{ formatCustomerId(reminderPreview.customer.id) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">USt-IdNr.:</span>
            <span class="meta-value">{{ reminderPreview.customer.vat_id || '' }}</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div>
        <p class="greeting">Sehr geehrte Damen und Herren,</p>
        <p v-if="reminderPreview?.intro_text">{{ reminderPreview.intro_text }}</p>
      </div>

      <!-- remeinders Details -->
      <div class="reminders-card">
        <h3 class="reminders-title">📄 Offene Rechnung(en)</h3>

        <div class="info-row">
          <span>Rechnungsnummer</span>
          <span>{{ formatInvoiceId(reminderPreview.invoice.id) }}</span>
        </div>

        <div class="info-row">
          <span>Rechnungsdatum</span>
          <span>{{ formatDate(reminderPreview.invoice.date) }}</span>
        </div>

        <div class="info-row">
          <span>Fälligkeitsdatum</span>
          <span>{{ formatDate(reminderPreview.invoice.due_date) }}</span>
        </div>

        <div class="info-row">
          <span>Betrag</span>
          <span>{{ formatCurrency(reminderPreview.invoice.gross_total) }}</span>
        </div>

        <div class="info-row muted">
          <span>Mahngebühr</span>
          <span>{{ formatCurrency(reminderPreview.reminder_fee) }}</span>
        </div>

        <div class="info-row muted">
          <span>Verzugszinsen</span>
          <span>{{ formatCurrency(reminderPreview.late_interest) }}</span>
        </div>

        <div class="info-row total">
          <span>Offener Gesamtbetrag</span>
          <span>
            {{ formatCurrency(setTotalAmount, reminderPreview.invoice.currency) }}
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
          <span class="bank-value">Zahlungsziel: {{ reminderPreview.payment_deadline }}</span>
        </div>
      </div>

      <!-- Warning Box -->
      <div v-if="reminderPreview?.level >= 2" class="warning-box">
        <div v-if="reminderPreview.level === '2'">
          <strong>⚠️ Wichtiger Hinweis:</strong><br />
          <p>{{ reminderPreview.warning_text }}</p>
        </div>
        <div v-if="reminderPreview.level === '3'">
          <strong>🚨 Letzte Mahnung:</strong><br />
          <p>{{ reminderPreview.warning_text }}</p>
        </div>
      </div>

      <div class="reminderPreview-content">
        <p v-if="reminderPreview?.closing_text">{{ reminderPreview.closing_text }}</p>
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
    <RemiderActions
      v-if="reminderPreview"
      :tableData="reminderPreview"
      :fileName="actionFileName"
      sourcePage="preview"
    />
    <router-link
      v-if="reminderPreview"
      :to="`/reminders/create/${reminderPreview.invoice_id}`"
      class="back-link"
    >
      ← Zurück zur Rechnungserstellung
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import RemiderActions from '../../components/preview/RemiderActions.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'

export default {
  name: 'ReminderPreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    RemiderActions,
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
      title: 'Mahnungs Vorschau',
      reminderPreview: null,
      auth: null
    }
  },
  computed: {
    setTotalAmount() {
      if (!this.reminderPreview) return
      return (
        this.reminderPreview.invoice.gross_total +
        this.reminderPreview.reminder_fee +
        this.reminderPreview.late_interest
      )
    },
    actionFileName() {
      if (!this.reminderPreview) return
      return this.formatReminderId(this.reminderPreview.id)
    }
  },
  mounted() {
    this.getReminderPreview()
    this.getAuth()
  },
  methods: {
    getReminderPreview() {
      if (!store.state.reminder) return
      this.reminderPreview = store.state.reminder
      console.log('preview', this.reminderPreview)
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    }
  }
}
</script>
