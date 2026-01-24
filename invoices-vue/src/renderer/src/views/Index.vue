<template>
  <div class="main-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="title">{{ title }}</h1>
        <p class="dashboard-subtitle">Übersicht Ihrer Geschäftstätigkeit</p>
      </div>
      <div class="dashboard-header-actions">
        <button class="dashbord-btn btn-secondary">📥 Exportieren</button>
        <button class="dashbord-btn btn-primary">➕ Neue Rechnung</button>
      </div>
    </div>

    <!-- Dashboard Cards -->
    <div v-if="tablesCount" class="dashboard-grid">
      <!-- dashboards Card -->
      <div class="dashboard-card" @click="goTo('customers')" style="cursor: pointer">
        <div class="dashboard-card-header">
          <div class="dashboard-avatar">👥</div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">Alle Kunden</h3>
        <span class="dashboard-value">{{ tablesCount.customers }}</span>
      </div>

      <!-- Rechnungen Card -->
      <div class="dashboard-card" @click="goTo('invoices')" style="cursor: pointer">
        <div class="dashboard-card-header">
          <div class="dashboard-avatar">💶</div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">Alle Rechnungen</h3>
        <span class="dashboard-value"> {{ tablesCount.invoices }}</span>
      </div>

      <!-- Angebote Card -->
      <div class="dashboard-card" @click="goTo('offers')" style="cursor: pointer">
        <div class="dashboard-card-header">
          <div class="dashboard-avatar">📄</div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">Alle Angebote</h3>
        <span class="dashboard-value"> {{ tablesCount.offers }}</span>
      </div>

      <!-- Aufträge Card -->
      <div class="dashboard-card" @click="goTo('orders')" style="cursor: pointer">
        <div class="dashboard-card-header">
          <div class="dashboard-avatar">📦</div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">Alle Aufträge</h3>
        <span class="dashboard-value">{{ tablesCount.orders }}</span>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <h3>Umsatzentwicklung</h3>
          <div class="time-filter">
            <button class="active">1M</button>
            <button>3M</button>
            <button>6M</button>
            <button>1J</button>
          </div>
        </div>
        <canvas id="revenueChart"></canvas>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <h3>Verteilung</h3>
        </div>
        <canvas id="distributionChart"></canvas>
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
          <span>104</span>
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
              <span>Kundenzufriedenheit</span>
              <span>94%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" data-width="94"></div>
            </div>
          </div>
          <div class="progress-item">
            <div class="progress-header">
              <span>Zahlungspünktlichkeit</span>
              <span>87%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" data-width="87"></div>
            </div>
          </div>
          <div class="progress-item">
            <div class="progress-header">
              <span>Projekterfolgsrate</span>
              <span>96%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" data-width="96"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-card">
        <h3 class="info-title">Letzte Aktivitäten</h3>
        <div class="activity-item">
          <div class="activity-icon">✓</div>
          <div class="activity-content">
            <div class="activity-title">Rechnung #1045 bezahlt</div>
            <div class="activity-subtitle">Kunde: Müller GmbH</div>
          </div>
          <div class="activity-time">Vor 2 Std.</div>
        </div>
        <div class="activity-item">
          <div class="activity-icon">📄</div>
          <div class="activity-content">
            <div class="activity-title">Neues Angebot erstellt</div>
            <div class="activity-subtitle">Angebot #342 - Weber KG</div>
          </div>
          <div class="activity-time">Vor 5 Std.</div>
        </div>
        <div class="activity-item">
          <div class="activity-icon">⚠️</div>
          <div class="activity-content">
            <div class="activity-title">Rechnung fällig</div>
            <div class="activity-subtitle">Rechnung #1038 - Fällig in 2 Tagen</div>
          </div>
          <div class="activity-time">Gestern</div>
        </div>
        <div class="activity-item">
          <div class="activity-icon">👤</div>
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
import store from '../store/store'
export default {
  data() {
    return {
      title: 'Dashboard',
      tablesCount: null
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
        if (!result.success) return
        this.tablesCount = result.rows
      } catch (error) {
        console.error(error)
      }
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
.dashbord-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashbord-btn.btn-primary {
  background: linear-gradient(135deg, #3ba55c 0%, #2d8a47 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 165, 92, 0.25);
}

.dashbord-btn.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 165, 92, 0.35);
}

.dashbord-btn.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.dashbord-btn.btn-secondary:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.dashboard-card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border: 1px solid #f3f4f6;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.dashboard-badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: #f0fdf4;
  color: #15803d;
  border-radius: 20px;
  font-weight: 600;
}

.dashboard-title {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.dashboard-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.dashboard-change {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dashboard-change.positive {
  color: #15803d;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.chart-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #f3f4f6;
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
  transition: all 0.2s;
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

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #f3f4f6;
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

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
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
