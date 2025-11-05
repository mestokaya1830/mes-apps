<template>
  <div v-if="ordersPreview">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" />

        <!-- Recipient & Order Details -->
        <div v-if="ordersPreview.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
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
            <div class="section-title">Auftragsdetails</div>
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
            <div v-if="ordersPreview.service_period" class="meta-row">
              <span class="meta-label">Leistungszeitraum:</span>
              <span class="meta-value">{{ ordersPreview.service_period }}</span>
            </div>

            <!-- Optional tax fields -->
            <div v-if="$store.state.auth.tax_number" class="meta-row">
              <span class="meta-label">Steuernummer:</span>
              <span class="meta-value">{{ $store.state.auth.tax_number }}</span>
            </div>
            <div v-if="$store.state.auth.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ $store.state.auth.vat_id }}</span>
            </div>
          </div>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          <template v-if="ordersPreview.selected_customer?.gender === 'f'">
            Sehr geehrte Frau {{ ordersPreview.selected_customer?.last_name }},
          </template>
          <template v-else>
            Sehr geehrter Herr {{ ordersPreview.selected_customer?.last_name }},
          </template>
          <br />
          vielen Dank für Ihre Auftragserteilung. Wir bestätigen Ihnen hiermit folgenden Auftrag:
        </div>

        <!-- events -->
        <EventsPreview v-if="ordersPreview.events" :data="ordersPreview" />

        <!-- Contact Person -->
        <ContactPersonPreview />
        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="ordersPreview.selected_customer"
        :email="ordersPreview.selected_customer.email"
        :file-name="title + ' ' + formatAuftragId"
      />
    </div>

    <router-link to="/orders/create" class="back-link">
      ← Zurück zur Auftragserstellung
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
  name: 'OrdersPreview',
  components: {
    HeaderSidePreview,
    FooterSidePreview,
    ActionsButtonPreview,
    ContactPersonPreview,
    EventsPreview
  },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Auftragbestätigung',
      ordersPreview: {}
    }
  },
  computed: {
    formatAuftragId() {
      if (!this.ordersPreview.id) return ''
      const year = new Date().getFullYear()
      return `AUF-${year}-${String(this.ordersPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getOrdersPreview()
  },
  methods: {
    getOrdersPreview() {
      if (this.$store?.state?.ordersPreview) {
        const preview = this.$store.state.ordersPreview
        if (preview) this.ordersPreview = preview
      } else {
        return this.ordersPreview
      }
    }
  }
}
</script>
