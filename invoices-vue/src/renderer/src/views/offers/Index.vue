<template>
  <div class="editor-panel">

    <!-- Header Section -->
    <div class="editor-header-block">
      <div>
        <h1 class="title">{{ title }} {{ offersList.length }}</h1>
        <p class="subtitle">Verwalten Sie alle Ihre Angebote</p>
      </div>
      <router-link to="/offers/create" class="add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Neues Angebot erstellen</span>
      </router-link>
    </div>

    <div class="filter-container">
      <input v-model="search_box" type="search" @input="searchOffer()" placeholder="Suce..." />
      <input v-model="date_box_start" type="date" @input="dateFilter()" />
      <input v-model="date_box_end" type="date" @input="dateFilter()" />
      <div @click="sorting('id')">&#8645;</div>
       <router-link to="/reports/offers" class="preview-btn">
        👁️ Report</router-link>
    </div>
    <!-- Offers Grid -->
    <div class="customer-grid">
      <div v-for="item in offersList" :key="item.id" class="customer-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="customer-avatar">
            {{ getInitials(item.customer.first_name, item.customer.last_name) }}
          </div>
          <div class="customer-info">
            <h3 class="customer-name">{{ formatOfferId(item.id) }}</h3>
            <span class="customer-type-badge">{{ item.customer.company_name }}</span>
          </div>
          <div class="status-badge" :class="item.accepted ? 'active' : 'inactive'">
            {{ item.accepted ? 'Akzeptiert' : 'Nicht akzeptiert' }}
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <router-link :to="'/offers/details/' + item.id" class="action-btn details-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Details
          </router-link>
          <button class="action-btn delete-btn" @click="deleteOffer(offer.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Löschen
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!offersList || offersList.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <h3>Keine Angebote</h3>
      <p>Erstellen Sie neue Angebote, um sie hier zu sehen.</p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Angebote',
      offersList: [],
      search: [],
      search_box: '',
      date_box_start: '',
      date_box_end: '',
      isSort: true
    }
  },
  mounted() {
    this.getOffersList()
  },
  methods: {
    async getOffersList() {
      try {
        const result = await window.api.getDocument('offers')
        this.offersList = result.rows.map((item) => ({
          ...item,
          customer: JSON.parse(item.customer)
        }))
        this.search = result.rows.map((item) => ({
          ...item,
          customer: JSON.parse(item.customer)
        }))
      } catch (error) {
        console.error(error)
      }
    },
    async deleteOffer(id) {
      if (confirm('Sind Sie sicher, dass Sie dieses Angebot löschen möchten?')) {
        try {
          const result = await window.api.deleteDocument('offers', id)
          if (result.success) this.getOffersList()
        } catch (error) {
          console.error(error)
        }
      }
    },
    formatOfferId(id) {
      if (!id) return ''
      return `ANG-${String(id).padStart(6, '0')}`
    },
     getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '??'
    },
    searchFilter() {
      if (this.search_box && this.search_box.trim() !== '') {
        this.offersList = this.search.filter(
          (item) =>
            item.customer.first_name.toLowerCase().includes(this.search_box.toLowerCase()) ||
            item.customer.last_name.toLowerCase().includes(this.search_box.toLowerCase()) ||
            item.customer.company_name.toLowerCase().includes(this.search_box.toLowerCase()) ||
            this.formatInvoiceId(item.id).toLowerCase().includes(this.search_box.toLowerCase())
        )
      } else {
        this.offersList = this.search
      }
    },
    dateFilter() {
      if (this.date_box_start && this.date_box_end) {
        this.offersList = this.search.filter(
          (item) => item.date >= this.date_box_start && item.date <= this.date_box_end
        )
      } else if (this.date_box_start && !this.date_box_end) {
        this.offersList = this.search.filter((item) => item.date == this.date_box_start)
      } else {
        this.offersList = this.search
      }
    },
    sorting(key) {
      if (!key) return
      this.offersList.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    }
  }
}
</script>

<style scoped>

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

/* Grid & Cards */
.customer-grid {
  display: grid;
  width: 80%;
  gap: 24px;
}

.customer-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.customer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
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
</style>
