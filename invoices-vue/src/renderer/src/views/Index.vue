<template>
  <div class="main-container">
    <div class="main-header">
      <label>{{ title }}</label>
      <button class="btn btn-secondary">
        <i class="bi bi-download icons"></i>
        Exportieren
      </button>
    </div>
    <div class="dashboard-grid">
      <div class="dashboard-card customers" @click="goTo('customers')">
        <div class="dashboard-card-header">
          <div class="dashboard-avatar">
            <i :class="`bi bi-people-fill icons`"></i>
          </div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">Kunden</h3>
        <span class="dashboard-value">{{ tablesCount ? tablesCount.customers : 0 }}</span>
      </div>

      <div class="dashboard-card invoices" @click="goTo('invoices')">
        <div class="dashboard-card-header">
          <div class="dashboard-avatar">
            <i :class="`bi bi-file-earmark-text-fill icons`"></i>
          </div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">Rechnungen</h3>
        <span class="dashboard-value">{{ tablesCount ? tablesCount.invoices : 0 }}</span>
      </div>

      <div class="dashboard-card offers" @click="goTo('offers')">
        <div class="dashboard-card-header">
          <div class="dashboard-avatar">
            <i :class="`bi bi-file-earmark-text-fill icons`"></i>
          </div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">Angebote</h3>
        <span class="dashboard-value">{{ tablesCount ? tablesCount.offers : 0 }}</span>
      </div>

      <div class="dashboard-card orders" @click="goTo('orders')">
        <div class="dashboard-card-header">
          <div class="dashboard-avatar">
            <i :class="`bi bi-file-earmark-text-fill icons`"></i>
          </div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">Bestellungen</h3>
        <span class="dashboard-value">{{ tablesCount ? tablesCount.orders : 0 }}</span>
      </div>
    </div>

    <!-- Grafikleri göster -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <h3>Umsatzentwicklung</h3>
          <div class="time-filter">
            <button :class="{ active: selectedPeriod === '1M' }" @click="updateChartData('1M')">
              1M
            </button>
            <button :class="{ active: selectedPeriod === '3M' }" @click="updateChartData('3M')">
              3M
            </button>
            <button :class="{ active: selectedPeriod === '6M' }" @click="updateChartData('6M')">
              6M
            </button>
            <button :class="{ active: selectedPeriod === '1J' }" @click="updateChartData('1J')">
              1J
            </button>
          </div>
        </div>
        <DashboardChart v-if="chartData" :chartData="chartData" :key="chartKey" />
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3>Verteilung</h3>
        </div>
        <DashboardChartDonat v-if="chartDataDonat" :chartData="chartDataDonat" :key="chartKey" />
      </div>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <h3 class="info-title">Stammdaten</h3>
        <div class="data-row">
          <span>Aktive Kunden</span>
          <span>30</span>
        </div>
        <div class="data-row">
          <span>Bezahlte Rechnungen</span>
          <span>{{ tablesCount ? tablesCount.paid_count : 0 }}</span>
        </div>
        <div class="data-row">
          <span>Offene Angebote</span>
          <span>0</span>
        </div>
        <div class="data-row">
          <span>Laufende Aufträge</span>
          <span>0</span>
        </div>
        <div style="margin-top: 1.5rem">
          <div class="progress-item">
            <div class="progress-header">
              <span>Zahlungspünktlichkeit</span>
              <span>{{ invoiceStats.paymentRate }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: invoiceStats.paymentRate + '%' }"></div>
            </div>
          </div>

          <div class="progress-item">
            <div class="progress-header">
              <span>Unbezahlt Quote</span>
              <span>{{ invoiceStats.unpaidRate }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: invoiceStats.unpaidRate + '%' }"></div>
            </div>
          </div>

          <div class="progress-item">
            <div class="progress-header">
              <span>Überfällig Quote</span>
              <span>{{ invoiceStats.overdueRate }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: invoiceStats.overdueRate + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-card">
        <h3 class="info-title">
          <i class="bi bi-clock-history info-title-icon icons"></i>
          Letzte Aktivitäten
        </h3>

        <div class="activity-item">
          <i class="bi bi-check-circle-fill icons"></i>
          <div class="activity-content">
            <div class="activity-title">Rechnung #1045 bezahlt</div>
            <div class="activity-subtitle">Kunde: Müller GmbH</div>
          </div>
          <div class="activity-time">Vor 2 Std.</div>
        </div>

        <div class="activity-item">
          <i class="bi bi-file-earmark-text icons"></i>
          <div class="activity-content">
            <div class="activity-title">Neues Angebot erstellt</div>
            <div class="activity-subtitle">Angebot #342 – Weber KG</div>
          </div>
          <div class="activity-time">Vor 5 Std.</div>
        </div>

        <div class="activity-item">
          <i class="bi bi-exclamation-triangle-fill icons"></i>
          <div class="activity-content">
            <div class="activity-title">Rechnung fällig</div>
            <div class="activity-subtitle">Rechnung #1038 – Fällig in 2 Tagen</div>
          </div>
          <div class="activity-time">Gestern</div>
        </div>

        <div class="activity-item">
          <i class="bi bi-person-plus-fill icons"></i>
          <div class="activity-content">
            <div class="activity-title">Neuer Kunde registriert</div>
            <div class="activity-subtitle">Schmidt Solutions GmbH</div>
          </div>
          <div class="activity-time">Vor 2 Tagen</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardChart from '../components/chart/DashboardChart.vue'
import DashboardChartDonat from '../components/chart/DashBoardChartDonat.vue'
import store from '../store/store'

export default {
  components: { DashboardChart, DashboardChartDonat },
  data() {
    return {
      title: 'Übersicht',
      tablesCount: null,
      chartData: null,
      chartDataDonat: null,
      selectedPeriod: '1M',
      chartKey: 0,
      last_activities: null
    }
  },
  computed: {
    invoiceStats() {
      if (!this.tablesCount) {
        return {
          paymentRate: 0,
          unpaidRate: 0,
          overdueRate: 0
        }
      }

      const paid = this.tablesCount.paid_count || 0
      const partial = this.tablesCount.partially_paid_count || 0
      const unpaid = this.tablesCount.unpaid_count || 0
      const overdue = this.tablesCount.overdue_count || 0

      const total = paid + partial + unpaid + overdue

      if (total === 0) {
        return {
          paymentRate: 0,
          unpaidRate: 0,
          overdueRate: 0
        }
      }

      return {
        paymentRate: Math.round(((paid + partial) / total) * 100),
        unpaidRate: Math.round((unpaid / total) * 100),
        overdueRate: Math.round((overdue / total) * 100)
      }
    }
  },
  mounted() {
    this.getDashboard()
  },
  methods: {
    async getDashboard() {
      try {
        this.clearDate()
        const result = await window.api.getDashboard()
        console.log('Dashboard verisi:', result)
        if (!result.success) return
        this.tablesCount = {
          customers: result.rows.customers || 0,
          invoices: result.rows.invoices || 0,
          offers: result.rows.offers || 0,
          orders: result.rows.orders || 0,
          paid_count: result.rows.paid_count || 0,
          partially_paid_count: result.rows.partially_paid_count || 0,
          unpaid_count: result.rows.unpaid_count || 0,
          overdue_count: result.rows.overdue_count || 0
        }
        await this.updateChartData(this.selectedPeriod)
        await this.getLatestActivities()
      } catch (error) {
        console.error(error)
      }
    },

    async updateChartData(period) {
      try {
        this.selectedPeriod = period
        const result = await window.api.getDashboardChart(period)
        console.log('Chart verisi:', result)

        if (result.success) {
          this.chartData = {
            labels: result.rows.labels,
            values: result.rows.values
          }
          this.chartDataDonat = {
            labels: ['Bezahlt', 'Teilweise bezahlt', 'Unbezahlt', 'Überfällig'],
            values: [
              result.rows.paid_count,
              result.rows.partially_paid_count,
              result.rows.unpaid_count,
              result.rows.overdue_count
            ]
          }
          this.chartKey++
        }
      } catch (error) {
        console.error('Chart verisi alınamadı:', error)
      }
    },

    async getLatestActivities() {
      const result = await window.api.getLatestActivities()
      if (!result) return
      this.last_activities = result.rows || null
      console.log('Letzte Aktivitäten:', this.last_activities)
    },
    goTo(path) {
      this.$router.push(`/${path}`)
    },

    async clearDate() {
      try {
        await store.clearStore('date_filter')
        await store.clearStore('category_filter')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.dashboard-header,
.dashboard-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
}
.dashboard-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}
.dashboard-header-actions {
  display: flex;
  gap: 1rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}
.dashboard-card {
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.05),
    0 6px 12px rgba(0, 0, 0, 0.03);
}
.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.07),
    0 10px 20px rgba(0, 0, 0, 0.04);
}
.dashboard-card.customers {
  background: #ecfdf5;
  border-top: 4px solid #3ba55c;
}
.dashboard-card.invoices {
  background: #fffbeb;
  border-top: 4px solid #f59e0b;
}
.dashboard-card.offers {
  background: #eef2ff;
  border-top: 4px solid #6366f1;
}
.dashboard-card.orders {
  background: #ffe4e6;
  border-top: 4px solid #ef4444;
}
.dashboard-card.customers .icons {
  color: #3ba55c;
}
.dashboard-card.invoices .icons {
  color: #f59e0b;
}
.dashboard-card.offers .icons {
  color: #6366f1;
}
.dashboard-card.orders .icons {
  color: #ef4444;
}
.dashboard-badge {
  font-size: 0.75rem;
  padding: 0.3rem 1rem;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-weight: 600;
  color: #15803c;
}
.dashboard-title {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}
.dashboard-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
}
.icons {
  width: 36px;
  text-align: center;
  font-size: 24px;
}
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}
.chart-card,
.info-card {
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.05),
    0 6px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
}
.chart-card:hover,
.info-card:hover {
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.06),
    0 8px 16px rgba(0, 0, 0, 0.04);
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.chart-header h3 {
  font-size: 1.25rem;
  color: #111827;
}
.time-filter {
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 8px;
}
.time-filter button {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}
.time-filter button.active {
  background: white;
  color: #3ba55c;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.time-filter button:hover:not(.active) {
  color: #111827;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}
.info-title {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #111827;
}
.data-row {
  display: flex;
  justify-content: space-between;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}
.data-row:last-child {
  border-bottom: none;
}
.data-row span:last-child {
  font-weight: 700;
  color: #111827;
}
.progress-item {
  margin-bottom: 1.25rem;
}
.progress-item:last-child {
  margin-bottom: 0;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}
.progress-header span:last-child {
  font-weight: 700;
  color: #3ba55c;
}
.progress-bar {
  height: 8px;
  background: #f3f4f6;
  border-radius: 20px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3ba55c 0%, #4ade80 100%);
  border-radius: 20px;
  transition: width 1s ease;
  width: 0;
}
.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}
.activity-item:last-child {
  border-bottom: none;
}
.activity-content {
  flex: 1;
}
.activity-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}
.activity-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}
.activity-time {
  color: #9ca3af;
  font-size: 0.875rem;
  flex-shrink: 0;
}
canvas {
  max-height: 300px;
}
</style>
