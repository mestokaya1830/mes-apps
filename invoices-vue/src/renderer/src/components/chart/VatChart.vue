<template>
  <div class="vat-chart-wrapper">
    <div class="chart-header">
      <h3 class="chart-title">
        <i class="bi bi-graph-up-arrow me-2"></i>Finanzübersicht
      </h3>
      <div class="chart-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['chart-tab', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key; renderChart()"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="charts-grid">
      <!-- Hauptchart: Monatlicher Trend oder Kundenchart -->
      <div class="chart-card chart-main">
        <canvas ref="mainChart"></canvas>
      </div>

      <!-- Nebenchart: Zahlungsstatus Donut -->
      <div class="chart-card chart-side">
        <canvas ref="donutChart"></canvas>
      </div>
    </div>

    <!-- KPI Leiste unter den Charts -->
    <div class="kpi-strip">
      <div class="kpi-item">
        <span class="kpi-dot" style="background:#10b981"></span>
        <span class="kpi-label">Bezahlt</span>
        <span class="kpi-value">{{ formatEur(kpi.paid) }}</span>
      </div>
      <div class="kpi-item">
        <span class="kpi-dot" style="background:#60a5fa"></span>
        <span class="kpi-label">Teilweise</span>
        <span class="kpi-value">{{ formatEur(kpi.partial) }}</span>
      </div>
      <div class="kpi-item">
        <span class="kpi-dot" style="background:#f59e0b"></span>
        <span class="kpi-label">Offen</span>
        <span class="kpi-value">{{ formatEur(kpi.unpaid) }}</span>
      </div>
      <div class="kpi-item">
        <span class="kpi-dot" style="background:#ef4444"></span>
        <span class="kpi-label">Überfällig</span>
        <span class="kpi-value">{{ formatEur(kpi.overdue) }}</span>
      </div>
      <div class="kpi-item kpi-total">
        <span class="kpi-label">Gesamt</span>
        <span class="kpi-value">{{ formatEur(kpi.total) }}</span>
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
      activeTab: 'monthly',
      mainChartInstance: null,
      donutChartInstance: null,
      tabs: [
        { key: 'monthly', label: 'Monatlicher Umsatz' },
        { key: 'customers', label: 'Top Kunden' },
        { key: 'timeline', label: 'Zahlungsdauer' }
      ]
    }
  },
  computed: {
    // Fatura verilerini işlenmiş hale getir
    processedData() {
      if (!Array.isArray(this.chartData)) return []
      return this.chartData.map(item => {
        const today = new Date()
        const dueDate = new Date(item.due_date)
        const isOverdue = item.payment_status !== 'paid' && today > dueDate
        return { ...item, isOverdue }
      })
    },

    // KPI hesapla
    kpi() {
      const data = this.processedData
      return {
        paid:    data.filter(i => i.payment_status === 'paid').reduce((s, i) => s + Number(i.gross_total || 0), 0),
        partial: data.filter(i => i.payment_status === 'partially_paid').reduce((s, i) => s + Number(i.gross_total || 0), 0),
        unpaid:  data.filter(i => i.payment_status === 'unpaid' && !i.isOverdue).reduce((s, i) => s + Number(i.gross_total || 0), 0),
        overdue: data.filter(i => i.isOverdue).reduce((s, i) => s + Number(i.gross_total || 0), 0),
        total:   data.reduce((s, i) => s + Number(i.gross_total || 0), 0)
      }
    },

    // Aylık gruplama
    monthlyData() {
      const map = {}
      this.processedData.forEach(item => {
        const d = new Date(item.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!map[key]) map[key] = { paid: 0, partial: 0, unpaid: 0, overdue: 0 }
        const val = Number(item.gross_total || 0)
        if (item.payment_status === 'paid') map[key].paid += val
        else if (item.payment_status === 'partially_paid') map[key].partial += val
        else if (item.isOverdue) map[key].overdue += val
        else map[key].unpaid += val
      })
      const sorted = Object.keys(map).sort()
      return {
        labels: sorted.map(k => {
          const [y, m] = k.split('-')
          return new Date(y, m - 1).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })
        }),
        paid:    sorted.map(k => map[k].paid),
        partial: sorted.map(k => map[k].partial),
        unpaid:  sorted.map(k => map[k].unpaid),
        overdue: sorted.map(k => map[k].overdue)
      }
    },

    // Top 8 müşteri
    topCustomersData() {
      const map = {}
      this.processedData.forEach(item => {
        const name = item.customer_name || 'Unbekannt'
        if (!map[name]) map[name] = 0
        map[name] += Number(item.gross_total || 0)
      })
      const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
      return {
        labels: sorted.map(e => e[0]),
        values: sorted.map(e => e[1])
      }
    },

    // Zahlungsdauer dağılımı
    timelineData() {
      const buckets = { '≤7 Tage': 0, '8–14 Tage': 0, '15–30 Tage': 0, '31–60 Tage': 0, '>60 Tage': 0 }
      this.processedData
        .filter(i => i.payment_status === 'paid' && i.paid_at)
        .forEach(item => {
          const days = Math.ceil((new Date(item.paid_at) - new Date(item.date)) / 86400000)
          if (days <= 7)       buckets['≤7 Tage']    += Number(item.gross_total || 0)
          else if (days <= 14) buckets['8–14 Tage']  += Number(item.gross_total || 0)
          else if (days <= 30) buckets['15–30 Tage'] += Number(item.gross_total || 0)
          else if (days <= 60) buckets['31–60 Tage'] += Number(item.gross_total || 0)
          else                 buckets['>60 Tage']   += Number(item.gross_total || 0)
        })
      return {
        labels: Object.keys(buckets),
        values: Object.values(buckets)
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.renderChart())
  },
  watch: {
    chartData() {
      this.$nextTick(() => this.renderChart())
    }
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    destroyCharts() {
      if (this.mainChartInstance) { this.mainChartInstance.destroy(); this.mainChartInstance = null }
      if (this.donutChartInstance) { this.donutChartInstance.destroy(); this.donutChartInstance = null }
    },

    renderChart() {
      this.destroyCharts()
      this.renderDonut()
      if (this.activeTab === 'monthly')   this.renderMonthly()
      if (this.activeTab === 'customers') this.renderCustomers()
      if (this.activeTab === 'timeline')  this.renderTimeline()
    },

    // Donut – ödeme durumu dağılımı (her zaman görünür)
    renderDonut() {
      const ctx = this.$refs.donutChart
      if (!ctx) return
      const { paid, partial, unpaid, overdue } = this.kpi
      this.donutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Bezahlt', 'Teilweise', 'Offen', 'Überfällig'],
          datasets: [{
            data: [paid, partial, unpaid, overdue],
            backgroundColor: ['#10b981', '#60a5fa', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 11 }, padding: 12, usePointStyle: true }
            },
            title: {
              display: true,
              text: 'Zahlungsstatus (€)',
              font: { size: 13, weight: '600' },
              padding: { bottom: 10 }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.label}: ${this.formatEur(ctx.raw)}`
              }
            }
          }
        }
      })
    },

    // Bar – aylık stacked ciro
    renderMonthly() {
      const ctx = this.$refs.mainChart
      if (!ctx) return
      const { labels, paid, partial, unpaid, overdue } = this.monthlyData
      this.mainChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Bezahlt',   data: paid,    backgroundColor: '#10b981', borderRadius: 3, stack: 'stack' },
            { label: 'Teilweise', data: partial,  backgroundColor: '#60a5fa', borderRadius: 3, stack: 'stack' },
            { label: 'Offen',     data: unpaid,   backgroundColor: '#f59e0b', borderRadius: 3, stack: 'stack' },
            { label: 'Überfällig',data: overdue,  backgroundColor: '#ef4444', borderRadius: 3, stack: 'stack' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            title: {
              display: true,
              text: 'Monatlicher Umsatz nach Zahlungsstatus',
              font: { size: 13, weight: '600' },
              padding: { bottom: 12 }
            },
            legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true } },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${this.formatEur(ctx.raw)}`
              }
            }
          },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
            y: {
              stacked: true,
              grid: { color: '#f0f0f0' },
              ticks: {
                font: { size: 11 },
                callback: v => this.formatEurShort(v)
              }
            }
          }
        }
      })
    },

    // Horizontal Bar – Top Kunden
    renderCustomers() {
      const ctx = this.$refs.mainChart
      if (!ctx) return
      const { labels, values } = this.topCustomersData
      const colors = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#06b6d4']
      this.mainChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Umsatz',
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderRadius: 4,
            barPercentage: 0.65
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Top Kunden nach Umsatz',
              font: { size: 13, weight: '600' },
              padding: { bottom: 12 }
            },
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${this.formatEur(ctx.raw)}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: '#f0f0f0' },
              ticks: { callback: v => this.formatEurShort(v), font: { size: 11 } }
            },
            y: { grid: { display: false }, ticks: { font: { size: 11 } } }
          }
        }
      })
    },

    // Bar – Zahlungsdauer
    renderTimeline() {
      const ctx = this.$refs.mainChart
      if (!ctx) return
      const { labels, values } = this.timelineData
      const colors = ['#10b981', '#34d399', '#f59e0b', '#fb923c', '#ef4444']
      this.mainChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Umsatz',
            data: values,
            backgroundColor: colors,
            borderRadius: 5,
            barPercentage: 0.6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Zahlungsdauer – bezahlte Rechnungen',
              font: { size: 13, weight: '600' },
              padding: { bottom: 12 }
            },
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${this.formatEur(ctx.raw)}`
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: {
              grid: { color: '#f0f0f0' },
              ticks: { callback: v => this.formatEurShort(v), font: { size: 11 } }
            }
          }
        }
      })
    },

    formatEur(value) {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value || 0)
    },

    formatEurShort(value) {
      if (value >= 1000000) return (value / 1000000).toFixed(1) + ' Mio€'
      if (value >= 1000)    return (value / 1000).toFixed(0) + 'k €'
      return value + ' €'
    }
  }
}
</script>

<style scoped>
.vat-chart-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.chart-tabs {
  display: flex;
  gap: 0.375rem;
  background: #f3f4f6;
  padding: 3px;
  border-radius: 8px;
}

.chart-tab {
  padding: 0.35rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 500;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s ease;
}

.chart-tab.active {
  background: #fff;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

.chart-tab:hover:not(.active) {
  color: #374151;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1rem;
  align-items: start;
}

.chart-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}

.chart-main {
  height: 320px;
  position: relative;
}

.chart-main canvas {
  width: 100% !important;
  height: 100% !important;
}

.chart-side {
  height: 280px;
  position: relative;
}

.chart-side canvas {
  width: 100% !important;
  height: 100% !important;
}

.kpi-strip {
  display: flex;
  gap: 0;
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.kpi-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.65rem 0.5rem;
  border-right: 1px solid #e5e7eb;
  gap: 3px;
}

.kpi-item:last-child {
  border-right: none;
}

.kpi-total {
  background: #f8fafc;
}

.kpi-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.kpi-label {
  font-size: 0.7rem;
  color: #6b7280;
}

.kpi-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: #111827;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .chart-main {
    height: 260px;
  }
  .chart-side {
    height: 240px;
  }
  .kpi-strip {
    flex-wrap: wrap;
  }
  .kpi-item {
    flex: 1 1 45%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>