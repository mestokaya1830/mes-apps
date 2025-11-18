<template>
  <div>
    <div class="editor-panel">
      <h1>{{ title }}</h1>
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
      <select v-model="report_type" class="form-input">
        <option value="" disabled>Waehle Bericht</option>
        <option value="umsatz">Umsatzbericht</option>
        <option value="zahlungsstatus">Zahlungsstatus</option>
        <option value="kunden">Kundenbezogener Bericht</option>
        <option value="mwst">Mehrwertsteuer (MwSt) Bericht</option>
        <option value="rechnungsListe">Rechnungsliste</option>
        <option value="prognose">Umsatzprognose</option>
      </select>

      <div class="report-container">
        <div class="report-header">
          <div>
            <h2>Umsatzbericht</h2>
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
                <th>Offener Betrag</th>
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
                  <strong>{{ formatCurrency(item.summary.outstanding) }}</strong>
                </td>
                <td><span class="status-badge paid">Bezahlt</span></td>
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
                <td colspan="2"></td>
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
      title: 'Rechnung Report',
      reports: null,
      report_type: '',
      report_static_date: '',
      date_box_start: '',
      date_box_end: '',
      period: {
        start: '',
        end: ''
      },
      reportSummary: {}
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
    },
    printReport() {
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
