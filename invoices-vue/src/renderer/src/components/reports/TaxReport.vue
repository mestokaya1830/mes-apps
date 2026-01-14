<template>
  <div class="editor-panel">
    <select v-model="date_range" class="form-input" @change="rangeDateFilter">
      <option value="" disabled>Wähle Daten</option>
      <option value="1">Diesen Monat</option>
      <option value="3">Letzte 3 Monate</option>
      <option value="6">Letzte 6 Monate</option>
      <option value="12">Letztes Jahr</option>
    </select>

    <div class="form-section">
      <div class="form-row">
        <div class="form-group">
          <label>Von</label>
          <input
            ref="date_box_start"
            v-model="date_box_start"
            type="date"
            class="form-input date"
            @change="flexDateFilter"
          />
        </div>
        <div class="form-group">
          <label>Bis</label>
          <input
            ref="date_box_end"
            v-model="date_box_end"
            type="date"
            class="form-input date"
            @change="flexDateFilter"
          />
        </div>
      </div>
    </div>

    <!-- REPORT STARTS -->
    <div v-if="is_ready" class="report-container">
      <div class="report-header-2">
        <div>
          <h2>{{ title }}</h2>
          <p class="report-period">Zeitraum: {{ selectedPeriod }}</p>
        </div>
        <!-- <button class="btn-export" onclick="window.print()">🖨️ Drucken</button> -->
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">💶</div>
          <div class="card-content">
            <p class="card-label">Gesamte MwSt</p>
            <h3 class="card-value">{{ formatCurrency(totalTax) }}</h3>
            <p class="card-detail">Alle Steuersätze</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <p class="card-label">MwSt 19%</p>
            <h3 class="card-value">{{ formatCurrency(totalTax19.totalVat19) }}</h3>
            <p class="card-detail">{{ formatCurrency(totalTax19.totalNet19) }}</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">📈</div>
          <div class="card-content">
            <p class="card-label">MwSt 7%</p>
            <h3 class="card-value">{{ formatCurrency(totalTax7.totalVat7) }}</h3>
            <p class="card-detail">{{ formatCurrency(totalTax7.totalNet7) }}</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">⚡</div>
          <div class="card-content">
            <p class="card-label">An Finanzamt zu zahlen</p>
            <h3 class="card-value">{{ formatCurrency(totalTax) }}</h3>
            <p class="card-detail">Zahllast</p>
          </div>
        </div>
      </div>

      <!-- Tax Rate Breakdown -->
      <div class="tax-rate-grid">
        <div class="tax-rate-box">
          <div class="tax-rate-header">
            <div class="tax-rate-title">Regelsteuersatz</div>
            <div class="tax-rate-percent">19%</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Nettobetrag</div>
            <div class="tax-rate-value">€43.400,00</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">MwSt-Betrag</div>
            <div class="tax-rate-value">€8.246,00</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Bruttobetrag</div>
            <div class="tax-rate-value">€51.646,00</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Anzahl Rechnungen</div>
            <div class="tax-rate-value">22</div>
          </div>
        </div>

        <div class="tax-rate-box">
          <div class="tax-rate-header">
            <div class="tax-rate-title">Ermäßigter Steuersatz</div>
            <div class="tax-rate-percent">7%</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Nettobetrag</div>
            <div class="tax-rate-value">€6.643,00</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">MwSt-Betrag</div>
            <div class="tax-rate-value">€465,01</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Bruttobetrag</div>
            <div class="tax-rate-value">€7.108,01</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Anzahl Rechnungen</div>
            <div class="tax-rate-value">2</div>
          </div>
        </div>

        <div class="tax-rate-box">
          <div class="tax-rate-header">
            <div class="tax-rate-title">Steuerfrei</div>
            <div class="tax-rate-percent">0%</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Nettobetrag</div>
            <div class="tax-rate-value">€0,00</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">MwSt-Betrag</div>
            <div class="tax-rate-value">€0,00</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Bruttobetrag</div>
            <div class="tax-rate-value">€0,00</div>
          </div>
          <div class="tax-rate-item">
            <div class="tax-rate-label">Anzahl Rechnungen</div>
            <div class="tax-rate-value">0</div>
          </div>
        </div>
      </div>

      <!-- Monthly Chart -->
      <!-- Chart -->
      <!-- <InvoiceChart :chartData="summary" /> -->

      <!-- UStVA Summary -->
      <div class="ustva-section">
        <h3>📋 Umsatzsteuervoranmeldung (UStVA) Zusammenfassung</h3>

        <div class="ustva-alert">
          <div class="ustva-alert-text">
            ℹ️ Dies ist eine vereinfachte Zusammenfassung. Bitte konsultieren Sie Ihren
            Steuerberater für die vollständige UStVA.
          </div>
        </div>

        <table class="ustva-table">
          <thead>
            <tr>
              <th>Kennzahl</th>
              <th>Beschreibung</th>
              <th>Bemessungsgrundlage</th>
              <th>Steuersatz</th>
              <th>Steuerbetrag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="field-number">Kz. 81</td>
              <td>Steuerbare Umsätze (19%)</td>
              <td class="amount">€43.400,00</td>
              <td class="center">19%</td>
              <td class="amount">€8.246,00</td>
            </tr>
            <tr>
              <td class="field-number">Kz. 86</td>
              <td>Steuerbare Umsätze (7%)</td>
              <td class="amount">€6.643,00</td>
              <td class="center">7%</td>
              <td class="amount">€465,01</td>
            </tr>
            <tr>
              <td class="field-number">Kz. 91</td>
              <td>Steuerfreie Umsätze</td>
              <td class="amount">€0,00</td>
              <td class="center">0%</td>
              <td class="amount">€0,00</td>
            </tr>
            <tr class="ustva-total-row">
              <td colspan="4"><strong>Summe Umsatzsteuer (Kz. 83)</strong></td>
              <td class="amount"><strong>€8.711,01</strong></td>
            </tr>
            <tr>
              <td class="field-number">Kz. 66</td>
              <td>Vorsteuerabzug</td>
              <td class="amount">-</td>
              <td class="center">-</td>
              <td class="amount">€0,00</td>
            </tr>
            <tr class="ustva-payable">
              <td colspan="4"><strong>Zahllast (Kz. 83)</strong></td>
              <td class="amount"><strong>€8.711,01</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detailed Table -->
      <div class="table-section">
        <h3>Detaillierte Rechnungsübersicht nach MwSt-Satz</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>Rechnungsnr.</th>
              <th>Datum</th>
              <th>Kunde</th>
              <th class="center">MwSt-Satz</th>
              <th>Nettobetrag</th>
              <th>MwSt-Betrag</th>
              <th>Bruttobetrag</th>
              <th>Status</th>
              <th>Zahlungsdatum</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="field-number">1234</td>
              <td>01.01.2023</td>
              <td>Max Mustermann</td>
              <td class="center">19%</td>
              <td class="amount">€10.000,00</td>
              <td class="amount">€1.800,00</td>
              <td class="amount">€12.800,00</td>
              <td class="status paid">Bezahlt</td>
              <td>01.02.2023</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceChart from '../chart/InvoiceChart.vue'
