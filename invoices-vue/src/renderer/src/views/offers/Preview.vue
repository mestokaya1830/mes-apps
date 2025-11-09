<template>
  <div>
    <div v-if="offersPreview && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- Recipient & offer Details -->
        <div v-if="offersPreview?.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ offersPreview.selected_customer.company_name }}
            </div>
            <div>{{ offersPreview.selected_customer.address }}</div>
            <div>
              {{ offersPreview.selected_customer.postal_code }}
              {{ offersPreview.selected_customer.city }} <br />
              {{ offersPreview.selected_customer.country }}
            </div>
          </div>

          <div class="invoice-details">
            <div class="section-title">Angebotdetails</div>
            <div class="meta-row">
              <span class="meta-label">Aangebot-Nr.:</span>
              <span class="meta-value">{{ formatAngebotId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(offersPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(offersPreview.selected_customer.id)
              }}</span>
            </div>

            <!-- Optional tax fields -->
            <div v-if="offersPreview.selected_customer.tax_number" class="meta-row">
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ offersPreview.selected_customer.tax_number }}</span>
            </div>
            <div v-if="offersPreview.selected_customer.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ offersPreview.selected_customer.vat_id }}</span>
            </div>
            <div v-if="offersPreview.valid_days" class="meta-row">
              <span class="meta-label">Gültig bis:</span>
              <span class="meta-value">{{
                formatValidDays(offersPreview.date, offersPreview.valid_days)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
          <span v-if="offersPreview.title" class="project-badge">
            {{ offersPreview.title }}
          </span>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          Sehr geehrter Herr Weber,<br /><br />
          vielen Dank für Ihre Auftragserteilung. Hiermit bestätigen wir den Eingang Ihres Auftrags
          auf Grundlage unseres Angebots vom {{ formatDate(offersPreview.offer_date) }}.
        </div>

        <!-- Positions Table -->
        <EventsPreview v-if="offersPreview.events" :data="offersPreview.events" />

        <!-- Project Info -->
        <div class="delivery-box">
          <div class="delivery-title">📅 Geplanter Projektstart</div>
          <div>
            Projektstart: {{ formatDate(offersPreview.project_start) }}<br />
            Voraussichtliche Dauer: {{ offersPreview.project_duration }} Wochen
          </div>
        </div>

        <!-- Closing -->
        <div class="closing closing-pro">
          Wir bedanken uns für Ihr Vertrauen und freuen uns auf eine erfolgreiche Zusammenarbeit.<br /><br />
          Mit freundlichen Grüßen
        </div>

        <!-- Contact Person -->
        <ContactPersonPreview :contactData="auth.contact_person"/>
        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="offersPreview.selected_customer"
        :email="offersPreview.selected_customer.email"
        :file-name="title + ' ' + formatAngebotId"
      />
    </div>

    <router-link to="/offers/create" class="back-link">
      ← Zurück zur Auftragserstellung
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import EventsPreview from '../../components/preview/EventsPreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'

export default {
  name: 'OffersPreview',
  components: {
    HeaderSidePreview,
    EventsPreview,
    ContactPersonPreview,
    FooterSidePreview,
    ActionsButtonPreview
  },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate', 'formatValidDays'],
  data() {
    return {
      title: 'Angebotbestätigung',
      offersPreview: null,
      auth: null
    }
  },
  computed: {
    formatAngebotId() {
      if (!this.offersPreview.id) return ''
      const year = new Date().getFullYear()
      return `ANG-${year}-${String(this.offersPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getoffersPreview()
    this.getAuth()
  },
  methods: {
    getoffersPreview() {
      if (store.state.offers) {
        this.offersPreview = store.state.offers
      } else {
        return this.offersPreview
      }
      console.log('Offers Preview Data:', this.offersPreview)
    },
    async getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      } else {
        return this.auth
      }
    }
  }
}
</script>
