<template>
  <div v-if="invoicePreview">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSide :title="title" :color="'green'" />
        <!-- Recipient & Invoice Details -->
        <div v-if="invoicePreview.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ invoicePreview.selected_customer.company_name }}
            </div>
            <div>{{ invoicePreview.selected_customer.address }}</div>
            <div>
              {{ invoicePreview.selected_customer.postal_code }}
              {{ invoicePreview.selected_customer.city }}<br />
              {{ invoicePreview.selected_customer.country }}
            </div>
          </div>

          <div class="invoice-details">
            <div class="section-title">Rechnungsdetails</div>
            <div class="meta-row">
              <span class="meta-label">Rechnung-Nr.:</span>
              <span class="meta-value">{{ formatRechnungId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(invoicePreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(invoicePreview.selected_customer.id)
              }}</span>
            </div>
            <div v-if="invoicePreview.selected_customer.tax_number" class="meta-row">
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ invoicePreview.selected_customer.tax_number }}</span>
            </div>
            <div v-if="invoicePreview.selected_customer.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr:</span>
              <span class="meta-value">{{ invoicePreview.selected_customer.vat_id }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Leistung:</span>
              <span class="meta-value">{{ invoicePreview.service_period }}</span>
            </div>
          </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
          Rechnung
          <span
            v-if="invoicePreview.paid_amount && invoicePreview.paid_amount > 0"
            class="status-badge"
          >
            ⏱️ Teilweise bezahlt
          </span>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          Sehr geehrter Herr Weber,<br />
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
          <tbody v-if="invoicePreview.positions">
            <tr v-for="(item, index) in invoicePreview.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ formatCurrency(item.price) }}</td>
              <td class="right">{{ item.vat }}%</td>
              <td class="right">{{ formatCurrency(item.unit_total) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{ formatCurrency(invoicePreview.subtotal) }}</span>
          </div>
          <div v-if="!invoicePreview.is_small_company" class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{ formatCurrency(invoicePreview.vat_amount) }}</span>
          </div>
          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{ formatCurrency(invoicePreview.total) }}</span>
          </div>
          <div
            v-if="invoicePreview.paid_amount && invoicePreview.paid_amount > 0"
            class="total-row paid"
          >
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value">- {{ formatCurrency(invoicePreview.paid_amount) }}</span>
          </div>
          <div class="total-row outstanding">
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{ formatCurrency(invoicePreview.outstanding) }}</span>
          </div>

          <div v-if="invoicePreview.is_small_company" class="tax-note">
            ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
          </div>
        </div>

        <!-- Payment Terms -->
        <div class="payment-terms">
          <strong>Zahlungsbedingungen:</strong> Zahlbar innerhalb von 14 Tagen ab Rechnungsdatum.
        </div>

        <!-- Contact Person -->
        <div v-if="invoicePreview.contact_person" class="contact-box">
          <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
          <div class="contact-person">
            <div class="contact-avatar">SM</div>
            <div class="contact-details">
              <div class="contact-name">{{ invoicePreview.contact_person.full_name }}</div>
              <div class="contact-info">
                Projektmanagement & Kundenbetreuung<br />
                📞 +{{ invoicePreview.contact_person.phone }}<br />
                📧 {{ invoicePreview.contact_person.email }}
              </div>
            </div>
          </div>
        </div>

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
            <span class="bank-value">{{ invoicePreview.verwendung }}</span>
          </div>
        </div>
        <FooterSide />
      </div>
      <ActionsButton
        v-if="invoicePreview.selected_customer"
        :email="invoicePreview.selected_customer.email"
        :file-name="title + ' ' + formatRechnungId"
      />
    </div>

    <router-link to="/invoices/create" class="back-link">
      ← Zurück zur Rechnungserstellung
    </router-link>
  </div>
</template>

<script>
import HeaderSide from '../../components/HeaderSide.vue'
import FooterSide from '../../components/FooterSide.vue'
import ActionsButton from '../../components/ActionsButton.vue'

export default {
  name: 'InvoicePreview',
  components: { HeaderSide, FooterSide, ActionsButton },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Rechnung',
      invoicePreview: {}
    }
  },
  computed: {
    formatRechnungId() {
      if (!this.invoicePreview.id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(this.invoicePreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getInvoicePreview()
  },
  methods: {
    getInvoicePreview() {
      this.invoicePreview = this.$store.state.invoicePreview
      console.log(this.invoicePreview)
    }
  }
}
</script>
