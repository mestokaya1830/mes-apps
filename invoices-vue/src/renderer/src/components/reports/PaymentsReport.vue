<template>
  <div>
    <div class="editor-panel">
      <h3 class="editor-hedaer">
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
          <div class="summary-cards">
            <!-- PÜNKTLICH BEZAHLT -->
            <div class="summary-card">
              <div class="card-icon">✅</div>
              <div class="card-content">
                <p class="card-label">Pünktlich Bezahlt</p>
                <h3 class="card-value">
                  {{ formatCurrency(invoiceStats.paid.amount) }}
                </h3>
                <p class="card-detail">
                  {{ invoiceStats.paid.count }} Rechnungen ({{ invoiceStats.paid.percent }}%)
                </p>
              </div>
            </div>

            <!-- FÄLLIG (AUSSTEHEND) -->
            <div class="summary-card">
              <div class="card-icon">⏳</div>
              <div class="card-content">
                <p class="card-label">Ausstehend (fällig)</p>
                <h3 class="card-value">
                  {{ formatCurrency(invoiceStats.pending.amount) }}
                </h3>
                <p class="card-detail">
                  {{ invoiceStats.pending.count }} Rechnungen ({{ invoiceStats.pending.percent }}%)
                </p>
              </div>
            </div>

            <!-- ÜBERFÄLLIG -->
            <div class="summary-card">
              <div class="card-icon">⚠️</div>
              <div class="card-content">
                <p class="card-label">Überfällig</p>
                <h3 class="card-value">
                  {{ formatCurrency(invoiceStats.overdue.amount) }}
                </h3>
                <p class="card-detail">
                  {{ invoiceStats.overdue.count }} Rechnungen ({{ invoiceStats.overdue.percent }}%)
                </p>
              </div>
            </div>

            <!-- Ø ZAHLUNGSZIEL -->
            <div class="summary-card">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <p class="card-label">Zahlungsziel Ø</p>
                <h3 class="card-value">{{ invoiceStats.averageDays }} Tage</h3>
                <p class="card-detail">Durchschnitt</p>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h1>Chart</h1>
          </div>
        </div>

        <!-- Donut Chart & Aging -->
        <div class="chart-row">
          <div class="donut-section">
            <h3>Zahlungsverteilung</h3>
            <div class="donut-container">
              <div class="donut-chart">
                <div class="donut-ring">
                  <div class="donut-hole">
                    <div class="donut-total">{{ paymentStats.totalInvoices }}</div>
                    <div class="donut-label">Rechnungen</div>
                  </div>
                </div>
              </div>
              <div class="donut-legend">
                <div class="legend-item">
                  <div class="legend-color paid"></div>
                  <div class="legend-text">
                    <div class="legend-title">Bezahlt</div>
                    <div class="legend-value">{{ formatCurrency(paymentStats.paid.amount) }}</div>
                    <div class="legend-detail">
                      {{ paymentStats.paid.count }} Rg. ({{ paymentStats.paid.percent }}%)
                    </div>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color pending"></div>
                  <div class="legend-text">
                    <div class="legend-title">Ausstehend</div>
                    <div class="legend-value">
                      {{ formatCurrency(paymentStats.pending.amount) }}
                    </div>
                    <div class="legend-detail">
                      {{ paymentStats.pending.count }} Rg. ({{ paymentStats.pending.percent }}%)
                    </div>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color overdue"></div>
                  <div class="legend-text">
                    <div class="legend-title">Überfällig</div>
                    <div class="legend-value">
                      {{ formatCurrency(paymentStats.overdue.amount) }}
                    </div>
                    <div class="legend-detail">
                      {{ paymentStats.overdue.count }} Rg. ({{ paymentStats.overdue.percent }}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="aging-section">
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
                <tr v-for="row in agingStats" :key="row.label">
                  <td>
                    <strong>{{ row.label }}</strong>
                  </td>
                  <td class="amount">{{ formatCurrency(row.amount) }}</td>
                  <td>{{ row.count }}</td>
                  <td class="percent">{{ row.percent }}%</td>
                  <td>
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :class="{
                          warning: row.percent > 10 && row.percent < 50,
                          danger: row.percent >= 50
                        }"
                        :style="{ width: row.percent + '%' }"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detailed Table -->
        <div class="table-section">
          <h3>Detaillierte Übersicht</h3>

          <div class="filter-tabs">
            <button class="filter-tab active">Alle {{ filterCounts.all }}</button>
            <button class="filter-tab">Bezahlt ({{ filterCounts.paid }})</button>
            <button class="filter-tab">Ausstehend ({{ filterCounts.pending }})</button>
            <button class="filter-tab">Überfällig ({{ filterCounts.overdue }})</button>
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
  </div>
