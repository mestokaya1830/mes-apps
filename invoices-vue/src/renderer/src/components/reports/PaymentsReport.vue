<template>
  <div>
    <div class="editor-panel">
      <h1>
        {{ title }}
        <h2 v-if="reportsLength">{{ reportsLength }}</h2>
      </h1>
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
      title: 'Zahlungsstatus Bericht',
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 24px;
  border-radius: 12px;
  color: white;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-card:nth-child(2) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.summary-card:nth-child(3) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
  margin-top: 30px;
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

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.overdue {
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
