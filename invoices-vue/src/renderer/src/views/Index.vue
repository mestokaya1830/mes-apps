<template>
  <div class="editor-panel">
    <!-- Header -->
    <div class="editor-header-block">
      <div>
        <h1 class="title">{{ title }}</h1>
        <p class="subtitle">Übersicht Ihrer Rechnungen, Angebote und Aufträge</p>
      </div>
    </div>

    <!-- Dashboard Cards -->
    <div v-if="tablesCount" class="dashboard-grid">
      <!-- dashboards Card -->
      <div class="dashboard-card" @click="goTo('customers')" style="cursor: pointer">
        <div class="card-header">
          <div class="dashboard-avatar">👥</div>
          <div class="dashboard-info">
            <h3 class="dashboard-name">Kunden</h3>
            <span class="dashboard-type-badge">Gesamt: {{ tablesCount.customers }}</span>
          </div>
        </div>
      </div>

      <!-- Rechnungen Card -->
      <div class="dashboard-card" @click="goTo('invoices')" style="cursor: pointer">
        <div class="card-header">
          <div class="dashboard-avatar">💶</div>
          <div class="dashboard-info">
            <h3 class="dashboard-name">Rechnungen</h3>
            <span class="dashboard-type-badge">Gesamt: {{ tablesCount.invoices }}</span>
          </div>
        </div>
      </div>

      <!-- Angebote Card -->
      <div class="dashboard-card" @click="goTo('offers')" style="cursor: pointer">
        <div class="card-header">
          <div class="dashboard-avatar">📄</div>
          <div class="dashboard-info">
            <h3 class="dashboard-name">Angebote</h3>
            <span class="dashboard-type-badge">Gesamt: {{ tablesCount.offers }}</span>
          </div>
        </div>
      </div>

      <!-- Aufträge Card -->
      <div class="dashboard-card" @click="goTo('orders')" style="cursor: pointer">
        <div class="card-header">
          <div class="dashboard-avatar">📦</div>
          <div class="dashboard-info">
            <h3 class="dashboard-name">Aufträge</h3>
            <span class="dashboard-type-badge">Gesamt: {{ tablesCount.orders }}</span>
          </div>
        </div>
      </div>
      <!-- Aufträge Card -->
      <div class="dashboard-card" @click="goTo('reports')" style="cursor: pointer">
        <div class="card-header">
          <div class="dashboard-avatar">📊</div>
          <div class="dashboard-info">
            <h3 class="dashboard-name">Berichte</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
        const result = await window.api.getDashboard()
        if (!result.success) return
        this.tablesCount = result.rows
      } catch (error) {
        console.error(error)
      }
    },
    goTo(path) {
      this.$router.push(`/${path}`)
    }
  }
}
</script>

<style scoped>
/* Önceki CSS aynen korunuyor */
.editor-panel {
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
}

.editor-header-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.subtitle {
  color: #718096;
  margin: 8px 0 0 0;
  font-size: 14px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  width: 80%;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 24px;
  flex-shrink: 0;
}

.dashboard-info {
  flex: 1;
  min-width: 0;
}

.dashboard-name {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 6px 0;
}

.dashboard-type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
.dashboard-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Küçük/orta ekran */
  width: 100%;
}

/* Kartlar */
.dashboard-card {
  display: grid;
  grid-template-columns: auto 1fr; /* Avatar + içerik yan yana */
  align-items: start;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  height: auto; /* İçerik kadar */
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* TAM EKRAN (>1600px): alt alta, tam genişlik */
@media (min-width: 1600px) {
  .dashboard-grid {
    grid-template-columns: 1fr; /* Tek sütun */
  }

  .dashboard-card {
    width: 100%; /* Tam genişlik */
  }
}
</style>
