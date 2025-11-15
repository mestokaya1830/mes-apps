<template>
  <div>
    <div v-if="offers && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- customers -->
        <div class="recipient">
          <div class="recipient-section">
            <div class="recipient-address">
              <div class="section-title">Empfänger</div>
              <div class="company-name-subtitle">
                {{ offers.customer.company_name }}
              </div>
              <div class="meta-label">{{ offers.customer.address }}</div>
              <div class="meta-label">
                {{ offers.customer.postal_code }}
                {{ offers.customer.city }}<br />
                {{ offers.customer.country }}
              </div>
            </div>
          </div>
          <div class="invoice-details">
            <div class="section-title">Angebotsdetails</div>

            <div class="meta-row">
              <span class="meta-label">Angebots-Nr.:</span>
              <span class="meta-value">{{ formatAngebotsId }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(offers.date) }}</span>
            </div>

            <!-- Leistungsdatum hinzugefügt -->
            <div v-if="offers.service_date" class="meta-row">
              <span class="meta-label">Leistungsdatum:</span>
              <span class="meta-value">{{ formatDate(offers.service_date) }}</span>
            </div>

            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{ formatCustomerId(offers.customer.id) }}</span>
            </div>

            <div
              v-if="
                offers.customer.country === 'Germany' &&
                offers.customer.tax_number
              "
              class="meta-row"
            >
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ offers.customer.tax_number }}</span>
            </div>

            <div
              v-else-if="offers.customer.is_in_eu && offers.customer.vat_id"
              class="meta-row"
            >
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ offers.customer.vat_id }}</span>
            </div>

            <div
              v-else-if="!offers.customer.is_in_eu && offers.customer.vat_id"
              class="meta-row"
            >
              <span class="meta-label">VAT ID:</span>
              <span class="meta-value">{{ offers.customer.vat_id }}</span>
            </div>
            <div v-if="offers.valid_until" class="meta-row">
              <span class="meta-label">Gültig bis:</span>
              <span class="meta-value">{{ formatDate(offers.valid_until) }}</span>
            </div>
          </div>
          <!-- <div class="offer-meta">
            <div class="meta-row">
              <span class="meta-label">Angebots-Nr.:</span>
              <span class="meta-value">{{ offers.id }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(offers.date) }}</span>
            </div>
            <div v-if="offers.customer?.id" class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{ offers.customer.id }}</span>
            </div>
           
            <div
              v-if="offers.service_period_start && offers.service_period_end"
              class="meta-row"
            >
              <span class="meta-label">Leistungszeitraum:</span>
              <span class="meta-value">
                {{ formatDate(offers.service_period_start) }} -
                {{ formatDate(offers.service_period_end) }}
              </span>
            </div>
          </div> -->
        </div>

        <!-- Document Title -->
        <div class="document-title">
          <h1>{{ offers.title || 'Angebot' }}</h1>
        </div>

        <!-- Subject / Description -->
        <div class="form-group">
          <label class="form-label">Betreff / Beschreibung</label>
          <div class="intro-text">
            {{ offers.subject }}
          </div>
        </div>
        <!-- Intro Text -->
        <div class="intro-text">
          Sehr geehrte Damen und Herren,<br /><br />
          vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen folgendes Angebot:
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

          <tbody v-if="offers.positions && offers.positions.length > 0">
            <tr v-for="(item, index) in offers.positions" :key="index">
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
              <td class="right">{{ formatCurrency(item.price, offers.currency) }}</td>
              <td class="right">
                {{ offers.is_reverse_charge ? '0%' : item.vat + '%' }}
              </td>
              <td class="right">
                {{ formatCurrency(item.unit_total, offers.currency) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- summary -->
        <div v-if="offers.summary" class="summary-section">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(offers.summary.subtotal, offers.currency)
            }}</span>
          </div>

          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(offers.summary.vat_amount, offers.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(offers.summary.total, offers.currency)
            }}</span>
          </div>
        </div>

        <!-- Payment Terms -->
        <div v-if="offers.payment" class="payment-section">
          <div class="section-heading">Zahlungsbedingungen</div>
          <div class="payment-content">
            <p v-if="offers.payment.terms">
              Zahlbar innerhalb <strong>{{ offers.payment.terms }} Tagen</strong> netto nach
              Rechnungsdatum.
            </p>
            <p v-if="offers.payment.has_skonto">
              Bei Zahlung innerhalb von
              <strong>{{ offers.payment.skonto_days }} Tagen</strong> gewähren wir
              <strong>{{ offers.payment.skonto_percentage }}% Skonto</strong>.
            </p>
            <p v-if="offers.payment.payment_conditions">
              {{ offers.payment.payment_conditions }}
            </p>
          </div>
        </div>

        <!-- Bank Details -->
        <div v-if="auth.bank || offers.bank" class="bank-section">
          <div class="section-heading">Bankverbindung</div>
          <div class="bank-details">
            <div v-if="auth.bank?.bank_name || offers.bank?.bank_name">
              Kreditinstitut: {{ auth.bank?.bank_name || offers.bank?.bank_name }}
            </div>
            <div v-if="auth.bank?.iban || offers.bank?.iban">
              IBAN: {{ auth.bank?.iban || offers.bank?.iban }}
            </div>
            <div v-if="auth.bank?.bic || offers.bank?.bic">
              BIC: {{ auth.bank?.bic || offers.bank?.bic }}
            </div>
          </div>
        </div>

        <!-- Legal Validity -->
        <div v-if="offers.is_legal_validity" class="signature-section">
          <div class="signature-note">
            Durch Ihre Unterschrift bestätigen Sie die Annahme dieses Angebots.
          </div>
          <div class="signature-box">
            <div class="signature-line">
              <div>_____________________________</div>
              <div class="signature-label">Ort, Datum</div>
            </div>
            <div class="signature-line">
              <div>_____________________________</div>
              <div class="signature-label">Unterschrift</div>
            </div>
          </div>
        </div>

        <!-- Closing -->
        <div class="closing">
          Wir freuen uns auf Ihre Rückmeldung und stehen für Rückfragen gerne zur Verfügung.<br /><br />
          Mit freundlichen Grüßen
        </div>

        <!-- Contact Person -->
        <ContactPersonPreview v-if="auth.contact_person" :contactData="auth.contact_person" />

        <!-- leagal validity -->
        <div v-if="offers.is_legal" class="pdf-footer">
          <label style="display: flex; align-items: center; gap: 8px">
            <input type="checkbox" checked disabled style="width: 16px; height: 16px" />
            Rechtsgültige Unterschrift erforderlich
          </label>

          <div
            class="signature-box"
            style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px"
          >
            <div class="signature-line">
              <div>_____________________________</div>
              <div class="signature-label">Ort, Datum</div>
            </div>
            <div class="signature-line">
              <div>_____________________________</div>
              <div class="signature-label">Unterschrift</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <ActionsButtonPreview
        v-if="offers.customer"
        tableName="offers"
        :tableData="offers"
        sourcePage="details"
      />
    </div>

    <router-link to="/offers" class="back-link"> ← Zurück zur Angebotsliste </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