</template>
<script>
export default {
  name: 'PaymentsReport',
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Zahlungsstatus',
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
  computed: {
    invoiceStats() {
      if (!this.reports) return null

      const today = new Date().toISOString().slice(0, 10)

      let paidTotal = 0
      let paidCount = 0

      let pendingTotal = 0
      let pendingCount = 0

      let overdueTotal = 0
      let overdueCount = 0

      let paymentDays = []

      this.reports.forEach((item) => {
        const pay = item.payment
        const total = Number(item.summary.total)
        const outstanding = Number(item.summary.outstanding)

        if (pay.is_paid) {
          paidTotal += total
          paidCount++
        } else if (pay.payment_date >= today) {
          pendingTotal += outstanding
          pendingCount++
        } else {
          overdueTotal += outstanding
          overdueCount++
        }

        paymentDays.push(pay.payment_terms)
      })

      const totalInvoices = this.reports.length
      const avgDays =
        paymentDays.length > 0
          ? Math.round(paymentDays.reduce((a, b) => a + b, 0) / paymentDays.length)
          : 0

      return {
        paid: {
          amount: paidTotal,
          count: paidCount,
          percent: Math.round((paidCount / totalInvoices) * 100)
        },
        pending: {
          amount: pendingTotal,
          count: pendingCount,
          percent: Math.round((pendingCount / totalInvoices) * 100)
        },
        overdue: {
          amount: overdueTotal,
          count: overdueCount,
          percent: Math.round((overdueCount / totalInvoices) * 100)
        },
        averageDays: avgDays
      }
    },
    paymentStats() {
      if (!this.reports) return null

      const today = new Date().toISOString().slice(0, 10)

      const paid = []
      const pending = []
      const overdue = []

      this.reports.forEach((inv) => {
        const pay = inv.payment
        const total = Number(inv.summary.total)
        const paidAmount = Number(inv.summary.paid_amount)
        const outstanding = total - paidAmount

        if (pay.is_paid) {
          paid.push({ total, paidAmount, outstanding })
        } else {
          if (pay.payment_date < today) {
            overdue.push({ total, paidAmount, outstanding })
          } else {
            pending.push({ total, paidAmount, outstanding })
          }
        }
      })

      const sum = (arr) => arr.reduce((a, b) => a + b.total, 0)

      const totalInvoices = this.reports.length
      const totalAmount = sum(paid) + sum(pending) + sum(overdue)

      return {
        paid: {
          count: paid.length,
          amount: sum(paid),
          percent: totalInvoices ? Math.round((paid.length / totalInvoices) * 100) : 0
        },
        pending: {
          count: pending.length,
          amount: sum(pending),
          percent: totalInvoices ? Math.round((pending.length / totalInvoices) * 100) : 0
        },
        overdue: {
          count: overdue.length,
          amount: sum(overdue),
          percent: totalInvoices ? Math.round((overdue.length / totalInvoices) * 100) : 0
        },
        totalInvoices,
        totalAmount
      }
    },
    agingStats() {
      if (!this.reports) return []
      const totalInvoices = this.reports.length

      const ranges = [
        { label: '0-30 Tage', min: 0, max: 30 },
        { label: '31-60 Tage', min: 31, max: 60 },
        { label: '61-90 Tage', min: 61, max: 90 },
        { label: '> 90 Tage', min: 91, max: 9999 }
      ]

      return ranges.map((r) => {
        const filtered = this.reports.filter((inv) => {
          const paymentDate = new Date(inv.payment.payment_date)
          const invoiceDate = new Date(inv.date)
          const diffDays = Math.floor((paymentDate - invoiceDate) / (1000 * 60 * 60 * 24))
          return diffDays >= r.min && diffDays <= r.max
        })

        const amount = filtered.reduce((sum, inv) => sum + Number(inv.summary.total), 0)
        const count = filtered.length
        const percent = totalInvoices ? Math.round((count / totalInvoices) * 100) : 0

        return { label: r.label, amount, count, percent }
      })
    },
    filterCounts() {
      if (!this.reports) return { all: 0, paid: 0, pending: 0, overdue: 0 }

      const today = new Date().toISOString().slice(0, 10)

      let paid = 0,
        pending = 0,
        overdue = 0

      this.reports.forEach((inv) => {
        const pay = inv.payment
        if (pay.is_paid) {
          paid++
        } else if (pay.payment_date < today) {
          overdue++
        } else {
          pending++
        }
      })

      return {
        all: this.reports.length,
        paid,
        pending,
        overdue
      }
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
        this.reports.forEach((report) => {
          this.reportSummary.total += Number(report.summary.total)
          this.reportSummary.paid_amount += Number(report.summary.paid_amount)
          this.reportSummary.outstanding += Number(report.summary.outstanding)
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
