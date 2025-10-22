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
                invoicesPreview.selected_customer.is_in_eu && invoicesPreview.selected_customer.vat_id
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

            <div class="meta-row">
              <span class="meta-label">Leistung:</span>
              <span class="meta-value">{{ invoicesPreview.service_period }}</span>
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
          <tbody v-if="invoicesPreview.positions">
            <tr v-for="(item, index) in invoicesPreview.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ formatCurrency(item.price, invoicesPreview.currency) }}</td>
              <td class="right">{{ invoicesPreview.reverse_charge ? '0%' : item.vat + '%' }}</td>
              <td class="right">{{ formatCurrency(item.unit_total, invoicesPreview.currency) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(invoicesPreview.subtotal, invoicesPreview.currency)
            }}</span>
          </div>

          <!-- KDV sadece reverse charge değilse göster -->
          <div
            v-if="!invoicesPreview.is_small_company && !invoicesPreview.reverse_charge"
            class="total-row"
          >
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(invoicesPreview.vat_amount, invoicesPreview.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(invoicesPreview.total, invoicesPreview.currency)
            }}</span>
          </div>

          <div
            v-if="invoicesPreview.paid_amount && invoicesPreview.paid_amount > 0"
            class="total-row paid"
          >
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value"
              >- {{ formatCurrency(invoicesPreview.paid_amount, invoicesPreview.currency) }}</span
            >
          </div>

          <div class="total-row outstanding">
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{
              formatCurrency(invoicesPreview.outstanding, invoicesPreview.currency)
            }}</span>
          </div>

          <!-- Küçük işletme veya Reverse-Charge notları -->
          <div v-if="invoicesPreview.is_small_company" class="tax-note">
            ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
          </div>

          <div v-if="invoicesPreview.reverse_charge" class="tax-note">
            ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß §4 Nr.1b UStG (Reverse Charge).
          </div>
        </div>

        <!-- Payment Terms -->
        <div class="payment-terms">
          <strong>Zahlungsbedingungen:</strong> Zahlbar innerhalb von 14 Tagen ab Rechnungsdatum.
        </div>

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
            <span class="bank-label">Verwendung:</span>
            <span class="bank-value">{{ invoicesPreview.verwendung }}</span>
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

export default {
  name: 'InvoicesPreview',
  components: { HeaderSidePreview, FooterSidePreview, ActionsButtonPreview, ContactPersonPreview },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
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
