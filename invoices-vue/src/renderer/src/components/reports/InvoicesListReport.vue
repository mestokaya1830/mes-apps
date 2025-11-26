<template>
  <div>
    <div class="editor-panel">
      <h1>
        {{ title }}
        <h2 v-if="reportsLength">{{ reportsLength }}</h2>
      </h1>
      <select v-model="date_range" class="form-input" @change="rangeDateFilter">
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
            <input
              v-model="date_box_start"
              ref="date_box_start"
              type="date"
              class="form-input"
              @change="flexDateFilter()"
            />
          </div>
          <div class="form-group">
            <label for="">Bis</label>
            <input
              v-model="date_box_end"
              ref="date_box_end"
              type="date"
              class="form-input"
              @change="flexDateFilter()"
            />
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
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-icon">📄</div>
              <div class="card-content">
                <p class="card-label">Gesamt Rechnungen</p>
                <h3 class="card-value">{{ reportsLength }}</h3>
                <p class="card-detail">Total Betrag: {{ formatCurrency(summaryTotals.total) }}</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">✅</div>
              <div class="card-content">
                <p class="card-label">Bezahlt</p>
                <h3 class="card-value">{{ summaryTotals.paidCount }}</h3>
                <p class="card-detail">Betrag: {{ formatCurrency(summaryTotals.paidAmount) }}</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">⏳</div>
              <div class="card-content">
                <p class="card-label">Ausstehend</p>
                <h3 class="card-value">{{ summaryTotals.outstandingCount }}</h3>
                <p class="card-detail">
                  Betrag: {{ formatCurrency(summaryTotals.outstandingAmount) }}
                </p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">💳</div>
              <div class="card-content">
                <p class="card-label">Teilweise bezahlt</p>
                <h3 class="card-value">{{ summaryTotals.partialPaidCount }}</h3>
                <p class="card-detail">
                  Betrag: {{ formatCurrency(summaryTotals.partialPaidAmount) }}
                </p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">⚠️</div>
              <div class="card-content">
                <p class="card-label">Überfällig</p>
                <h3 class="card-value">{{ summaryTotals.overdueCount }}</h3>
                <p class="card-detail">Betrag: {{ formatCurrency(summaryTotals.overdueAmount) }}</p>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h1>Chart</h1>
          </div>
        </div>

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
                  <strong>{{ formatCurrency(item.summary.partial_paid) }}</strong>
                </td>
                <td class="amount">
                  <strong>{{ formatCurrency(item.summary.outstanding) }}</strong>
                </td>
                <td>{{ formatDate(item.due_date) }}</td>
                <td>
                  <span :class="getPaymentClass(item)">{{
                    item.is_active ? 'Paid' : 'Unpaid'
                  }}</span>
                </td>
                <td>{{ item.is_active ? 'Aktiv' : 'Inaktiv' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3"><strong>SUMME</strong></td>
                <td class="amount">
                  <strong>{{ formatCurrency(summaryTotals.total) }}</strong>
                </td>
                <td class="amount"></td>
                <td class="amount">
                  <strong>{{ formatCurrency(summaryTotals.total) }}</strong>
                </td>
                <td class="amount">
                  <strong>{{ formatCurrency(summaryTotals.partialPaidAmount) }}</strong>
                </td>
                <td class="amount">
                  <strong>{{ formatCurrency(summaryTotals.outstandingAmount) }}</strong>
                </td>
                <td colspan="3"></td>
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
  name: 'InvoicesListReport',
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Rechnungsliste',
      reports: [],
      date_range: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false,
      reportsLength: 0,
      summaryTotals: {
        total: 0,
        paidCount: 0,
        paidAmount: 0,
        outstandingCount: 0,
        outstandingAmount: 0,
        partialPaidCount: 0,
        partialPaidAmount: 0,
        overdueCount: 0,
        overdueAmount: 0
      }
    }
  },
  methods: {
    formatInvoiceId(id) {
      const year = new Date().getFullYear()
      return `RE-${year}-${String(id).padStart(5, '0')}`
    },
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
      const result = await window.api.documentReport(
        'invoices',
        this.date_box_start,
        this.date_box_end
      )
      if (!result.success) return

      this.reports = result.rows.map((row) => ({
        ...row,
        customer: JSON.parse(row.customer),
        terms: JSON.parse(row.terms),
        positions: JSON.parse(row.positions),
        summary: JSON.parse(row.summary),
        tax_options: JSON.parse(row.tax_options)
      }))

      this.period.start = this.date_box_start
      this.period.end = this.date_box_end
      this.is_ready = true
      this.calculateSummary()
    },
    calculateSummary() {
      const totals = {
        total: 0,
        paidCount: 0,
        paidAmount: 0,
        outstandingCount: 0,
        outstandingAmount: 0,
        partialPaidCount: 0,
        partialPaidAmount: 0,
        overdueCount: 0,
        overdueAmount: 0
      }

      const todayStr = new Date().toISOString().slice(0, 10)

      this.reports.forEach((item) => {
        const s = item.summary
        totals.total += Number(s.total)
        totals.paidAmount += Number(s.paid_amount)
        totals.outstandingAmount += Number(s.outstanding)
        totals.partialPaidAmount += Number(s.partial_paid)
        console.log(item)

        if (s.paid_amount >= s.total) totals.paidCount++
        else if (s.partial_paid > 0) totals.partialPaidCount++
        else totals.outstandingCount++

        if (item.due_date < todayStr && s.outstanding > 0)
          (totals.overdueCount++, (totals.overdueAmount += Number(s.outstanding)))
      })

      this.reportsLength = this.reports.length
      this.summaryTotals = totals
    },
    getPaymentClass(item) {
      const today = new Date().toISOString().slice(0, 10)
      if (item.summary.paid_amount >= item.summary.total) return 'paid'
      else if (item.due_date < today) return 'overdue'
      else return 'pending'
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

.header-actions {
  display: flex;
  gap: 10px;
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

.btn-secondary {
  padding: 10px 20px;
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-secondary:hover {
  background: #eff6ff;
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

/* FILTERS */
.filters-section {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
}

.filters-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 12px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 6px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.filter-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  background: white;
}

/* TABS */
.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.filter-tab {
  padding: 8px 20px;
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

.tab-count {
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  margin-left: 6px;
}

.filter-tab.active .tab-count {
  background: #dbeafe;
  color: #1e40af;
}

/* TABLE */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.report-table thead {
  background: #f9fafb;
}

.report-table th {
  padding: 14px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: #f9fafb;
}

.report-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.report-table th.sortable:hover {
  background: #f3f4f6;
}

.sort-icon {
  display: inline-block;
  margin-left: 4px;
  color: #9ca3af;
  font-size: 10px;
}

.report-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #f3f4f6;
}

.report-table tbody tr {
  transition: background 0.2s;
}

.report-table tbody tr:hover {
  background: #f9fafb;
}

.report-table .amount {
  text-align: right;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.report-table .center {
  text-align: center;
}

.invoice-number {
  font-weight: 600;
  color: #1f2937;
}

.customer-name {
  color: #4b5563;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
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

.status-badge.draft {
  background: #f3f4f6;
  color: #4b5563;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 6px 10px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #4b5563;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #3b82f6;
  color: #3b82f6;
}

/* PAGINATION */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 13px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #4b5563;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #3b82f6;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
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
  .form-input,
  h1,
  .btn-export,
  .btn-secondary,
  .filters-section,
  .filter-tabs,
  .action-buttons,
  .pagination {
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
