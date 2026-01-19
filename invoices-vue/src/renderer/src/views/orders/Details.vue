<template>
  <div v-if="order" class="preview-panel">
    <div class="printable">
      <!-- Header section -->
      <HeaderSidePreview :title="title" :auth="auth" />

      <!-- Intro Text -->
      <div v-if="order.intro_text" class="intro-text" style="margin-bottom: 20px">
        <p>{{ order.intro_text }}</p>
      </div>

      <!-- Empfänger und Auftragsdetails -->
      <div v-if="order.customer" class="recipient">
        <div class="recipient-address">
          <div class="recipient-title">Empfänger</div>
          <div class="company-name-subtitle">{{ order.customer.company_name }}</div>
          <div>{{ order.customer.address }}</div>
          <div>
            {{ order.customer.postal_code }} {{ order.customer.city }}<br />
            {{ order.customer.country }}
          </div>
        </div>

        <div class="recipient-details">
          <div class="recipient-title">Auftragsdetails</div>
          <div class="meta-row">
            <span class="meta-label">Auftrags-Nr.:</span>
            <span class="meta-value">{{ formatOrderId(order.id) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ formatDate(order.date) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Kunden-Nr.:</span>
            <span class="meta-value">{{ formatCustomerId(order.customer.id) }}</span>
          </div>
          <div v-if="auth.tax_number" class="meta-row">
            <span class="meta-label">Steuernummer:</span>
            <span class="meta-value">{{ auth.tax_number }}</span>
          </div>
          <div v-if="auth.vat_id" class="meta-row">
            <span class="meta-label">USt-ID:</span>
            <span class="meta-value">{{ auth.vat_id }}</span>
          </div>
          <div v-if="order.customer_reference" class="meta-row">
            <span class="meta-label">Kundenreferenz:</span>
            <span class="meta-value">{{ order.customer_reference }}</span>
          </div>

          <!-- Leistungszeitraum -->
          <div v-if="order.service_period_start && order.service_period_end" class="meta-row">
            <span class="meta-label">Leistungszeitraum:</span>
            <span class="meta-value">
              {{ formatDate(order.service_period_start) }} -
              {{ formatDate(order.service_period_end) }}
            </span>
          </div>

          <!-- Status, Priorität, Versandinfo -->
          <div class="meta-row">
            <span class="meta-label">Status:</span>
            <div class="" :class="orderStatus(order.status).class">
              {{ orderStatus(order.status).text }}
            </div>
          </div>
          <div v-if="order.status_by" class="meta-row">
            <span class="meta-label">Bearbeitet von:</span>
            <span class="meta-value">{{ order.status_by }}</span>
          </div>
          <div v-if="order.status_date" class="meta-row">
            <span class="meta-label">Bearbeitet am:</span>
            <span class="meta-value">{{ formatDate(order.status_date) }}</span>
          </div>
          <div v-if="order.status_comments" class="meta-row">
            <span class="meta-label">Kommentare:</span>
            <span class="meta-value">{{ order.status_comments }}</span>
          </div>
          <div v-if="order.priority" class="meta-row">
            <span class="meta-label">Priorität:</span>
            <span class="meta-value">{{ order.priority }}</span>
          </div>
          <div v-if="order.sent_at" class="meta-row">
            <span class="meta-label">Gesendet am:</span>
            <span class="meta-value">{{ formatDate(order.sent_at) }}</span>
          </div>
          <div v-if="order.sent_method" class="meta-row">
            <span class="meta-label">Gesendet per:</span>
            <span class="meta-value">{{ order.sent_method }}</span>
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
        <tbody v-if="order.positions && order.positions.length > 0">
          <tr v-for="(item, index) in order.positions" :key="index">
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
            <td class="right">{{ formatCurrency(item.price, order.currency) }}</td>
            <td class="right">{{ item.vat + '%' }}</td>
            <td class="right">{{ formatCurrency(item.unit_total, order.currency) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Zusammenfassung -->
      <div class="summary-section">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">{{ formatCurrency(order.net_total, order.currency) }}</span>
        </div>
        <div class="total-row">
          <span class="total-label">MwSt.:</span>
          <span class="total-value">{{ formatCurrency(order.vat_total, order.currency) }}</span>
        </div>
        <div class="total-row subtotal">
          <span class="total-label">Rechnungsbetrag (brutto):</span>
          <span class="total-value">{{ formatCurrency(order.gross_total, order.currency) }}</span>
        </div>
      </div>

      <!-- Kundenhinweise -->
      <div v-if="order.customer_notes" class="customer-notes" style="margin-top: 25px">
        <div class="section-title">Kundenhinweis</div>
        <p>{{ order.customer_notes }}</p>
      </div>

      <!-- Lieferinformationen -->
      <div class="form-section">
        <div v-if="order.delivery_address" class="meta-row">
          <span class="meta-label">Lieferadresse:</span>
          <span class="meta-value">
            {{ order.delivery_address }}<br />
            {{ order.delivery_postal_code }} {{ order.delivery_city }}<br />
            {{ order.delivery_country }}
          </span>
        </div>
        <div v-if="order.delivery_date" class="meta-row">
          <span class="meta-label">Lieferdatum:</span>
          <span class="meta-value">{{ formatDate(order.delivery_date) }}</span>
        </div>
        <div v-if="order.delivery_terms" class="meta-row">
          <span class="meta-label">Lieferbedingungen:</span>
          <span class="meta-value">{{ order.delivery_terms }}</span>
        </div>
        <div v-if="order.shipping_method" class="meta-row">
          <span class="meta-label">Versandart:</span>
          <span class="meta-value">{{ order.shipping_method }}</span>
        </div>
      </div>

      <!-- Zahlungsbedingungen -->
      <div v-if="order" class="terms-section">
        <div class="section-title">Zahlungsbedingungen</div>
        <div class="terms-grid">
          <div v-if="order.payment_terms" class="term-item">
            <span class="term-label">Zahlungsfrist:</span>
            <span class="term-value">{{ paymentTermsText }}</span>
          </div>
          <div v-if="order.payment_method" class="term-item">
            <span class="term-label">Zahlungsart:</span>
            <span class="term-value">{{ order.payment_method }}</span>
          </div>
          <div v-if="order.payment_reference" class="term-item">
            <span class="term-label">Zahlungsreferenz:</span>
            <span class="term-value">{{ order.payment_reference }}</span>
          </div>
          <div v-if="order.payment_conditions" class="term-item">
            <span class="term-label">Bedingungen:</span>
            <span class="term-value">{{ order.payment_conditions }}</span>
          </div>
        </div>
      </div>

      <!-- Stornierungsinformationen -->
      <div v-if="order.status === 'cancelled'" class="cancel-info" style="margin-top: 25px">
        <h3 style="color: red">Storniert</h3>
        <div v-if="order.cancelled_at" class="meta-row">
          <span class="meta-label">Storniert am:</span>
          <span class="meta-value">{{ formatDate(order.cancelled_at) }}</span>
        </div>
        <div v-if="order.cancelled_by" class="meta-row">
          <span class="meta-label">Storniert von:</span>
          <span class="meta-value">{{ order.cancelled_by }}</span>
        </div>
        <div v-if="order.cancellation_reason" class="meta-row">
          <span class="meta-label">Grund:</span>
          <span class="meta-value">{{ order.cancellation_reason }}</span>
        </div>
      </div>

      <!-- Abschlusstext -->
      <div class="closing-text">
        {{ order.closing_text }}
        <p>Mit freundlichen Grüßen,</p>
      </div>

      <!-- Interne Notizen -->
      <div
        v-if="order.internal_notes"
        class="internal-notes"
        style="opacity: 0.6; margin-top: 25px; border-left: 4px solid #999; padding-left: 12px"
      >
        <div class="section-title">Interne Notiz (nicht im PDF)</div>
        <p>{{ order.internal_notes }}</p>
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
      <div v-if="order.is_legal" class="pdf-footer">
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
    <OrderActions v-if="order" :tableData="order" :fileName="actionFileName" sourcePage="details" />

    <router-link to="/orders" class="back-link">← Zurück zur Auftragsliste</router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
import OrderActions from '../../components/preview/OrderActions.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'

export default {
  name: 'AuftragDetails',
  components: {
    HeaderSidePreview,
    FooterSidePreview,
    OrderActions,
    ContactPersonPreview
  },
  inject: ['formatOrderId', 'formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Auftrags-Vorschau',
      order: null,
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
    paymentTermsText() {
      if (!this.order?.payment_terms) return ''
      const terms = this.order.payment_terms
      if (terms === 'vorkasse') return 'Prepayment'
      if (terms === 0) return 'Due immediately'
      return `Due within ${terms} days`
    },
    actionFileName() {
      if (!this.order) return
      return this.formatOrderId(this.order.id)
    }
  },
  mounted() {
    this.getOrder()
    this.getAuth()
  },
  methods: {
    async getOrder() {
      const id = this.$route.params.id
      try {
        const result = await window.api.getOrderById(id)
        if (!result.success) return
        this.order = {
          ...result.rows,
          customer: JSON.parse(result.rows.customer),
          positions: JSON.parse(result.rows.positions)
        }
      } catch (error) {
        console.error(error)
      }
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