export default {
  name: 'TaxReport',
  components: {
    InvoiceChart
  },
  inject: [
    'formatDate',
    'formatCurrency',
    'formatInvoiceId',
    'formatCustomerId',
    'checkDueDate',
    'formatPercentage'
  ],
  data() {
    return {
      title: 'Mehrwertsteuer (MwSt) Bericht',
      reports: null,
      date_range: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false,
      activeTab: 'all',
      is_sort: true
    }
  },
  computed: {
    selectedPeriod() {
      if (!this.period) return
      return this.formatDate(this.period.start) + ' - ' + this.formatDate(this.period.end)
    },
    totalTax() {
      if (!this.reports) return 0
      return this.reports.reduce((sum, item) => sum + item.vat_total, 0)
    },
    totalTax19() {
      if (!Array.isArray(this.reports)) {
        return { totalVat19: 0, totalNet19: 0 }
      }

      return this.reports.reduce(
        (acc, report) => {
          if (!Array.isArray(report.positions)) return acc

          report.positions.forEach((pos) => {
            if (Number(pos.vat) === 19) {
              acc.totalVat19 += Number(pos.vat_unit || 0) * Number(pos.quantity || 0)
              acc.totalNet19 += Number(pos.price * pos.quantity || 0)
            }
          })

          return acc
        },
        { totalVat19: 0, totalNet19: 0 }
      )
    },
    totalTax7() {
      if (!Array.isArray(this.reports)) {
        return { totalVat7: 0, totalNet7: 0 }
      }

      return this.reports.reduce(
        (acc, report) => {
          if (!Array.isArray(report.positions)) return acc

          report.positions.forEach((pos) => {
            if (Number(pos.vat) === 7) {
              acc.totalVat7 += Number(pos.vat_unit || 0) * Number(pos.quantity || 0)
              acc.totalNet7 += Number(pos.price * pos.quantity || 0)
            }
          })

          return acc
        },
        { totalVat7: 0, totalNet7: 0 }
      )
    }
  },
  methods: {
    async rangeDateFilter() {
      if (!this.date_range) return
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth() - this.date_range, 1)
      const endDate = new Date(today.getFullYear(), today.getMonth() + 0, 0)
      this.date_box_start = startDate.toISOString().slice(0, 10)
      this.date_box_end = endDate.toISOString().slice(0, 10)
      this.getReport()
    },
    flexDateFilter() {
      if (!this.date_box_start) return this.$refs.date_box_start.focus()
      if (!this.date_box_end) return this.$refs.date_box_end.focus()
      if (this.date_box_start > this.date_box_end) {
        this.date_box_end = ''
        return this.$refs.date_box_end.focus()
      }
      this.getReport()
    },
    async getReport() {
      if (!this.date_box_start || !this.date_box_end) return
      const data = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      const result = await window.api.reportTaxs(data)
      if (!result.success) return
      this.reports = result.rows.map((item) => ({
        ...item,
        positions: JSON.parse(item.positions || '[]')
      }))

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      this.is_ready = true
      console.log(this.reports)
    },
    sorting(key) {
      if (!key) return
      this.reports.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    }
  }
}
</script>

