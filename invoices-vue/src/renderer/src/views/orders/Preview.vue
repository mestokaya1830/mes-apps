<template>
  <div v-if="orderPreview">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :color="'red'" />

        <!-- Recipient & Order Details -->
        <div v-if="orderPreview.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ orderPreview.selected_customer.company_name }}
            </div>
            <div>{{ orderPreview.selected_customer.address }}</div>
            <div>
              {{ orderPreview.selected_customer.postal_code }}
              {{ orderPreview.selected_customer.city }}
              {{ orderPreview.selected_customer.country }}
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
              <span class="meta-value">{{ formatDate(orderPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(orderPreview.selected_customer.id)
              }}</span>
            </div>
            <div v-if="orderPreview.service_period" class="meta-row">
              <span class="meta-label">Leistungszeitraum:</span>
              <span class="meta-value">{{ orderPreview.service_period }}</span>
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
          <template v-if="orderPreview.selected_customer?.gender === 'f'">
            Sehr geehrte Frau {{ orderPreview.selected_customer?.last_name }},
          </template>
          <template v-else>
            Sehr geehrter Herr {{ orderPreview.selected_customer?.last_name }},
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
          <tbody v-if="orderPreview.positions?.length">
            <tr v-for="(item, index) in orderPreview.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title || '–' }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
              </td>
              <td class="center">{{ item.quantity ?? 0 }}</td>
              <td class="center">{{ item.unit || '' }}</td>
              <td class="right">{{ formatCurrency(item.price, orderPreview.currency) }}</td>
              <td class="right">{{ item.vat != null ? item.vat + ' %' : '0 %' }}</td>
              <td class="right">{{ formatCurrency(item.unit_total, orderPreview.currency) }}</td>
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
              formatCurrency(orderPreview.subtotal, orderPreview.currency)
            }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(orderPreview.vat_amount, orderPreview.currency)
            }}</span>
          </div>
          <div class="total-row subtotal">
            <span class="total-label">Auftragsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(orderPreview.total, orderPreview.currency)
            }}</span>
          </div>
        </div>

        <!-- Payment Terms -->
        <div class="conditions">
          <div class="condition-section">
            <div class="condition-title">💳 Zahlungsbedingungen</div>
            <div class="condition-text">
              50 % Anzahlung bei Auftragserteilung, Restzahlung nach Projektabschluss. Zahlbar
              innerhalb von 14 Tagen netto ohne Abzug.
            </div>
          </div>
        </div>

        <!-- Contact Person -->

        <ContactPersonPreview
          v-if="orderPreview.contact_person"
          :data="orderPreview.contact_person"
        />
        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="orderPreview.selected_customer"
        :email="orderPreview.selected_customer.email"
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

export default {
  name: 'OrderPreview',
  components: { HeaderSidePreview, FooterSidePreview, ActionsButtonPreview, ContactPersonPreview },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Auftragbestätigung',
      orderPreview: {}
    }
  },
  computed: {
    formatAuftragId() {
      if (!this.orderPreview.id) return ''
      const year = new Date().getFullYear()
      return `AUF-${year}-${String(this.orderPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getOrderPreview()
  },
  methods: {
    getOrderPreview() {
      this.orderPreview = this.$store.state.orderPreview
    }
  }
}
</script>
