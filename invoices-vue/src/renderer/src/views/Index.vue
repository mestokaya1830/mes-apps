<!-- <template>
  <div class="main-container">
    <div class="dashboard-header">
      <div>
        <h1 class="title">{{ title }}</h1>
        <p class="dashboard-subtitle">Übersicht Ihrer Geschäftstätigkeit</p>
      </div>
      <div class="dashboard-header-actions">
        <button class="dashbord-btn btn-secondary">
          <i class="bi bi-download btn-icon"></i>
          Exportieren
        </button>
        <button class="dashbord-btn btn-primary">
          <i class="bi bi-plus-circle btn-icon"></i>
          Neue Rechnung
        </button>
      </div>
    </div>

    <div v-if="tablesCount" class="dashboard-grid">
      <div
        v-for="(count, key) in tablesCount"
        :key="key"
        class="dashboard-card"
        :class="key"
        @click="goTo(key)"
      >
        <div class="dashboard-card-header">
          <div class="dashboard-avatar" :class="key">
            <i :class="`bi ${icons[key]} icons`"></i>
          </div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">{{ titles[key] }}</h3>
        <span class="dashboard-value">{{ count }}</span>
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
import store from '../store/store'
export default {
  data() {
    return {
      title: 'Dashboard',
      tablesCount: null,
      titles: {
        customers: 'Alle Kunden',
        invoices: 'Alle Rechnungen',
        offers: 'Alle Angebote',
        orders: 'Alle Aufträge'
      },
      icons: {
        customers: 'bi-people-fill',
        invoices: 'bi-receipt',
        offers: 'bi-file-earmark-text',
        orders: 'bi-box-seam'
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
}
.dashbord-btn.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
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
  border: 1px solid #e5e7eb;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.05),
    0 6px 12px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.25s ease;
}
.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.07),
    0 10px 20px rgba(0, 0, 0, 0.04);
}
.dashboard-card.customers {
  border-top: 4px solid #3ba55c;
}
.dashboard-card.invoices {
  border-top: 4px solid #f59e0b;
}
.dashboard-card.offers {
  border-top: 4px solid #6366f1;
}
.dashboard-card.orders {
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
</style> -->

<template>
  <div class="main-container">
    <div class="dashboard-header">
      <div>
        <h1 class="title">{{ title }}</h1>
        <p class="dashboard-subtitle">Übersicht Ihrer Geschäftstätigkeit</p>
      </div>
      <div class="dashboard-header-actions">
        <button class="btn btn-secondary">
          <i class="bi bi-download icons"></i>
          Exportieren
        </button>
      </div>
    </div>

    <div v-if="tablesCount" class="dashboard-grid">
      <div
        v-for="(count, key) in tablesCount"
        :key="key"
        class="dashboard-card"
        :class="key"
        @click="goTo(key)"
      >
        <div class="dashboard-card-header">
          <div class="dashboard-avatar" :class="key">
            <i :class="`bi ${icons[key]} icons`"></i>
          </div>
          <div class="dashboard-badge">Aktiv</div>
        </div>
        <h3 class="dashboard-title">{{ titles[key] }}</h3>
        <span class="dashboard-value">{{ count }}</span>
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
import store from '../store/store'
export default {
  data() {
    return {
      title: 'Dashboard',
      tablesCount: null,
      titles: {
        customers: 'Alle Kunden',
        invoices: 'Alle Rechnungen',
        offers: 'Alle Angebote',
        orders: 'Alle Aufträge'
      },
      icons: {
        customers: 'bi-people-fill',
        invoices: 'bi-receipt',
        offers: 'bi-file-earmark-text',
        orders: 'bi-box-seam'
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
