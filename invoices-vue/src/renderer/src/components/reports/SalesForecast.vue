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
              <div class="card-icon">📈</div>
              <div class="card-content">
                <p class="card-label">Prognostizierter Umsatz (Q1 2026)</p>
                <h3 class="card-value">€52.300,00</h3>
                <p class="card-detail">Nächstes Quartal</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <p class="card-label">Erwartetes Wachstum</p>
                <h3 class="card-value">+14%<span class="trend-indicator">↗</span></h3>
                <p class="card-detail">Gegenüber Vorquartal</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">🎯</div>
              <div class="card-content">
                <p class="card-label">Prognosegenauigkeit</p>
                <h3 class="card-value">87%</h3>
                <p class="card-detail">Basierend auf Historie</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">💡</div>
              <div class="card-content">
                <p class="card-label">Ø Monatsumsatz (Prognose)</p>
                <h3 class="card-value">€17.433,33</h3>
                <p class="card-detail">Pro Monat Q1 2026</p>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h1>Chart</h1>
          </div>
        </div>

        <!-- Table -->
        <!-- Alerts -->
        <div class="alert-box success">
          <div class="alert-icon">✅</div>
          <div class="alert-content">
            <div class="alert-title">Positiver Trend erkannt</div>
            <div class="alert-text">
              Ihre Umsätze zeigen einen stabilen Aufwärtstrend. Die Prognose deutet auf ein Wachstum
              von 14% im nächsten Quartal hin.
            </div>
          </div>
        </div>

        <div class="alert-box warning">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">
            <div class="alert-title">Saisonale Schwankungen beachten</div>
            <div class="alert-text">
              Historische Daten zeigen, dass Januar typischerweise 8% unter dem Durchschnitt liegt.
              Planen Sie entsprechend.
            </div>
          </div>
        </div>

        <!-- Forecast Chart -->
        <div class="forecast-chart-section">
          <h3>📊 Umsatzentwicklung & Prognose (6 Monate)</h3>
          <div class="forecast-chart">
            <!-- Historical Data -->
            <div class="forecast-bar-item">
              <div class="forecast-bar-wrapper">
                <div class="forecast-bar actual" style="height: 130px">
                  <span class="bar-value">€12.500</span>
                </div>
              </div>
              <p class="bar-label">Aug 2025</p>
              <p class="bar-type">Ist</p>
            </div>

            <div class="forecast-bar-item">
              <div class="forecast-bar-wrapper">
                <div class="forecast-bar actual" style="height: 170px">
                  <span class="bar-value">€16.350</span>
                </div>
              </div>
              <p class="bar-label">Sep 2025</p>
              <p class="bar-type">Ist</p>
            </div>

            <div class="forecast-bar-item">
              <div class="forecast-bar-wrapper">
                <div class="forecast-bar actual" style="height: 110px">
                  <span class="bar-value">€10.500</span>
                </div>
              </div>
              <p class="bar-label">Okt 2025</p>
              <p class="bar-type">Ist</p>
            </div>

            <div class="forecast-bar-item">
              <div class="forecast-bar-wrapper">
                <div class="forecast-bar actual" style="height: 68px">
                  <span class="bar-value">€6.500</span>
                </div>
              </div>
              <p class="bar-label">Nov 2025</p>
              <p class="bar-type">Ist (Teil)</p>
            </div>

            <!-- Forecast Data -->
            <div class="forecast-bar-item">
              <div class="forecast-bar-wrapper">
                <div class="forecast-bar forecast" style="height: 145px">
                  <span class="bar-value">€14.200</span>
                </div>
              </div>
              <p class="bar-label">Dez 2025</p>
              <p class="bar-type">Prognose</p>
            </div>

            <div class="forecast-bar-item">
              <div class="forecast-bar-wrapper">
                <div class="forecast-bar forecast" style="height: 155px">
                  <span class="bar-value">€15.800</span>
                </div>
              </div>
              <p class="bar-label">Jan 2026</p>
              <p class="bar-type">Prognose</p>
            </div>

            <div class="forecast-bar-item">
              <div class="forecast-bar-wrapper">
                <div class="forecast-bar forecast" style="height: 180px">
                  <span class="bar-value">€18.500</span>
                </div>
              </div>
              <p class="bar-label">Feb 2026</p>
              <p class="bar-type">Prognose</p>
            </div>

            <div class="forecast-bar-item">
              <div class="forecast-bar-wrapper">
                <div class="forecast-bar forecast" style="height: 190px">
                  <span class="bar-value">€19.200</span>
                </div>
              </div>
              <p class="bar-label">Mär 2026</p>
              <p class="bar-type">Prognose</p>
            </div>
          </div>

          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color actual"></div>
              <span class="legend-text">Tatsächlicher Umsatz</span>
            </div>
            <div class="legend-item">
              <div class="legend-color forecast"></div>
              <span class="legend-text">Prognostizierter Umsatz</span>
            </div>
          </div>
        </div>

        <!-- Insights Grid -->
        <div class="insights-grid">
          <div class="insight-box">
            <h3>📌 Schlüsselkennzahlen</h3>
            <div class="insight-item">
              <div class="insight-label">Durchschn. monatl. Wachstum</div>
              <div class="insight-value positive">+4.2%</div>
            </div>
            <div class="insight-item">
              <div class="insight-label">Best Month (Prognose)</div>
              <div class="insight-value">März 2026</div>
            </div>
            <div class="insight-item">
              <div class="insight-label">Schwächster Monat</div>
              <div class="insight-value">November 2025</div>
            </div>
            <div class="insight-item">
              <div class="insight-label">Volatilität</div>
              <div class="insight-value">Mittel (±12%)</div>
            </div>
          </div>

          <div class="insight-box">
            <h3>🎯 Zielerreichung</h3>
            <div class="insight-item">
              <div class="insight-label">Quartalsziel Q4 2025</div>
              <div class="insight-value">€40.000</div>
            </div>
            <div class="insight-item">
              <div class="insight-label">Aktueller Stand</div>
              <div class="insight-value positive">€45.850 (115%)</div>
            </div>
            <div class="insight-item">
              <div class="insight-label">Quartalsziel Q1 2026</div>
              <div class="insight-value">€50.000</div>
            </div>
            <div class="insight-item">
              <div class="insight-label">Prognose Q1 2026</div>
              <div class="insight-value positive">€52.300 (105%)</div>
            </div>
          </div>
        </div>

        <!-- Detailed Forecast Table -->
        <div class="table-section">
          <h3>Detaillierte Monatsprognose</h3>

          <table class="report-table">
            <thead>
              <tr>
                <th>Monat</th>
                <th>Typ</th>
                <th>Prognostizierter Umsatz</th>
                <th>Erwartete Rechnungen</th>
                <th>Ø pro Rechnung</th>
                <th class="center">Wachstum (MoM)</th>
                <th class="center">Konfidenz</th>
                <th>Bemerkungen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>August 2025</strong></td>
                <td><span class="month-badge actual">Ist</span></td>
                <td class="amount">€12.500,00</td>
                <td class="center">6</td>
                <td class="amount">€2.083,33</td>
                <td class="center">-</td>
                <td class="center">
                  <div class="confidence-bar">
                    <div class="confidence-fill" style="width: 100%"></div>
                  </div>
                </td>
                <td>Tatsächliche Daten</td>
              </tr>
              <tr>
                <td><strong>September 2025</strong></td>
                <td><span class="month-badge actual">Ist</span></td>
                <td class="amount">€16.350,00</td>
                <td class="center">8</td>
                <td class="amount">€2.043,75</td>
                <td class="center">
                  <span class="growth-indicator positive">↗ +30.8%</span>
                </td>
                <td class="center">
                  <div class="confidence-bar">
                    <div class="confidence-fill" style="width: 100%"></div>
                  </div>
                </td>
                <td>Tatsächliche Daten</td>
              </tr>
              <tr>
                <td><strong>Oktober 2025</strong></td>
                <td><span class="month-badge actual">Ist</span></td>
                <td class="amount">€10.500,00</td>
                <td class="center">6</td>
                <td class="amount">€1.750,00</td>
                <td class="center">
                  <span class="growth-indicator negative">↘ -35.8%</span>
                </td>
                <td class="center">
                  <div class="confidence-bar">
                    <div class="confidence-fill" style="width: 100%"></div>
                  </div>
                </td>
                <td>Tatsächliche Daten</td>
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
  name: 'SalesForecast',
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Umsatzprognose',
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

