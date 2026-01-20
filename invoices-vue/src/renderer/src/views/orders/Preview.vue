<template>
  <div v-if="orderPreview" class="editor-panel">
    <div class="printable">
      <!-- Header section -->
      <HeaderSidePreview :title="title" :auth="auth" />

      <!-- Intro Text -->
      <div v-if="orderPreview.intro_text" class="intro-text" style="margin-bottom: 20px">
        <p>{{ orderPreview.intro_text }}</p>
      </div>

      <!-- Empfänger und Auftragsdetails -->
      <div v-if="orderPreview.customer" class="recipient">
        <div class="recipient-address">
          <div class="recipient-title">Empfänger</div>
          <div class="company-name-subtitle">{{ orderPreview.customer.company_name }}</div>
          <div>{{ orderPreview.customer.address }}</div>
          <div>
            {{ orderPreview.customer.postal_code }} {{ orderPreview.customer.city }}<br />
            {{ orderPreview.customer.country }}
          </div>
        </div>

        <div class="recipient-details">
          <div class="recipient-title">Auftragsdetails</div>
          <div class="meta-row">
            <span class="meta-label">Auftrags-Nr.:</span>
            <span class="meta-value">{{ formatOrderId(orderPreview.id) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ formatDate(orderPreview.date) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Kunden-Nr.:</span>
            <span class="meta-value">{{ formatCustomerId(orderPreview.customer.id) }}</span>
          </div>
          <div v-if="auth.tax_number" class="meta-row">
            <span class="meta-label">Steuernummer:</span>
            <span class="meta-value">{{ auth.tax_number }}</span>
          </div>
          <div v-if="auth.vat_id" class="meta-row">
            <span class="meta-label">USt-ID:</span>
            <span class="meta-value">{{ auth.vat_id }}</span>
          </div>
          <div v-if="orderPreview.customer_reference" class="meta-row">
            <span class="meta-label">Kundenreferenz:</span>
            <span class="meta-value">{{ orderPreview.customer_reference }}</span>
          </div>

          <!-- Leistungszeitraum -->
          <div
            v-if="orderPreview.service_period_start && orderPreview.service_period_end"
            class="meta-row"
          >
            <span class="meta-label">Leistungszeitraum:</span>
            <span class="meta-value">
              {{ formatDate(orderPreview.service_period_start) }} -
              {{ formatDate(orderPreview.service_period_end) }}
            </span>
          </div>

          <!-- Status, Priorität, Versandinfo -->
          <div class="meta-row">
            <span class="meta-label">Status:</span>
            <div class="" :class="orderStatus(orderPreview.status).class">
              {{ orderStatus(orderPreview.status).text }}
            </div>
          </div>
          <div v-if="orderPreview.status_by" class="meta-row">
            <span class="meta-label">Bearbeitet von:</span>
            <span class="meta-value">{{ orderPreview.status_by }}</span>
          </div>
          <div v-if="orderPreview.status_date" class="meta-row">
            <span class="meta-label">Bearbeitet am:</span>
            <span class="meta-value">{{ formatDate(orderPreview.status_date) }}</span>
          </div>
          <div v-if="orderPreview.status_comments" class="meta-row">
            <span class="meta-label">Kommentare:</span>
            <span class="meta-value">{{ orderPreview.status_comments }}</span>
          </div>
          <div v-if="orderPreview.priority" class="meta-row">
            <span class="meta-label">Priorität:</span>
            <span class="meta-value">{{ orderPreview.priority }}</span>
          </div>
          <div v-if="orderPreview.sent_at" class="meta-row">
            <span class="meta-label">Gesendet am:</span>
            <span class="meta-value">{{ formatDate(orderPreview.sent_at) }}</span>
          </div>
          <div v-if="orderPreview.sent_method" class="meta-row">
            <span class="meta-label">Gesendet per:</span>
            <span class="meta-value">{{ orderPreview.sent_method }}</span>
          </div>
        </div>
      </div>

      <!-- Positions Tabelle -->
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
        <tbody v-if="orderPreview.positions && orderPreview.positions.length > 0">
          <tr v-for="(item, index) in orderPreview.positions" :key="index">
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
            <td class="right">{{ formatCurrency(item.price, orderPreview.currency) }}</td>
            <td class="right">{{ item.vat + '%' }}</td>
            <td class="right">{{ formatCurrency(item.unit_total, orderPreview.currency) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Zusammenfassung -->
      <div class="summary-section">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">{{
            formatCurrency(orderPreview.net_total, orderPreview.currency)
          }}</span>
        </div>
        <div class="total-row">
          <span class="total-label">MwSt.:</span>
          <span class="total-value">{{
            formatCurrency(orderPreview.vat_total, orderPreview.currency)
          }}</span>
        </div>
        <div class="total-row subtotal">
          <span class="total-label">Rechnungsbetrag (brutto):</span>
          <span class="total-value">{{
            formatCurrency(orderPreview.gross_total, orderPreview.currency)
          }}</span>
        </div>
      </div>

      <!-- Kundenhinweise -->
      <div v-if="orderPreview.customer_notes" class="customer-notes" style="margin-top: 25px">
        <div class="section-title">Kundenhinweis</div>
        <p>{{ orderPreview.customer_notes }}</p>
      </div>

      <!-- Lieferinformationen -->
      <div class="form-section">
        <div v-if="orderPreview.delivery_address" class="meta-row">
          <span class="meta-label">Lieferadresse:</span>
          <span class="meta-value">
            {{ orderPreview.delivery_address }}<br />
            {{ orderPreview.delivery_postal_code }} {{ orderPreview.delivery_city }}<br />
            {{ orderPreview.delivery_country }}
          </span>
        </div>
        <div v-if="orderPreview.delivery_date" class="meta-row">
          <span class="meta-label">Lieferdatum:</span>
          <span class="meta-value">{{ formatDate(orderPreview.delivery_date) }}</span>
        </div>
        <div v-if="orderPreview.delivery_terms" class="meta-row">
          <span class="meta-label">Lieferbedingungen:</span>
          <span class="meta-value">{{ orderPreview.delivery_terms }}</span>
        </div>
        <div v-if="orderPreview.shipping_method" class="meta-row">
          <span class="meta-label">Versandart:</span>
          <span class="meta-value">{{ orderPreview.shipping_method }}</span>
        </div>
      </div>

      <!-- Zahlungsbedingungen -->
      <div v-if="orderPreview" class="terms-section">
        <div class="section-title">Zahlungsbedingungen</div>
        <div class="terms-grid">
          <div v-if="orderPreview.payment_terms" class="term-item">
            <span class="term-label">Zahlungsfrist:</span>
            <span class="term-value">{{ paymentTermsText }}</span>
          </div>
          <div v-if="orderPreview.payment_method" class="term-item">
            <span class="term-label">Zahlungsart:</span>
            <span class="term-value">{{ orderPreview.payment_method }}</span>
          </div>
          <div v-if="orderPreview.payment_reference" class="term-item">
            <span class="term-label">Zahlungsreferenz:</span>
            <span class="term-value">{{ orderPreview.payment_reference }}</span>
          </div>
          <div v-if="orderPreview.payment_conditions" class="term-item">
            <span class="term-label">Bedingungen:</span>
            <span class="term-value">{{ orderPreview.payment_conditions }}</span>
          </div>
        </div>
      </div>

      <!-- Stornierungsinformationen -->
      <div v-if="orderPreview.status === 'cancelled'" class="cancel-info" style="margin-top: 25px">
        <h3 style="color: red">Storniert</h3>
        <div v-if="orderPreview.cancelled_at" class="meta-row">
          <span class="meta-label">Storniert am:</span>
          <span class="meta-value">{{ formatDate(orderPreview.cancelled_at) }}</span>
        </div>
        <div v-if="orderPreview.cancelled_by" class="meta-row">
          <span class="meta-label">Storniert von:</span>
          <span class="meta-value">{{ orderPreview.cancelled_by }}</span>
        </div>
        <div v-if="orderPreview.cancellation_reason" class="meta-row">
          <span class="meta-label">Grund:</span>
          <span class="meta-value">{{ orderPreview.cancellation_reason }}</span>
        </div>
      </div>

      <!-- Abschlusstext -->
      <div class="closing-text">
        {{ orderPreview.closing_text }}
        <p>Mit freundlichen Grüßen,</p>
      </div>

      <!-- Interne Notizen -->
      <div
        v-if="orderPreview.internal_notes"
        class="internal-notes"
        style="opacity: 0.6; margin-top: 25px; border-left: 4px solid #999; padding-left: 12px"
      >
        <div class="section-title">Interne Notiz (nicht im PDF)</div>
        <p>{{ orderPreview.internal_notes }}</p>
      </div>

      <!-- Kontaktperson -->
      <ContactPersonPreview :contactData="auth.contact_person" />

      <!-- Bankinformationen -->
      <div class="bank-box">
        <div class="bank-title">🏦 Bankinformationen</div>
        <div class="bank-info">
          <span class="bank-label">Bank:</span>
          <span class="bank-value">{{ auth.bank_name }}</span>
          <span class="bank-label">IBAN:</span>
          <span class="bank-value">{{ auth.iban }}</span>
          <span class="bank-label">BIC:</span>
          <span class="bank-value">{{ auth.bic }}</span>
        </div>
      </div>

      <!-- Rechtsgültigkeit -->
      <div v-if="orderPreview.is_legal" class="pdf-footer">
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

      <!-- Footer -->
      <FooterSidePreview />
    </div>

    <!-- Actions -->
    <OrderActions
      v-if="orderPreview"
      :tableData="orderPreview"
      :fileName="actionFileName"
      sourcePage="preview"
    />

    <router-link to="/orders/create" class="back-link">← Zurück zur Auftragsliste</router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
import OrderActions from '../../components/preview/OrderActions.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'

export default {
  name: 'OrderPreviewPage',
  components: {
    HeaderSidePreview,
    FooterSidePreview,
    OrderActions,
    ContactPersonPreview
  },
  inject: ['formatOrderId', 'formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Auftragsbestätigung',
      orderPreview: null,
      auth: null,
      STATUS_MAP: {
        draft: { text: 'Entwurf', class: 'status-draft' },
        pending: { text: 'Ausstehend', class: 'status-pending' },
        sent: { text: 'Gesendet', class: 'status-sent' },
        accepted: { text: 'Angenommen', class: 'status-accepted' },
        rejected: { text: 'Abgelehnt', class: 'status-rejected' }
      }
    }
  },
  computed: {
    // Check if payment or delivery terms exist
    hasPaymentOrDeliveryTerms() {
      return (
        (this.orderPreview.payment &&
          (this.orderPreview.payment.payment_terms ||
            this.orderPreview.payment.payment_method ||
            this.orderPreview.payment.payment_conditions)) ||
        this.orderPreview.delivery_terms ||
        this.orderPreview.shipping_method
      )
    },
    // Get readable payment terms text
    paymentTermsText() {
      if (!this.orderPreview.payment?.payment_terms) return ''
      const terms = this.orderPreview.payment.payment_terms
      if (terms === 'vorkasse') return 'Prepayment'
      if (terms === 0) return 'Due immediately'
      return `Due within ${terms} days`
    },
    actionFileName() {
      if (!this.orderPreview) return
      return this.formatOrderd(this.orderPreview.id)
    }
  },
  mounted() {
    this.getOrderPreview()
    this.getAuth()
  },
  methods: {
    getOrderPreview() {
      if (!store.state.order) return
      this.orderPreview = store.state.order
    },
    getAuth() {
      if (!store.state.auth) return
      this.auth = store.state.auth
    },
    orderStatus(status) {
      return this.STATUS_MAP[status] || { text: 'Unbekannt', class: 'status-unknown' }
    }
  }
}
</script>
