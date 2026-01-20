<template>
  <div v-if="customers" class="main-container">
    <!-- Header Section -->
    <div class="main-header">
      <div>
        <h1 class="title">{{ title }} {{ customers.length }}</h1>
        <p class="subtitle">Verwalten Sie alle Ihre Kunden</p>
      </div>
      <router-link to="/customers/create" class="add-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Neue Kunden erstellen</span>
      </router-link>
    </div>

    <div class="main-filter">
      <input
        v-model="search_box"
        type="search"
        class="inputs search-box"
        placeholder="Suce..."
        @input="searchFilter()"
      />
      <div class="sort-btn" @click="sorting('id')">&#8645;</div>
    </div>

    <!-- Customer Cards -->
    <div class="list-grid">
      <div v-for="item in customers" :key="item.id" class="list-card">
        <div class="card-header">
          <div class="card-header-left">
            <div class="list-avatar">
              {{ avatarStyle(item.first_name, item.last_name) }}
            </div>
            <div class="list-info">
              <h3 class="list-id">{{ formatCustomerId(item.id) }}</h3>
              <span class="list-type-badge">{{ item.company_type || 'Standard' }}</span> <br />
              <span class="list-name">{{ item.first_name }} {{ item.last_name }}</span>
            </div>
          </div>
          <div class="status-badge" :class="item.is_active ? 'active' : 'inactive'">
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </div>
        </div>

        <div class="card-actions">
          <router-link
            :to="{
              path: '/invoices/create',
              query: { id: item.id }
            }"
            class="action-btn details-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 8V21H3V3h12l6 5z"></path>
              <line x1="3" y1="7" x2="21" y2="7"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="17" x2="21" y2="17"></line>
            </svg>
            Rechnung erstellen
          </router-link>
          <router-link
            :to="{
              path: '/offers/create',
              query: { id: item.id }
            }"
            class="action-btn details-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 8V21H3V3h12l6 5z"></path>
              <line x1="3" y1="7" x2="21" y2="7"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="17" x2="21" y2="17"></line>
            </svg>
            Neues Angebote erstellen
          </router-link>
          <router-link
            :to="{
              path: '/orders/create',
              query: { id: item.id }
            }"
            class="action-btn details-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 8V21H3V3h12l6 5z"></path>
              <line x1="3" y1="7" x2="21" y2="7"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="17" x2="21" y2="17"></line>
            </svg>
            Neues Auftrag erstellen
          </router-link>
          <router-link :to="'/customers/details/' + item.id" class="details-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Details
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="customers.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <h3>Keine Kunden</h3>
      <p>Füge Kunden hinzu, um sie zu verwalten.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Customers',
  inject: ['formatCustomerId'],
  data() {
    return {
      title: 'Kunden',
      customers: [],
      search_box: '',
      isSort: true
    }
  },
  mounted() {
    this.getCustomers()
  },
  methods: {
    async getCustomers() {
      try {
        const result = await window.api.getCustomers()
        if (!result.success) return
        this.customers = result.rows
        console.log(this.customers)
      } catch (error) {
        console.error(error)
      }
    },
    avatarStyle(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '??'
    },
    async searchFilter() {
      const term = this.search_box?.trim()
      if (!term) {
        this.getCustomers()
        return
      }
      if (isNaN(term) && term.length < 3) {
        return
      }
      const result = await window.api.searchCustomers(term)
      if (!result.success) return
      this.customers = result.rows
    },
    sorting(key) {
      if (!key) return
      this.customers.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    }
  }
}
</script>
