<template>
  <div>
    <div v-if="offersPreview && auth" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- Recipient & offer Details -->
        <div v-if="offersPreview?.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ offersPreview.selected_customer.company_name }}
            </div>
            <div>{{ offersPreview.selected_customer.address }}</div>
            <div>
              {{ offersPreview.selected_customer.postal_code }}
              {{ offersPreview.selected_customer.city }} <br />
              {{ offersPreview.selected_customer.country }}
            </div>
          </div>

          <div class="invoice-details">
            <div class="section-title">Angebotdetails</div>
            <div class="meta-row">
              <span class="meta-label">Aangebot-Nr.:</span>
              <span class="meta-value">{{ formatAngebotId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(offersPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(offersPreview.selected_customer.id)
              }}</span>
            </div>

            <!-- Optional tax fields -->
            <div v-if="offersPreview.selected_customer.tax_number" class="meta-row">
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ offersPreview.selected_customer.tax_number }}</span>
            </div>
            <div v-if="offersPreview.selected_customer.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ offersPreview.selected_customer.vat_id }}</span>
            </div>
            <div v-if="offersPreview.valid_days" class="meta-row">
              <span class="meta-label">Gültig bis:</span>
              <span class="meta-value">{{
                formatValidDays(offersPreview.date, offersPreview.valid_days)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
          <span v-if="offersPreview.title" class="project-badge">
            {{ offersPreview.title }}
          </span>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          Sehr geehrter Herr Weber,<br /><br />
          vielen Dank für Ihre Auftragserteilung. Hiermit bestätigen wir den Eingang Ihres Auftrags
          auf Grundlage unseres Angebots vom {{ formatDate(offersPreview.offer_date) }}.
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

          <tbody v-if="offersPreview.positions && offersPreview.positions.length > 0">
            <tr v-for="(item, index) in offersPreview.positions" :key="index">
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
              <td class="right">{{ formatCurrency(item.price, offersPreview.currency) }}</td>
              <td class="right">
                {{ offersPreview.reverse_charge ? '0%' : item.vat + '%' }}
              </td>
              <td class="right">
                {{ formatCurrency(item.unit_total, offersPreview.currency) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- summary -->
        <div v-if="offersPreview.summary" class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(offersPreview.summary.subtotal, offersPreview.currency)
            }}</span>
          </div>

          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(offersPreview.summary.vat_amount, offersPreview.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(offersPreview.summary.total, offersPreview.currency)
            }}</span>
          </div>

          <div
            v-if="
              offersPreview.payment &&
              offersPreview.payment.paid_amount &&
              offersPreview.payment.paid_amount > 0
            "
            class="total-row paid"
          >
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value">
              - {{ formatCurrency(offersPreview.payment.paid_amount, offersPreview.currency) }}
            </span>
          </div>

          <div
            v-if="offersPreview.summary && offersPreview.summary.outstanding > 0"
            class="total-row outstanding"
          >
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{
              formatCurrency(offersPreview.summary.outstanding, offersPreview.currency)
            }}</span>
          </div>

          <!-- Sadece Kleinunternehmer için -->
          <div v-if="auth.is_kleinunternehmer" class="tax-note">
            ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
          </div>

          <!-- Reverse Charge için -->
          <div v-if="offersPreview.is_reverse_charge" class="tax-note">
            ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß §4 Nr.1b UStG (Reverse Charge).
          </div>
        </div>

        <!-- Project Info -->
        <div class="delivery-box">
          <div class="delivery-title">📅 Geplanter Projektstart</div>
          <div>
            Projektstart: {{ formatDate(offersPreview.project_start) }}<br />
            Voraussichtliche Dauer: {{ offersPreview.project_duration }} Wochen
          </div>
        </div>

        <!-- Closing -->
        <div class="closing closing-pro">
          Wir bedanken uns für Ihr Vertrauen und freuen uns auf eine erfolgreiche Zusammenarbeit.<br /><br />
          Mit freundlichen Grüßen
        </div>

        <!-- Contact Person -->
        <ContactPersonPreview :contactData="auth.contact_person" />
        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="offersPreview.selected_customer"
        tableName="offers"
        :email="offersPreview.selected_customer.email"
        :documentId="formatAngebotId"
        :invoicesData="offersPreview"
      />
    </div>

    <router-link to="/offers/create" class="back-link">
      ← Zurück zur Auftragserstellung
    </router-link>
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
  inject: ['formatCustomerId', 'formatDate', 'formatValidDays', 'formatCurrency'],
  data() {
    return {
      title: 'Angebotbestätigung',
      offersPreview: null,
      auth: null
    }
  },
  computed: {
    formatAngebotId() {
      if (!this.offersPreview.id) return ''
      const year = new Date().getFullYear()
      return `ANG-${year}-${String(this.offersPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getOffersPreview()
    this.getAuth()
  },
  methods: {
    getOffersPreview() {
      if (store.state.offers) {
        this.offersPreview = store.state.offers
      } else {
        return this.offersPreview
      }
      console.log('Offers Preview Data:', this.offersPreview)
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      } else {
        return this.auth
      }
    }
  }
}
</script>
<style>
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