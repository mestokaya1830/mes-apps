<template>
  <div class="main-container">
    <!-- Header -->
    <div class="main-header">
      <div>
        <h1 class="title">{{ title }}</h1>
        <p class="preview-subtitle">Übersicht Ihrer Rechnungen, Angebote und Aufträge</p>
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
/* Önceki CSS aynen korunuyor */
</style>
