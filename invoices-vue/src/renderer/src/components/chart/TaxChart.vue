<template>
  <div class="vat-chart-wrapper">
    <div class="chart-header">
      <h3 class="chart-title"><i class="bi bi-percent me-2"></i>Umsatzsteuer nach Steuersätzen</h3>
    </div>

    <div class="charts-grid">
      <!-- Bar Chart -->
      <div class="chart-card chart-main">
        <canvas ref="barChart"></canvas>
      </div>

      <!-- Donut Chart -->
      <div class="chart-card chart-side">
        <canvas ref="donutChart"></canvas>
      </div>
    </div>

    <!-- KPI Strip -->
    <div class="kpi-strip">
      <div class="kpi-item" v-for="(vatData, vatRate) in vatRatesData" :key="vatRate">
        <span class="kpi-dot" :style="`background:${getVatColor(vatRate)}`"></span>
        <span class="kpi-label">{{ vatRate }}% MwSt.</span>
        <span class="kpi-value">{{ formatEur(vatData.gross) }}</span>
        <span class="kpi-count">{{ vatData.count }} Positionen</span>
      </div>
      <div class="kpi-item kpi-total">
        <span class="kpi-label">Gesamt MwSt.</span>
        <span class="kpi-value">{{ formatEur(totalVat.gross) }}</span>
        <span class="kpi-count">{{ totalVat.count }} Positionen</span>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'VatChart',
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      barChartInstance: null,
      donutChartInstance: null
    }
  },
  computed: {
    vatRatesData() {
      const vatMap = {}
      this.chartData.forEach((invoice) => {
        let positions = []
        try {
          positions = JSON.parse(invoice.positions)
        } catch {
          positions = []
        }

        positions.forEach((pos) => {
          const vatRate = Number(pos.vat || 0)
          const quantity = Number(pos.quantity || 1)
          const price = Number(pos.price || 0)
          const discount = Number(pos.discount || 0)

          const net = price * quantity - discount
          const vat = (net * vatRate) / 100
          const gross = net + vat

          if (!vatMap[vatRate]) vatMap[vatRate] = { count: 0, net: 0, vat: 0, gross: 0 }

          vatMap[vatRate].count++
          vatMap[vatRate].net += net
          vatMap[vatRate].vat += vat
          vatMap[vatRate].gross += gross
        })
      })

      return Object.keys(vatMap)
        .sort((a, b) => b - a)
        .reduce((acc, key) => {
          acc[key] = vatMap[key]
          return acc
        }, {})
    },

    totalVat() {
      return Object.values(this.vatRatesData).reduce(
        (tot, v) => {
          tot.count += v.count
          tot.net += v.net
          tot.vat += v.vat
          tot.gross += v.gross
          return tot
        },
        { count: 0, net: 0, vat: 0, gross: 0 }
      )
    }
  },
  mounted() {
    this.$nextTick(() => this.renderCharts())
  },
  watch: {
    chartData() {
      this.$nextTick(() => this.renderCharts())
    }
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    destroyCharts() {
      this.barChartInstance?.destroy()
      this.donutChartInstance?.destroy()
      this.barChartInstance = null
      this.donutChartInstance = null
    },

    renderCharts() {
      this.destroyCharts()
      this.renderBarChart()
      this.renderDonutChart()
    },

    renderBarChart() {
      const ctx = this.$refs.barChart
      if (!ctx) return
      const rates = Object.keys(this.vatRatesData)
      const labels = rates.map((r) => `${r}%`)
      const netData = rates.map((r) => this.vatRatesData[r].net)
      const vatData = rates.map((r) => this.vatRatesData[r].vat)
      const colors = rates.map((r) => this.getVatColor(r))

      this.barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Netto',
              data: netData,
              backgroundColor: colors.map((c) => c + '99'),
              borderRadius: 5
            },
            { label: 'MwSt.', data: vatData, backgroundColor: colors, borderRadius: 5 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Netto- und MwSt.-Beträge nach Steuersatz',
              font: { size: 14, weight: '600' },
              padding: { bottom: 16 }
            },
            legend: {
              position: 'top',
              labels: { font: { size: 11 }, usePointStyle: true, padding: 12 }
            },
            tooltip: {
              callbacks: { label: (ctx) => `${ctx.dataset.label}: ${this.formatEur(ctx.raw)}` }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 12 } } },
            y: {
              grid: { color: '#f0f0f0' },
              ticks: { font: { size: 11 }, callback: (v) => this.formatEurShort(v) }
            }
          }
        }
      })
    },

    renderDonutChart() {
      const ctx = this.$refs.donutChart
      if (!ctx) return
      const rates = Object.keys(this.vatRatesData)
      const labels = rates.map((r) => `${r}% MwSt.`)
      const data = rates.map((r) => this.vatRatesData[r].gross)
      const colors = rates.map((r) => this.getVatColor(r))

      this.donutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            { data, backgroundColor: colors, borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 11 }, padding: 15, usePointStyle: true }
            },
            title: {
              display: true,
              text: 'Anteil nach Steuersatz',
              font: { size: 13, weight: '600' },
              padding: { bottom: 12 }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const perc = ((ctx.raw / this.totalVat.gross) * 100).toFixed(1)
                  return `${ctx.label}: ${this.formatEur(ctx.raw)} (${perc}%)`
                }
              }
            }
          }
        }
      })
    },

    getVatColor(rate) {
      rate = Number(rate)
      if (rate === 19) return '#6366f1'
      if (rate === 7) return '#8b5cf6'
      if (rate === 0) return '#ec4899'
      const colors = ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4']
      return colors[Math.floor(rate / 5) % colors.length]
    },

    formatEur(v) {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v || 0)
    },
    formatEurShort(v) {
      if (v >= 1e6) return (v / 1e6).toFixed(1) + ' Mio€'
      if (v >= 1e3) return (v / 1e3).toFixed(0) + 'k€'
      return v.toFixed(0) + '€'
    }
  }
}
</script>

<style scoped>
.vat-chart-wrapper {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}
.chart-header {
  margin-bottom: 1.25rem;
}
.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.25rem;
}
.chart-card {
  border-radius: 10px;
  padding: 1.25rem;
  background: #fafafa;
  border: 1px solid #f0f0f0;
}
.chart-main,
.chart-side {
  height: 350px;
}

.kpi-strip {
  display: flex;
  margin-top: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.kpi-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.85rem 0.5rem;
  border-right: 1px solid #e5e7eb;
  gap: 4px;
}
.kpi-item:last-child {
  border-right: none;
}
.kpi-total {
  background: #f8fafc;
}
.kpi-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.kpi-label {
  font-size: 0.7rem;
  color: #6b7280;
}
.kpi-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
}
.kpi-count {
  font-size: 0.65rem;
  color: #9ca3af;
}

@media (max-width: 968px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
