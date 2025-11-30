<template>
  <div>
    <div v-if="customers" class="list-panel">
      <!-- Header Section -->
      <div class="editor-header-block">
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

      <div class="filter-container">
        <input
          v-model="search_box"
          type="search"
          class="form-input"
          placeholder="Suce..."
          @input="searchCustomer()"
        />
        <div @click="sorting('id')">&#8645;</div>
      </div>
      <!-- Customer Cards -->
      <div class="customer-grid">
        <div v-for="item in customers" :key="item.id" class="customer-card">
          <div class="card-header">
            <div class="customer-avatar">
              {{ setAvatar(item.first_name, item.last_name) }}
            </div>
            <div class="customer-info">
              <h3 class="customer-name">{{ item.first_name }} {{ item.last_name }}</h3>
              <label>{{ formatCustomerId(item.id) }}</label>
              <span class="customer-type-badge">{{ item.company_type || 'Standard' }}</span>
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
            <router-link :to="'/customers/details/' + item.id" class="action-btn details-btn">
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
            <button class="action-btn delete-btn" @click="deleteCustomer(item.id)">
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
                <polyline points="3 6 5 6 21 6"></polyline>
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                ></path>
              </svg>
              Löschen
            </button>
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
    async deleteCustomer(id) {
      if (!id) return
      if (confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten? ✅')) {
        try {
          const result = await window.api.deleteCustomerById(id)
          if (!result.success) return
          this.getCustomers()
        } catch (error) {
          console.error(error)
        }
      }
    },
    setAvatar(firstName, lastName) {
      if (!firstName && !lastName) return
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '??'
    },
    async searchCustomer() {
      const term = this.search_box?.trim()
      if (!term) {
        this.getCustomers()
        return
      }
      if (term.length < 4) {
        return
      }
      const result = await window.api.searchCustomer(term)
      if (result?.success) {
        this.customers = result.rows
      }
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

<style scoped>
.list-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
}
/* Header */
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #718096;
  margin: 8px 0 0 0;
  font-size: 14px;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Customer Grid */
.customer-grid {
  display: grid;
  width: 80%;
  /* grid-template-columns: repeat(auto-fill, minmax(750px, 1fr)); */
  gap: 24px;
}

.customer-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.customer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  position: relative;
}

.customer-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.customer-info {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.customer-type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  top: 0;
  right: 0;
}

.status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.inactive {
  background: #fed7d7;
  color: #742a2a;
}

/* Card Actions */
.card-actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.details-btn {
  background: #edf2f7;
  color: #2d3748;
}

.details-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.delete-btn {
  background: #fff5f5;
  color: #c53030;
}

.delete-btn:hover {
  background: #fed7d7;
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #718096;
}

.empty-state svg {
  opacity: 0.3;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
.filter-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 24px 16px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .title {
    font-size: 24px;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }

  .customer-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
