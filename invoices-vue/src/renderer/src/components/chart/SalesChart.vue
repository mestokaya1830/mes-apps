<template>
  <div class="sales-chart-wrapper">
    <div class="chart-header">
      <h3 class="chart-title">
        <i class="bi bi-bar-chart-line-fill me-2"></i>Umsatzanalyse
      </h3>
      <div class="chart-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['chart-tab', { active: activeTab === tab.key }]"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- KPI Şeridi -->
    <div class="kpi-strip">
      <div class="kpi-item">
        <p class="kpi-label">Gesamtumsatz</p>
        <h4 class="kpi-value">{{ formatEur(kpi.total) }}</h4>
        <p class="kpi-sub">{{ kpi.count }} Rechnungen</p>
      </div>
      <div class="kpi-divider"></div>
      <div class="kpi-item">
        <p class="kpi-label">Nettoumsatz</p>
        <h4 class="kpi-value text-primary">{{ formatEur(kpi.net) }}</h4>
      </div>
      <div class="kpi-divider"></div>
      <div class="kpi-item">
        <p class="kpi-label">MwSt 19%</p>
        <h4 class="kpi-value text-warning">{{ formatEur(kpi.vat19) }}</h4>
      </div>
      <div class="kpi-divider"></div>
      <div class="kpi-item">
        <p class="kpi-label">MwSt 7%</p>
        <h4 class="kpi-value text-info">{{ formatEur(kpi.vat7) }}</h4>
      </div>
      <div class="kpi-divider"></div>
      <div class="kpi-item">
        <p class="kpi-label">Bezahlt</p>
        <h4 class="kpi-value text-success">{{ formatEur(kpi.paid) }}</h4>
      </div>
      <div class="kpi-divider"></div>
      <div class="kpi-item">
        <p class="kpi-label">Ausstehend</p>
        <h4 class="kpi-value text-danger">{{ formatEur(kpi.unpaid) }}</h4>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <div class="chart-card chart-main">
        <canvas ref="mainChart"></canvas>
      </div>
      <div class="chart-card chart-side">
        <canvas ref="donutChart"></canvas>
      </div>
    </div>

    <!-- Alt Chart: MwSt Kırılımı -->
    <div class="chart-card chart-bottom mt-3">
      <canvas ref="vatChart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'SalesChart',
  props: {
    chartData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: 'monthly',
      mainChartInstance: null,
      donutChartInstance: null,
      vatChartInstance: null,
      tabs: [
        { key: 'monthly',   label: 'Monatlich' },
        { key: 'customers', label: 'Kundentyp' },
        { key: 'payment',   label: 'Zahlungsstatus' }
      ]
    }
  },
  computed: {
    // KPI — reports dizisinden hesapla
    kpi() {
      let total = 0, net = 0, vat19 = 0, vat7 = 0, paid = 0, unpaid = 0

      this.chartData.forEach(invoice => {
        const gross = Number(invoice.gross_total || 0)
        total += gross

        if (invoice.payment_status === 'paid') paid += gross
        else unpaid += gross

        // Positions varsa detaylı hesapla
        const positions = Array.isArray(invoice.positions) ? invoice.positions : []
        if (positions.length > 0) {
          positions.forEach(pos => {
            const rate  = Number(pos.vat) || 0
            const qty   = Number(pos.quantity) || 0
            const price = Number(pos.price) || 0
            const posGross = price * qty
            const posNet = posGross / (1 + rate / 100)
            const tax = posGross - posNet
            net += posNet
            if (rate === 19) vat19 += tax
            else if (rate === 7) vat7 += tax
          })
        } else {
          // positions yoksa net_total kullan
          net += Number(invoice.net_total || gross / 1.19)
          vat19 += Number(invoice.vat_total || gross - gross / 1.19)
        }
      })

      return {
        total,
        net: Math.round(net * 100) / 100,
        vat19: Math.round(vat19 * 100) / 100,
        vat7: Math.round(vat7 * 100) / 100,
        paid,
        unpaid,
        count: this.chartData.length
      }
    },

    // Aylık gruplama: net + vat19 + vat7
    monthlyData() {
      const map = {}
      this.chartData.forEach(invoice => {
        const d = new Date(invoice.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!map[key]) map[key] = { net: 0, vat19: 0, vat7: 0 }

        const positions = Array.isArray(invoice.positions) ? invoice.positions : []
        if (positions.length > 0) {
          positions.forEach(pos => {
            const rate  = Number(pos.vat) || 0
            const qty   = Number(pos.quantity) || 0
            const price = Number(pos.price) || 0
            const gross = price * qty
            const posNet = gross / (1 + rate / 100)
            const tax = gross - posNet
            map[key].net += posNet
            if (rate === 19) map[key].vat19 += tax
            else if (rate === 7) map[key].vat7 += tax
          })
        } else {
          const gross = Number(invoice.gross_total || 0)
          map[key].net   += Number(invoice.net_total || gross / 1.19)
          map[key].vat19 += Number(invoice.vat_total || gross - gross / 1.19)
        }
      })

      const sorted = Object.keys(map).sort()
      return {
        labels: sorted.map(k => {
          const [y, m] = k.split('-')
          return new Date(y, m - 1).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })
        }),
        net:   sorted.map(k => Math.round(map[k].net * 100) / 100),
        vat19: sorted.map(k => Math.round(map[k].vat19 * 100) / 100),
        vat7:  sorted.map(k => Math.round(map[k].vat7 * 100) / 100)
      }
    },

    // Müşteri tipi dağılımı
    customerTypeData() {
      const map = {
        'B2B Deutschland': 0,
        'B2B EU':          0,
        'B2B Drittland':   0,
        'B2C':             0,
        'Reverse Charge':  0
      }
      const typeMap = {
        b2b_de: 'B2B Deutschland',
        b2b_eu: 'B2B EU',
        b2b_third: 'B2B Drittland',
        b2c: 'B2C',
        reverse_charge: 'Reverse Charge'
      }

      this.chartData.forEach(invoice => {
        const type  = this.getCustomerType(invoice)
        const label = typeMap[type] || 'B2C'
        map[label] += Number(invoice.gross_total || 0)
      })

      const entries = Object.entries(map).filter(e => e[1] > 0)
      return {
        labels: entries.map(e => e[0]),
        values: entries.map(e => e[1])
      }
    },

    // Aylık ödeme durumu
    paymentData() {
      const map = {}
      this.chartData.forEach(invoice => {
        const d = new Date(invoice.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!map[key]) map[key] = { paid: 0, unpaid: 0 }
        const gross = Number(invoice.gross_total || 0)
        if (invoice.payment_status === 'paid') map[key].paid += gross
        else map[key].unpaid += gross
      })

      const sorted = Object.keys(map).sort()
      return {
        labels: sorted.map(k => {
          const [y, m] = k.split('-')
          return new Date(y, m - 1).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })
        }),
        paid:   sorted.map(k => map[k].paid),
        unpaid: sorted.map(k => map[k].unpaid)
      }
    },

    // MwSt kırılımı
    vatData() {
      const map = {}
      this.chartData.forEach(invoice => {
        const positions = Array.isArray(invoice.positions) ? invoice.positions : []
        if (positions.length > 0) {
          positions.forEach(pos => {
            const rate  = Number(pos.vat) || 0
            const qty   = Number(pos.quantity) || 0
            const price = Number(pos.price) || 0
            const gross = price * qty
            const posNet = gross / (1 + rate / 100)
            const tax = gross - posNet
            if (!map[rate]) map[rate] = { net: 0, tax: 0 }
            map[rate].net += posNet
            map[rate].tax += tax
          })
        } else {
          const rate = 19
          const gross = Number(invoice.gross_total || 0)
          const posNet = gross / 1.19
          if (!map[rate]) map[rate] = { net: 0, tax: 0 }
          map[rate].net += posNet
          map[rate].tax += gross - posNet
        }
      })

      const sorted = Object.keys(map).sort((a, b) => Number(b) - Number(a))
      return {
        labels: sorted.map(r => `${r}% MwSt`),
        net:    sorted.map(r => Math.round(map[r].net * 100) / 100),
        tax:    sorted.map(r => Math.round(map[r].tax * 100) / 100)
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.$nextTick(() => this.renderAll())
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.renderAll())
  },
  beforeUnmount() {
    this.destroyAll()
  },
  methods: {
    destroyAll() {
      if (this.mainChartInstance)  { this.mainChartInstance.destroy();  this.mainChartInstance = null }
      if (this.donutChartInstance) { this.donutChartInstance.destroy(); this.donutChartInstance = null }
      if (this.vatChartInstance)   { this.vatChartInstance.destroy();   this.vatChartInstance = null }
    },

    renderAll() {
      this.destroyAll()
      this.renderMain()
      this.renderDonut()
      this.renderVat()
    },

    switchTab(key) {
      this.activeTab = key
      this.renderAll()
    },

    renderMain() {
      const ctx = this.$refs.mainChart
      if (!ctx) return

      if (this.activeTab === 'monthly') {
        const { labels, net, vat19, vat7 } = this.monthlyData
        this.mainChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              { label: 'Nettoumsatz', data: net,   backgroundColor: '#6366f1', borderRadius: 4, stack: 'stack' },
              { label: 'MwSt 19%',   data: vat19,  backgroundColor: '#f59e0b', borderRadius: 4, stack: 'stack' },
              { label: 'MwSt 7%',    data: vat7,   backgroundColor: '#34d399', borderRadius: 4, stack: 'stack' }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              title: { display: true, text: 'Monatlicher Umsatz – Netto + MwSt', font: { size: 13, weight: '600' }, padding: { bottom: 10 } },
              legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } },
              tooltip: {
                callbacks: {
                  label: c => ` ${c.dataset.label}: ${this.formatEur(c.raw)}`,
                  footer: items => `Gesamt: ${this.formatEur(items.reduce((s, i) => s + i.raw, 0))}`
                }
              }
            },
            scales: {
              x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
              y: { stacked: true, grid: { color: '#f3f4f6' }, ticks: { callback: v => this.formatEurShort(v), font: { size: 11 } } }
            }
          }
        })
      }

      if (this.activeTab === 'customers') {
        const { labels, values } = this.customerTypeData
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6']
        this.mainChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Bruttoumsatz',
              data: values,
              backgroundColor: colors.slice(0, labels.length),
              borderRadius: 5,
              barPercentage: 0.6
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: { display: true, text: 'Umsatz nach Kundentyp', font: { size: 13, weight: '600' }, padding: { bottom: 10 } },
              legend: { display: false },
              tooltip: { callbacks: { label: c => ` ${this.formatEur(c.raw)}` } }
            },
            scales: {
              x: { grid: { color: '#f3f4f6' }, ticks: { callback: v => this.formatEurShort(v), font: { size: 11 } } },
              y: { grid: { display: false }, ticks: { font: { size: 11 } } }
            }
          }
        })
      }

      if (this.activeTab === 'payment') {
        const { labels, paid, unpaid } = this.paymentData
        this.mainChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              { label: 'Bezahlt',    data: paid,   backgroundColor: '#10b981', borderRadius: 4, stack: 'stack' },
              { label: 'Ausstehend', data: unpaid, backgroundColor: '#ef4444', borderRadius: 4, stack: 'stack' }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              title: { display: true, text: 'Zahlungsstatus nach Monat', font: { size: 13, weight: '600' }, padding: { bottom: 10 } },
              legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } },
              tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${this.formatEur(c.raw)}` } }
            },
            scales: {
              x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
              y: { stacked: true, grid: { color: '#f3f4f6' }, ticks: { callback: v => this.formatEurShort(v), font: { size: 11 } } }
            }
          }
        })
      }
    },

    renderDonut() {
      const ctx = this.$refs.donutChart
      if (!ctx) return
      const { labels, values } = this.customerTypeData
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6']

      this.donutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 3,
            borderColor: '#fff',
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            title: { display: true, text: 'Kundentyp (€)', font: { size: 13, weight: '600' }, padding: { bottom: 8 } },
            legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 10 }, padding: 10 } },
            tooltip: { callbacks: { label: c => ` ${c.label}: ${this.formatEur(c.raw)}` } }
          }
        }
      })
    },

    renderVat() {
      const ctx = this.$refs.vatChart
      if (!ctx) return
      const { labels, net, tax } = this.vatData

      this.vatChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Nettobetrag', data: net, backgroundColor: '#6366f1', borderRadius: 4, barPercentage: 0.5 },
            { label: 'MwSt-Betrag', data: tax, backgroundColor: '#f59e0b', borderRadius: 4, barPercentage: 0.5 }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            title: { display: true, text: 'MwSt-Aufschlüsselung nach Steuersatz', font: { size: 13, weight: '600' }, padding: { bottom: 10 } },
            legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } },
            tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${this.formatEur(c.raw)}` } }
          },
          scales: {
            x: { grid: { color: '#f3f4f6' }, ticks: { callback: v => this.formatEurShort(v), font: { size: 11 } } },
            y: { grid: { display: false }, ticks: { font: { size: 12, weight: '500' } } }
          }
        }
      })
    },

    getCustomerType(invoice) {
      if (!invoice.customer) return 'b2c'
      const customer = invoice.customer
      const countryCode = customer.country_code || 'DE'
      const hasVatId = customer.vat_id && customer.vat_id.trim() !== ''
      if (invoice.reverse_charge) return 'reverse_charge'
      const euCountries = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR',
        'GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE']
      const isB2B = hasVatId || customer.is_company
      if (countryCode === 'DE') return isB2B ? 'b2b_de' : 'b2c'
      if (euCountries.includes(countryCode)) return isB2B ? 'b2b_eu' : 'b2c'
      return isB2B ? 'b2b_third' : 'b2c'
    },

    formatEur(value) {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value || 0)
    },

    formatEurShort(value) {
      if (value >= 1000000) return (value / 1000000).toFixed(1) + ' Mio€'
      if (value >= 1000)    return (value / 1000).toFixed(0) + 'k€'
      return value + '€'
    }
  }
}
</script>

