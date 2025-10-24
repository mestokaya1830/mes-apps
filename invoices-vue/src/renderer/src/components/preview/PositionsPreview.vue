<template lang="">
  <div>
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
      <tbody v-if="data.positions">
        <tr v-for="(item, index) in data.positions" :key="index">
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
          <td class="right">{{ formatCurrency(item.price, data.currency) }}</td>
          <td class="right">
            {{ data.reverse_charge || data.is_small_company ? '0%' : item.vat + '%' }}
          </td>
          <td class="right">{{ formatCurrency(item.unit_total, data.currency) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="total-row">
        <span class="total-label">Zwischensumme (netto):</span>
        <span class="total-value">{{ formatCurrency(data.subtotal, data.currency) }}</span>
      </div>

      <!-- KDV sadece reverse charge değilse göster -->
      <div v-if="!data.is_small_company && !data.reverse_charge" class="total-row">
        <span class="total-label">MwSt.:</span>
        <span class="total-value">{{ formatCurrency(data.vat_amount, data.currency) }}</span>
      </div>

      <div class="total-row subtotal">
        <span class="total-label">Rechnungsbetrag (brutto):</span>
        <span class="total-value">{{ formatCurrency(data.total, data.currency) }}</span>
      </div>

      <div v-if="data.paid_amount && data.paid_amount > 0" class="total-row paid">
        <span class="total-label">✓ Bereits bezahlt:</span>
        <span class="total-value">- {{ formatCurrency(data.paid_amount, data.currency) }}</span>
      </div>

      <div class="total-row outstanding">
        <span class="total-label">⚠️ Offener Betrag:</span>
        <span class="total-value">{{ formatCurrency(data.outstanding, data.currency) }}</span>
      </div>

      <!-- Küçük işletme veya Reverse-Charge notları -->
      <div v-if="data.is_small_company" class="tax-note">
        ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
      </div>

      <div v-if="data.reverse_charge" class="tax-note">
        ⚠️ Innergemeinschaftliche Lieferung – steuerfrei gemäß §4 Nr.1b UStG (Reverse Charge).
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PositionsPreview',
  inject: ['formatCurrency'],
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
