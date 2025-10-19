<template>
  <div>
    <h1>{{ title }}</h1>
    <div class="preview-panel">
      <div class="printable">
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
          <div v-if="invoicePreview && invoicePreview.selected_customer" class="recipient-address">
            <div>{{ invoicePreview.selected_customer.company_name }}</div>
            <div>{{ invoicePreview.selected_customer.address }}</div>
            <div>
              {{ invoicePreview.selected_customer.postal_code }}
              {{ invoicePreview.selected_customer.city }}<br />
              {{ invoicePreview.selected_customer.country }}
            </div>
          </div>
          <div v-if="invoicePreview && invoicePreview.selected_customer">
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

        <div class="document-title">
          Rechnung
          <span
            v-if="invoicePreview.paid_amount && invoicePreview.paid_amount > 0"
            class="status-badge"
          >
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
          <tbody v-if="invoicePreview && invoicePreview.positions">
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

        <div v-if="invoicePreview" class="totals">
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
          <div class="total-row final outstanding">
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{ formatCurrency(invoicePreview.outstanding) }}</span>
          </div>

          <div v-if="invoicePreview.is_small_company" class="tax-note">
            ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
          </div>
        </div>

        <div class="payment-terms">
          <strong>Zahlungsbedingungen:</strong> Zahlbar innerhalb von 14 Tagen ab Rechnungsdatum.
        </div>

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

        <div class="bank-box">
          <div class="bank-title">🏦 Bankverbindung</div>
          <div v-if="invoicePreview" class="bank-info">
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
        <div class="footer-note">
          <strong>{{ $store.state.auth.firm_name }}</strong> • Geschäftsführer:
          {{ $store.state.auth.ceo }} • Amtsgericht {{ $store.state.auth.register_court }} HRB
          {{ $store.state.auth.id }}<br />
          USt-IdNr.: {{ $store.state.auth.vat_id }} • Steuer-Nr.: {{ $store.state.auth.tax_number }}
        </div>
      </div>
    </div>
    <div class="footer">
      <router-link to="/invoices/create" class="back-link">
        ← Zurück zur Rechnungserstellung
      </router-link>
    </div>
    <button class="no-print" @click="exportPDF">📄 Als PDF exportieren</button>
    <button class="no-print" @click="printInvoice">🖨️ Drucken</button>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
export default {
  name: 'InvoicePreview',
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Rechnung',
      invoicePreview: {}
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
    },
    exportPDF() {
      const element = this.$el.querySelector('.printable')
      if (!element) return

      const options = {
        margin: 20,
        filename: `Rechnung.pdf`,
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().set(options).from(element).save()
    },
    printInvoice() {
      window.print()
    }
  }
}
</script>
