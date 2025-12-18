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
      period: {},
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
