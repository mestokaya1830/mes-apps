<template>
  <div v-if="invoicesPreview && auth">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <h1 class="header-title">{{ title }}</h1>
        <div class="header">
          <div class="company-info">
            <div class="company-name">{{ auth.firm_name }}</div>
            <div class="company-details">{{ auth.address }}</div>
            <div class="company-details">{{ auth.postal_code }} {{ auth.city }}</div>
            <div class="company-details">Tel: {{ auth.phone }}</div>
            <div class="company-details">Email: {{ auth.email }}</div>
            <div class="company-details">Web: {{ auth.website }}</div>
          </div>
          <img :src="logoSrc" alt="Logo" class="preview-logo" />
        </div>

        <div v-if="invoicesPreview.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ invoicesPreview.selected_customer.company_name }}
            </div>
            <div class="meta-label">{{ invoicesPreview.selected_customer.address }}</div>
            <div class="meta-label">
              {{ invoicesPreview.selected_customer.postal_code }}
              {{ invoicesPreview.selected_customer.city }}<br />
              {{ invoicesPreview.selected_customer.country }}
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
          <tbody v-if="invoicesPreview.events.positions">
            <tr v-for="(item, index) in invoicesPreview.events.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
                <div class="position-service-period">
                  Leistungszeitraum: {{ item.service_period_start }} - {{ item.service_period_end }}
                </div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">
                {{ formatCurrency(item.price, invoicesPreview.events.currency) }}
              </td>
              <td class="right">
                {{
                  invoicesPreview.events.reverse_charge || invoicesPreview.events.is_small_company
                    ? '0%'
                    : item.vat + '%'
                }}
              </td>
              <td class="right">
                {{ formatCurrency(item.unit_total, invoicesPreview.events.currency) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- summary -->
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(invoicesPreview.summary.subtotal, invoicesPreview.events.currency)
            }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(invoicesPreview.summary.vat_amount, invoicesPreview.events.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(invoicesPreview.summary.total, invoicesPreview.events.currency)
            }}</span>
          </div>

          <div
            v-if="invoicesPreview.events.paid_amount && invoicesPreview.events.paid_amount > 0"
            class="total-row paid"
          >
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value"
              >-
              {{
                formatCurrency(invoicesPreview.summary.paid_amount, invoicesPreview.events.currency)
              }}</span
            >
          </div>
          <div v-if="invoicesPreview.source_page === 'invoices'" class="total-row outstanding">
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{
              formatCurrency(invoicesPreview.summary.outstanding, invoicesPreview.events.currency)
            }}</span>
          </div>

          <div v-if="invoicesPreview.events.is_small_company" class="tax-note">
            ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
          </div>

          <div v-if="invoicesPreview.events.reverse_charge" class="tax-note">
            ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß §4 Nr.1b UStG (Reverse Charge).
          </div>
        </div>
        <!-- Contact Person -->
        <ContactPersonPreview :contactData="auth.contact_person" />

        <!-- Bank Info -->
        <div class="bank-box">
          <div class="bank-title">🏦 Bankverbindung</div>
          <div class="bank-info">
            <span class="bank-label">Bank:</span>
            <span class="bank-value">{{ auth.bank_name }}</span>
            <span class="bank-label">IBAN:</span>
            <span class="bank-value">{{ auth.iban }}</span>
            <span class="bank-label">BIC:</span>
            <span class="bank-value">{{ auth.bic }}</span>
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
import store from '../../store/store.js'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'

export default {
  name: 'InvoicesPreview',
  components: {
    ContactPersonPreview,
    FooterSidePreview,
    ActionsButtonPreview
  },
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency', 'formatValidDays'],
  data() {
    return {
      title: 'Rechnungbestätigung',
      invoicesPreview: null,
      auth: null
    }
  },
  computed: {
    formatRechnungId() {
      if (!this.invoicesPreview.id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(this.invoicesPreview.id).padStart(5, '0')}`
    },
    logoSrc() {
      const logo = this.auth.logo
      if (!logo) return null
      if (typeof logo === 'string') {
        if (logo.startsWith('data:image')) return logo
        return `data:image/png;base64,${logo}`
      }
      try {
        let binary = ''
        const bytes = new Uint8Array(Object.values(logo))
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
        return `data:image/png;base64,${window.btoa(binary)}`
      } catch (error) {
        console.error(error)
        return null
      }
    }
  },
  mounted() {
    this.getInvoicesPreview()
    this.getAuth()
  },
  methods: {
    async getInvoicesPreview() {
      if (store.state.invoices) {
        this.invoicesPreview = store.state.invoices
      }
    },
    async getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
        console.log('preview', this.auth)
      }
    }
  }
}
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 15px;
  align-items: center;
  border-bottom: 3px solid #91a7c5;
}

.header-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.logo-container {
  flex-shrink: 0;
  margin-left: 20px;
}

.section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.company-name {
  font-size: 20px;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 4px;
}

.company-name-subtitle {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.company-details {
  font-size: 12px;
  color: var(--darkColor);
  line-height: 1.6;
}

.preview-logo {
  max-width: 160px;
  max-height: 100px;
  width: auto;
  height: auto;
  display: block;
  /* margin: 0 auto; */
}

.positions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: 9px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.positions-table thead {
  background: #f1f5f9;
}

.positions-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #333;
  border: 1px solid #e2e8f0;
}

.positions-table th.left,
.positions-table td.left {
  text-align: left;
}

.positions-table th.right,
.positions-table td.right {
  text-align: right;
}

.positions-table th.center,
.positions-table td.center {
  text-align: center;
}

.positions-table tbody tr {
  border-bottom: 1px solid #e9ecef;
}

.positions-table td {
  padding: 18px 16px;
  font-size: 14px;
  color: #1e293b;
}

.positions-table td.right {
  text-align: right;
  font-weight: 600;
}

.position-title {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.position-amount {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.position-description {
  font-size: 12px;
  color: #64748b;
}

.position-service-period {
  font-size: 12px;
  color: #64748b;
}

/* TOTALS */
.totals {
  margin-left: auto;
  width: 280px;
  margin-top: 40px;
  margin-bottom: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 10px;
}

.total-row.subtotal {
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
}

.total-row.paid {
  color: #10b981;
}

.total-row.outstanding {
  color: #dc2626;
  font-weight: 600;
}

.total-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.total-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.outstanding {
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding: 20px 24px;
  background: #16a34a;
  border-radius: 6px;
}

.outstanding .total-label {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.outstanding .total-value {
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}

.tax-note {
  margin-top: 16px;
  padding: 16px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 8px;
  display: flex;
  gap: 12px;
}
</style>