<style scoped>
.sales-chart-wrapper {
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
  font-weight: 700;
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
  padding: 0.35rem 0.9rem;
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

.chart-tab:hover:not(.active) { color: #374151; }

.kpi-strip {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.85rem 1.25rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
  gap: 0;
}

.kpi-item {
  flex: 1;
  min-width: 100px;
  text-align: center;
}

.kpi-divider {
  width: 1px;
  height: 40px;
  background: #e5e7eb;
  flex-shrink: 0;
  margin: 0 0.75rem;
}

.kpi-label {
  font-size: 0.67rem;
  color: #6b7280;
  margin: 0 0 2px;
  white-space: nowrap;
}

.kpi-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1px;
}

.kpi-sub {
  font-size: 0.67rem;
  color: #9ca3af;
  margin: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 1rem;
}

.chart-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
  position: relative;
}

.chart-main   { height: 300px; }
.chart-side   { height: 280px; }
.chart-bottom { height: 150px; }

.chart-main canvas,
.chart-side canvas,
.chart-bottom canvas {
  width: 100% !important;
  height: 100% !important;
}

.mt-3 { margin-top: 1rem; }

.text-primary { color: #6366f1 !important; }
.text-success { color: #10b981 !important; }
.text-warning { color: #f59e0b !important; }
.text-info    { color: #06b6d4 !important; }
.text-danger  { color: #ef4444 !important; }

@media (max-width: 768px) {
  .charts-grid  { grid-template-columns: 1fr; }
  .chart-main   { height: 250px; }
  .chart-side   { height: 230px; }
  .chart-bottom { height: 130px; }
  .chart-header { flex-direction: column; align-items: flex-start; }
  .kpi-strip    { flex-wrap: wrap; gap: 0.5rem; }
  .kpi-divider  { display: none; }
  .kpi-item     { flex: 1 1 40%; text-align: left; }
}
</style>