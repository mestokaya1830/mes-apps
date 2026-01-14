<template>
  <div class="editor-panel">
    <h1>Rechnung Report</h1>

    <select class="form-input">
      <option value="" disabled selected>Wähle Daten</option>
      <option value="1">Diesen Monat</option>
      <option value="3">Letzte 3 Monate</option>
      <option value="6">Letzte 6 Monate</option>
      <option value="12">Letztes Jahr</option>
    </select>

    <div class="form-section">
      <div class="form-row">
        <div class="form-group">
          <label>Von</label>
          <input type="date" class="form-input" value="2025-08-01" />
        </div>
        <div class="form-group">
          <label>Bis</label>
          <input type="date" class="form-input" value="2025-11-18" />
        </div>
      </div>
    </div>

    <select class="form-input">
      <option value="" disabled>Wähle Bericht</option>
      <option value="umsatz" selected>Umsatzbericht</option>
      <option value="zahlungsstatus">Zahlungsstatus</option>
      <option value="kunden">Kundenbezogener Bericht</option>
      <option value="mwst">Mehrwertsteuer (MwSt) Bericht</option>
      <option value="rechnungsListe">Rechnungsliste</option>
      <option value="prognose">Umsatzprognose</option>
    </select>

    <!-- REPORT STARTS -->
    <div class="report-container">
      <div class="report-header">
        <div>
          <h2>Umsatzbericht</h2>
          <p class="report-period">Zeitraum: 01.08.2025 - 18.11.2025</p>
        </div>
        <button class="btn-export" onclick="window.print()">🖨️ Drucken</button>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <p class="card-label">Gesamtumsatz</p>
            <h3 class="card-value">€45.850,00</h3>
            <p class="card-detail">24 Rechnungen</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <p class="card-label">Bezahlt</p>
            <h3 class="card-value">€38.200,00</h3>
            <p class="card-detail">18 Rechnungen (75%)</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">⏳</div>
          <div class="card-content">
            <p class="card-label">Ausstehend</p>
            <h3 class="card-value">€7.650,00</h3>
            <p class="card-detail">6 Rechnungen (25%)</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <p class="card-label">Durchschnitt pro Rechnung</p>
            <h3 class="card-value">€1.910,42</h3>
            <p class="card-detail">Ø Wert</p>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart-section">
        <h3>Monatliche Übersicht</h3>
        <div class="bar-chart">
          <div class="bar-item">
            <div class="bar-wrapper">
              <div class="bar-fill" style="height: 65%">
                <span class="bar-value">€12.500</span>
              </div>
            </div>
            <p class="bar-label">Aug 2025</p>
            <p class="bar-count">6 Rg.</p>
          </div>
          <div class="bar-item">
            <div class="bar-wrapper">
              <div class="bar-fill" style="height: 85%">
                <span class="bar-value">€16.350</span>
              </div>
            </div>
            <p class="bar-label">Sep 2025</p>
            <p class="bar-count">8 Rg.</p>
          </div>
          <div class="bar-item">
            <div class="bar-wrapper">
              <div class="bar-fill" style="height: 55%">
                <span class="bar-value">€10.500</span>
              </div>
            </div>
            <p class="bar-label">Okt 2025</p>
            <p class="bar-count">6 Rg.</p>
          </div>
          <div class="bar-item">
            <div class="bar-wrapper">
              <div class="bar-fill" style="height: 35%">
                <span class="bar-value">€6.500</span>
              </div>
            </div>
            <p class="bar-label">Nov 2025</p>
            <p class="bar-count">4 Rg.</p>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-section">
        <h3>Detaillierte Rechnungsliste</h3>
        <input
          type="text"
          placeholder="Suche nach Rechnungsnummer oder Kunde..."
          class="search-input"
        />

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
            <tr>
              <td><strong>RE-2025-0124</strong></td>
              <td>15.11.2025</td>
              <td>Müller GmbH</td>
              <td class="amount">€2.100,00</td>
              <td class="amount">€399,00</td>
              <td class="amount"><strong>€2.499,00</strong></td>
              <td><span class="status-badge paid">Bezahlt</span></td>
              <td>17.11.2025</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0123</strong></td>
              <td>12.11.2025</td>
              <td>Schmidt AG</td>
              <td class="amount">€1.500,00</td>
              <td class="amount">€285,00</td>
              <td class="amount"><strong>€1.785,00</strong></td>
              <td><span class="status-badge unpaid">Ausstehend</span></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0122</strong></td>
              <td>08.11.2025</td>
              <td>Weber & Co</td>
              <td class="amount">€3.200,00</td>
              <td class="amount">€608,00</td>
              <td class="amount"><strong>€3.808,00</strong></td>
              <td><span class="status-badge paid">Bezahlt</span></td>
              <td>10.11.2025</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0121</strong></td>
              <td>05.11.2025</td>
              <td>Fischer KG</td>
              <td class="amount">€890,00</td>
              <td class="amount">€169,10</td>
              <td class="amount"><strong>€1.059,10</strong></td>
              <td><span class="status-badge overdue">Überfällig</span></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0120</strong></td>
              <td>02.11.2025</td>
              <td>Becker GmbH</td>
              <td class="amount">€1.750,00</td>
              <td class="amount">€332,50</td>
              <td class="amount"><strong>€2.082,50</strong></td>
              <td><span class="status-badge paid">Bezahlt</span></td>
              <td>04.11.2025</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0119</strong></td>
              <td>28.10.2025</td>
              <td>Hoffmann Industries</td>
              <td class="amount">€4.200,00</td>
              <td class="amount">€798,00</td>
              <td class="amount"><strong>€4.998,00</strong></td>
              <td><span class="status-badge paid">Bezahlt</span></td>
              <td>30.10.2025</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="3"><strong>SUMME</strong></td>
              <td class="amount"><strong>€13.640,00</strong></td>
              <td class="amount"><strong>€2.591,60</strong></td>
              <td class="amount"><strong>€16.231,60</strong></td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Tax Breakdown -->
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
            <tr>
              <td>19%</td>
              <td class="amount">€38.500,00</td>
              <td class="amount">€7.315,00</td>
              <td class="amount">€45.815,00</td>
            </tr>
            <tr>
              <td>7%</td>
              <td class="amount">€500,00</td>
              <td class="amount">€35,00</td>
              <td class="amount">€535,00</td>
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
      const result = await window.api.reportSales(data)
      if (!result.success) return
      this.reports = result.rows

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      this.is_ready = true
      // console.log(result)
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
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
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

