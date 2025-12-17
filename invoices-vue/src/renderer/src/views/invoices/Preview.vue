<template>
  <div>
    <div v-if="invoicePreview && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- customers -->
        <div v-if="invoicePreview.customer" class="recipient">
          <div class="recipient-address">
            <div class="recipient-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ invoicePreview.customer.company_name }}
            </div>
            <div class="meta-label">{{ invoicePreview.customer.address }}</div>
            <div class="meta-label">
              {{ invoicePreview.customer.postal_code }}
              {{ invoicePreview.customer.city }}<br />
              {{ invoicePreview.customer.country }}
            </div>
          </div>
          <!-- recipient details -->
          <div class="recipient-details">
            <div class="recipient-title">Rechnungsdetails</div>

            <div class="meta-row">
              <span class="meta-label">Rechnung-Nr.:</span>
              <span class="meta-value">{{ formatInvoiceId(invoicePreview.id) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(invoicePreview.date) }}</span>
            </div>

            <!-- Service date -->
            <div v-if="invoicePreview.service_date" class="meta-row">
              <span class="meta-label">Leistungsdatum:</span>
              <span class="meta-value">{{ formatDate(invoicePreview.service_date) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{ formatCustomerId(invoicePreview.customer.id) }}</span>
            </div>

            <div
              v-if="
                invoicePreview.customer.country === 'Germany' && invoicePreview.customer.tax_number
              "
              class="meta-row"
            >
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ invoicePreview.customer.tax_number }}</span>
            </div>

            <div
              v-else-if="invoicePreview.customer.is_in_eu && invoicePreview.customer.vat_id"
              class="meta-row"
            >
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ invoicePreview.customer.vat_id }}</span>
            </div>

            <div
              v-else-if="!invoicePreview.customer.is_in_eu && invoicePreview.customer.vat_id"
              class="meta-row"
            >
              <span class="meta-label">VAT ID:</span>
              <span class="meta-value">{{ invoicePreview.customer.vat_id }}</span>
            </div>
          </div>
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

          <tbody v-if="invoicePreview.positions">
            <tr v-for="(item, index) in invoicePreview.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
                <div
                  v-if="item.service_period_start && item.service_period_end"
                  class="position-service-period"
                >
                  Leistungszeitraum: {{ formatDate(item.service_period_start) }} -
                  {{ formatDate(item.service_period_end) }}
                </div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ formatCurrency(item.price, invoicePreview.currency) }}</td>
              <td class="right">
                {{ invoicePreview.is_reverse_charge ? '0%' : item.vat + '%' }}
              </td>
              <td class="right">
                {{ formatCurrency(item.unit_total, invoicePreview.currency) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- summary -->
        <div class="summary-section">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(invoicePreview.net_total, invoicePreview.currency)
            }}</span>
          </div>

          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(invoicePreview.vat_total, invoicePreview.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(invoicePreview.gross_total, invoicePreview.currency)
            }}</span>
          </div>

          <div class="total-row paid">
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value"> - {{ formatCurrency(0, invoicePreview.currency) }} </span>
          </div>

          <div class="total-row outstanding">
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{
              formatCurrency(invoicePreview.gross_total, invoicePreview.currency)
            }}</span>
          </div>

          <div class="preview-section">
            <div v-if="invoicePreview.is_small_company" class="tax-note small-company">
              ⚠️ Gemäß <span>§19 UStG</span> wird keine Umsatzsteuer berechnet.
            </div>

            <div v-else-if="invoicePreview.is_reverse_charge" class="tax-note">
              ⚠️ Reverse-Charge-Verfahren – Steuerschuldnerschaft des Leistungsempfängers (<span
                >§13b UStG</span
              >)
            </div>

            <div v-else-if="invoicePreview.is_eu_delivery" class="tax-note">
              ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß
              <span>§4 Nr.1b UStG</span> (Europa içi)
            </div>
          </div>
        </div>

        <!-- payment -->
        <div class="payment-terms-box">
          <div class="payment-terms-title">💳 Zahlungsbedingungen</div>

          <div class="payment-terms-content">
            <div v-if="invoicePreview.payment_terms" class="payment-term-item">
              <strong>Zahlungsziel:</strong>
              {{ invoicePreview.payment_terms }} Tage netto (fällig bis
              {{ formatDate(invoicePreview.due_date) }})
            </div>

            <div
              v-if="invoicePreview.early_payment_offer"
              class="payment-term-item skonto-highlight"
            >
              <strong>💰 Skonto:</strong>
              {{ invoicePreview.early_payment_percentage }}% Skonto bei Zahlung innerhalb von
              {{ invoicePreview.early_payment_days }} Tagen (bis
              {{ formatDate(invoicePreview.early_payment_deadline) }})
              <div class="skonto-amount">
                <span
                  >Skonto-Betrag:
                  {{
                    formatCurrency(invoicePreview.early_payment_discount, invoicePreview.currency)
                  }}</span
                >
                <span
                  >Zahlbetrag:
                  {{
                    formatCurrency(
                      invoicePreview.gross_total_after_discount,
                      invoicePreview.currency
                    )
                  }}</span
                >
              </div>
            </div>

            <div v-if="invoicePreview.payment_conditions" class="payment-term-item">
              <strong>Zusätzliche Bedingungen:</strong>
              <div class="payment-conditions-text">
                {{ invoicePreview.payment_conditions }}
              </div>
            </div>
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
          </div>
        </div>

        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="invoicePreview"
        :tableData="invoicePreview"
        :fileName="actionFileName"
        sourcePage="preview"
      />
    </div>

    <router-link to="/invoices/create" class="back-link">
      ← Zurück zur Rechnungserstellung
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/invoices/HeaderSidePreview.vue'
import ContactPersonPreview from '../../components/invoices/ContactPersonPreview.vue'
import ActionsButtonPreview from '../../components/invoices/ActionsButtonPreview.vue'
import FooterSidePreview from '../../components/invoices/FooterSidePreview.vue'

export default {
  name: 'InvoicePreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    ActionsButtonPreview,
    FooterSidePreview
  },
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency', 'formatInvoiceId'],
  data() {
    return {
      title: 'Rechnungbestätigung',
      invoicePreview: null,
      auth: null
    }
  },
  computed: {
    actionFileName() {
      if (!this.invoicePreview) return
      return this.formatInvoiceId(this.invoicePreview.id)
    }
  },
  mounted() {
    this.getInvoicePreview()
    this.getAuth()
  },
  methods: {
    getInvoicePreview() {
      if (!store.state.invoice) return
      this.invoicePreview = store.state.invoice
      console.log('invoice-preview', this.invoicePreview)
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    }
  }
}
</script>