export default {
  name: 'OffersDetails',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    ActionsButtonPreview
  },
  inject: ['formatCustomerId', 'formatDate', 'formatValidDays', 'formatCurrency'],
  data() {
    return {
      title: 'Angebot-Vorschau',
      offers: null,
      auth: null
    }
  },
  computed: {
    formatAngebotsId() {
      if (!this.offers || !this.offers.id) return ''
      return `ANG-${String(this.offers.id).padStart(6, '0')}`
    }
  },
  mounted() {
    this.getOffers()
    this.getAuth()
  },
  methods: {
    async getOffers() {
      const id = this.$route.params.id
      try {
        const result = await window.api.getDocumentById(id, 'offers')
        this.offers = {
          ...result.rows,
          customer: JSON.parse(result.rows.customer),
          positions: JSON.parse(result.rows.positions),
          payment: JSON.parse(result.rows.payment),
          summary: JSON.parse(result.rows.summary)
        }
        console.log(this.offers)
      } catch (error) {
        console.error(error)
      }
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      }
    }
  }
}
</script>
<style>
/* PREVIEW PANEL */
.preview-panel {
  width: 80%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: auto;
  padding: 20px;
  top: 20px;
}

/* RECIPIENT */
.recipient {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.recipient-address {
  font-weight: 600;
  color: var(--lightColor);
  font-size: 12px;
}

/* META INFO */
.meta-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  margin-bottom: 4px;
}

