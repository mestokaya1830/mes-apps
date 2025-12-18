<template>
  <div>
    <div class="editor-panel">
      <h3 class="editor-header">
        {{ title }}
        <h2 v-if="reportsLength">{{ reportsLength }}</h2>
      </h3>

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
            <label>Von</label>
            <input v-model="date_box_start" type="date" class="form-input" @change="dateFilter" />
          </div>
          <div class="form-group">
            <label>Bis</label>
            <input v-model="date_box_end" type="date" class="form-input" @change="dateFilter" />
          </div>
        </div>
      </div>

      <div v-if="is_ready" class="report-container printable">
        <!-- Header -->
        <div class="report-header">
          <div>
            <p class="report-period">Zeitraum: {{ period.start }} - {{ period.end }}</p>
          </div>
          <button class="btn-export" @click="printReport">🖨️ Drucken</button>
        </div>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-icon">💶</div>
              <div class="card-content">
                <p class="card-label">Gesamte MwSt</p>
                <h3 class="card-value">{{ formatCurrency(totalVat) }}</h3>
              </div>
            </div>

            <div class="summary-card" v-for="rate in [19, 7, 0]" :key="rate">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <p class="card-label">MwSt {{ rate }}%</p>
                <h3 class="card-value">{{ formatCurrency(vatByRate[rate]) }}</h3>
                <p class="card-detail">{{ formatCurrency(netByRate[rate]) }} Netto</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">⚡</div>
              <div class="card-content">
                <p class="card-label">An Finanzamt zu zahlen</p>
                <h3 class="card-value">{{ formatCurrency(totalVat) }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Tax Rate Detail -->
        <div class="tax-rate-grid">
          <div class="tax-rate-box" v-for="rate in [19, 7, 0]" :key="rate">
            <div class="tax-rate-header">
              <div class="tax-rate-title">Steuersatz</div>
              <div class="tax-rate-percent">{{ rate }}%</div>
            </div>

            <div class="tax-rate-item">
              <div class="tax-rate-label">Nettobetrag</div>
              <div class="tax-rate-value">{{ formatCurrency(netByRate[rate]) }}</div>
            </div>
            <div class="tax-rate-item">
              <div class="tax-rate-label">MwSt-Betrag</div>
              <div class="tax-rate-value">{{ formatCurrency(vatByRate[rate]) }}</div>
            </div>
            <div class="tax-rate-item">
              <div class="tax-rate-label">Bruttobetrag</div>
              <div class="tax-rate-value">
                {{ formatCurrency(netByRate[rate] + vatByRate[rate]) }}
              </div>
            </div>
            <div class="tax-rate-item">
              <div class="tax-rate-label">Anzahl Rechnungen</div>
              <div class="tax-rate-value">{{ countByRate[rate] }}</div>
            </div>
          </div>
        </div>

        <!-- UStVA -->
        <div class="ustva-section">
          <h3>📋 Umsatzsteuervoranmeldung (UStVA)</h3>

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
                <td>Kz. 81</td>
                <td>Steuerbare Umsätze (19%)</td>
                <td>{{ formatCurrency(netByRate[19]) }}</td>
                <td>19%</td>
                <td>{{ formatCurrency(vatByRate[19]) }}</td>
              </tr>

              <tr>
                <td>Kz. 86</td>
                <td>Steuerbare Umsätze (7%)</td>
                <td>{{ formatCurrency(netByRate[7]) }}</td>
                <td>7%</td>
                <td>{{ formatCurrency(vatByRate[7]) }}</td>
              </tr>

              <tr>
                <td>Kz. 91</td>
                <td>Steuerfreie Umsätze</td>
                <td>{{ formatCurrency(netByRate[0]) }}</td>
                <td>0%</td>
                <td>{{ formatCurrency(vatByRate[0]) }}</td>
              </tr>

              <tr class="ustva-total-row">
                <td colspan="4"><strong>Summe Umsatzsteuer (Kz. 83)</strong></td>
                <td>
                  <strong>{{ formatCurrency(totalVat) }}</strong>
                </td>
              </tr>

              <tr class="ustva-payable">
                <td colspan="4"><strong>Zahllast</strong></td>
                <td>
                  <strong>{{ formatCurrency(totalVat) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
         <!-- Table -->
        <div class="table-section">
          <h3>Detaillierte Rechnungsliste</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>Rechnungsnr.</th>
                <th>Datum</th>
                <th>Kunde</th>
                <th>Nettobetrag</th>
                <th>MwSt</th>
                <th>Bruttobetrag</th>
                <th>Teilweise bezahlt</th>
                <th>Offener Betrag</th>
                <th>Fälligkeit</th>
                <th>Zahlungsstatus</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody v-if="reports">
              <tr v-for="item in reports" :key="item.id">
                <td>
                  <strong>{{ formatInvoiceId(item.id) }}</strong>
                </td>
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.customer.company_name }}</td>
                <td class="amount">{{ formatCurrency(item.summary.subtotal) }}</td>
                <td class="amount">{{ formatCurrency(item.summary.vat_amount) }}</td>
                <td class="amount">
                  <strong>{{ formatCurrency(item.summary.total) }}</strong>
                </td>
                <td class="amount">
                  <strong>{{ formatCurrency(item.summary.paid_amount) }}</strong>
                </td>
                <td class="amount">
                  <strong>{{ formatCurrency(item.summary.outstanding) }}</strong>
                </td>
                <td>
                  <span class="status-badge overdue">{{ getDaysOverdue(item.payment) }}</span>
                </td>
                <td>
                  <span :class="getPaymentClass(item.payment)">{{
                    formatDate(item.payment.payment_date)
                  }}</span>
                </td>
                <td>
                  <span class="status-badge paid">{{ item.is_active }}</span>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="reportSummary">
              <tr class="total-row">
                <td colspan="3"><strong>SUMME</strong></td>
                <td class="amount">
                  <strong>{{ formatCurrency(reportSummary.total) }}</strong>
                </td>
                <td class="amount">
                  <strong>{{ formatCurrency(reportSummary.paid_amount) }}</strong>
                </td>
                <td class="amount">
                  <strong>{{ formatCurrency(reportSummary.outstanding) }}</strong>
                </td>
                <td class="amount" colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaxReport',
  inject: ['formatCurrency', 'formatDate'],

  data() {
    return {
      title: 'Mehrwertsteuer (MwSt) Bericht',
      reports: [],
      report_static_date: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false,
      vatByRate: { 19: 0, 7: 0, 0: 0 },
      netByRate: { 19: 0, 7: 0, 0: 0 },
      countByRate: { 19: 0, 7: 0, 0: 0 },
      reportsLength: 0,
      reportSummary: null
    }
  },

  computed: {
    totalVat() {
      return this.vatByRate[19] + this.vatByRate[7] + this.vatByRate[0]
    }
  },

  methods: {
    getVatRate(r) {
      const net = Number(r.summary.subtotal)
      const vat = Number(r.summary.vat_amount)
      if (net <= 0) return 0
      return Math.round((vat / net) * 100)
    },

    formatInvoiceId(id) {
      const y = new Date().getFullYear()
      return `RE-${y}-${String(id).padStart(5, '0')}`
    },

    calculateSummary() {
      this.vatByRate = { 19: 0, 7: 0, 0: 0 }
      this.netByRate = { 19: 0, 7: 0, 0: 0 }
      this.countByRate = { 19: 0, 7: 0, 0: 0 }

      this.reports.forEach((r) => {
        const rate = this.getVatRate(r)
        const net = Number(r.summary.subtotal)
        const vat = Number(r.summary.vat_amount)

        let rateGroup = 0
        if (rate >= 18) rateGroup = 19
        else if (rate >= 6) rateGroup = 7
        else rateGroup = 0

        this.netByRate[rateGroup] += net
        this.vatByRate[rateGroup] += vat
        this.countByRate[rateGroup]++
      })
      this.reportsLength = this.reports.length
    },

    async getStaticDate() {
      if (!this.report_static_date) return
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
        this.reports = result.rows.map((item) => ({
          ...item,
          customer: JSON.parse(item.customer),
          payment: JSON.parse(item.payment),
          positions: JSON.parse(item.positions),
          summary: JSON.parse(item.summary),
          tax_options: JSON.parse(item.tax_options)
        }))
        this.period.start = startDate.toISOString().slice(0, 10)
        this.period.end = endDate.toISOString().slice(0, 10)
        this.is_ready = true
        this.calculateSummary()
        console.log(this.reports)
      }
    },

    async dateFilter() {
      if (!this.date_box_start || !this.date_box_end) return
      const result = await window.api.documentReport(
        'invoices',
        this.date_box_start,
        this.date_box_end
      )
      if (result.success) {
        this.reports = result.rows.map((r) => ({
          ...r,
          customer: JSON.parse(r.customer),
          payment: JSON.parse(r.payment),
          positions: JSON.parse(r.positions),
          summary: JSON.parse(r.summary),
          tax_options: JSON.parse(r.tax_options)
        }))
        this.period.start = this.date_box_start
        this.period.end = this.date_box_end
        this.is_ready = true
        this.calculateSummary()
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
    getPaymentClass(item) {
      const d = new Date()
      const today = d.toISOString().slice(0, 10)
      if (item.is_paid)
        return 'paid' // Yeşil
      else if (item.payment_date.trim() < today)
        return 'overdue' // Kırmızı
      else return 'pending' // Sarı
    },
    getDaysOverdue(item) {
      const today = new Date()
      const paymentDate = new Date(item.payment_date)
      const diffTime = paymentDate - today
      return Math.floor(diffTime / (1000 * 60 * 60 * 24))
    },
    printReport() {
      window.print()
    }
  }
}
</script>

<style>
.paid {
  color: green;
}
.overdue {
  color: red;
}
.pading {
  color: yellow;
}
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
