<template>
  <div>
    <div class="form-section">
      <div class="form-group">
        <select v-model="date_range" class="form-input" @change="rangeDateFilter">
          <option disabled value="">Wähle Daten</option>
          <option value="1">Diesen Monat</option>
          <option value="3">Letzte 3 Monate</option>
          <option value="6">Letzte 6 Monate</option>
          <option value="12">Letztes Jahr</option>
        </select>
      </div>
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

    <div v-if="is_ready" class="report-container">
      <!-- HEADER -->
      <div class="report-header">
        <label class="report-title">{{ title }}</label>
        <label class="report-period">Zeitraum: {{ selectedPeriad }}</label>
      </div>

      <div class="report-summary-container">
        <div class="report-summary-section">
          <div class="report-summary-cards">
            <div class="report-summary-card">
              <div class="report-card-icon">📄</div>
              <div class="report-card-content">
                <p class="report-card-label">Gesamt Rechnungen</p>
                <h3 class="report-card-value">{{ reports.length }}</h3>
                <p class="report-card-detail">Total Betrag: {{ formatCurrency(total) }}</p>
              </div>
            </div>

            <div class="report-summary-card">
              <div class="report-card-icon">✅</div>
              <div class="report-card-content">
                <p class="report-card-label">Bezahlt</p>
                <h3 class="report-card-value">{{ paidCount }}</h3>
                <p class="report-card-detail">Betrag: {{ formatCurrency(paidTotal) }}</p>
              </div>
            </div>

            <div class="report-summary-card">
              <div class="report-card-icon">⏳</div>
              <div class="report-card-content">
                <p class="report-card-label">Ausstehend</p>
                <h3 class="report-card-value">{{ outstandingCount }}</h3>
                <p class="report-card-detail">Betrag: {{ formatCurrency(outstandingTotal) }}</p>
              </div>
            </div>

            <div class="report-summary-card">
              <div class="report-card-icon">💳</div>
              <div class="report-card-content">
                <p class="report-card-label">Teilweise bezahlt</p>
                <h3 class="report-card-value">{{ partiallyPaidCount }}</h3>
                <p class="report-card-detail">Betrag: {{ formatCurrency(partiallyPaidTotal) }}</p>
              </div>
            </div>

            <div class="report-summary-card">
              <div class="report-card-icon">⚠️</div>
              <div class="report-card-content">
                <p class="report-card-label">Überfällig</p>
                <h3 class="report-card-value">{{ overdueCount }}</h3>
                <p class="report-card-detail">Betrag: {{ formatCurrency(overdueTotal) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="reports" class="report-chart-section">
          <InvoiceChart :chart-data="chartData" class="report-summary-chart" />
        </div>
      </div>

      <!-- TABS -->
      <div class="report-filter-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="report-filter-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span class="report-tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- TABLE -->
      <div class="report-table-container">
        <table class="report-table printable">
          <thead>
            <tr>
              <th class="sortable" @click="sorting('id')">
                Rechnungsnr. <span class="report-sort-icon">▼</span>
              </th>
              <th class="sortable" @click="sorting('date')">
                Datum <span class="report-sort-icon">▼</span>
              </th>
              <th class="sortable" @click="sorting('customer_id')">
                Kunde <span class="report-sort-icon">▼</span>
              </th>
              <th class="sortable">Fälligkeits <span class="report-sort-icon">▼</span></th>
              <th class="center">MwSt</th>
              <th class="sortable amount">Netto <span class="report-sort-icon">▼</span></th>
              <th class="sortable amount">MwSt-Betrag <span class="report-sort-icon">▼</span></th>
              <th class="sortable amount">Brutto <span class="report-sort-icon">▼</span></th>
              <th>Status</th>
              <th>Zahlungsdatum</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredReports" :key="item.id">
              <td class="item-id">{{ formatInvoiceId(item.id) }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td class="table-customer-id">{{ item.customer_id }}</td>
              <td>{{ formatDate(item.due_date) }}</td>
              <td class="center">{{ item.vat }}%</td>
              <td class="amount">{{ formatCurrency(item.net_total) }}</td>
              <td class="amount">{{ formatCurrency(item.vat_total) }}</td>
              <td class="amount">{{ formatCurrency(item.gross_total) }}</td>
              <td>
                <span class="report-table-satus-badge" :class="item.payment_status">
                  {{ statusText(item.payment_status) }}
                </span>
              </td>
              <td>{{ item.paid_at || '---------------' }}</td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn">👁️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceChart from '../../components/charts/InvoiceChart.vue'
export default {
  name: 'InvoiceReport',
  components: { InvoiceChart },
  inject: ['formatDate', 'formatCurrency', 'formatInvoiceId'],
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
    total() {
      return this.reports.reduce((a, b) => a + Number(b.gross_total) || 0, 0)
    },
    paidCount() {
      return this.reports.filter((item) => item.payment_status === 'paid').length
    },
    paidTotal() {
      return this.reports
        .filter((item) => item.payment_status === 'paid')
        .reduce((sum, item) => sum + (Number(item.gross_total) || 0), 0)
    },
    outstandingCount() {
      return this.reports.filter((item) => item.payment_status !== 'paid').length
    },
    outstandingTotal() {
      return this.reports
        .filter((item) => item.payment_status !== 'paid')
        .reduce((sum, item) => sum + (Number(item.gross_total) || 0), 0)
    },
    partiallyPaidCount() {
      return this.reports.filter((item) => item.payment_status === 'partially_paid').length
    },
    partiallyPaidTotal() {
      return this.reports
        .filter((item) => item.payment_status === 'partially_paid')
        .reduce((sum, item) => sum + (Number(item.gross_total) || 0), 0)
    },
    overdueCount() {
      const today = new Date().setHours(0, 0, 0, 0)
      return this.reports.filter(
        (item) => item.payment_status !== 'paid' && item.due_date && new Date(item.due_date) < today
      ).length
    },
    overdueTotal() {
      const today = new Date().setHours(0, 0, 0, 0)
      return this.reports
        .filter(
          (item) =>
            item.payment_status !== 'paid' && item.due_date && new Date(item.due_date) < today
        )
        .reduce((sum, item) => sum + (Number(item.gross_total) || 0), 0)
    },
    filteredReports() {
      if (!this.reports) return []

      if (this.activeTab === 'all') {
        return this.reports
      }
      if (this.activeTab === 'paid') {
        return this.reports.filter((item) => item.payment_status === 'paid')
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
      if (!this.reports) {
        return [
          { key: 'all', label: 'Alle', count: 0 },
          { key: 'paid', label: 'Bezahlt', count: 0 },
          { key: 'unpaid', label: 'Ausstehend', count: 0 },
          { key: 'overdue', label: 'Überfällig', count: 0 }
        ]
      }
      return [
        { key: 'all', label: 'Alle', count: this.reports.length },
        { key: 'paid', label: 'Bezahlt', count: this.paidCount },
        { key: 'unpaid', label: 'Ausstehend', count: this.outstandingCount },
        { key: 'overdue', label: 'Überfällig', count: this.overdueCount }
      ]
    },
    chartData() {
      if (!this.reports || !Array.isArray(this.reports) || this.reports.length === 0) {
        return {
          labels: ['Veri Yok'],
          datasets: [
            {
              label: 'Veri Yok',
              data: [0],
              backgroundColor: '#e5e7eb'
            }
          ]
        }
      }
      const grouped = this.groupByMonth(this.reports)
      return {
        labels: grouped.labels,
        datasets: [
          {
            label: 'Bezahlt',
            data: grouped.paid,
            backgroundColor: '#10b981',
            borderRadius: 15,
            borderColor: '#ccc',
            borderWidth: 2
          },
          {
            label: 'Ausstehend',
            data: grouped.outstanding,
            backgroundColor: '#f59e0b',
            borderRadius: 15,
            borderColor: '#ccc',
            borderWidth: 2
          },
          {
            label: 'Teilweise',
            data: grouped.partially,
            backgroundColor: '#3b82f6',
            borderRadius: 15,
            borderColor: '#ccc',
            borderWidth: 2
          },
          {
            label: 'Überfällig',
            data: grouped.overdue,
            backgroundColor: '#ef4444',
            borderRadius: 15,
            borderColor: '#ccc',
            borderWidth: 2
          }
        ]
      }
    }
    // chartOptions() {
    //   return {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins: {
    //       legend: { position: 'top' },
    //       title: {
    //         display: true,
    //         text: 'Monatliche Rechnungsübersicht'
    //       }
    //     },
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //         ticks: {
    //           callback: (value) => this.formatCurrency(value)
    //         }
    //       }
    //     },
    //     barThickness: 50,
    //     maxBarThickness: 60,
    //     categoryPercentage: 0.8,
    //     barPercentage: 0.9
    //   }
    // }
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
      if (!result.success) return
      this.reports = result.rows
      console.log(result)

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
    groupByMonth(reports) {
      const months = {}
      reports.forEach((item) => {
        const date = new Date(item.date)
        const monthKey = date.toLocaleDateString('de-DE', { year: 'numeric', month: 'short' })

        if (!months[monthKey]) {
          months[monthKey] = { paid: 0, outstanding: 0, partially: 0, overdue: 0 }
        }

        const amount = item.gross_total

        if (item.payment_status === 'paid') {
          months[monthKey].paid += amount
        } else if (item.payment_status === 'outstanding') {
          months[monthKey].outstanding += amount
        } else if (item.payment_status === 'partially_paid') {
          months[monthKey].partially += amount
        } else if (item.payment_status === 'overdue') {
          months[monthKey].overdue += amount
        }
      })

      const sortedKeys = Object.keys(months).sort((a, b) => {
        const dateA = new Date(a.split(' ').reverse().join(' '))
        const dateB = new Date(b.split(' ').reverse().join(' '))
        return dateA - dateB
      })

      return {
        labels: sortedKeys,
        paid: sortedKeys.map((key) => months[key].paid),
        outstanding: sortedKeys.map((key) => months[key].outstanding),
        partially: sortedKeys.map((key) => months[key].partially),
        overdue: sortedKeys.map((key) => months[key].overdue)
      }
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
