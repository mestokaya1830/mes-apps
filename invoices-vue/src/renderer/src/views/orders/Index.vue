<template>
  <div class="preview-panel">
    <!-- Header Section -->
    <div class="preview-header-block">
      <div>
        <h1 class="title">{{ title }}</h1>
        <p class="preview-subtitle">Verwalten Sie alle Ihre Aufträge</p>
      </div>
      <router-link to="/orders/create" class="add-btn">
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
        <span>Neuen Auftrag erstellen</span>
      </router-link>
    </div>

    <div class="filter-container">
      <input
        v-model="search_box"
        type="search"
        placeholder="Suche..."
        class="form-input"
        @input="searchOrder()"
      />
      <input v-model="date_box_start" type="date" @input="dateFilter()" class="form-input date" />
      <input v-model="date_box_end" type="date" @input="dateFilter()" class="form-input date" />
      <div class="sort-btn" @click="sorting('id')">&#8645;</div>
    </div>

    <!-- Orders Grid -->
    <div class="list-grid">
      <div v-for="item in ordersList" :key="item.id" class="list-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="list-avatar">
            {{ getInitials(item.customer.first_name, item.customer.last_name) }}
          </div>
          <div class="list-info">
            <h3 class="list-id">{{ formatOrderId(item.id) }}</h3>
            <span class="list-type-badge">{{ item.customer.company_name }}</span> <br />
            <span class="list-name"
              >{{ item.customer.first_name }} {{ item.customer.last_name }}</span
            >
          </div>

          <div class="status-badge" :class="item.is_active ? 'active' : 'inactive'">
            {{ item.is_active ? 'Aktiv' : 'Storniert' }}
          </div>
          <div class="status-badge status" :class="orderStatus(item.status).class">
            {{ orderStatus(item.status).text }}
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <router-link :to="'/orders/details/' + item.id" class="action-btn details-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
    <div v-if="!ordersList || ordersList.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
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
      <h3>Keine Aufträge</h3>
      <p>Erstellen Sie neue Aufträge, um sie hier zu sehen.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  inject: ['formatOrderId', 'formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Aufträge',
      ordersList: [],
      search_box: '',
      date_box_start: '',
      date_box_end: '',
      isSort: true,
      STATUS_MAP: {
        draft: { text: 'Entwurf', class: 'status-draft' },
        pending: { text: 'Ausstehend', class: 'status-pending' },
        sent: { text: 'Gesendet', class: 'status-sent' },
        accepted: { text: 'Angenommen', class: 'status-accepted' },
        rejected: { text: 'Abgelehnt', class: 'status-rejected' }
      }
    }
  },
  mounted() {
    this.getOrders()
  },
  methods: {
    async getOrders() {
      try {
        const result = await window.api.getOrders()
        if (!result.success) return
        this.ordersList = result.rows.map((item) => ({
          ...item,
          customer: JSON.parse(item.customer)
        }))
      } catch (error) {
        console.error(error)
      }
    },
    async deleteOrder(id) {
      if (confirm('Sind Sie sicher, dass Sie diesen Auftrag löschen möchten?')) {
        try {
          const result = await window.api.deleteOrderById(id)
          if (!result.success) return
          this.getOrders()
        } catch (error) {
          console.error(error)
        }
      }
    },
    getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '??'
    },
    orderStatus(status) {
      return this.STATUS_MAP[status] || { text: 'Unbekannt', class: 'status-unknown' }
    },
    sorting(key) {
      if (!key) return
      this.ordersList.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    }
  }
}
</script>
