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
          <label><i class="bi bi-calendar-event me-1"></i> Von</label>
          <input
            ref="date_box_start"
            v-model="date_box_start"
            type="date"
            class="inputs date"
            @change="flexDateFilter"
          />
        </div>
        <div class="form-group">
          <label><i class="bi bi-calendar-check me-1"></i> Bis</label>
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
          <h2><i class="bi bi-file-earmark-spreadsheet-fill me-1 icons"></i>{{ title }}</h2>
          <p class="report-period"><i class="bi bi-clock me-1"></i> Zeitraum: {{ selectedPeriod }}</p>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon text-primary"><i class="bi bi-wallet2"></i></div>
          <div class="card-content">
            <p class="card-label">Gesamte MwSt</p>
            <h3 class="card-value">{{ formatCurrency(totalTax) }}</h3>
            <p class="card-detail">Alle Steuersätze</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon text-info"><i class="bi bi-percent"></i></div>
          <div class="card-content">
            <p class="card-label">MwSt 19%</p>
            <h3 class="card-value">{{ formatCurrency(totalTax19.totalVat19) }}</h3>
            <p class="card-detail">{{ formatCurrency(totalTax19.totalNet19) }}</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon text-info"><i class="bi bi-percent"></i></div>
          <div class="card-content">
            <p class="card-label">MwSt 7%</p>
            <h3 class="card-value">{{ formatCurrency(totalTax7.totalVat7) }}</h3>
            <p class="card-detail">{{ formatCurrency(totalTax7.totalNet7) }}</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon text-success"><i class="bi bi-shield-check"></i></div>
          <div class="card-content">
            <p class="card-label">Steuerfrei</p>
            <h3 class="card-value">{{ formatCurrency(totalTaxFree.totalVatFree) }}</h3>
            <p class="card-detail">{{ formatCurrency(totalTaxFree.totalVatFree) }}</p>
          </div>
        </div>
      </div>

      <InvoiceChart :chartData="summary" />

      <div class="ustva-section">
        <h3><i class="bi bi-clipboard-data me-1 icons"></i>Umsatzsteuervoranmeldung (UStVA) Zusammenfassung</h3>

        <div class="ustva-alert alert alert-info d-flex align-items-center">
          <i class="bi bi-info-circle-fill me-1 icons"></i>
          <div class="ustva-alert-text">
            Dies ist eine vereinfachte Zusammenfassung. Bitte konsultieren Sie Ihren
            Steuerberater für die vollständige UStVA.
          </div>
        </div>

        <table class="ustva-table">
          ...
        </table>
      </div>

      <div class="table-section mt-4">
        <h3><i class="bi bi-list-columns-reverse me-1 icons"></i>Detaillierte Rechnungsübersicht nach MwSt-Satz</h3>
        <table class="report-table">
          ...
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceChart from '../chart/InvoiceChart.vue'
export default {
  name: 'TaxReport',
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
      title: 'Mehrwertsteuer (MwSt) Bericht',
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
    totalTax() {
      if (!this.reports) return 0
      return this.reports.reduce((sum, item) => sum + item.vat_total, 0)
    },
    totalTax19() {
      if (!Array.isArray(this.reports)) {
        return { totalVat19: 0, totalNet19: 0 }
      }

      return this.reports.reduce(
        (acc, item) => {
          if (!Array.isArray(item.positions)) return acc

          item.positions.forEach((pos) => {
            if (Number(pos.vat) === 19) {
              acc.totalVat19 += Number(pos.vat_unit || 0) * Number(pos.quantity || 0)
              acc.totalNet19 += Number(pos.price * pos.quantity || 0)
            }
          })

          return acc
        },
        { totalVat19: 0, totalNet19: 0 }
      )
    },
    totalTax7() {
      if (!Array.isArray(this.reports)) {
        return { totalVat7: 0, totalNet7: 0 }
      }

      return this.reports.reduce(
        (acc, item) => {
          if (!Array.isArray(item.positions)) return acc

          item.positions.forEach((pos) => {
            if (Number(pos.vat) === 7) {
              acc.totalVat7 += Number(pos.vat_unit || 0) * Number(pos.quantity || 0)
              acc.totalNet7 += Number(pos.price * pos.quantity || 0)
            }
          })

          return acc
        },
        { totalVat7: 0 }
      )
    },
    totalTaxFree() {
      if (!Array.isArray(this.reports)) {
        return { totalVatFree: 0, totalNetFree: 0 }
      }

      return this.reports.reduce(
        (acc, item) => {
          if (!Array.isArray(item.positions)) return acc

          item.positions.forEach((pos) => {
            if (Number(pos.vat) === 0) {
              acc.totalVatFree += Number(pos.price * pos.quantity || 0)
            }
          })

          return acc
        },
        { totalVatFree: 0 }
      )
    },
    reportDetails() {
      if (!Array.isArray(this.reports)) return []

      return this.reports.flatMap((report) => {
        if (!Array.isArray(report.positions)) return []

        return report.positions
          .filter((item) => item && item.unit_total != null && item.vat != null)
          .map((item) => {
            const baseAmount = Number(item.price * item.quantity) || 0
            const vat = Number(item.vat) || 0

            return {
              id: item.id,
              description: item.description || '-',
              vat,
              baseAmount,
              taxAmount: (baseAmount * vat) / 100
            }
          })
      })
    },

    totalTaxAmount() {
      return this.reportDetails.reduce((sum, item) => sum + (item.taxAmount || 0), 0)
    },
    reportList() {
      if (!Array.isArray(this.reports)) return []

      return this.reports.map((item) => {
        const vatRate = item.positions?.[0]?.vat ?? 0

        const netAmount = Number(item.net_total) || 0
        const vatAmount = Number(item.vat_total) || 0
        const grossAmount = Number(item.gross_total) || 0

        // let customerName = '-'
        // try {
        //   customerName = item.customer ? JSON.parse(item.customer).company_name : '-'
        // } catch (error) {
        //   console.log(error)
        // }

        return {
          id: item.id,
          date: item.date,
          customer_id: item.customer_id,
          vatRate,
          netAmount,
          vatAmount,
          grossAmount,
          paymentStatus: item.payment_status,
          paidAt: item.paid_at
        }
      })
    },

    totalVatAmount() {
      return this.detailedVatReport.reduce((sum, row) => sum + row.vatAmount, 0)
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
      const result = await window.api.reportTaxs(data)
      if (!result.success) return
      this.reports = result.rows.map((item) => ({
        ...item,
        positions: JSON.parse(item.positions || '[]')
      }))

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      this.is_ready = true
      console.log(this.reports)
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