.trend-indicator {
  display: inline-block;
  margin-left: 8px;
  font-size: 16px;
}

/* FORECAST CHART */
.forecast-chart-section {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.forecast-chart-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.forecast-chart {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 280px;
  position: relative;
}

.forecast-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.forecast-bar-wrapper {
  width: 100%;
  height: 230px;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.forecast-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
  transition: all 0.3s;
}

.forecast-bar.actual {
  background: linear-gradient(to top, #3b82f6, #60a5fa);
}

.forecast-bar.forecast {
  background: linear-gradient(to top, #10b981, #34d399);
  opacity: 0.8;
  border: 2px dashed #059669;
}

.forecast-bar:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.bar-value {
  font-size: 11px;
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

.bar-type {
  font-size: 9px;
  color: #9ca3af;
  margin: 0;
  text-transform: uppercase;
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
  width: 20px;
  height: 16px;
  border-radius: 3px;
}

.legend-color.actual {
  background: linear-gradient(to right, #3b82f6, #60a5fa);
}

.legend-color.forecast {
  background: linear-gradient(to right, #10b981, #34d399);
  border: 2px dashed #059669;
}

.legend-text {
  font-size: 12px;
  color: #4b5563;
  font-weight: 500;
}

/* FORECAST INSIGHTS */
.insights-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.insight-box {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.insight-box h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.insight-item:last-child {
  border-bottom: none;
}

.insight-label {
  font-size: 13px;
  color: #6b7280;
}

.insight-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Courier New', monospace;
}

.insight-value.positive {
  color: #10b981;
}

.insight-value.negative {
  color: #ef4444;
}

/* ALERTS */
.alert-box {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 16px 20px;
  margin-bottom: 24px;
  border-radius: 4px;
  display: flex;
  gap: 12px;
}

.alert-box.warning {
  background: #fffbeb;
  border-left-color: #f59e0b;
}

.alert-box.success {
  background: #f0fdf4;
  border-left-color: #10b981;
}

.alert-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.alert-text {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

/* DETAILED FORECAST TABLE */
.table-section {
  margin-top: 30px;
}

.table-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 16px 0;
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

.month-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.month-badge.actual {
  background: #dbeafe;
  color: #1e40af;
}

.month-badge.forecast {
  background: #d1fae5;
  color: #065f46;
}

.confidence-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
}

.growth-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.growth-indicator.positive {
  background: #d1fae5;
  color: #065f46;
}

.growth-indicator.negative {
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

/* METHODOLOGY */
.methodology-section {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
  border: 1px solid #e5e7eb;
}

.methodology-section h4 {
  font-size: 14px;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.methodology-section p {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
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
  .form-input,
  h1,
  .btn-export {
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

  .forecast-chart-section,
  .insights-grid,
  .alert-box {
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
