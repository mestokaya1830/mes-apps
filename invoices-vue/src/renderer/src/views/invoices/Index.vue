<template>
  <div class="editor-panel">
    <!-- Header Section -->
    <div class="editor-header-block">
      <div>
        <h1 class="title">{{ title }} {{ invoiceList.length }}</h1>
        <p class="subtitle">Verwalten Sie alle Ihre Rechnungen</p>
      </div>
      <router-link to="/invoices/create" class="add-btn">
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
        <span>Neue Rechnung erstellen</span>
      </router-link>
    </div>

    <div class="filter-container">
      <div class="form-group">
        <select
          v-model="categiries_filter"
          class="form-input"
          @change="categoriesFilter"
        >
          <option value="" disabled>Kategorrie</option>
          <option value="all">Alles</option>
          <option value="active">Aktiv</option>
          <option value="canceled">Storniert</option>
          <option value="paid">Bezahlt</option>
          <option value="not_paid">Unbezahlt</option>
          <option value="partially_paid">Teilweise bezahlt</option>
        </select>
      </div>
      <input v-model="search_box" type="search" @input="searchFilter()" placeholder="Suce..." />
      <input v-model="date_box_start" type="date" @input="dateFilter()" />
      <input v-model="date_box_end" type="date" @input="dateFilter()" />
      <div @click="sorting('id')">&#8645;</div>
      <router-link to="/reports/invoices" class="preview-btn"> 👁️ Report</router-link>
    </div>
    <!-- Invoice Grid -->
    <div class="customer-grid">
      <div v-for="item in invoiceList" :key="item.id" class="customer-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="customer-avatar">
            {{ avatarStyle(item.customer.first_name, item.customer.last_name) }}
          </div>
          <div class="customer-info">
            <h3 class="customer-name">{{ formatInvoiceId(item.id) }}</h3>
            <span class="customer-type-badge">{{ item.customer.company_name }}</span>
          </div>
          <div class="status-badge" :class="item.is_active ? 'active' : 'inactive'">
            {{ item.is_active ? 'Aktiv' : 'Storniert' }}
          </div>

          <div class="status-badge" :class="item.payment.is_paid ? 'paid' : 'unpaid'">
            {{ item.payment.is_paid ? 'Bezahlt' : 'Unbezahlt' }}
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <router-link :to="'/invoices/details/' + item.id" class="action-btn details-btn">
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
    <div v-if="!invoiceList || invoiceList.length === 0" class="empty-state">
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
      <h3>Keine Rechnungen</h3>
      <p>Erstellen Sie neue Rechnungen, um sie hier zu sehen.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Invoices',
  data() {
    return {
      title: 'Rechnungen',
      invoiceList: [],
      search: [],
      search_box: '',
      date_box_start: '',
      date_box_end: '',
      categiries_filter: '',
      isSort: true
    }
  },
  mounted() {
    this.getInvoiceList()
  },
  methods: {
    async getInvoiceList() {
      try {
        const result = await window.api.getDocument('invoices')
        this.invoiceList = result.rows.map((item) => ({
          ...item,
          customer: JSON.parse(item.customer),
          summary: JSON.parse(item.summary),
          payment: JSON.parse(item.payment)
        }))
        this.search = this.invoiceList
      } catch (error) {
        console.error(error)
      }
    },
    formatInvoiceId(id) {
      if (!id) return ''
      const year = new Date().getFullYear()
      return `RE-${year}-${String(id).padStart(5, '0')}`
    },
    avatarStyle(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '??'
    },
    async categoriesFilter() {
      try {
        console.log(this.categiries_filter)
        // const result = await window.api.documentFilter('invoices', 'categories')
        // this.search = result.rows
      } catch (error) {
        console.error(error)
      }
    },
    searchFilter() {
      console.log(this.search)
      if (this.search_box && this.search_box.trim() !== '') {
        this.invoiceList = this.search.filter(
          (item) =>
            item.customer.first_name.toLowerCase().includes(this.search_box.toLowerCase()) ||
            item.customer.last_name.toLowerCase().includes(this.search_box.toLowerCase()) ||
            item.customer.company_name.toLowerCase().includes(this.search_box.toLowerCase()) ||
            this.formatInvoiceId(item.id).toLowerCase().includes(this.search_box.toLowerCase())
        )
      } else {
        this.invoiceList = this.search
      }
    },
    dateFilter() {
      if (this.date_box_start && this.date_box_end) {
        this.invoiceList = this.search.filter(
          (item) => item.date >= this.date_box_start && item.date <= this.date_box_end
        )
      } else if (this.date_box_start && !this.date_box_end) {
        this.invoiceList = this.search.filter((item) => item.date == this.date_box_start)
      } else {
        this.invoiceList = this.search
      }
    },
    sorting(key) {
      if (!key) return
      this.invoiceList.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    }
  }
}
</script>

<style scoped>
/* Kunden CSS aynı şekilde uygulanıyor */

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
  color: #000;
}
.status-badge.inactive {
  background: #dc2626;
  color: #fff;
}

.status-badge.paid {
  background: #c6f6d5;
  color: #000;
  top: 30px;
}
.status-badge.unpaid {
  background: #dc2626;
  color: #fff;
  top: 30px;
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
