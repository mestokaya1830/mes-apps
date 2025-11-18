<template>
  <div class="editor-panel">
    <h1>Rechnung Report</h1>

    <!-- Date Range Selector -->
    <select v-model="staticRange" class="form-input" @change="applyStaticRange">
      <option value="" disabled selected>Wähle Daten</option>
      <option value="1">Diesen Monat</option>
      <option value="3">Letzte 3 Monate</option>
      <option value="6">Letzte 6 Monate</option>
      <option value="12">Letztes Jahr</option>
    </select>

    <!-- Custom Date Filter -->
    <div class="form-section">
      <div class="form-row">
        <div class="form-group">
          <label>Von</label>
          <input type="date" class="form-input" v-model="dateStart" />
        </div>
        <div class="form-group">
          <label>Bis</label>
          <input type="date" class="form-input" v-model="dateEnd" />
        </div>
      </div>
    </div>

    <select v-model="reportType" class="form-input">
      <option value="" disabled>Wähle Bericht</option>
      <option value="umsatz">Umsatzbericht</option>
      <option value="zahlungsstatus">Zahlungsstatus</option>
      <option value="kunden">Kundenbezogener Bericht</option>
      <option value="mwst">Mehrwertsteuer Bericht</option>
      <option value="rechnungsListe">Rechnungsliste</option>
      <option value="prognose">Umsatzprognose</option>
    </select>

    <!-- REPORT -->
    <div class="report-container">
      <div class="report-header">
        <div>
          <h2>Umsatzbericht</h2>
          <p class="report-period">Zeitraum: {{ dateStart }} - {{ dateEnd }}</p>
        </div>
        <button class="btn-export" @click="printPage">🖨️ Drucken</button>
      </div>

      <!-- SUMMARY CARDS -->
      <div class="summary-cards">
        <div class="summary-card" v-for="(card, i) in summaryCards" :key="i">
          <div class="card-icon">{{ card.icon }}</div>
          <div class="card-content">
            <p class="card-label">{{ card.label }}</p>
            <h3 class="card-value">{{ card.value }}</h3>
            <p class="card-detail">{{ card.detail }}</p>
          </div>
        </div>
      </div>

      <!-- BAR CHART -->
      <div class="chart-section">
        <h3>Monatliche Übersicht</h3>
        <div class="bar-chart">
          <div class="bar-item" v-for="(month, i) in monthlyData" :key="i">
            <div class="bar-wrapper">
              <div class="bar-fill" :style="{ height: month.height + '%' }">
                <span class="bar-value">{{ month.value }}</span>
              </div>
            </div>
            <p class="bar-label">{{ month.label }}</p>
            <p class="bar-count">{{ month.count }} Rg.</p>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="table-section">
        <h3>Detaillierte Rechnungsliste</h3>
        <input type="text" v-model="search" placeholder="Suche..." class="search-input" />

        <table class="report-table">
          <thead>
            <tr>
              <th>Rechnungsnr.</th>
              <th>Datum</th>
              <th>Kunde</th>
              <th>Nettobetrag</th>
              <th>MwSt</th>
              <th>Bruttobetrag</th>
              <th>Status</th>
              <th>Zahlungsdatum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in filteredRows" :key="i">
              <td><strong>{{ row.nr }}</strong></td>
              <td>{{ row.datum }}</td>
              <td>{{ row.kunde }}</td>
              <td class="amount">{{ row.netto }}</td>
              <td class="amount">{{ row.mwst }}</td>
              <td class="amount"><strong>{{ row.brutto }}</strong></td>
              <td><span :class="['status-badge', row.statusClass]">{{ row.status }}</span></td>
              <td>{{ row.zahlung || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAX TABLE -->
      <div class="tax-breakdown">
        <h3>MwSt-Aufschlüsselung</h3>
        <table class="tax-table">
          <thead>
            <tr>
              <th>MwSt-Satz</th>
              <th>Nettobetrag</th>
              <th>MwSt-Betrag</th>
              <th>Bruttobetrag</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, i) in taxRows" :key="i">
              <td>{{ t.rate }}</td>
              <td class="amount">{{ t.netto }}</td>
              <td class="amount">{{ t.mwst }}</td>
              <td class="amount">{{ t.brutto }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InvoiceReport",
  data() {
    return {
      staticRange: "",
      dateStart: "2025-08-01",
      dateEnd: "2025-11-18",
      reportType: "umsatz",
      search: "",

      summaryCards: [
        { icon: "💰", label: "Gesamtumsatz", value: "€45.850,00", detail: "24 Rechnungen" },
        { icon: "✅", label: "Bezahlt", value: "€38.200,00", detail: "18 Rechnungen (75%)" },
        { icon: "⏳", label: "Ausstehend", value: "€7.650,00", detail: "6 Rechnungen (25%)" },
        { icon: "📊", label: "Durchschnitt", value: "€1.910,42", detail: "Ø Wert" }
      ],

      monthlyData: [
        { label: "Aug 2025", value: "€12.500", count: 6, height: 65 },
        { label: "Sep 2025", value: "€16.350", count: 8, height: 85 },
        { label: "Okt 2025", value: "€10.500", count: 6, height: 55 },
        { label: "Nov 2025", value: "€6.500", count: 4, height: 35 }
      ],

      rows: [
        { nr: "RE-2025-0124", datum: "15.11.2025", kunde: "Müller GmbH", netto: "€2.100,00", mwst: "€399,00", brutto: "€2.499,00", status: "Bezahlt", statusClass: "paid", zahlung: "17.11.2025" },
        { nr: "RE-2025-0123", datum: "12.11.2025", kunde: "Schmidt AG", netto: "€1.500,00", mwst: "€285,00", brutto: "€1.785,00", status: "Ausstehend", statusClass: "unpaid", zahlung: null },
        { nr: "RE-2025-0122", datum: "08.11.2025", kunde: "Weber & Co", netto: "€3.200,00", mwst: "€608,00", brutto: "€3.808,00", status: "Bezahlt", statusClass: "paid", zahlung: "10.11.2025" }
      ],

      taxRows: [
        { rate: "19%", netto: "€38.500,00", mwst: "€7.315,00", brutto: "€45.815,00" },
        { rate: "7%", netto: "€500,00", mwst: "€35,00", brutto: "€535,00" }
      ]
    }
  },

  computed: {
    filteredRows() {
      if (!this.search) return this.rows
      return this.rows.filter(r =>
        r.nr.toLowerCase().includes(this.search.toLowerCase()) ||
        r.kunde.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },

  methods: {
    printPage() {
      window.print()
    },
    applyStaticRange() {
      console.log("Range selected:", this.staticRange)
    }
  }
}
</script>

<style>
/* Original CSS copied as-is */
</style>
