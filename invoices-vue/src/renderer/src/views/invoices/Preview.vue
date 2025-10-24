<template>
  <div v-if="invoicesPreview">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :color="'green'" />

        <!-- Recipient & Invoice Details -->
        <div v-if="invoicesPreview.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ invoicesPreview.selected_customer.company_name }}
            </div>
            <div>{{ invoicesPreview.selected_customer.address }}</div>
            <div>
              {{ invoicesPreview.selected_customer.postal_code }}
              {{ invoicesPreview.selected_customer.city }}<br />
              {{ invoicesPreview.selected_customer.country }}
            </div>
          </div>

          <!-- invoice details -->
          <div class="invoice-details">
            <div class="section-title">Rechnungsdetails</div>

            <div class="meta-row">
              <span class="meta-label">Rechnung-Nr.:</span>
              <span class="meta-value">{{ formatRechnungId }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(invoicesPreview.date) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(invoicesPreview.selected_customer.id)
              }}</span>
            </div>

            <div
              v-if="
                invoicesPreview.selected_customer.country === 'Germany' &&
                invoicesPreview.selected_customer.tax_number
              "
              class="meta-row"
            >
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ invoicesPreview.selected_customer.tax_number }}</span>
            </div>

            <div
              v-else-if="
                invoicesPreview.selected_customer.is_in_eu &&
                invoicesPreview.selected_customer.vat_id
              "
              class="meta-row"
            >
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ invoicesPreview.selected_customer.vat_id }}</span>
            </div>

            <div
              v-else-if="
                !invoicesPreview.selected_customer.is_in_eu &&
                invoicesPreview.selected_customer.vat_id
              "
              class="meta-row"
            >
              <span class="meta-label">VAT ID:</span>
              <span class="meta-value">{{ invoicesPreview.selected_customer.vat_id }}</span>
            </div>
          </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
          {{ title }}
          <span
            v-if="invoicesPreview.paid_amount && invoicesPreview.paid_amount > 0"
            class="status-badge"
          >
            ⏱️ Teilweise bezahlt
          </span>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          Sehr geehrter Kunde,<br />
          für die erbrachten Leistungen erlauben wir uns, Ihnen wie folgt in Rechnung zu stellen:
        </div>

        <!-- Events Table -->
        <EventsPreview v-if="invoicesPreview.events" :data="invoicesPreview" />

        <!-- Contact Person -->
        <ContactPersonPreview
          v-if="invoicesPreview.contact_person"
          :data="invoicesPreview.contact_person"
        />
        <!-- Bank Info -->
        <div class="bank-box">
          <div class="bank-title">🏦 Bankverbindung</div>
          <div class="bank-info">
            <span class="bank-label">Bank:</span>
            <span class="bank-value">{{ $store.state.auth.bank_name }}</span>
            <span class="bank-label">IBAN:</span>
            <span class="bank-value">{{ $store.state.auth.iban }}</span>
            <span class="bank-label">BIC:</span>
            <span class="bank-value">{{ $store.state.auth.bic }}</span>
            <span class="bank-label"> Verwendungszweck:</span>
            <span class="bank-value">{{ invoicesPreview.verwendungszweck }}</span>
          </div>
        </div>

        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="invoicesPreview.selected_customer"
        :email="invoicesPreview.selected_customer.email"
        :file-name="title + ' ' + formatRechnungId"
      />
    </div>

    <router-link to="/invoices/create" class="back-link">
      ← Zurück zur Rechnungserstellung
    </router-link>
  </div>
</template>

<script>
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import EventsPreview from '../../components/preview/EventsPreview.vue'

export default {
  name: 'InvoicesPreview',
  components: {
    HeaderSidePreview,
    FooterSidePreview,
    ActionsButtonPreview,
    ContactPersonPreview,
    EventsPreview
  },
  inject: ['formatCustomerId', 'formatDate'],
  data() {
    return {
      title: 'Rechnungbestätigung',
      invoicesPreview: {}
    }
  },
  computed: {
    formatRechnungId() {
      if (!this.invoicesPreview.id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(this.invoicesPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getInvoicesPreview()
  },
  methods: {
    getInvoicesPreview() {
      this.invoicesPreview = this.$store.state.invoicesPreview
      // Reverse charge durumu hesapla
      if (
        this.invoicesPreview.selected_customer &&
        this.invoicesPreview.selected_customer.is_in_eu &&
        this.invoicesPreview.selected_customer.country !== 'Germany' &&
        this.invoicesPreview.selected_customer.vat_id &&
        this.invoicesPreview.company_vat_id
      ) {
        this.invoicesPreview.reverse_charge = true
      } else {
        this.invoicesPreview.reverse_charge = false
      }
    }
  }
}
</script>
