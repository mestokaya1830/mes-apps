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
            <label>Von</label>
            <input v-model="date_box_start" type="date" class="form-input" @change="dateFilter" />
          </div>
          <div class="form-group">
            <label>Bis</label>
            <input v-model="date_box_end" type="date" class="form-input" @change="dateFilter" />
          </div>
        </div>
      </div>

      <div v-if="is_ready" class="report-container printable">
        <!-- Header -->
        <div class="report-header">
          <div>
            <p class="report-period">Zeitraum: {{ period.start }} - {{ period.end }}</p>
          </div>
          <button class="btn-export" @click="printReport">🖨️ Drucken</button>
        </div>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-icon">💶</div>
              <div class="card-content">
                <p class="card-label">Gesamte MwSt</p>
                <h3 class="card-value">{{ formatCurrency(totalVat) }}</h3>
              </div>
            </div>

            <div class="summary-card" v-for="rate in [19, 7, 0]" :key="rate">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <p class="card-label">MwSt {{ rate }}%</p>
                <h3 class="card-value">{{ formatCurrency(vatByRate[rate]) }}</h3>
                <p class="card-detail">{{ formatCurrency(netByRate[rate]) }} Netto</p>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon">⚡</div>
              <div class="card-content">
                <p class="card-label">An Finanzamt zu zahlen</p>
                <h3 class="card-value">{{ formatCurrency(totalVat) }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Tax Rate Detail -->
        <div class="tax-rate-grid">
          <div class="tax-rate-box" v-for="rate in [19, 7, 0]" :key="rate">
            <div class="tax-rate-header">
              <div class="tax-rate-title">Steuersatz</div>
              <div class="tax-rate-percent">{{ rate }}%</div>
            </div>

            <div class="tax-rate-item">
              <div class="tax-rate-label">Nettobetrag</div>
              <div class="tax-rate-value">{{ formatCurrency(netByRate[rate]) }}</div>
            </div>
            <div class="tax-rate-item">
              <div class="tax-rate-label">MwSt-Betrag</div>
              <div class="tax-rate-value">{{ formatCurrency(vatByRate[rate]) }}</div>
            </div>
            <div class="tax-rate-item">
              <div class="tax-rate-label">Bruttobetrag</div>
              <div class="tax-rate-value">
                {{ formatCurrency(netByRate[rate] + vatByRate[rate]) }}
              </div>
            </div>
            <div class="tax-rate-item">
              <div class="tax-rate-label">Anzahl Rechnungen</div>
              <div class="tax-rate-value">{{ countByRate[rate] }}</div>
            </div>
          </div>
        </div>

        <!-- UStVA -->
        <div class="ustva-section">
          <h3>📋 Umsatzsteuervoranmeldung (UStVA)</h3>

          <table class="ustva-table">
            <thead>
              <tr>
                <th>Kennzahl</th>
                <th>Beschreibung</th>
                <th>Bemessungsgrundlage</th>
                <th>Steuersatz</th>
                <th>Steuerbetrag</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kz. 81</td>
                <td>Steuerbare Umsätze (19%)</td>
                <td>{{ formatCurrency(netByRate[19]) }}</td>
                <td>19%</td>
                <td>{{ formatCurrency(vatByRate[19]) }}</td>
              </tr>

              <tr>
                <td>Kz. 86</td>
                <td>Steuerbare Umsätze (7%)</td>
                <td>{{ formatCurrency(netByRate[7]) }}</td>
                <td>7%</td>
                <td>{{ formatCurrency(vatByRate[7]) }}</td>
              </tr>

              <tr>
                <td>Kz. 91</td>
                <td>Steuerfreie Umsätze</td>
                <td>{{ formatCurrency(netByRate[0]) }}</td>
                <td>0%</td>
                <td>{{ formatCurrency(vatByRate[0]) }}</td>
              </tr>

              <tr class="ustva-total-row">
                <td colspan="4"><strong>Summe Umsatzsteuer (Kz. 83)</strong></td>
                <td>
                  <strong>{{ formatCurrency(totalVat) }}</strong>
                </td>
              </tr>

              <tr class="ustva-payable">
                <td colspan="4"><strong>Zahllast</strong></td>
                <td>
                  <strong>{{ formatCurrency(totalVat) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
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
</template>

<script>
export default {
  name: 'TaxReport',
  inject: ['formatCurrency', 'formatDate'],

  data() {
    return {
      title: 'Mehrwertsteuer (MwSt) Bericht',
      reports: [],
      report_static_date: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false,
      vatByRate: { 19: 0, 7: 0, 0: 0 },
      netByRate: { 19: 0, 7: 0, 0: 0 },
      countByRate: { 19: 0, 7: 0, 0: 0 },
      reportsLength: 0,
      reportSummary: null
    }
  },

  computed: {
    totalVat() {
      return this.vatByRate[19] + this.vatByRate[7] + this.vatByRate[0]
    }
  },

  methods: {
    getVatRate(r) {
      const net = Number(r.summary.subtotal)
      const vat = Number(r.summary.vat_amount)
      if (net <= 0) return 0
      return Math.round((vat / net) * 100)
    },

    formatInvoiceId(id) {
      const y = new Date().getFullYear()
      return `RE-${y}-${String(id).padStart(5, '0')}`
    },

    calculateSummary() {
      this.vatByRate = { 19: 0, 7: 0, 0: 0 }
      this.netByRate = { 19: 0, 7: 0, 0: 0 }
      this.countByRate = { 19: 0, 7: 0, 0: 0 }

      this.reports.forEach((r) => {
        const rate = this.getVatRate(r)
        const net = Number(r.summary.subtotal)
        const vat = Number(r.summary.vat_amount)

        let rateGroup = 0
        if (rate >= 18) rateGroup = 19
        else if (rate >= 6) rateGroup = 7
        else rateGroup = 0

        this.netByRate[rateGroup] += net
        this.vatByRate[rateGroup] += vat
        this.countByRate[rateGroup]++
      })
      this.reportsLength = this.reports.length
    },

    async getStaticDate() {
      if (!this.report_static_date) return
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
        this.reports = result.rows.map((item) => ({
          ...item,
          customer: JSON.parse(item.customer),
          payment: JSON.parse(item.payment),
          positions: JSON.parse(item.positions),
          summary: JSON.parse(item.summary),
          tax_options: JSON.parse(item.tax_options)
        }))
        this.period.start = startDate.toISOString().slice(0, 10)
        this.period.end = endDate.toISOString().slice(0, 10)
        this.is_ready = true
        this.calculateSummary()
        console.log(this.reports)
      }
    },

    async dateFilter() {
      if (!this.date_box_start || !this.date_box_end) return
      const result = await window.api.documentReport(
        'invoices',
        this.date_box_start,
        this.date_box_end
      )
      if (result.success) {
        this.reports = result.rows.map((r) => ({
          ...r,
          customer: JSON.parse(r.customer),
          payment: JSON.parse(r.payment),
          positions: JSON.parse(r.positions),
          summary: JSON.parse(r.summary),
          tax_options: JSON.parse(r.tax_options)
        }))
        this.period.start = this.date_box_start
        this.period.end = this.date_box_end
        this.is_ready = true
        this.calculateSummary()
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
    printReport() {
      window.print()
    }
  }
}
</script>