/* CHART SECTION */
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

.bar-chart {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 200px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-wrapper {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
}

.bar-value {
  font-size: 10px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.bar-label {
  font-size: 11px;
  font-weight: 500;
  color: #4b5563;
  margin: 8px 0 2px 0;
}

.bar-count {
  font-size: 10px;
  color: #9ca3af;
  margin: 0;
}

/* TABLE SECTION */
.table-section {
  margin-bottom: 30px;
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

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.paid {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.unpaid {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.overdue {
  background: #fee2e2;
  color: #991b1b;
}

.total-row {
  background: #f3f4f6;
  font-weight: 600;
}

.total-row td {
  border-top: 2px solid #d1d5db;
  padding: 14px 12px;
}

/* TAX BREAKDOWN */
.tax-breakdown {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
}

.tax-breakdown h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.tax-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.tax-table thead {
  background: #f3f4f6;
}

.tax-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.tax-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.tax-table .amount {
  text-align: right;
  font-family: 'Courier New', monospace;
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

  /* Formları gizle - sadece raporu yazdır */
  .form-section,
  .form-input:not(.search-input),
  h1,
  .btn-export {
    display: none !important;
  }

  .report-container {
    margin-top: 0;
  }

  .report-header {
    page-break-after: avoid;
  }

  /* Özet kartları yazdırma için optimize et */
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 20px;
    page-break-inside: avoid;
  }

  .summary-card {
    padding: 15px;
    box-shadow: none;
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }

  /* Grafik bölümü */
  .chart-section {
    page-break-inside: avoid;
    margin-bottom: 20px;
  }

  /* Tablo optimizasyonu */
  .table-section {
    page-break-inside: avoid;
  }

  .search-input {
    display: none;
  }

  .report-table {
    font-size: 10px;
    page-break-inside: auto;
  }

  .report-table thead {
    display: table-header-group;
    background: #f3f4f6 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .report-table tbody tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  .report-table tfoot {
    display: table-footer-group;
  }

  /* Status badges için renkler */
  .status-badge {
    border: 1px solid #ccc;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Tax breakdown */
  .tax-breakdown {
    page-break-before: avoid;
    page-break-inside: avoid;
    margin-top: 20px;
  }

  /* Bar chart yazdırma */
  .bar-chart {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Sayfa numarası ekle */
  @page {
    margin: 1.5cm;
    @bottom-right {
      content: 'Seite ' counter(page) ' von ' counter(pages);
    }
  }
}
</style>
