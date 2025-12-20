<template>
  <div class="editor-panel">
    <select class="form-input" v-model="date_range" @change="rangeDateFilter">
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
          <h2>Rechnungsbericht</h2>
          <p class="report-period">Zeitraum: 01.08.2025 - 18.11.2025</p>
        </div>
        <button class="btn-export" onclick="window.print()">🖨️ Drucken</button>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <p class="card-label">Summe Ø</p>
            <h3 class="card-value">{{ formatCurrency(summary.all_total) }}</h3>
            <p class="card-detail">{{ summary.all_count }} Rechnungen (100%)</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <p class="card-label">Pünktlich Bezahlt</p>
            <h3 class="card-value">{{ formatCurrency(summary.paid_total) }}</h3>
            <p class="card-detail">
              {{ summary.paid_count }} Rechnungen ({{ setPercentage.paid_percentage }})
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <p class="card-label">Teilzhaltig Bezahlt</p>
            <h3 class="card-value">{{ formatCurrency(summary.partially_paid_total) }}</h3>
            <p class="card-detail">
              {{ summary.partially_paid_count }} Rechnungen ({{
                setPercentage.partially_paid_percentage
              }})
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">⏳</div>
          <div class="card-content">
            <p class="card-label">Ausstehend (fällig)</p>
            <h3 class="card-value">{{ formatCurrency(summary.unpaid_total) }}</h3>
            <p class="card-detail">
              {{ summary.unpaid_count }} Rechnungen ({{ setPercentage.unpaid_percentage }})
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">⚠️</div>
          <div class="card-content">
            <p class="card-label">Überfällig</p>
            <h3 class="card-value">{{ formatCurrency(summary.overdue_total) }}</h3>
            <p class="card-detail">
              {{ summary.overdue_count }} Rechnungen ({{ setPercentage.overdue_percentage }})
            </p>
          </div>
        </div>
      </div>

      <!-- Donut Chart & Aging -->
      <div class="chart-row">
        <InvoiceChart :chartData="summary" />
        <!-- <div class="aging-section">
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
        </div> -->
      </div>

      <!-- Detailed Table -->
      <div class="table-section">
        <h3>Detaillierte Übersicht</h3>

        <div class="filter-tabs">
          <button
            :class="['filter-tab', { active: activeTab === 'all' }]"
            class="filter-tab"
            @click="activeTab = 'all'"
          >
            Alle ({{ summary.all_count }})
          </button>
          <button
            :class="['filter-tab', { active: activeTab === 'paid' }]"
            class="filter-tab"
            @click="activeTab = 'paid'"
          >
            Bezahlt ({{ summary.paid_count }})
          </button>
          <button
            :class="['filter-tab', { active: activeTab === 'partially_paid' }]"
            class="filter-tab"
            @click="activeTab = 'partially_paid'"
          >
            Teilweizeltig ({{ summary.partially_paid_count }})
          </button>
          <button
            :class="['filter-tab', { active: activeTab === 'unpaid' }]"
            class="filter-tab"
            @click="activeTab = 'unpaid'"
          >
            Ausstehend({{ summary.unpaid_count }})
          </button>
          <button
            :class="['filter-tab', { active: activeTab === 'overdue' }]"
            class="filter-tab"
            @click="activeTab = 'overdue'"
          >
            Überfällig ({{ summary.overdue_count }})
          </button>
        </div>

        <table class="report-table">
          <thead>
            <tr>
              <th>Rechnungsnr.</th>
              <th>Kunde</th>
              <th>Rechnungsdatum</th>
              <th>Fälligkeitsdatum</th>
              <th>Betrag</th>
              <th>Status</th>
              <!-- <th>Tage seit Fälligkeit</th> -->
              <th>Zahlungsdatum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredReports" :key="item.id">
              <td>
                <strong>{{ formatInvoiceId(item.id) }}</strong>
              </td>
              <td>{{ item.customer_id }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ formatDate(item.due_date) }}</td>
              <td class="amount">{{ formatCurrency(item.gross_total) }}</td>
              <td>
                <span :class="['report-table-status-badge ' + item.payment_status]">{{
                  item.payment_status
                }}</span>
              </td>
              <td>
                <span class="days-badge">{{ formatDate(item.paid_at) }}</span>
              </td>
              <!-- <td>17.11.2025</td> -->
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
  name: 'InvoiceReport',
  components: { InvoiceChart },
  inject: ['formatDate', 'formatCurrency', 'formatInvoiceId', 'formatCustomerId'],
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
      is_sort: true
    }
  },
  computed: {
    selectedPeriad() {
      if (!this.period) return
      return this.formatDate(this.period.start) + ' - ' + this.formatDate(this.period.end)
    },
    summary() {
      const all = this.reports || []
      const paid = all.filter((item) => item.payment_status === 'paid')
      const partially_paid = all.filter((item) => item.payment_status === 'partially_paid')
      const unpaid = all.filter((item) => item.payment_status === 'unpaid')
      const overdue = all.filter((item) => item.payment_status === 'overdue')

      const sum = {
        all_count: all.length,
        paid_count: paid.length,
        partially_paid_count: partially_paid.length,
        unpaid_count: unpaid.length,
        overdue_count: overdue.length,

        all_total: all.reduce(
          (sum, item) => sum + (item.gross_total != null ? Number(item.gross_total) : 0),
          0
        ),
        paid_total: paid.reduce(
          (sum, item) => sum + (item.gross_total != null ? Number(item.gross_total) : 0),
          0
        ),
        partially_paid_total: partially_paid.reduce(
          (sum, item) => sum + (item.gross_total != null ? Number(item.gross_total) : 0),
          0
        ),
        unpaid_total: unpaid.reduce(
          (sum, item) => sum + (item.gross_total != null ? Number(item.gross_total) : 0),
          0
        ),
        overdue_total: overdue.reduce(
          (sum, item) => sum + (item.gross_total != null ? Number(item.gross_total) : 0),
          0
        )
      }

      return sum
    },

    setPercentage() {
      const sum = this.summary
      return {
        paid_percentage: this.formatPercentage(sum.paid_total, sum.all_total),
        unpaid_percentage: this.formatPercentage(sum.unpaid_total, sum.all_total),
        partially_paid_percentage: this.formatPercentage(sum.partially_paid_total, sum.all_total),
        overdue_percentage: this.formatPercentage(sum.overdue_total, sum.all_total)
      }
    },
    filteredReports() {
      if (!this.reports) return []

      if (this.activeTab === 'all') {
        return this.reports
      }
      if (this.activeTab === 'paid') {
        return this.reports.filter((item) => item.payment_status === 'paid')
      }
      if (this.activeTab === 'partially_paid') {
        return this.reports.filter((item) => item.payment_status === 'partially_paid')
      }
      if (this.activeTab === 'unpaid') {
        return this.reports.filter((item) => item.payment_status !== 'paid')
      }
      if (this.activeTab === 'overdue') {
        const today = new Date().setHours(0, 0, 0, 0)
        return this.reports.filter(
          (item) =>
            item.payment_status !== 'paid' && item.due_date && new Date(item.due_date) < today
        )
      }
      return this.reports
    },
    tabs() {
      return [
        { key: 'all', label: 'Alle', count: this.summary.all_count },
        { key: 'paid', label: 'Bezahlt', count: this.summary.paid_count },
        { key: 'unpaid', label: 'Ausstehend', count: this.summary.unpaid_count },
        {
          key: 'partially_paid',
          label: 'Teilweise Bezahlt',
          count: this.summary.partially_paid_count
        },
        { key: 'overdue', label: 'Überfällig', count: this.summary.overdue_count }
      ]
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
      const result = await window.api.documentReport(data)
      console.log(result)
      if (!result.success) return
      this.reports = result.rows

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      this.is_ready = true
    },
    statusText(status) {
      return {
        paid: 'Bezahlt',
        unpaid: 'Ausstehend',
        overdue: 'Überfällig',
        draft: 'Entwurf'
      }[status]
    },
    formatPercentage(value, total) {
      if (!total || total === 0) return '0.00%'
      return ((value / total) * 100).toFixed(2) + '%'
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

<style scoped>
.editor-panel {
  max-width: 100%;
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

.report-header-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.report-header-2 h2 {
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
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
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
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.summary-card:nth-child(4) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.summary-card:nth-child(5) {
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
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #ccc;
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

.report-table-status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.report-table-status-badge.paid {
  background: #d1fae5;
  color: #065f46;
}

.report-table-status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.report-table-status-badge.overdue {
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
