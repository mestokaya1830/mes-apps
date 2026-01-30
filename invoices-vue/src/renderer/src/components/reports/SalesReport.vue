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
          <label>Von</label>
          <input
            ref="date_box_start"
            v-model="date_box_start"
            type="date"
            class="inputs date"
            @change="flexDateFilter"
          />
        </div>
        <div class="form-group">
          <label>Bis</label>
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

    <!-- REPORT STARTS -->
    <div v-if="is_ready" class="printable">
      <div class="report-header-2">
        <div>
          <h2>{{ title }}</h2>
          <p class="report-period">Zeitraum: {{ selectedPeriod }}</p>
        </div>
        <!-- <button class="btn-export" onclick="window.print()">🖨️ Drucken</button> -->
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <p class="card-label">Gesamtumsatz</p>
            <h3 class="card-value">{{ formatCurrency(all.totalAmount) }}</h3>
            <p class="card-detail">{{ all.totalCount }} Rechnungen</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <p class="card-label">Bezahlt</p>
            <h3 class="card-value">{{ formatCurrency(allPaid.totalAmount) }}</h3>
            <p class="card-detail">
              {{ allPaid.totalCount }} Rechnungen ({{ allPaid.percentage }}%)
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">⏳</div>
          <div class="card-content">
            <p class="card-label">Ausstehend</p>
            <h3 class="card-value">{{ formatCurrency(allUnpaid.totalAmount) }}</h3>
            <p class="card-detail">
              {{ allUnpaid.totalCount }} Rechnungen ({{ allUnpaid.percentage }}%)
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <p class="card-label">Durchschnitt pro Rechnung</p>
            <h3 class="card-value">{{ formatCurrency(average.averagePerInvoice) }}</h3>
            <p class="card-detail">Ø Wert {{ average.totalCount }}</p>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <InvoiceChart :chartData="summary" />

      <!-- Tax Breakdown -->
      <div class="tax-breakdown">
        <h3>MwSt-Aufschlüsselung</h3>
        <table class="tax-table">
          <thead>
            <tr>
              <th>MwSt-Satz</th>
              <th>Nettobetrag</th>
              <th>MwSt-Betrag</th>
              <th>Bruttobetrag</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in taxBreakdown" :key="item.rate">
              <td>{{ item.rate }}%</td>
              <td class="amount">{{ formatCurrency(item.net) }}</td>
              <td class="amount">{{ formatCurrency(item.tax) }}</td>
              <td class="amount">{{ formatCurrency(item.gross) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td><strong>SUMME</strong></td>
              <td class="amount">
                <strong>{{ formatCurrency(totalNet) }}</strong>
              </td>
              <td class="amount">
                <strong>{{ formatCurrency(totalTax) }}</strong>
              </td>
              <td class="amount">
                <strong>{{ formatCurrency(totalGross) }}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceChart from '../chart/InvoiceChart.vue'
export default {
  name: 'SalesReport',
  components: {
    InvoiceChart
  },
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
      title: 'Umsatzbericht',
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
    all() {
      if (!this.reports) return { totalAmount: 0, totalCount: 0 }
      const totalAmount = this.reports.reduce((sum, item) => sum + item.gross_total, 0)
      const totalCount = this.reports.length
      return { totalAmount, totalCount }
    },
    allPaid() {
      if (!this.reports || this.reports.length === 0)
        return { totalAmount: 0, totalCount: 0, percentage: 0 }

      const totalAmount = this.reports.reduce((sum, item) => sum + item.gross_total, 0)
      const paidItems = this.reports.filter((item) => item.payment_status === 'paid')
      const paidAmount = paidItems.reduce((sum, item) => sum + item.gross_total, 0)
      const paidCount = paidItems.length

      return {
        totalAmount: paidAmount,
        totalCount: paidCount,
        percentage: totalAmount ? Math.round((paidAmount / totalAmount) * 100) : 0
      }
    },

    allUnpaid() {
      if (!this.reports || this.reports.length === 0)
        return { totalAmount: 0, totalCount: 0, percentage: 0 }

      const totalAmount = this.reports.reduce((sum, item) => sum + item.gross_total, 0)
      const unpaidItems = this.reports.filter((item) => item.payment_status === 'unpaid')
      const unpaidAmount = unpaidItems.reduce((sum, item) => sum + item.gross_total, 0)
      const unpaidCount = unpaidItems.length

      return {
        totalAmount: unpaidAmount,
        totalCount: unpaidCount,
        percentage: totalAmount ? Math.round((unpaidAmount / totalAmount) * 100) : 0
      }
    },
    average() {
      if (!this.reports || this.reports.length === 0)
        return { totalAmount: 0, totalCount: 0, averagePerInvoice: 0 }

      const totalAmount = this.reports.reduce((sum, item) => sum + item.gross_total, 0)
      const totalCount = this.reports.length
      const averagePerInvoice = totalCount ? totalAmount / totalCount : 0

      return {
        totalAmount,
        totalCount,
        averagePerInvoice
      }
    },
    taxBreakdown() {
      if (!this.reports || this.reports.length === 0) return []
      const taxMap = {}
      this.reports.forEach((item) => {
        item.positions.forEach((pos) => {
          const rate = pos.vat
          const gross = Number(pos.unit_total)
          const net = gross / (1 + rate / 100)
          const tax = gross - net

          if (!taxMap[rate]) {
            taxMap[rate] = { net: 0, tax: 0, gross: 0 }
          }

          taxMap[rate].net += net
          taxMap[rate].tax += tax
          taxMap[rate].gross += gross
        })
      })

      return Object.keys(taxMap).map((rate) => ({
        rate: rate,
        net: taxMap[rate].net,
        tax: taxMap[rate].tax,
        gross: taxMap[rate].gross
      }))
    },
    totalNet() {
      return this.taxBreakdown.reduce((sum, item) => sum + item.net, 0)
    },
    totalTax() {
      return this.taxBreakdown.reduce((sum, item) => sum + item.tax, 0)
    },
    totalGross() {
      console.log(this.taxBreakdown.reduce((sum, item) => sum + item.gross, 0))
      return this.taxBreakdown.reduce((sum, item) => sum + item.gross, 0)
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
      const result = await window.api.reportSales(data)
      if (!result.success) return
      this.reports = result.rows.map((item) => {
        return {
          ...item,
          positions: JSON.parse(item.positions)
        }
      })

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      this.is_ready = true
      console.log(result)
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