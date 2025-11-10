<template>
  <div v-if="ordersPreview">
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :auth="auth" />

        <!-- Recipient & Order Details -->
        <div v-if="ordersPreview.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ ordersPreview.selected_customer.company_name }}
            </div>
            <div>{{ ordersPreview.selected_customer.address }}</div>
            <div>
              {{ ordersPreview.selected_customer.postal_code }}
              {{ ordersPreview.selected_customer.city }}<br />
              {{ ordersPreview.selected_customer.country }}
            </div>
          </div>

          <div class="invoice-details">
            <div class="section-title">Auftragsdetails</div>
            <div class="meta-row">
              <span class="meta-label">Auftrags-Nr.:</span>
              <span class="meta-value">{{ formatAuftragId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(ordersPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(ordersPreview.selected_customer.id)
              }}</span>
            </div>
            <div v-if="ordersPreview.service_period" class="meta-row">
              <span class="meta-label">Leistungszeitraum:</span>
              <span class="meta-value">{{ ordersPreview.service_period }}</span>
            </div>

            <!-- Optional tax fields -->
            <div v-if="auth.tax_number" class="meta-row">
              <span class="meta-label">Steuernummer:</span>
              <span class="meta-value">{{ auth.tax_number }}</span>
            </div>
            <div v-if="auth.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ auth.vat_id }}</span>
            </div>
          </div>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          <template v-if="ordersPreview.selected_customer?.gender === 'f'">
            Sehr geehrte Frau {{ ordersPreview.selected_customer?.last_name }},
          </template>
          <template v-else>
            Sehr geehrter Herr {{ ordersPreview.selected_customer?.last_name }},
          </template>
          <br />
          vielen Dank für Ihre Auftragserteilung. Wir bestätigen Ihnen hiermit folgenden Auftrag:
        </div>

        <!-- events -->
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

          <tbody v-if="ordersPreview.positions && ordersPreview.positions.length > 0">
            <tr v-for="(item, index) in ordersPreview.positions" :key="index">
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
              <td class="right">{{ formatCurrency(item.price, ordersPreview.currency) }}</td>
              <td class="right">
                {{ ordersPreview.reverse_charge ? '0%' : item.vat + '%' }}
              </td>
              <td class="right">
                {{ formatCurrency(item.unit_total, ordersPreview.currency) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- summary -->
        <div v-if="ordersPreview.summary" class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.summary.subtotal, ordersPreview.currency)
            }}</span>
          </div>

          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.summary.vat_amount, ordersPreview.currency)
            }}</span>
          </div>

          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.summary.total, ordersPreview.currency)
            }}</span>
          </div>

          <div
            v-if="
              ordersPreview.payment &&
              ordersPreview.payment.paid_amount &&
              ordersPreview.payment.paid_amount > 0
            "
            class="total-row paid"
          >
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value">
              - {{ formatCurrency(ordersPreview.payment.paid_amount, ordersPreview.currency) }}
            </span>
          </div>

          <!-- <div
            v-if="ordersPreview.summary && ordersPreview.summary.outstanding > 0"
            class="total-row outstanding"
          >
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{
              formatCurrency(ordersPreview.summary.outstanding, ordersPreview.currency)
            }}</span>
          </div> -->

          <!-- Sadece Kleinunternehmer için -->
          <div v-if="auth.is_kleinunternehmer" class="tax-note">
            ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
          </div>

          <!-- Reverse Charge için -->
          <div v-if="ordersPreview.is_reverse_charge" class="tax-note">
            ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß §4 Nr.1b UStG (Reverse Charge).
          </div>
        </div>

        <!-- Contact Person -->
        <ContactPersonPreview :contactData="auth.contact_person"/>
        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="ordersPreview.selected_customer"
        tableName="orders"
        :email="ordersPreview.selected_customer.email"
        :documentId="formatAuftragId"
        :invoicesData="ordersPreview"
      />
    </div>

    <router-link to="/orders/create" class="back-link">
      ← Zurück zur Auftragserstellung
    </router-link>
  </div>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'

export default {
  name: 'OrdersPreview',
  components: {
    HeaderSidePreview,
    FooterSidePreview,
    ActionsButtonPreview,
    ContactPersonPreview
  },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Auftragbestätigung',
      ordersPreview: null,
      auth: null
    }
  },
  computed: {
    formatAuftragId() {
      if (!this.ordersPreview.id) return ''
      const year = new Date().getFullYear()
      return `AUF-${year}-${String(this.ordersPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getOrdersPreview()
    this.getAuth()
  },
  methods: {
    getOrdersPreview() {
      if (store.state.orders) {
        this.ordersPreview = store.state.orders
      } else {
        return this.ordersPreview
      }
      console.log('Orders Preview Data:', this.ordersPreview)
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
        console.log('Auth Data:', this.auth)
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