<style>
.editor-panel {
  max-width: 1400px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
}

.report-container {
  margin-top: 30px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.report-header h2 {
  font-size: 24px;
  color: #1f2937;
}

.report-period {
  color: #6b7280;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.btn-export {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-export:hover {
  background: #2563eb;
}

/* SUMMARY CARDS */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  color: white;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-card:nth-child(2) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.summary-card:nth-child(3) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.summary-card:nth-child(4) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.card-icon {
  font-size: 36px;
  opacity: 0.9;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 13px;
  opacity: 0.9;
  margin: 0 0 4px 0;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.card-detail {
  font-size: 12px;
  opacity: 0.85;
  margin: 4px 0 0 0;
}

/* TAX RATE BREAKDOWN */
.tax-rate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.tax-rate-box {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s;
}

.tax-rate-box:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.tax-rate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.tax-rate-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.tax-rate-percent {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}

.tax-rate-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.tax-rate-item:last-child {
  border-bottom: none;
}

.tax-rate-label {
  font-size: 13px;
  color: #6b7280;
}

.tax-rate-value {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Courier New', monospace;
}

/* MONTHLY TAX CHART */
.chart-section {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.chart-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.stacked-bar-chart {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 250px;
}

.stacked-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stacked-bar-wrapper {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.stacked-bar {
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}

.bar-segment {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.bar-segment.rate-19 {
  background: linear-gradient(to top, #3b82f6, #60a5fa);
}

.bar-segment.rate-7 {
  background: linear-gradient(to top, #10b981, #34d399);
}

.bar-segment.rate-0 {
  background: linear-gradient(to top, #6b7280, #9ca3af);
}

.stacked-bar-label {
  font-size: 11px;
  font-weight: 500;
  color: #4b5563;
  margin-top: 8px;
}

.stacked-bar-total {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.legend-color.rate-19 {
  background: #3b82f6;
}

.legend-color.rate-7 {
  background: #10b981;
}

.legend-color.rate-0 {
  background: #6b7280;
}

.legend-text {
  font-size: 12px;
  color: #4b5563;
  font-weight: 500;
}

/* UStVA SUMMARY */
.ustva-section {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 2px solid #e5e7eb;
}

.ustva-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ustva-alert {
  background: #dbeafe;
  border-left: 4px solid #3b82f6;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.ustva-alert-text {
  font-size: 13px;
  color: #1e40af;
}

.ustva-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.ustva-table thead {
  background: #f3f4f6;
}

.ustva-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.ustva-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.ustva-table .field-number {
  font-weight: 600;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

.ustva-table .amount {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.ustva-total-row {
  background: #eff6ff;
  font-weight: 700;
}

.ustva-total-row td {
  border-top: 2px solid #3b82f6;
  padding: 14px 12px;
  color: #1e40af;
}

.ustva-payable {
  background: #fee2e2;
}

.ustva-payable td {
  color: #991b1b;
}

.ustva-refund {
  background: #d1fae5;
}

.ustva-refund td {
  color: #065f46;
}

/* DETAILED TABLE */
.table-section {
  margin-top: 30px;
}

.table-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.report-table thead {
  background: #f9fafb;
}

.report-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.report-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.report-table tbody tr:hover {
  background: #f9fafb;
}

.report-table .amount {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.report-table .center {
  text-align: center;
}

.rate-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.rate-badge.rate-19 {
  background: #dbeafe;
  color: #1e40af;
}

.rate-badge.rate-7 {
  background: #d1fae5;
  color: #065f46;
}

.rate-badge.rate-0 {
  background: #f3f4f6;
  color: #4b5563;
}

.total-row {
  background: #f3f4f6;
  font-weight: 600;
}

.total-row td {
  border-top: 2px solid #d1d5db;
  padding: 14px 12px;
}

/* PRINT STYLES */
@media print {
  body {
    background: white;
    padding: 0;
  }

  .editor-panel {
    box-shadow: none;
    padding: 20px;
    max-width: 100%;
  }

  .form-section,
  .form-input:not(.search-input),
  h1,
  .btn-export,
  .search-input {
    display: none !important;
  }

  .report-container {
    margin-top: 0;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    page-break-inside: avoid;
  }

  .summary-card {
    padding: 15px;
    box-shadow: none;
    border: 1px solid #ddd;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .tax-rate-grid,
  .chart-section,
  .ustva-section {
    page-break-inside: avoid;
  }

  .report-table {
    font-size: 10px;
  }

  .report-table thead {
    display: table-header-group;
    background: #f3f4f6 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .report-table tbody tr {
    page-break-inside: avoid;
  }

  @page {
    margin: 1.5cm;
  }
}
</style>
