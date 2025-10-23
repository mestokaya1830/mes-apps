<template>
  <div v-if="ordersPreview">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :color="'red'" />

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
              {{ ordersPreview.selected_customer.city }}
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

        <!-- Positions Table -->
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
          <tbody v-if="ordersPreview.positions?.length">
            <tr v-for="(item, index) in ordersPreview.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title || '–' }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
              </td>
              <td class="center">{{ item.quantity ?? 0 }}</td>
              <td class="center">{{ item.unit || '' }}</td>
              <td class="right">{{ formatCurrency(item.price, ordersPreview.currency) }}</td>
              <td class="right">{{ item.vat != null ? item.vat + ' %' : '0 %' }}</td>
              <td class="right">{{ formatCurrency(item.unit_total, ordersPreview.currency) }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7" class="center text-gray-500">Keine Positionen vorhanden</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.subtotal, ordersPreview.currency)
            }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.vat_amount, ordersPreview.currency)
            }}</span>
          </div>
          <div class="total-row subtotal">
            <span class="total-label">Auftragsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.total, ordersPreview.currency)
            }}</span>
          </div>
        </div>

        <!-- Payment Terms -->
        <PaymentTermsPreview v-if="ordersPreview.payment" :data="ordersPreview.payment" />

        <!-- Contact Person -->

        <ContactPersonPreview
          v-if="ordersPreview.contact_person"
          :data="ordersPreview.contact_person"
        />
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
import PaymentTermsPreview from '../../components/preview/PaymentTermsPreview.vue'

export default {
  name: 'OrdersPreview',
  components: {
    HeaderSidePreview,
    FooterSidePreview,
    ActionsButtonPreview,
    ContactPersonPreview,
    PaymentTermsPreview
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
      this.ordersPreview = this.$store.state.ordersPreview
    }
  }
}
</script>
