<template>
  <div>
    <div v-if="offersPreview && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- Absender (Sender) Info -->
        <div class="sender-line">
          {{ auth.company_name }} · {{ auth.address }} · {{ auth.postal_code }} {{ auth.city }}
        </div>

        <!-- Recipient & Offer Details -->
        <div class="main-content">
          <div class="recipient-section">
            <div v-if="offersPreview?.selected_customer" class="recipient-address">
              <div v-if="offersPreview.selected_customer.company_name" class="company-name">
                {{ offersPreview.selected_customer.company_name }}
              </div>
              <div
                v-if="
                  offersPreview.selected_customer.first_name ||
                  offersPreview.selected_customer.last_name
                "
              >
                {{ offersPreview.selected_customer.first_name }}
                {{ offersPreview.selected_customer.last_name }}
              </div>
              <div>{{ offersPreview.selected_customer.address }}</div>
              <div>
                {{ offersPreview.selected_customer.postal_code }}
                {{ offersPreview.selected_customer.city }}
              </div>
              <div v-if="offersPreview.selected_customer.country">
                {{ offersPreview.selected_customer.country }}
              </div>
            </div>
          </div>

          <div class="offer-meta">
            <div class="meta-row">
              <span class="meta-label">Angebotsnummer:</span>
              <span class="meta-value">{{ offersPreview.id }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Angebotsdatum:</span>
              <span class="meta-value">{{ formatDate(offersPreview.date) }}</span>
            </div>
            <div v-if="offersPreview.valid_until" class="meta-row">
              <span class="meta-label">Gültig bis:</span>
              <span class="meta-value">{{ formatDate(offersPreview.valid_until) }}</span>
            </div>
            <div v-if="offersPreview.selected_customer?.id" class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{ offersPreview.selected_customer.id }}</span>
            </div>
            <div
              v-if="offersPreview.service_period_start && offersPreview.service_period_end"
              class="meta-row"
            >
              <span class="meta-label">Leistungszeitraum:</span>
              <span class="meta-value">
                {{ formatDate(offersPreview.service_period_start) }} -
                {{ formatDate(offersPreview.service_period_end) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
          <h1>{{ offersPreview.title || 'Angebot' }}</h1>
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
              <th class="center" style="width: 10%">Menge</th>
              <th class="center" style="width: 10%">Einheit</th>
              <th class="right" style="width: 15%">Einzelpreis</th>
              <th class="right" style="width: 10%">MwSt.</th>
              <th class="right" style="width: 15%">Gesamt</th>
            </tr>
          </thead>

          <tbody v-if="offersPreview.positions && offersPreview.positions.length > 0">
            <tr v-for="(item, index) in offersPreview.positions" :key="index">
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
              <td class="center">{{ formatNumber(item.quantity) }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ formatCurrency(item.price) }}</td>
              <td class="right">{{ item.vat }}%</td>
              <td class="right">{{ formatCurrency(item.gross) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Summary/Totals -->
        <div class="totals-section">
          <div class="total-row">
            <span class="total-label">Summe Netto:</span>
            <span class="total-value">{{ formatCurrency(totals.net) }}</span>
          </div>

          <!-- VAT Breakdown by Rate -->
          <div v-if="!offersPreview.is_kleinunternehmer && !offersPreview.is_reverse_charge">
            <div v-for="(amount, rate) in totals.vatByRate" :key="rate" class="total-row vat-row">
              <span class="total-label">zzgl. {{ rate }}% MwSt.:</span>
              <span class="total-value">{{ formatCurrency(amount) }}</span>
            </div>
          </div>

          <div class="total-row total-final">
            <span class="total-label">Gesamtbetrag:</span>
            <span class="total-value">{{ formatCurrency(totals.gross) }}</span>
          </div>

          <!-- Tax Notes -->
          <div v-if="offersPreview.is_kleinunternehmer" class="tax-note kleinunternehmer">
            <strong>Hinweis:</strong> Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
          </div>

          <div v-if="offersPreview.is_reverse_charge" class="tax-note reverse-charge">
            <strong>Hinweis:</strong> Steuerschuldnerschaft des Leistungsempfängers gemäß §13b UStG
            (Reverse Charge).
          </div>
        </div>

        <!-- Payment Terms -->
        <div v-if="offersPreview.payment" class="payment-section">
          <div class="section-heading">Zahlungsbedingungen</div>
          <div class="payment-content">
            <p v-if="offersPreview.payment.terms">
              Zahlbar innerhalb <strong>{{ offersPreview.payment.terms }} Tagen</strong> netto nach
              Rechnungsdatum.
            </p>
            <p v-if="offersPreview.payment.has_skonto">
              Bei Zahlung innerhalb von
              <strong>{{ offersPreview.payment.skonto_days }} Tagen</strong> gewähren wir
              <strong>{{ offersPreview.payment.skonto_percentage }}% Skonto</strong>.
            </p>
            <p v-if="offersPreview.payment.payment_conditions">
              {{ offersPreview.payment.payment_conditions }}
            </p>
          </div>
        </div>

        <!-- Bank Details -->
        <div v-if="auth.bank || offersPreview.bank" class="bank-section">
          <div class="section-heading">Bankverbindung</div>
          <div class="bank-details">
            <div v-if="auth.bank?.bank_name || offersPreview.bank?.bank_name">
              Kreditinstitut: {{ auth.bank?.bank_name || offersPreview.bank?.bank_name }}
            </div>
            <div v-if="auth.bank?.iban || offersPreview.bank?.iban">
              IBAN: {{ auth.bank?.iban || offersPreview.bank?.iban }}
            </div>
            <div v-if="auth.bank?.bic || offersPreview.bank?.bic">
              BIC: {{ auth.bank?.bic || offersPreview.bank?.bic }}
            </div>
          </div>
        </div>

        <!-- Legal Validity -->
        <div v-if="offersPreview.is_legal_validity" class="signature-section">
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

        <!-- Footer with Company Details -->
       <div class="pdf-footer">
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
        v-if="offersPreview.selected_customer"
        tableName="offers"
        :email="offersPreview.selected_customer.email"
        :documentId="offersPreview.id"
        :invoicesData="offersPreview"
      />
    </div>

    <router-link to="/offers/create" class="back-link"> ← Zurück zur Bearbeitung </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
export default {
  name: 'OffersPreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    FooterSidePreview,
    ActionsButtonPreview
  },
  inject: ['formatCustomerId', 'formatDate', 'formatValidDays', 'formatCurrency', 'formatNumber'],
  data() {
    return {
      title: 'Angebot',
      offersPreview: null,
      auth: null,
      totals: {
        net: 0,
        gross: 0,
        vatByRate: {}
      }
    }
  },
  mounted() {
    this.getOffersPreview()
    this.getAuth()
    this.calculateTotals()
  },
  methods: {
    getOffersPreview() {
      if (store.state.offers) {
        this.offersPreview = store.state.offers
      }
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      }
    },
    calculateTotals() {
      if (!this.offersPreview?.positions) return

      let net = 0
      let gross = 0
      const vatByRate = {}

      this.offersPreview.positions.forEach((pos) => {
        net += pos.net || 0
        gross += pos.gross || 0

        if (
          pos.vat > 0 &&
          !this.offersPreview.is_kleinunternehmer &&
          !this.offersPreview.is_reverse_charge
        ) {
          if (!vatByRate[pos.vat]) {
            vatByRate[pos.vat] = 0
          }
          vatByRate[pos.vat] += pos.vat_amt || 0
        }
      })

      this.totals = { net, gross, vatByRate }
    }
  }
}
</script>

<style scoped>
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

/* Totals Section */
.totals-section {
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

.total-row.vat-row {
  font-size: 9pt;
  color: #666;
}

.total-row.total-final {
  border-top: 2px solid #333;
  border-bottom: 3px double #333;
  padding: 12px 0;
  margin-top: 8px;
  font-size: 12pt;
  font-weight: 700;
}

.total-label {
  font-weight: 500;
}

.total-value {
  font-weight: 600;
  text-align: right;
}

.total-final .total-value {
  font-size: 14pt;
}

/* Tax Notes */
.tax-note {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 9pt;
  line-height: 1.5;
}

.tax-note.kleinunternehmer {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
}

.tax-note.reverse-charge {
  background: #d1ecf1;
  border: 1px solid #17a2b8;
  color: #0c5460;
}

/* Payment Section */
.payment-section,
.bank-section {
  margin-bottom: 30px;
}

.section-heading {
  font-size: 11pt;
  font-weight: 700;
  color: #000;
  margin-bottom: 12px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

.payment-content,
.bank-details {
  font-size: 10pt;
  line-height: 1.8;
}

.payment-content p {
  margin: 8px 0;
}

/* Signature Section */
.signature-section {
  margin: 40px 0;
}

.signature-note {
  font-size: 10pt;
  margin-bottom: 30px;
  color: #666;
}

.signature-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 40px;
}

.signature-line {
  text-align: center;
}

.signature-line > div:first-child {
  border-bottom: 1px solid #333;
  padding-bottom: 2px;
  margin-bottom: 8px;
}

.signature-label {
  font-size: 9pt;
  color: #666;
}

/* Closing */
.closing {
  margin: 40px 0 30px;
  line-height: 1.8;
}

/* Back Link */
.back-link {
  display: inline-block;
  margin: 20px;
  padding: 10px 20px;
  background: #4a90e2;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
}

.back-link:hover {
  background: #357abd;
}

/* Print Styles */
@media print {
  .preview-panel {
    background: #fff;
    padding: 0;
  }

  .printable {
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  .back-link {
    display: none;
  }
}
</style>
