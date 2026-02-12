<template>
  <div v-if="reminder && auth" class="main-container">
     <header class="main-header">
      <label class="main-title">{{ title }}</label>
      <router-link to="/reminders" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons"></i>Zurück
      </router-link>
    </header>
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

      <!-- reminders Details -->
      <div class="reminders-card">
        <h3 class="reminders-title">
          <i class="bi bi-file-text icons"></i>Offene Rechnung(en)
        </h3>

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
      <div v-if="auth" class="preview-box">
        <div class="preview-box-title">
          <i class="bi bi-bank2 icons"></i>Bankverbindung
        </div>
        <div class="bank-info">
          <span class="preview-box-label">Bank:</span>
          <span class="preview-box-value">{{ auth.bank_name }}</span>
          <span class="preview-box-label">IBAN:</span>
          <span class="preview-box-value">{{ auth.iban }}</span>
          <span class="preview-box-label">BIC:</span>
          <span class="preview-box-value">{{ auth.bic }}</span>
          <span class="preview-box-value">Zahlungsziel: {{ reminder.payment_deadline }}</span>
        </div>
      </div>

      <!-- Warning Box -->
      <div v-if="reminder?.level >= 2" class="warning-box">
        <div v-if="reminder.level === '2'">
          <strong><i class="bi bi-exclamation-triangle-fill text-warning icons"></i>Wichtiger Hinweis:</strong><br />
          <p>{{ reminder.warning_text }}</p>
        </div>
        <div v-if="reminder.level === '3'">
          <strong><i class="bi bi-exclamation-octagon-fill text-danger icons"></i>Letzte Mahnung:</strong><br />
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
    <RemiderActions
      v-if="reminder"
      :tableData="reminder"
      :fileName="actionFileName"
      sourcePage="details"
    />
    <router-link v-if="reminder" :to="`/reminders/create/${reminder.invoice_id}`" class="btn back-btn">
      <i class="bi bi-arrow-left icons"></i>Zurück zur Rechnungserstellung
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
  name: 'ReminderDetails',
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
    },
    actionFileName() {
      if (!this.reminder) return
      return this.formatReminderId(this.reminder.id)
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