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
            <p class="report-period">Zeitraum: {{ period.start }} - {{ period.end }}</p>
          </div>
          <button class="btn-export" @click="printReport">🖨️ Drucken</button>
        </div>

        <div class="summary-section">
          <!-- Summary Cards -->
          <div v-if="reportSummary" class="summary-container">
            <div class="summary-card">
              <div class="card-icon">💰</div>
              <div class="card-content">
                <p class="card-label">Gesamtumsatz</p>
                <h3 class="card-value">{{ formatCurrency(reportSummary.total) }}</h3>
                <p class="card-detail">24 Rechnungen</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">✅</div>
              <div class="card-content">
                <p class="card-label">Bezahlt</p>
                <h3 class="card-value">{{ formatCurrency(reportSummary.paid_amount) }}</h3>
                <p class="card-detail">18 Rechnungen (75%)</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">⏳</div>
              <div class="card-content">
                <p class="card-label">Ausstehend</p>
                <h3 class="card-value">{{ formatCurrency(reportSummary.outstanding) }}</h3>
                <p class="card-detail">6 Rechnungen (25%)</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <h3 class="card-value">{{ formatCurrency(reportSummary.average) }}</h3>
                <p class="card-detail">Ø Wert</p>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h1>Chart</h1>
          </div>
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
  name: 'InvoicesReport',
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Umsatzbericht',
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
        this.reports.forEach((item) => {
          this.reportSummary.total += Number(item.summary.total)
          this.reportSummary.paid_amount += Number(item.summary.paid_amount)
          this.reportSummary.outstanding += Number(item.summary.outstanding)
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
    async printReport() {
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

.summary-section {
  display: flex;
  margin-bottom: 30px;
}
/* SUMMARY CARDS */
.summary-container {
  width: 50%;
  gap: 20px;
}
.chart-container {
  display: flex;
  justify-content: center;
  width: 50%;
}
.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  color: white;
  display: flex;
  gap: 16px;
  align-items: center;
  margin: 10px 0;
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
  body * {
    visibility: hidden;
  }
  .printable,
  .printable * {
    visibility: visible;
    -webkit-print-color-adjust: exact; /* Chrome, Safari */
    print-color-adjust: exact; /* Firefox */
  }
  .printable {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #fff; /* istediğin arka plan */
  }
  @page {
    margin: 1.5cm;
    @bottom-right {
      content: 'Seite ' counter(page) ' von ' counter(pages);
    }
  }
}
</style>
