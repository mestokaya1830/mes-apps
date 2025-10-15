<template>
  <div>
    <h1>{{ title }}</h1>
    <!-- PREVIEW PANEL -->
    <div class="preview-panel">
      <div class="header">
        <div>
          <div class="company-name">{{ $store.state.auth.firm_name }}</div>
          <div class="company-details">
            {{ $store.state.auth.address }} {{ $store.state.auth.postal_code }} *
            {{ $store.state.auth.city }}<br />
            Tel: {{ $store.state.auth.phone }} <br />{{ $store.state.auth.email }} <br />{{
              $store.state.auth.website
            }}
          </div>
        </div>
        <img :src="logoSrc" alt="" class="preview-logo" />
      </div>

      <div class="recipient">
        <div v-if="previewData && previewData.customer" class="recipient-address">
          <div>{{ previewData.customer.company_name }}</div>
          <div>{{ previewData.customer.address }}</div>
          <div>
            {{ previewData.customer.postal_code }} <br />{{ previewData.customer.city }} <br />
            {{ previewData.customer.country }}
          </div>
        </div>
        <div v-if="previewData && previewData.customer">
          <div class="meta-row">
            <span class="meta-label">RechnungNr.:</span>
            <span class="meta-value">{{ previewData.invoice_grund.invoice_number }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ previewData.invoice_grund.invoice_date }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">KundenNr.:</span>
            <span class="meta-value">{{ formattedCustomerNumber(previewData.customer.id) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Leistung:</span>
            <span class="meta-value">{{ previewData.invoice_grund.service_period }}</span>
          </div>
        </div>
      </div>

      <div class="document-title">
        Rechnung
        <span class="status-badge">⏱️ Teilweise bezahlt</span>
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
        <tbody
          v-if="previewData && previewData.invoice_grund && previewData.invoice_grund.positions"
        >
          <tr v-for="(item, index) in previewData.invoice_grund.positions" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="position-title">{{ item.title }}</div>
              <div v-if="item.description" class="position-description">
                {{ item.description }}
              </div>
            </td>
            <td class="center">{{ item.quantity }}</td>
            <td class="center">{{ item.unit }}</td>
            <td class="right">{{ item.price }}</td>
            <td class="right">{{ item.vat }}%</td>
            <td class="right">{{ item.unitTotal }}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">{{ $store.state.invoicePreview.invoice_grund.subtotal }}</span>
        </div>
        <div class="total-row">
          <span class="total-label">MwSt.:</span>
          <span class="total-value">{{ $store.state.invoicePreview.invoice_grund.vatAmount }}</span>
        </div>
        <div class="total-row subtotal">
          <span class="total-label">Rechnungsbetrag (brutto):</span>
          <span class="total-value">{{
            $store.state.invoicePreview.invoice_grund.grandTotal
          }}</span>
        </div>
        <div class="total-row paid">
          <span class="total-label">✓ Bereits bezahlt:</span>
          <span class="total-value"
            >- {{ $store.state.invoicePreview.invoice_grund.paidAmount }}</span
          >
        </div>
        <div class="total-row final outstanding">
          <span class="total-label">⚠️ Offener Betrag:</span>
          <span class="total-value">{{
            $store.state.invoicePreview.invoice_grund.outstanding
          }}</span>
        </div>
      </div>
      <!-- KONTAKT BOX (PREMIUM FEATURE) -->
      <div v-if="$store.state.offerPreview.sprach_partner" class="contact-box">
        <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
        <div class="contact-person">
          <div class="contact-avatar">SM</div>
          <div class="contact-details">
            <div class="contact-name">
              {{ $store.state.offerPreview.sprach_partner.fullname }}
            </div>
            <div class="contact-info">
              Projektmanagement & Kundenbetreuung<br />
              📞 +{{ $store.state.offerPreview.sprach_partner.phone }} <br />
              📧
              {{ $store.state.offerPreview.sprach_partner.email }}
            </div>
          </div>
        </div>
      </div>
      <div class="bank-box">
        <div class="bank-title">🏦 Bankverbindung</div>
        <div v-if="previewData && previewData.invoice_grund" class="bank-info">
          <span class="bank-label">Bank:</span>
          <span class="bank-value">{{ $store.state.auth.bank_name }}</span>
          <span class="bank-label">IBAN:</span>
          <span class="bank-value">{{ $store.state.auth.iban }}</span>
          <span class="bank-label">BIC:</span>
          <span class="bank-value">{{ $store.state.auth.bic }}</span>
          <span class="bank-label">Steuernummer:</span>
          <span class="bank-value">{{ $store.state.auth.tax_number }}</span>
          <span class="bank-label">Verwendung:</span>
          <span class="bank-value">{{ previewData.invoice_grund.verwendung }}</span>
        </div>
      </div>

      <div class="footer">
        <router-link to="/invoices/create" class="back-link"
          >← Zurück zur Rechnungserstellung</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderPreview',
  inject: ['formattedCustomerNumber'],
  data() {
    return {
      title: 'Auftrag',
      previewData: {}
    }
  },
  computed: {
    logoSrc() {
      const logo = this.$store.state.auth.logo
      if (!logo) return null
      if (typeof logo === 'string') {
        if (logo.startsWith('data:image')) {
          return logo
        }
        return `data:image/png;base64,${logo}`
      }
      try {
        let binary = ''
        const bytes = new Uint8Array(Object.values(logo))
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const base64 = window.btoa(binary)
        return `data:image/png;base64,${base64}`
      } catch (error) {
        console.error(error)
        return null
      }
    }
  },
  mounted() {
    this.getPreview()
  },
  methods: {
    async getPreview() {
      this.previewData = await this.$store.state.invoicePreview
      console.log(this.previewData)
    }
  }
}
</script>