.meta-label {
  font-weight: 600;
  color: var(--lightColor);
  font-size: 12px;
}

.meta-value {
  color: var(--midColor);
  font-size: 12px;
}

/* INTRO */
.intro-text {
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 10px;
}

/* BANK + CONTACT BOX */
.bank-box {
  background: #f1f5f9;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid transparent;
}

.bank-info {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 4px;
  line-height: 1.6;
  font-size: 12px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.bank-label {
  color: #444;
}

.bank-value {
  font-weight: 600;
  color: #333;
}

/* BACK LINK */
.back-link {
  display: inline-block;
  cursor: pointer;
  margin: 40px 0;
  font-size: 18px;
  color: #3b82f6;
  text-decoration: none;
  border: 1px solid #3b82f6;
  padding: 4px 8px;
  border-radius: 4px;
}
.back-link:hover {
  text-decoration: underline;
}

/* Positions Table */
.positions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  font-size: 10pt;
}

.positions-table thead {
  background: #f8f9fa;
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
}

.positions-table th {
  padding: 10px 8px;
  text-align: left;
  font-size: 9pt;
  font-weight: 700;
  text-transform: uppercase;
  color: #333;
}

.positions-table th.center,
.positions-table td.center {
  text-align: center;
}

.positions-table th.right,
.positions-table td.right {
  text-align: right;
}

.positions-table tbody tr {
  border-bottom: 1px solid #e9ecef;
}

.positions-table td {
  padding: 12px 8px;
  vertical-align: top;
}

.position-title {
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
}

.position-description {
  font-size: 9pt;
  color: #666;
  margin-top: 4px;
}

.position-service-period {
  font-size: 8pt;
  color: #888;
  margin-top: 4px;
  font-style: italic;
}

/* Section Title */
.section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 16px;
}

/* Summary Section */
.summary-section {
  margin-left: auto;
  width: 300px;
  margin-bottom: 40px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 10pt;
}

.total-row.subtotal {
  font-size: 11pt;
  font-weight: 700;
}

.total-row.paid {
  color: #16a34a;
  font-weight: 700;
}

.total-row.outstanding {
  color: #dc2626;
  font-weight: 700;
}

.total-label {
  font-weight: 500;
}

.total-value {
  font-weight: 600;
  text-align: right;
}

/* Tax Notes */
.tax-note {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 9pt;
  line-height: 1.5;
}

.small-company {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
}

/* Subject Line */
.subject-line {
  margin: 20px 0;
  padding: 12px;
  background-color: #f8f9fa;
  border-left: 4px solid #0066cc;
  font-size: 14px;
}

/* Payment Terms */
.payment-terms-box {
  margin: 30px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.payment-terms-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #0066cc;
}

.payment-terms-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-term-item {
  font-size: 13px;
  line-height: 1.6;
  padding: 8px 0;
}

.payment-term-item strong {
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.skonto-highlight {
  background-color: #e7f3ff;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #0066cc;
}

.skonto-amount {
  margin-top: 8px;
  font-size: 12px;
  color: #0066cc;
  font-weight: 600;
}

.payment-conditions-text {
  margin-top: 6px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  white-space: pre-wrap;
  font-size: 12px;
  color: #666;
}
</style>
