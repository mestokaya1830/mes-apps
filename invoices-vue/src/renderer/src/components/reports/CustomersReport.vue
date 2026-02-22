<template>
  <div>
    <select v-model="date_range" class="inputs" @change="rangeDateFilter">
      <option value="" disabled>Waehle Daten</option>
      <option value="1">Diesen Monat</option>
      <option value="3">Letzte 3 Monate</option>
      <option value="6">Letzte 6 Monate</option>
      <option value="12">Letztes Jahr</option>
    </select>

    <div class="sections mt-20">
      <div class="form-row">
        <div class="form-group">
          <label for=""> Von</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input
              v-model="date_box_start"
              type="date"
              class="inputs date"
              @change="flexDateFilter()"
            />
          </div>
        </div>
        <div class="form-group">
          <label for=""> Bis</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input
              v-model="date_box_end"
              type="date"
              class="inputs date"
              @change="flexDateFilter()"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="reports" class="printable">
      <div class="report-header-2">
        <div>
          <h2><i class="bi bi-bar-chart-line-fill me-1 icons"></i>{{ title }}</h2>
          <p class="report-period">
            <i class="bi bi-clock-history me-1"></i> Zeitraum: {{ selectedPeriod }}
          </p>
        </div>
      </div>

      <div class="report-summary-cards">
        <div class="report-summary-card">
          <div class="card-icon"><i class="bi bi-people-fill"></i></div>
          <div class="card-content">
            <p class="card-label">Aktive Kunden</p>
            <h3 class="card-value">{{ reports.length }}</h3>
            <p class="card-detail">Im Zeitraum {{ selectedPeriod }}</p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon"><i class="bi bi-cash-stack"></i></div>
          <div class="card-content">
            <p class="card-label">Ø Gesamtumsatz</p>
            <h3 class="card-value">{{ formatCurrency(summary.total_revenue) }}</h3>
            <p class="card-detail">Im Zeitraum</p>
          </div>
        </div>

        <div v-if="summary.top_customer" class="report-summary-card">
          <div class="card-icon"><i class="bi bi-trophy-fill text-warning"></i></div>
          <div class="card-content">
            <p class="card-label">Top Kunde</p>
            <h3 class="card-value">
              {{ formatCurrency(summary.top_customer.invoice_total) }}
            </h3>
            <h3 class="card-detail">{{ summary.top_customer.company_name }}</h3>
            <p class="card-detail">{{ summary.top_customer.full_name }}</p>
            <p class="card-detail">ID: {{ summary.top_customer.id }}</p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon"><i class="bi bi-graph-up-arrow"></i></div>
          <div class="card-content">
            <p class="card-label">Umsatz pro Kunde</p>
            <h3 class="card-value">{{ formatCurrency(summary.total_avarage) }}</h3>
            <p class="card-detail">Durchschchnitt</p>
          </div>
        </div>
      </div>

      <div class="sections">
        <h3><i class="bi bi-award me-1 icons"></i>Kunden</h3>
        <div v-for="(item, index) in reports" :key="item.id" class="top-customer-list">
          <div class="top-customer-item">
            <div class="customer-rank gold">{{ index + 1 }}</div>
            <div class="customer-info">
              <div class="customer-name">{{ item.company_name }}</div>
              <div class="customer-detail">{{ item.full_name }}</div>
              <div class="customer-bar">
                <div class="customer-bar-fill" :style="`width: ${item.percentage}%`"></div>
              </div>
              <small> {{ item.percentage }} %</small>
            </div>
            <div class="customer-revenue">
              <div class="revenue-amount">{{ formatCurrency(item.invoice_total) }}</div>
              <div class="revenue-count">{{ item.invoice_count }} Rechnungen</div>
              <small> {{ item.percentage }} %</small>
            </div>
          </div>
        </div>
      </div>

      <div class="table-section">
        <h3><i class="bi bi-list-check me-1 icons"></i>Detaillierte Kundenübersicht</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Firma</th>
              <th>Name</th>
              <th>Stadt</th>
              <th>Rechnungen</th>
              <th>Gesamtumsatz</th>
              <th>Anteil %</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in reports" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.company_name || '-' }}</td>
              <td>{{ item.full_name || '-' }}</td>
              <td>{{ item.city || '-' }}</td>
              <td class="text-center">{{ item.invoice_count }}</td>
              <td class="text-right">{{ formatCurrency(item.invoice_total) }}</td>
              <td class="text-center">{{ item.percentage }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ReportActions reportName="Kundenberichte" :period="period" />
  </div>
</template>

<script>
import ReportActions from '../preview/ReportActions.vue'
export default {
  name: 'CustomersReport',
  components: {
    ReportActions
  },
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency', 'formatPercentage'],
  data() {
    return {
      title: 'Kundenbezogener Bericht',
      reports: null,
      summary: null,
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
        end: this.date_box_end,
        limit: 20
      }
      const result = await window.api.reportCustomers(data)
      if (!result.success) return
      this.reports = result.rows
      const totalRevenue = result.rows.reduce((sum, c) => sum + c.invoice_count, 0)
      result.rows.forEach((c) => {
        c.percentage = ((c.invoice_count / totalRevenue) * 100).toFixed(2) // örn: "50.00"
      })

      this.summary = {
        total_revenue: result.rows.reduce((sum, c) => sum + c.invoice_total, 0),
        total_avarage: result.rows.reduce(
          (sum, c) => sum + c.invoice_total / result.rows.length,
          0
        ),
        top_customer: result.rows.sort((a, b) => (a.invoice_total > b.invoice_total ? -1 : 1))[0]
      }
      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      this.is_ready = true
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
