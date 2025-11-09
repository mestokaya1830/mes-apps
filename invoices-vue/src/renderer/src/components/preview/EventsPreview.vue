<template lang="">
  <div v-if="eventsPreview" class="events-preview">
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

      <tbody v-if="eventsPreview.positions && eventsPreview.positions.length > 0">
        <tr v-for="(item, index) in eventsPreview.positions" :key="index">
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
          <td class="right">{{ formatCurrency(item.price, eventsPreview.currency) }}</td>
          <td class="right">
            {{
              eventsPreview.reverse_charge ? '0%' : item.vat + '%'
            }}
          </td>
          <td class="right">
            {{ formatCurrency(item.unit_total, eventsPreview.currency) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- summary -->
    <div v-if="eventsPreview.summary" class="totals">
      <div class="total-row">
        <span class="total-label">Zwischensumme (netto):</span>
        <span class="total-value">{{
          formatCurrency(eventsPreview.summary.subtotal, eventsPreview.currency)
        }}</span>
      </div>

      <div class="total-row">
        <span class="total-label">MwSt.:</span>
        <span class="total-value">{{
          formatCurrency(eventsPreview.summary.vat_amount, eventsPreview.currency)
        }}</span>
      </div>

      <div class="total-row subtotal">
        <span class="total-label">Rechnungsbetrag (brutto):</span>
        <span class="total-value">{{
          formatCurrency(eventsPreview.summary.total, eventsPreview.currency)
        }}</span>
      </div>

      <div
        v-if="eventsPreview.paid_amount && eventsPreview.paid_amount > 0"
        class="total-row paid"
      >
        <span class="total-label">✓ Bereits bezahlt:</span>
        <span class="total-value"
          >-
          {{
            formatCurrency(eventsPreview.summary.paid_amount, eventsPreview.currency)
          }}</span
        >
      </div>

      <div v-if="eventsPreview.source_page === 'invoices'" class="total-row outstanding">
        <span class="total-label">⚠️ Offener Betrag:</span>
        <span class="total-value">{{
          formatCurrency(eventsPreview.summary.outstanding, eventsPreview.currency)
        }}</span>
      </div>

      <div class="tax-note">
        ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
      </div>

      <div v-if="eventsPreview.is_reverse_charge" class="tax-note">
        ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß §4 Nr.1b UStG (Reverse Charge).
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventsPreview',
  inject: ['formatCurrency'],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      eventsPreview: null
    }
  },

  mounted() {
    if (this.data) {
      this.eventsPreview = {
        ...this.data,
        positions: this.data.positions ? [...this.data.positions] : [],
        payment: this.data.payment
      }
      console.log('Events Preview Data:', this.eventsPreview)
      this.eventsPreview.summary = {
        subtotal: this.subtotal(),
        vat_amount: this.vatAmount(),
        total: this.total(),
        outstanding: this.outstanding()
      }
    } else {
      return this.eventsPreview
    }
  },
  methods: {
    subtotal() {
      if (!this.eventsPreview) return 0
      return this.eventsPreview.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      if (!this.eventsPreview) return 0
      return this.eventsPreview.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    total() {
      return this.subtotal() + this.vatAmount()
    },
    outstanding() {
      if (!this.eventsPreview) return 0
      if (this.eventsPreview.payment.paid_amount) {
        return this.total() - this.eventsPreview.payment.paid_amount
      }
      return 0
    }
  }
}
</script>

<style>
/* POSITIONS TABLE */
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
