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
      <tbody v-if="data.events.positions">
        <tr v-for="(item, index) in data.events.positions" :key="index">
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
          <td class="right">{{ formatCurrency(item.price, data.events.currency) }}</td>
          <td class="right">
            {{ data.events.reverse_charge || data.events.is_small_company ? '0%' : item.vat + '%' }}
          </td>
          <td class="right">{{ formatCurrency(item.unit_total, data.events.currency) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- summary -->
    <div class="totals">
      <div class="total-row">
        <span class="total-label">Zwischensumme (netto):</span>
        <span class="total-value">{{
          formatCurrency(data.summary.subtotal, data.events.currency)
        }}</span>
      </div>

      <!-- KDV sadece reverse charge değilse göster -->
      <div v-if="!data.events.is_small_company && !data.events.reverse_charge" class="total-row">
        <span class="total-label">MwSt.:</span>
        <span class="total-value">{{
          formatCurrency(data.summary.vat_amount, data.events.currency)
        }}</span>
      </div>

      <div class="total-row subtotal">
        <span class="total-label">Rechnungsbetrag (brutto):</span>
        <span class="total-value">{{
          formatCurrency(data.summary.total, data.events.currency)
        }}</span>
      </div>

      <div v-if="data.events.paid_amount && data.events.paid_amount > 0" class="total-row paid">
        <span class="total-label">✓ Bereits bezahlt:</span>
        <span class="total-value"
          >- {{ formatCurrency(data.events.paid_amount, data.events.currency) }}</span
        >
      </div>
      <div v-if="data.source_page === 'invoices'" class="total-row outstanding">
        <span class="total-label">⚠️ Offener Betrag:</span>
        <span class="total-value">{{
          formatCurrency(data.events.outstanding, data.events.currency)
        }}</span>
      </div>

      <!-- Küçük işletme veya Reverse-Charge notları (kdv yi musteri oder reverse charge)-->
      <div v-if="data.events.is_small_company" class="tax-note">
        ⚠️ Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
      </div>

      <div v-if="data.events.reverse_charge" class="tax-note">
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
  }
}
</script>
