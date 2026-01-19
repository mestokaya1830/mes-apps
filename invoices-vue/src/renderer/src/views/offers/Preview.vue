<template>
  <div v-if="offerPreview && auth" class="preview-panel">
    <div class="printable">
      <!-- Header -->
      <HeaderSidePreview :title="title" :auth="auth" />

      <!-- customers -->
      <div class="recipient">
        <div class="recipient-section">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ offerPreview.customer.company_name }}
            </div>
            <div class="meta-label">{{ offerPreview.customer.address }}</div>
            <div class="meta-label">
              {{ offerPreview.customer.postal_code }}
              {{ offerPreview.customer.city }}<br />
              {{ offerPreview.customer.country }}
            </div>
          </div>
        </div>
        <div class="invoice-details">
          <div class="section-title">Angebotsdetails</div>

          <div class="meta-row">
            <span class="meta-label">Angebots-Nr.:</span>
            <span class="meta-value">{{ formatOfferId(offerPreview.id) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ formatDate(offerPreview.date) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Kunden-Nr.:</span>
            <span class="meta-value">{{ formatCustomerId(offerPreview.customer.id) }}</span>
          </div>

          <div
            v-if="offerPreview.customer.country === 'Germany' && offerPreview.customer.tax_number"
            class="meta-row"
          >
            <span class="meta-label">Steuer-Nr.:</span>
            <span class="meta-value">{{ offerPreview.customer.tax_number }}</span>
          </div>

          <div
            v-else-if="offerPreview.customer.is_in_eu && offerPreview.customer.vat_id"
            class="meta-row"
          >
            <span class="meta-label">USt-IdNr.:</span>
            <span class="meta-value">{{ offerPreview.customer.vat_id }}</span>
          </div>

          <div
            v-else-if="!offerPreview.customer.is_in_eu && offerPreview.customer.vat_id"
            class="meta-row"
          >
            <span class="meta-label">VAT ID:</span>
            <span class="meta-value">{{ offerPreview.customer.vat_id }}</span>
          </div>

          <div v-if="offerPreview.valid_until" class="meta-row">
            <span class="meta-label">Gültig bis:</span>
            <span class="meta-value">{{ formatDate(offerPreview.valid_until) }}</span>
          </div>

          <div v-if="offerPreview.status" class="meta-row">
            <span class="meta-label">Status:</span>
            <span class="meta-value">{{ getStatusText(offerPreview.status) }}</span>
          </div>
        </div>
      </div>

      <!-- Document Title -->
      <div class="document-title">
        <h1>{{ offerPreview.title || 'Angebot' }}</h1>
      </div>

      <!-- Subject / Description -->
      <div v-if="offerPreview.subject" class="form-group">
        <label class="form-label">Betreff / Beschreibung</label>
        <div class="intro-text">
          {{ offerPreview.subject }}
        </div>
      </div>

      <!-- Introduction Text -->
      <div class="intro-text">
        <span v-if="offerPreview.introduction_text">
          {{ offerPreview.introduction_text }}
        </span>
        <span v-else>
          Sehr geehrte Damen und Herren,<br /><br />
          vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen folgendes Angebot:
        </span>
      </div>

      <!-- Contact Person -->
      <div v-if="offerPreview.contact_person" class="contact-person-section">
        <strong>Ihr Ansprechpartner:</strong> {{ offerPreview.contact_person }}
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

        <tbody v-if="offerPreview.positions && offerPreview.positions.length > 0">
          <tr v-for="(item, index) in offerPreview.positions" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="position-title">{{ item.title }}</div>
              <div v-if="item.description" class="position-description">
                {{ item.description }}
              </div>
            </td>
            <td class="center">{{ item.quantity }}</td>
            <td class="center">{{ item.unit }}</td>
            <td class="right">{{ formatCurrency(item.price, offerPreview.currency) }}</td>
            <td class="right">{{ item.vat }}%</td>
            <td class="right">
              {{ formatCurrency(item.unit_total, offerPreview.currency) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Summary Section -->
      <div class="summary-section">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">{{
            formatCurrency(offerPreview.net_total || 0, offerPreview.currency)
          }}</span>
        </div>

        <div class="total-row">
          <span class="total-label">MwSt. Gesamt:</span>
          <span class="total-value">{{
            formatCurrency(offerPreview.vat_total || 0, offerPreview.currency)
          }}</span>
        </div>

        <div class="total-row subtotal">
          <span class="total-label">Gesamtbetrag (brutto):</span>
          <span class="total-value">{{
            formatCurrency(offerPreview.gross_total || 0, offerPreview.currency)
          }}</span>
        </div>
      </div>

      <!-- Payment Terms -->
      <div v-if="offerPreview.payment_terms" class="payment-section">
        <div class="section-heading">Zahlungsbedingungen</div>
        <div class="payment-content">
          <p>{{ offerPreview.payment_terms }}</p>
        </div>
      </div>

      <!-- Delivery Terms -->
      <div v-if="offerPreview.delivery_terms" class="delivery-section">
        <div class="section-heading">Lieferbedingungen</div>
        <div class="delivery-content">
          <p>{{ offerPreview.delivery_terms }}</p>
        </div>
      </div>

      <!-- Delivery Time -->
      <div v-if="offerPreview.delivery_time" class="delivery-time-section">
        <div class="section-heading">Lieferzeit</div>
        <div class="delivery-time-content">
          <p>{{ offerPreview.delivery_time }}</p>
        </div>
      </div>

      <!-- Notes (Customer visible) -->
      <div v-if="offerPreview.notes" class="notes-section">
        <div class="section-heading">Hinweise</div>
        <div class="notes-content">
          <p>{{ offerPreview.notes }}</p>
        </div>
      </div>

      <!-- Bank Details -->
      <div v-if="auth.bank || offerPreview.bank" class="bank-section">
        <div class="section-heading">Bankverbindung</div>
        <div class="bank-details">
          <div v-if="auth.bank?.bank_name || offerPreview.bank?.bank_name">
            Kreditinstitut: {{ auth.bank?.bank_name || offerPreview.bank?.bank_name }}
          </div>
          <div v-if="auth.bank?.iban || offerPreview.bank?.iban">
            IBAN: {{ auth.bank?.iban || offerPreview.bank?.iban }}
          </div>
          <div v-if="auth.bank?.bic || offerPreview.bank?.bic">
            BIC: {{ auth.bank?.bic || offerPreview.bank?.bic }}
          </div>
        </div>
      </div>

      <!-- Closing Text -->
      <div class="closing">
        <span v-if="offerPreview.closing_text">
          {{ offerPreview.closing_text }}
        </span>
        <span v-else>
          Wir freuen uns auf Ihre Rückmeldung und stehen für Rückfragen gerne zur Verfügung.<br /><br />
          Mit freundlichen Grüßen
        </span>
      </div>

      <!-- Contact Person -->
      <ContactPersonPreview v-if="auth.contact_person" :contactData="auth.contact_person" />

      <!-- Legal Validity Signature -->
      <div v-if="offerPreview.is_legal" class="pdf-footer">
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

      <!-- Internal Notes (only visible in preview, not in PDF) -->
      <div v-if="offerPreview.internal_notes" class="internal-notes-section no-print">
        <div class="section-heading" style="color: #e74c3c">
          Interne Notizen (nicht für Kunden sichtbar)
        </div>
        <div
          class="internal-notes-content"
          style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107"
        >
          <p>{{ offerPreview.internal_notes }}</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <OfferActions
      v-if="offerPreview"
      :tableData="offerPreview"
      :fileName="actionFileName"
      sourcePage="preview"
    />
    <router-link to="/offers/create" class="back-link"> ← Zurück zur Bearbeitung </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import OfferActions from '../../components/preview/OfferActions.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
export default {
  name: 'OfferPreview',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    OfferActions
  },
  inject: ['formatCustomerId', 'formatOfferId', 'formatDate', 'formatValidDays', 'formatCurrency'],
  data() {
    return {
      title: 'Angebot',
      offerPreview: null,
      auth: null
    }
  },
  computed: {
    actionFileName() {
      if (!this.offerPreview) return
      return this.formatOfferId(this.offerPreview.id)
    }
  },
  mounted() {
    this.getOfferPreview()
    this.getAuth()
  },
  methods: {
    getOfferPreview() {
      if (!store.state.offer) return
      this.offerPreview = store.state.offer
      console.log('preview', this.offerPreview)
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    },
    getStatusText(status) {
      const statusMap = {
        draft: 'Entwurf',
        sent: 'Versendet',
        accepted: 'Akzeptiert',
        rejected: 'Abgelehnt',
        expired: 'Abgelaufen'
      }
      return statusMap[status] || status
    }
  }
}
</script>
