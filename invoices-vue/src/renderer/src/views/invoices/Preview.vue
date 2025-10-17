<template>
  <div>
    <h1>{{ title }}</h1>
    <div class="preview-panel">
      <div class="header">
        <div>
          <div class="company-name">{{ $store.state.auth.firm_name }}</div>
          <div class="company-details">
            {{ $store.state.auth.address }}<br />
            {{ $store.state.auth.postal_code }} {{ $store.state.auth.city }}<br />
            Tel: {{ $store.state.auth.phone }}<br />
            {{ $store.state.auth.email }}<br />
            {{ $store.state.auth.website }}
          </div>
        </div>
        <img :src="logoSrc" alt="" class="preview-logo" />
      </div>

      <div class="recipient">
        <div v-if="previewData && previewData.customer" class="recipient-address">
          <div>{{ previewData.customer.company_name }}</div>
          <div>{{ previewData.customer.address }}</div>
          <div>
            {{ previewData.customer.postal_code }} {{ previewData.customer.city }}<br />
            {{ previewData.customer.country }}
          </div>
        </div>
        <div v-if="previewData && previewData.customer">
          <div class="meta-row">
            <span class="meta-label">Rechnung-Nr.:</span>
            <span class="meta-value">{{ formatRechnungId }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ formatDate(previewData.base.date) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Kunden-Nr.:</span>
            <span class="meta-value">{{ formatCustomerId(previewData.customer.id) }}</span>
          </div>
          <div class="meta-row" v-if="previewData.customer.tax_number">
            <span class="meta-label">Steuer-Nr.:</span>
            <span class="meta-value">{{ previewData.customer.tax_number }}</span>
          </div>
          <div class="meta-row" v-if="previewData.customer.vat_id">
            <span class="meta-label">USt-IdNr:</span>
            <span class="meta-value">{{ previewData.customer.vat_id }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Leistung:</span>
            <span class="meta-value">{{ previewData.base.service_period }}</span>
          </div>
        </div>
      </div>

      <div class="document-title">
        Rechnung
        <span class="status-badge" v-if="previewData.base.paid_amount && previewData.base.paid_amount > 0">
          ⏱️ Teilweise bezahlt
        </span>
      </div>

      <div class="intro-text">
        Sehr geehrter Herr Weber,<br />
        für die erbrachten Leistungen erlauben wir uns, Ihnen wie folgt in Rechnung zu stellen:
      </div>

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
        <tbody v-if="previewData && previewData.base && previewData.base.positions">
          <tr v-for="(item, index) in previewData.base.positions" :key="index">
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

      <div v-if="previewData && previewData.base" class="totals">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">{{ formatCurrency(previewData.base.subtotal) }}</span>
        </div>
        <div class="total-row" v-if="!isKleinunternehmer">
          <span class="total-label">MwSt.:</span>
          <span class="total-value">{{ formatCurrency(previewData.base.vat_amount) }}</span>
        </div>
        <div class="total-row subtotal">
          <span class="total-label">Rechnungsbetrag (brutto):</span>
          <span class="total-value">{{ formatCurrency(previewData.base.total) }}</span>
        </div>
        <div class="total-row paid" v-if="previewData.base.paid_amount > 0">
          <span class="total-label">✓ Bereits bezahlt:</span>
          <span class="total-value">- {{ formatCurrency(previewData.base.paid_amount) }}</span>
        </div>
        <div class="total-row final outstanding">
          <span class="total-label">⚠️ Offener Betrag:</span>
          <span class="total-value">{{ formatCurrency(previewData.base.outstanding) }}</span>
        </div>

        <div class="tax-note" v-if="isKleinunternehmer">
          ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
        </div>
      </div>

      <div class="payment-terms">
        <strong>Zahlungsbedingungen:</strong> Zahlbar innerhalb von 14 Tagen ab Rechnungsdatum.
      </div>

      <div v-if="$store.state.offerPreview.sprach_partner" class="contact-box">
        <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
        <div class="contact-person">
          <div class="contact-avatar">SM</div>
          <div class="contact-details">
            <div class="contact-name">{{ $store.state.offerPreview.sprach_partner.fullname }}</div>
            <div class="contact-info">
              Projektmanagement & Kundenbetreuung<br />
              📞 +{{ $store.state.offerPreview.sprach_partner.phone }}<br />
              📧 {{ $store.state.offerPreview.sprach_partner.email }}
            </div>
          </div>
        </div>
      </div>

      <div class="bank-box">
        <div class="bank-title">🏦 Bankverbindung</div>
        <div v-if="previewData && previewData.base" class="bank-info">
          <span class="bank-label">Bank:</span>
          <span class="bank-value">{{ $store.state.auth.bank_name }}</span>
          <span class="bank-label">IBAN:</span>
          <span class="bank-value">{{ $store.state.auth.iban }}</span>
          <span class="bank-label">BIC:</span>
          <span class="bank-value">{{ $store.state.auth.bic }}</span>
          <span class="bank-label">Verwendung:</span>
          <span class="bank-value">{{ previewData.base.verwendung }}</span>
        </div>
      </div>

      <div class="footer">
        <div>
          <strong>{{ $store.state.auth.firm_name }}</strong> • Geschäftsführer: {{ $store.state.auth.ceo }} • Amtsgericht {{ $store.state.auth.register_court }} HRB {{ $store.state.auth.register_number }}<br />
          USt-IdNr.: {{ $store.state.auth.vat_id }} • Steuer-Nr.: {{ $store.state.auth.tax_number }}
        </div>
        <router-link to="/invoices/create" class="back-link">
          ← Zurück zur Rechnungserstellung
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoicePreview',
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Rechnung',
      previewData: {
        base: {},
        customer: {}
      },
      isKleinunternehmer: true
    }
  },
  computed: {
    logoSrc() {
      const logo = this.$store.state.auth.logo
      if (!logo) return null
      if (typeof logo === 'string') {
        if (logo.startsWith('data:image')) return logo
        return `data:image/png;base64,${logo}`
      }
      try {
        let binary = ''
        const bytes = new Uint8Array(Object.values(logo))
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
        const base64 = window.btoa(binary)
        return `data:image/png;base64,${base64}`
      } catch (error) {
        console.error(error)
        return null
      }
    },
    formatRechnungId() {
      if (!this.previewData.base.id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(this.previewData.base.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getPreview()
  },
  methods: {
    getPreview() {
      this.previewData = this.$store.state.invoicePreview
    }
  }
}
</script>

<style scoped>
.tax-note {
  border: 1px solid #e74c3c;
  background-color: #fdecea;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  font-weight: bold;
  color: #c0392b;
}
</style>
