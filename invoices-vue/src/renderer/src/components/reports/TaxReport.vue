<template>
  <div>
    <!-- Tarih Filtreleri -->
    <div class="filter-section">
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
            <label> Von</label>
            <div class="date-wrapper">
              <i class="bi bi-calendar3 calendar-icon"></i>
              <input
                ref="date_box_start"
                v-model="date_box_start"
                type="date"
                class="inputs date"
                @change="flexDateFilter"
              />
            </div>
          </div>
          <div class="form-group">
            <label> Bis</label>
            <div class="date-wrapper">
              <i class="bi bi-calendar3 calendar-icon"></i>
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
      </div>
    </div>

    <div v-if="is_ready" class="printable">
      <div class="report-header-2">
        <h2><i class="bi bi-file-earmark-bar-graph me-2"></i>{{ title }}</h2>
        <p class="report-period">
          <i class="bi bi-clock me-1 icons"></i> Zeitraum: {{ selectedPeriod }}
        </p>
      </div>

      <!-- KDV Kartları -->
      <div class="report-summary-cards">
        <div
          v-for="(vatData, vatRate) in dynamicVatSummary"
          :key="vatRate"
          class="report-summary-card"
        >
          <div class="card-content">
            <h3 class="card-value">{{ vatRate }} % MwSt</h3>
            <label class="card-detail">{{ vatData.count }} Positionen</label>
            <h3 class="card-label">{{ formatCurrency(vatData.gross) }}</h3>
          </div>
        </div>
      </div>

      <!-- tax chart -->
      <TaxChart :chartData="reports" />

      <!-- Vergi Oranları Tablosu -->
      <div class="vat-summary mt-4">
        <h3><i class="bi bi-percent icons"></i>Umsatzsteuer-Zusammenfassung</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>MwSt.-Satz</th>
              <th class="text-right">Anzahl Positionen</th>
              <th class="text-right">Nettobetrag</th>
              <th class="text-right">MwSt.-Betrag</th>
              <th class="text-right">Bruttobetrag</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vatData, vatRate) in dynamicVatSummary" :key="vatRate">
              <td>
                <strong>{{ vatRate }}% MwSt.</strong>
                <span v-if="vatRate == 0" class="text-muted"> (Export/Befreit)</span>
              </td>
              <td class="text-right">{{ vatData.count }}</td>
              <td class="text-right">{{ formatCurrency(vatData.net) }}</td>
              <td class="text-right">{{ formatCurrency(vatData.vat) }}</td>
              <td class="text-right">{{ formatCurrency(vatData.gross) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td><strong>GESAMT</strong></td>
              <td class="text-right">
                <strong>{{ totalVatSummary.totalCount }}</strong>
              </td>
              <td class="text-right">
                <strong>{{ formatCurrency(totalVatSummary.totalNet) }}</strong>
              </td>
              <td class="text-right">
                <strong>{{ formatCurrency(totalVatSummary.totalVat) }}</strong>
              </td>
              <td class="text-right">
                <strong>{{ formatCurrency(totalVatSummary.totalGross) }}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <ReportActions reportName="Umsatzsteuer-Bericht" :period="period"/>
  </div>
</template>

<script>
import ReportActions from '../preview/ReportActions.vue';
import TaxChart from '../chart/TaxChart.vue';
export default {
  name: 'VatReport',
  components: { TaxChart, ReportActions },
  inject: ['formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Umsatzsteuer-Bericht',
      reports: [],
      date_range: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false
    }
  },
  computed: {
    selectedPeriod() {
      if (!this.period.start || !this.period.end) return ''
      return this.formatDate(this.period.start) + ' - ' + this.formatDate(this.period.end)
    },

    dynamicVatSummary() {
      const vatMap = {}
      this.reports.forEach((invoice) => {
        let positions = []
        try {
          positions = JSON.parse(invoice.positions)
        } catch (err) {
          positions = []
        }

        positions.forEach((position) => {
          const vatRate = Number(position.vat || 0)
          const quantity = Number(position.quantity || 1)
          const price = Number(position.price || 0)
          const discount = Number(position.discount || 0)

          const net = price * quantity - discount
          const vat = (net * vatRate) / 100
          const gross = net + vat

          if (!vatMap[vatRate]) {
            vatMap[vatRate] = { count: 0, net: 0, vat: 0, gross: 0 }
          }

          vatMap[vatRate].count++
          vatMap[vatRate].net += net
          vatMap[vatRate].vat += vat
          vatMap[vatRate].gross += gross
        })
      })

      return Object.keys(vatMap)
        .sort((a, b) => Number(b) - Number(a))
        .reduce((acc, key) => {
          acc[key] = vatMap[key]
          return acc
        }, {})
    },

    totalVatSummary() {
      const totals = { totalCount: 0, totalNet: 0, totalVat: 0, totalGross: 0 }
      Object.values(this.dynamicVatSummary).forEach((v) => {
        totals.totalCount += v.count
        totals.totalNet += v.net
        totals.totalVat += v.vat
        totals.totalGross += v.gross
      })
      return totals
    }
  },
  methods: {
    async rangeDateFilter() {
      if (!this.date_range) return
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth() - this.date_range, 1)
      const endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      this.date_box_start = startDate.toISOString().slice(0, 10)
      this.date_box_end = endDate.toISOString().slice(0, 10)
      this.getReport()
    },

    flexDateFilter() {
      if (!this.date_box_start || !this.date_box_end) return
      if (this.date_box_start > this.date_box_end) {
        this.date_box_end = ''
        return
      }
      this.getReport()
    },

    async getReport() {
      if (!this.date_box_start || !this.date_box_end) return

      const data = { start: this.date_box_start, end: this.date_box_end }
      const result = await window.api.reportInvoices(data)
      if (!result.success) return

      this.reports = result.rows
      this.period = { start: this.date_box_start, end: this.date_box_end }
      this.is_ready = true
    }
  }
}
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.vat-rate {
  font-size: 2.2rem;
  font-weight: bold;
}


.card-body {
  text-align: left;
}

.gross-amount {
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.position-count {
  font-size: 0.95rem;
  opacity: 0.85;
}
</style>
