<template>
  <div class="editor-panel">
    <h3 class="editor-header">{{ title }}</h3>

    <!-- DATE RANGE SELECT -->
    <select v-model="date_range" class="form-input" @change="rangeDateFilter">
      <option disabled value="">Wähle Daten</option>
      <option value="1">Diesen Monat</option>
      <option value="3">Letzte 3 Monate</option>
      <option value="6">Letzte 6 Monate</option>
      <option value="12">Letztes Jahr</option>
    </select>

    <!-- DATE INPUTS -->
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

    <div v-if="is_ready">
      <!-- HEADER -->
      <div class="report-header">
        <div>
          <h2>Rechnungsliste</h2>
          <p class="report-period">Zeitraum: {{ selectedPeriad }}</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary">📊 Excel Export</button>
          <button class="btn-export" @click="print">🖨️ Drucken</button>
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">📄</div>
          <div class="card-content">
            <p class="card-label">Gesamt Rechnungen</p>
            <h3 class="card-value">{{ reports.length }}</h3>
            <p class="card-detail">Total Betrag: {{ formatCurrency(grossTotal) }}</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <p class="card-label">Bezahlt</p>
            <h3 class="card-value">{{ paidCount }}</h3>
            <p class="card-detail">Betrag: {{ formatCurrency(totalPaid) }}</p>
          </div>
        </div>

        <!-- <div class="summary-card">
          <div class="card-icon">⏳</div>
          <div class="card-content">
            <p class="card-label">Ausstehend</p>
            <h3 class="card-value">{{ summaryTotals.outstandingCount }}</h3>
            <p class="card-detail">Betrag: {{ formatCurrency(summaryTotals.outstandingAmount) }}</p>
          </div>
        </div> -->

        <!-- <div class="summary-card">
          <div class="card-icon">💳</div>
          <div class="card-content">
            <p class="card-label">Teilweise bezahlt</p>
            <h3 class="card-value">{{ summaryTotals.partialPaidCount }}</h3>
            <p class="card-detail">Betrag: {{ formatCurrency(summaryTotals.partialPaidAmount) }}</p>
          </div>
        </div> -->

        <!-- <div class="summary-card">
          <div class="card-icon">⚠️</div>
          <div class="card-content">
            <p class="card-label">Überfällig</p>
            <h3 class="card-value">{{ summaryTotals.overdueCount }}</h3>
            <p class="card-detail">Betrag: {{ formatCurrency(summaryTotals.overdueAmount) }}</p>
          </div>
        </div> -->
      </div>

      <!-- TABS -->
      <div class="filter-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="filter-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- TABLE -->
      <!-- <div class="table-container">
      <table class="report-table">
        <tbody>
          <tr v-for="invoice in filteredInvoices" :key="invoice.number">
            <td class="invoice-number">{{ invoice.number }}</td>
            <td>{{ invoice.date }}</td>
            <td class="customer-name">{{ invoice.customer }}</td>
            <td>{{ invoice.dueDate }}</td>
            <td class="center">{{ invoice.vat }}%</td>
            <td class="amount">{{ formatCurrency(invoice.net) }}</td>
            <td class="amount">{{ formatCurrency(invoice.vatAmount) }}</td>
            <td class="amount">{{ formatCurrency(invoice.gross) }}</td>
            <td>
              <span class="status" :class="invoice.status">
                {{ statusText(invoice.status) }}
              </span>
            </td>
            <td>{{ invoice.paymentDate || '-' }}</td>
            <td>
              <div class="action-buttons">
                <button v-for="btn in actions" :key="btn" class="action-btn">
                  {{ btn }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceReport',
  inject: ['formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Rechnungsbericht',
      reports: null,
      date_range: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false,
      activeTab: 'all',

      actions: ['👁️', '✏️', '📧'],

      tabs: [
        { key: 'all', label: 'Alle', count: 24 },
        { key: 'paid', label: 'Bezahlt', count: 18 },
        { key: 'unpaid', label: 'Ausstehend', count: 4 },
        { key: 'overdue', label: 'Überfällig', count: 2 }
      ],

      // summaryCards: [
      //   { icon: '📄', label: 'Gesamt Rechnungen', value: this.reports.length, detail: 'Im Zeitraum' },
      //   { icon: '✅', label: 'Bezahlt', value: 18, detail: '75%' },
      //   { icon: '⏳', label: 'Ausstehend', value: 4, detail: '17%' },
      //   { icon: '⚠️', label: 'Überfällig', value: 2, detail: '8%' }
      // ],

      invoices: [
        {
          number: 'RE-2025-0124',
          date: '15.11.2025',
          customer: 'Müller GmbH',
          dueDate: '29.11.2025',
          vat: 19,
          net: 2100,
          vatAmount: 399,
          gross: 2499,
          status: 'paid',
          paymentDate: '17.11.2025'
        },
        {
          number: 'RE-2025-0123',
          date: '12.11.2025',
          customer: 'Schmidt AG',
          dueDate: '26.11.2025',
          vat: 19,
          net: 1500,
          vatAmount: 285,
          gross: 1785,
          status: 'unpaid'
        }
      ]
    }
  },
  computed: {
    selectedPeriad() {
      if (!this.period) return
      return this.formatDate(this.period.start) + ' - ' + this.formatDate(this.period.end)
    },
    grossTotal() {
      let total = this.reports.reduce((a, b) => a + b.gross_total, 0)
      return total
    },
    paidCount() {
      let count = this.reports.filter((item) => item.payment_status === 'paid')
      return count.length
    },
    totalPaid() {
      let total = this.reports.reduce((a, b) => a + b.paid_amount, 0)
      return total
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
      this.date_box_start = ''
      this.date_box_end = ''
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
      const result = await window.api.documentReport(data)
      if (!result.success) return
      console.log(result)

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      this.is_ready = true
      console.log(this.reports)
      // this.calculateSummary()
    },
    statusText(status) {
      return {
        paid: 'Bezahlt',
        unpaid: 'Ausstehend',
        overdue: 'Überfällig',
        draft: 'Entwurf'
      }[status]
    },

    print() {
      window.print()
    }
  }
}
</script>

<style>
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
  border: 1px solid #e5e7eb;
  overflow-x: auto;
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
