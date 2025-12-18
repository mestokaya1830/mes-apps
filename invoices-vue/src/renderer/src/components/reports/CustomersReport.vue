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
            <h2>{{ title }}</h2>
            <p class="report-period">Zeitraum: {{ period.start }} - {{ period.end }}</p>
          </div>
          <button class="btn-export" @click="printReport">🖨️ Drucken</button>
        </div>

        <div class="summary-section">
          <!-- Summary Cards -->
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-icon">👥</div>
              <div class="card-content">
                <p class="card-label">Aktive Kunden</p>
                <h3 class="card-value">{{ reports.length }}</h3>
                <p class="card-detail">Im Zeitraum</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">💰</div>
              <div class="card-content">
                <p class="card-label">Ø Umsatz pro Kunde</p>
                <h3 class="card-value">{{ formatCurrency(reportSummary.average) }}</h3>
                <p class="card-detail">Durchschnitt</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">🏆</div>
              <div class="card-content">
                <p class="card-label">Top Kunde</p>
                <h3 class="card-value">{{ formatCurrency(reportSummary.top_customer) }}</h3>
                <p class="card-detail">{{ reportSummary.top_customer_name }}</p>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h1>Chart</h1>
          </div>
        </div>

        <!-- Table -->
        <div class="top-customers-section">
          <h3>🏆 Top 10 Kunden nach Umsatz</h3>
          <div v-for="(item, index) in reports" :key="item.id" class="top-customer-list">
            <div class="top-customer-item">
              <div class="customer-rank gold">{{ index }}</div>
              <div class="customer-info">
                <div class="customer-name">{{ item.customer.company_name }}</div>
                <div class="customer-detail">
                  Kunde seit: {{ formatDate(period.start) }} <br />
                  Letzte Rechnung: {{ formatDate(item.date) }}
                </div>
                <div class="customer-bar">
                  <div class="customer-bar-fill" style="width: 100%"></div>
                </div>
              </div>
              <div class="customer-revenue">
                <div class="revenue-amount">{{ formatCurrency(item.summary.total) }}</div>
                <div class="revenue-count">6 Rechnungen</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CustomersReport',
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Kundenbezogener Bericht',
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
            terms: JSON.parse(row.terms),
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
      if (this.reports) {
        this.reportSummary = {
          total: 0,
          paid_amount: 0,
          outstanding: 0,
          average: 0,
          top_customer: 0
        }
        this.reports.forEach((report) => {
          this.reportSummary.total += Number(report.summary.total)
          this.reportSummary.paid_amount += Number(report.summary.paid_amount)
          this.reportSummary.outstanding += Number(report.summary.outstanding)
        })
        this.reportSummary.average = this.reportSummary.total / this.reports.length
        this.reportSummary.top_customer = Math.max(...this.reports.map((r) => r.summary.total))
        this.reportSummary.top_customer_name = this.reports.find(
          (item) => Number(item.summary.total) === this.reportSummary.top_customer
        )?.customer.company_name
      }
      this.reportsLength = this.reports.length
    },
    async printReport() {
      window.print()
    }
  }
}
</script>
