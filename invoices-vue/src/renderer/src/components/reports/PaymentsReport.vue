<template>
  <div>
    <div class="editor-panel">
      <h1>{{ title }} <h2 v-if="reportsLength">{{ reportsLength }}</h2> </h1>
      <select v-model="report_static_date" class="form-input" @change="getStaticDate">
        <option value="" disabled selected>Waehle Daten</option>
        <option value="1">Diesen Monat</option>
        <option value="3">Letzte 3 Monate</option>
        <option value="6">Letzte 6 Monate</option>
        <option value="12">Letztes Jahr</option>
      </select>

      <div class="form-section">
        <div class="form-row">
          <div class="form-group">
            <label for="">Von</label>
            <input v-model="date_box_start" type="date" class="form-input" @change="dateFilter()" />
          </div>
          <div class="form-group">
            <label for="">Bis</label>
            <input v-model="date_box_end" type="date" class="form-input" @change="dateFilter()" />
          </div>
        </div>
      </div>
      <div v-if="is_ready" class="report-container printable">
        <div class="report-header">
          <div>
            <h2>{{ title }}</h2>
            <p class="report-period">Zeitraum: {{ period.start }} - {{ period.end }}</p>
          </div>
          <button class="btn-export" @click="printReport">🖨️ Drucken</button>
        </div>

        <div class="summary-section">
          <!-- Summary Cards -->
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-icon">✅</div>
              <div class="card-content">
                <p class="card-label">Pünktlich Bezahlt</p>
                <h3 class="card-value">€38.200,00</h3>
                <p class="card-detail">18 Rechnungen (75%)</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">⏳</div>
              <div class="card-content">
                <p class="card-label">Ausstehend (fällig)</p>
                <h3 class="card-value">€4.850,00</h3>
                <p class="card-detail">4 Rechnungen (17%)</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">⚠️</div>
              <div class="card-content">
                <p class="card-label">Überfällig</p>
                <h3 class="card-value">€2.800,00</h3>
                <p class="card-detail">2 Rechnungen (8%)</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <p class="card-label">Zahlungsziel Ø</p>
                <h3 class="card-value">14 Tage</h3>
                <p class="card-detail">Durchschnitt</p>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h1>Chart</h1>
          </div>
        </div>

        <!-- Table -->
        <!-- Donut Chart & Aging -->
        <div class="chart-row">
          <div class="donut-section">
            <h3>Zahlungsverteilung</h3>
            <div class="donut-container">
              <div class="donut-chart">
                <div class="donut-ring">
                  <div class="donut-hole">
                    <div class="donut-total">24</div>
                    <div class="donut-label">Rechnungen</div>
                  </div>
                </div>
              </div>
              <div class="donut-legend">
                <div class="legend-item">
                  <div class="legend-color paid"></div>
                  <div class="legend-text">
                    <div class="legend-title">Bezahlt</div>
                    <div class="legend-value">€38.200</div>
                    <div class="legend-detail">18 Rg. (75%)</div>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color pending"></div>
                  <div class="legend-text">
                    <div class="legend-title">Ausstehend</div>
                    <div class="legend-value">€4.850</div>
                    <div class="legend-detail">4 Rg. (17%)</div>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color overdue"></div>
                  <div class="legend-text">
                    <div class="legend-title">Überfällig</div>
                    <div class="legend-value">€2.800</div>
                    <div class="legend-detail">2 Rg. (8%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="aging-section">
            <h3>Forderungsaltersstruktur</h3>
            <table class="aging-table">
              <thead>
                <tr>
                  <th>Zeitraum</th>
                  <th>Betrag</th>
                  <th>Anzahl</th>
                  <th class="percent">Anteil</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>0-30 Tage</strong></td>
                  <td class="amount">€38.200,00</td>
                  <td>18</td>
                  <td class="percent">83%</td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 83%"></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><strong>31-60 Tage</strong></td>
                  <td class="amount">€4.850,00</td>
                  <td>4</td>
                  <td class="percent">11%</td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill warning" style="width: 11%"></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><strong>61-90 Tage</strong></td>
                  <td class="amount">€1.900,00</td>
                  <td>1</td>
                  <td class="percent">4%</td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill danger" style="width: 4%"></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><strong>> 90 Tage</strong></td>
                  <td class="amount">€900,00</td>
                  <td>1</td>
                  <td class="percent">2%</td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill danger" style="width: 2%"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detailed Table -->
        <div class="table-section">
          <h3>Detaillierte Übersicht</h3>

          <div class="filter-tabs">
            <button class="filter-tab active">Alle (24)</button>
            <button class="filter-tab">Bezahlt (18)</button>
            <button class="filter-tab">Ausstehend (4)</button>
            <button class="filter-tab">Überfällig (2)</button>
          </div>

          <input
            type="text"
            placeholder="Suche nach Rechnungsnummer oder Kunde..."
            class="search-input"
          />

          <table class="report-table">
            <thead>
              <tr>
                <th>Rechnungsnr.</th>
                <th>Kunde</th>
                <th>Rechnungsdatum</th>
                <th>Fälligkeitsdatum</th>
                <th>Betrag</th>
                <th>Status</th>
                <th>Tage seit Fälligkeit</th>
                <th>Zahlungsdatum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>RE-2025-0124</strong></td>
                <td>Müller GmbH</td>
                <td>15.11.2025</td>
                <td>29.11.2025</td>
                <td class="amount">€2.499,00</td>
                <td><span class="status-badge paid">Bezahlt</span></td>
                <td><span class="days-badge ok">-12</span></td>
                <td>17.11.2025</td>
              </tr>
              <tr>
                <td><strong>RE-2025-0123</strong></td>
                <td>Schmidt AG</td>
                <td>12.11.2025</td>
                <td>26.11.2025</td>
                <td class="amount">€1.785,00</td>
                <td><span class="status-badge pending">Ausstehend</span></td>
                <td><span class="days-badge ok">-8</span></td>
                <td>-</td>
              </tr>
              <tr>
                <td><strong>RE-2025-0122</strong></td>
                <td>Weber & Co</td>
                <td>08.11.2025</td>
                <td>22.11.2025</td>
                <td class="amount">€3.808,00</td>
                <td><span class="status-badge paid">Bezahlt</span></td>
                <td><span class="days-badge ok">-12</span></td>
                <td>10.11.2025</td>
              </tr>
              <tr>
                <td><strong>RE-2025-0121</strong></td>
                <td>Fischer KG</td>
                <td>05.11.2025</td>
                <td>19.11.2025</td>
                <td class="amount">€1.059,10</td>
                <td><span class="status-badge overdue">Überfällig</span></td>
                <td><span class="days-badge warning">+1</span></td>
                <td>-</td>
              </tr>
              <tr>
                <td><strong>RE-2025-0120</strong></td>
                <td>Becker GmbH</td>
                <td>02.11.2025</td>
                <td>16.11.2025</td>
                <td class="amount">€2.082,50</td>
                <td><span class="status-badge paid">Bezahlt</span></td>
                <td><span class="days-badge ok">-12</span></td>
                <td>04.11.2025</td>
              </tr>
              <tr>
                <td><strong>RE-2025-0119</strong></td>
                <td>Hoffmann Industries</td>
                <td>28.10.2025</td>
                <td>11.11.2025</td>
                <td class="amount">€4.998,00</td>
                <td><span class="status-badge paid">Bezahlt</span></td>
                <td><span class="days-badge ok">-19</span></td>
                <td>30.10.2025</td>
              </tr>
              <tr>
                <td><strong>RE-2025-0115</strong></td>
                <td>Schulz Gruppe</td>
                <td>15.10.2025</td>
                <td>29.10.2025</td>
                <td class="amount">€3.065,00</td>
                <td><span class="status-badge pending">Ausstehend</span></td>
                <td><span class="days-badge warning">+20</span></td>
                <td>-</td>
              </tr>
              <tr>
                <td><strong>RE-2025-0108</strong></td>
                <td>Krause & Partner</td>
                <td>28.09.2025</td>
                <td>12.10.2025</td>
                <td class="amount">€1.900,00</td>
                <td><span class="status-badge overdue">Überfällig</span></td>
                <td><span class="days-badge danger">+37</span></td>
                <td>-</td>
              </tr>
              <tr>
                <td><strong>RE-2025-0101</strong></td>
                <td>Neumann GmbH</td>
                <td>05.08.2025</td>
                <td>19.08.2025</td>
                <td class="amount">€900,00</td>
                <td><span class="status-badge overdue">Überfällig</span></td>
                <td><span class="days-badge danger">+91</span></td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PaymentsReport',
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Zahlungsstatus Bericht',
      reports: null,
      report_static_date: '',
      date_box_start: '',
      date_box_end: '',
      period: {
        start: '',
        end: ''
      },
      reportSummary: {},
      is_ready: false,
      reportsLength: 0
    }
  },

  methods: {
    formatInvoiceId(id) {
      if (!id || !id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(id).padStart(5, '0')}`
    },
    async getStaticDate() {
      if (this.report_static_date) {
        const today = new Date()
        const endDate = new Date(today.getFullYear(), today.getMonth() + 0, 0, 23, 59, 59) //with 23 hours
        const startDate = new Date(
          today.getFullYear(),
          today.getMonth() - this.report_static_date,
          1,
          0,
          0,
          0
        ) //with 0 hours

        const result = await window.api.documentReport(
          'invoices',
          startDate.toISOString().slice(0, 10),
          endDate.toISOString().slice(0, 10)
        )
        if (result.success) {
          this.reports = result.rows.map((row) => ({
            ...row,
            customer: JSON.parse(row.customer),
            payment: JSON.parse(row.payment),
            positions: JSON.parse(row.positions),
            summary: JSON.parse(row.summary),
            tax_options: JSON.parse(row.tax_options)
          }))
          this.period.start = startDate.toISOString().slice(0, 10)
          this.period.end = endDate.toISOString().slice(0, 10)
          this.is_ready = true
          this.reportSummaryFunction()
        }
      }
    },
    async dateFilter() {
      if (this.date_box_start && this.date_box_end) {
        const result = await window.api.documentReport(
          'invoices',
          this.date_box_start,
          this.date_box_end
        )
        if (result.success) {
          this.reports = result.rows
          this.is_ready = true
          this.reportSummaryFunction()
        }
      }
    },
    reportSummaryFunction() {
      console.log(this.reports)
      if (this.reports) {
        this.reportSummary = {
          total: 0,
          paid_amount: 0,
          outstanding: 0,
          average: 0
        }
        this.reports.forEach((report) => {
          this.reportSummary.total += Number(report.summary.total)
          this.reportSummary.paid_amount += Number(report.summary.paid_amount)
          this.reportSummary.outstanding += Number(report.summary.outstanding)
        })
        this.reportSummary.average = this.reportSummary.total / this.reports.length
      }
      this.reportsLength = this.reports.length
    },
    async printReport() {
      window.print()
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 24px;
  border-radius: 12px;
  color: white;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-card:nth-child(2) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.summary-card:nth-child(3) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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

/* DONUT CHART */
.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.donut-section {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
}

.donut-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.donut-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.donut-chart {
  position: relative;
  width: 200px;
  height: 200px;
}

.donut-ring {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(#10b981 0deg 270deg, #f59e0b 270deg 315deg, #ef4444 315deg 360deg);
  position: relative;
}

.donut-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-total {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.donut-label {
  font-size: 11px;
  color: #6b7280;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.legend-color.paid {
  background: #10b981;
}

.legend-color.pending {
  background: #f59e0b;
}

.legend-color.overdue {
  background: #ef4444;
}

.legend-text {
  flex: 1;
}

.legend-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.legend-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 2px 0;
}

.legend-detail {
  font-size: 11px;
  color: #6b7280;
}

/* AGING TABLE */
.aging-section {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
}

.aging-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.aging-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.aging-table thead {
  background: #f3f4f6;
}

.aging-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.aging-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.aging-table .amount {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.aging-table .percent {
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
}

.progress-fill.warning {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.progress-fill.danger {
  background: linear-gradient(90deg, #ef4444, #dc2626);
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

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.filter-tab {
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.filter-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.filter-tab:hover {
  color: #1f2937;
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

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.overdue {
  background: #fee2e2;
  color: #991b1b;
}

.days-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.days-badge.ok {
  background: #d1fae5;
  color: #065f46;
}

.days-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.days-badge.danger {
  background: #fee2e2;
  color: #991b1b;
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
  .filter-tabs,
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

  .chart-row {
    page-break-inside: avoid;
  }

  .donut-section,
  .aging-section {
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
