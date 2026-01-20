<template>
  <div class="report-panel">
    <select v-model="date_range" class="inputs" @change="rangeDateFilter">
      <option value="" disabled>Waehle Daten</option>
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
            type="date"
            class="inputs date"
            @change="flexDateFilter()"
          />
        </div>
        <div class="form-group">
          <label for="">Bis</label>
          <input
            v-model="date_box_end"
            type="date"
            class="inputs date"
            @change="flexDateFilter()"
          />
        </div>
      </div>
    </div>

    <div v-if="is_ready" class="report-container printable">
      <div class="report-header-2">
        <div>
          <h2>{{ title }}</h2>
          <p class="report-period">Zeitraum: {{ selectedPeriod }}</p>
        </div>
      </div>
      <!-- Summary Cards -->
      <div class="report-summary-cards">
        <div class="report-summary-card">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <p class="card-label">Aktive Kunden</p>
            <h3 class="card-value">{{ reports.length }}</h3>
            <p class="card-detail">Im Zeitraum {{ selectedPeriod }}</p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <p class="card-label">Ø Gesamtumsatz</p>
            <h3 class="card-value">{{ formatCurrency(summary.total_revenue) }}</h3>
            <p class="card-detail">Im Zeitraum</p>
          </div>
        </div>

        <div v-if="summary.top_customer" class="report-summary-card">
          <div class="card-icon">🏆</div>
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
          <div class="card-icon">📊</div>
          <div class="card-content">
            <p class="card-label">Umsatz pro Kunde</p>
            <h3 class="card-value">{{ formatCurrency(summary.total_avarage) }}</h3>
            <p class="card-detail">Durchschchnitt</p>
          </div>
        </div>
      </div>

      <!-- Top Customers -->
      <div class="top-customers-section">
        <h3>🏆 Kunden</h3>
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

      <!-- Detailed Table -->
      <div class="table-section">
        <h3>Detaillierte Kundenübersicht</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>Kunde</th>
              <th class="center">Rechnungen</th>
              <th>Gesamtumsatz</th>
              <th>Bezahlt</th>
              <th>Teilweise bezahlt</th>
              <th>Ausstehend</th>
              <th>Un­be­rfällig</th>
              <th>Letzte Aktivität</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reports" :key="item.id">
              <td>
                <strong>{{ item.company_name || item.full_name }}</strong>
              </td>
              <td>{{ item.invoice_count }}</td>
              <td>{{ formatCurrency(item.invoice_total) }}</td>
              <td>{{ item.paid }}</td>
              <td>{{ item.partially_paid }}</td>
              <td>{{ item.unpaid }}</td>
              <td>{{ item.overdue }}</td>
              <td>{{ item.last_activity }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td><strong>SUMME / DURCHSCHNITT</strong></td>
              <td><strong>30</strong></td>
              <td class="amount"><strong>€39.665,00</strong></td>
              <td class="amount"><strong>€1.322,17</strong></td>
              <td class="amount"><strong>€30.955,90</strong></td>
              <td class="amount"><strong>€8.709,10</strong></td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomersReport',
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
      console.log('result', result)
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
      console.log('summary', this.summary)
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
