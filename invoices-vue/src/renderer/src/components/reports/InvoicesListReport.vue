<template>
  <div>
    <select v-model="date_range" class="inputs" @change="rangeDateFilter">
      <option value="" disabled>Wähle Daten</option>
      <option value="1">Diesen Monat</option>
      <option value="3">Letzte 3 Monate</option>
      <option value="6">Letzte 6 Monate</option>
      <option value="12">Letztes Jahr</option>
    </select>

    <div class="sections mt-20">
      <div class="form-row">
        <div class="form-group">
          <label><i class="bi bi-calendar-range me-1 icons"></i> Von</label>
          <input
            ref="date_box_start"
            v-model="date_box_start"
            type="date"
            class="inputs date"
            @change="flexDateFilter"
          />
        </div>
        <div class="form-group">
          <label><i class="bi bi-calendar-check me-1 icons"></i> Bis</label>
          <input
            ref="date_box_end"
            v-model="date_box_end"
            type="date"
            class="inputs date"
            @change="flexDateFilter"
          />
        </div>
      </div>
    </div>

    <div v-if="is_ready" class="printable">
      <div class="report-header-2">
        <div>
          <h2><i class="bi bi-file-earmark-bar-graph me-2"></i>{{ title }}</h2>
          <p class="report-period"><i class="bi bi-clock me-1 icons"></i> Zeitraum: {{ selectedPeriod }}</p>
        </div>
      </div>

      <div class="report-summary-cards">
        <div class="report-summary-card">
          <div class="card-icon text-primary"><i class="bi bi-bar-chart-fill"></i></div>
          <div class="card-content">
            <p class="card-label">Summe Ø</p>
            <h3 class="card-value">{{ formatCurrency(summary.all_total) }}</h3>
            <p class="card-detail">{{ summary.all_count }} Rechnungen (100%)</p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon text-success"><i class="bi bi-check-circle-fill"></i></div>
          <div class="card-content">
            <p class="card-label">Pünktlich Bezahlt</p>
            <h3 class="card-value">{{ formatCurrency(summary.paid_total) }}</h3>
            <p class="card-detail">
              {{ summary.paid_count }} Rechnungen ({{ setPercentage.paid_percentage }})
            </p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon text-info"><i class="bi bi-pie-chart-fill"></i></div>
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

        <div class="report-summary-card">
          <div class="card-icon text-secondary"><i class="bi bi-hourglass-split"></i></div>
          <div class="card-content">
            <p class="card-label">Unbezahlt (fällig)</p>
            <h3 class="card-value">{{ formatCurrency(summary.unpaid_total) }}</h3>
            <p class="card-detail">
              {{ summary.unpaid_count }} Rechnungen ({{ setPercentage.unpaid_percentage }})
            </p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon text-danger"><i class="bi bi-exclamation-triangle-fill"></i></div>
          <div class="card-content">
            <p class="card-label">Überfällig</p>
            <h3 class="card-value">{{ formatCurrency(summary.overdue_total) }}</h3>
            <p class="card-detail">
              {{ summary.overdue_count }} Rechnungen ({{ setPercentage.overdue_percentage }})
            </p>
          </div>
        </div>
      </div>

      <InvoiceChart :chartData="summary" />

      <div class="report-table-container">
        <div class="report-filter-tabs">
          <button
            :class="['report-filter-tab', { active: activeTab === 'all' }]"
            @click="activeTab = 'all'"
          >
            Alle ({{ summary.all_count }})
          </button>
          <button
            :class="['report-filter-tab', { active: activeTab === 'paid' }]"
            @click="activeTab = 'paid'"
          >
            Bezahlt ({{ summary.paid_count }})
          </button>
          <button
            :class="['report-filter-tab', { active: activeTab === 'partially_paid' }]"
            @click="activeTab = 'partially_paid'"
          >
             Teilweizeltig ({{ summary.partially_paid_count }})
          </button>
          <button
            :class="['report-filter-tab', { active: activeTab === 'unpaid' }]"
            @click="activeTab = 'unpaid'"
          >
             Unbezahlt ({{ summary.unpaid_count }})
          </button>
          <button
            :class="['report-filter-tab', { active: activeTab === 'overdue' }]"
            @click="activeTab = 'overdue'"
          >
            Überfällig ({{ summary.overdue_count }})
          </button>
        </div>

        <table class="report-table">
          <thead>
            <tr>
              <th class="sortable" @click="sorting('id')">
                Rechnungsnr. <i class="bi bi-caret-down-fill ms-1"></i>
              </th>
              <th class="sortable">Datum <i class="bi bi-caret-down-fill ms-1"></i></th>
              <th>Kunde</th>
              <th class="sortable">Fälligkeitsdatum <i class="bi bi-caret-down-fill ms-1"></i></th>
              <th class="sortable amount">Netto <i class="bi bi-caret-down-fill ms-1"></i></th>
              <th class="sortable amount">MwSt-Betrag <i class="bi bi-caret-down-fill ms-1"></i></th>
              <th class="sortable amount">Brutto <i class="bi bi-caret-down-fill ms-1"></i></th>
              <th>Status</th>
              <th>Zahlungsdatum</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredReports" :key="item.id">
              <td><span class="invoice-number">{{ formatInvoiceId(item.id) }}</span></td>
              <td>{{ formatDate(item.date) }}</td>
              <td><span class="customer-name">{{ item.customer_id }}</span></td>
              <td>{{ formatDate(item.due_date) }}</td>
              <td class="amount">{{ formatCurrency(item.net_total) }}</td>
              <td class="amount">{{ formatCurrency(item.vat_total) }}</td>
              <td class="amount">{{ formatCurrency(item.gross_total) }}</td>
              <td>
                <span :class="['report-table-status-badge', item.isOverdue ? 'overdue' : item.payment_status]">
                  {{ item.isOverdue ? 'overdue' : item.payment_status }}
                </span>
              </td>
              <td>{{ formatDate(item.paid_at) || '--------' }}</td>
              <td>
                <button class="btn-report-details">
                  <i class="bi bi-eye"></i>
                </button>
              </td>
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
    selectedPeriod() {
      if (!this.period) return
      return this.formatDate(this.period.start) + ' - ' + this.formatDate(this.period.end)
    },
    returnReportWithOverdue() {
      if (!this.reports) return []
      return this.reports.map((item) => {
        return {
          ...item,
          isOverdue: item.payment_status === 'unpaid' && this.checkDueDate(item.due_date)
        }
      })
    },
    summary() {
      //shorthand
      const all = this.returnReportWithOverdue //new reports for isOverdue
      const paid = all.filter((item) => item.payment_status === 'paid')
      const partially_paid = all.filter((item) => item.payment_status === 'partially_paid')
      const unpaid = all.filter((item) => item.payment_status === 'unpaid')
      const overdue = all.filter((item) => item.isOverdue)

      return {
        //all counts
        all_count: all.length,
        paid_count: paid.length,
        partially_paid_count: partially_paid.length,
        unpaid_count: unpaid.length,
        overdue_count: overdue.length,

        //all totals
        all_total: all.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        paid_total: paid.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        partially_paid_total: partially_paid.reduce(
          (sum, item) => sum + Number(item.gross_total || 0),
          0
        ),
        unpaid_total: unpaid.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        overdue_total: overdue.reduce((sum, item) => sum + Number(item.gross_total || 0), 0)
      }
    },

    setPercentage() {
      const sum = this.summary
      return {
        paid_percentage: this.formatPercentage(sum.paid_total, sum.all_total),
        partially_paid_percentage: this.formatPercentage(sum.partially_paid_total, sum.all_total),
        unpaid_percentage: this.formatPercentage(sum.unpaid_total, sum.all_total),
        overdue_percentage: this.formatPercentage(sum.overdue_total, sum.all_total)
      }
    },
    filteredReports() {
      if (!this.returnReportWithOverdue) return []

      switch (this.activeTab) {
        case 'all':
          return this.returnReportWithOverdue
        case 'paid':
          return this.returnReportWithOverdue.filter((item) => item.payment_status === 'paid')
        case 'partially_paid':
          return this.returnReportWithOverdue.filter(
            (item) => item.payment_status === 'partially_paid'
          )
        case 'unpaid':
          return this.returnReportWithOverdue.filter((item) => item.payment_status === 'unpaid')
        case 'overdue':
          return this.returnReportWithOverdue.filter((item) => item.isOverdue)
        default:
          return this.returnReportWithOverdue
      }
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
      const result = await window.api.reportInvoices(data)
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

