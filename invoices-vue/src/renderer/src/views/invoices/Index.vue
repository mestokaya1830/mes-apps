<template>
  <div>
    <div class="main-container">
      <!-- Header Section -->
      <div v-if="invoices" class="editor-header-block">
        <div>
          <h1 class="title">{{ title }} {{ invoices.length }}</h1>
          <p class="subtitle">Verwalten Sie alle Ihre Rechnungen</p>
        </div>
        <router-link to="/customers" class="add-btn">
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
        <select v-model="categories_filter" class="form-input select" @change="filterCategories">
          <option value="" disabled>Kategorie</option>
          <option value="all">Alle</option>
          <option value="active">Aktiv</option>
          <option value="canceled">Storniert</option>
          <option value="is_paid">Bezahlt</option>
          <option value="is_partially_paid">Teilweise bezahlt</option>
          <option value="overdue">Überfällig</option>
          <option value="is_early_paid">Frühzahlung</option>
          <option value="is_early_paid">Frühzahlung</option>
          <option value="is_reminded">Erinnert</option>
        </select>

        <input
          v-model="search_box"
          class="form-input"
          placeholder="Kunde, Firma oder Rechnungs-ID suchen..."
          @input="searchInvoice"
        />

        <input
          ref="date_box_start"
          v-model="date_box_start"
          type="date"
          class="form-input"
          @input="formDate()"
        />
        <input
          ref="date_box_end"
          v-model="date_box_end"
          type="date"
          class="form-input"
          @input="filterDate()"
        />
        <div class="sort-btn" @click="sorting('id')">&#8645;</div>
      </div>

      <div v-if="search_box && search_box.length < 4" class="hint">
        Mindestens 2 Zeichen eingeben
      </div>

      <!-- Invoice Grid -->
      <div v-if="invoices" class="list-grid">
        <div v-for="item in invoices" :key="item.id" class="list-card">
          <!-- Card Header -->
          <div class="card-header">
            <div class="list-awatar">
              {{ avatarStyle(item.customer.first_name, item.customer.last_name) }}
            </div>
            <div class="list-info">
              <h3 class="list-id">{{ formatInvoiceId(item.id) }}</h3>
              <span class="list-type-badge">{{ item.customer.company_name }}</span> <br />
              <span class="list-name"
                >{{ item.customer.first_name }} {{ item.customer.last_name }}</span
              >
            </div>
            <div class="status-badge" :class="item.is_active ? 'active' : 'inactive'">
              {{ item.is_active ? 'Aktiv' : 'Storniert' }}
            </div>
            <div class="status-badge total">
              {{ formatCurrency(item.gross_total, item.currency) }}
            </div>

            <router-link
              v-if="item.payment_status !== 'paid' && item.is_active === 1"
              :to="`/payments/create/${item.id}`"
              class="status-badge payment"
              >Zahlung erfassen</router-link
            >

            <div
              v-if="item.payment_status === 'paid' && item.is_active === 1"
              class="status-badge paid"
            >
              <span v-if="item.paid_at && item.paid_at < item.due_date">⏰</span>
              Bezahlt
              <span v-if="item.early_paid_discount_applied">💰</span>
            </div>

            <div v-if="item.is_active === 0" class="status-badge canceled">
              <small>Storniert am: {{ formatDate(item.cancelled_at) }}</small>
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
      <div v-if="!invoices || invoices.length === 0" class="empty-state">
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
  </div>
</template>

<script>
import store from '../../store/store'
export default {
  name: 'Invoices',
  inject: ['formatInvoiceId', 'formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Rechnungen',
      invoices: [],
      search_box: '',
      date_box_start: '',
      date_box_end: '',
      categories_filter: '',
      invoice_length: 0,
      isSort: true
    }
  },
  mounted() {
    if (store.state.date_filter) {
      this.date_box_start = store.state.date_filter.start
      this.date_box_end = store.state.date_filter.end
      this.filterDate()
    } else {
      this.getInvoices()
    }
  },
  methods: {
    async getInvoices() {
      try {
        const result = await window.api.getInvoices()
        if (!result.success) return
        this.invoices = result.rows.map((row) => ({
          ...row,
          customer: row.customer ? JSON.parse(row.customer) : null
        }))
      } catch (error) {
        console.error(error)
      }
    },
    avatarStyle(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '??'
    },
    async filterCategories() {
      try {
        this.clearDate()
        const result = await window.api.filterInvoicesCategories(this.categories_filter)
        if (!result.success) return
        this.invoices = result.rows.map((row) => ({
          ...row,
          customer: row.customer ? JSON.parse(row.customer) : null
        }))
      } catch (error) {
        console.error(error)
      }
    },
    async searchInvoice() {
      const term = this.search_box?.trim()
      console.log(term)
      if (!term) {
        this.getInvoices()
        return
      }
      if (isNaN(term) && term.length < 3) {
        return
      }

      const result = await window.api.searchInvoices(term)
      if (!result.success) return
      this.invoices = result.rows.map((row) => ({
        ...row,
        customer: row.customer ? JSON.parse(row.customer) : null
      }))
    },
    async filterDate() {
      try {
        if (!this.date_box_start) return this.$refs.date_box_start.focus()
        if (!this.date_box_end) return this.$refs.date_box_end.focus()
        if (this.date_box_start > this.date_box_end) {
          this.date_box_end = ''
          return this.$refs.date_box_end.focus()
        }
        if (this.date_box_start && this.date_box_end) {
          const date = {
            start: this.date_box_start,
            end: this.date_box_end
          }
          const result = await window.api.filterInvoicesDate(date)
          if (!result.success) return
          this.invoices = result.rows.map((row) => ({
            ...row,
            customer: row.customer ? JSON.parse(row.customer) : null
          }))
          console.log('date', this.invoices)
          await store.setStore('date_filter', JSON.parse(JSON.stringify(date)))
        }
      } catch (error) {
        console.error(error)
      }
    },
    sorting(key) {
      if (!key) return
      this.invoices.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    },
    async clearDate() {
      try {
        this.date_box_start = ''
        this.date_box_end = ''
        await store.clearStore('date_filter')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style>
.main-container {
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
}

.editor-header-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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

.filter-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;
}

.filter-input {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.hint {
  width: 80%;
  font-size: 11px;
  color: #e53e3e;
  margin-bottom: 12px;
}

.list-grid {
  display: grid;
  width: 100%;
  gap: 24px;
}

.list-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.list-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  position: relative;
  min-height: 90px;
}

.list-awatar {
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

.list-info {
  flex: 1;
  min-width: 0;
}

.list-id {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}
.list-name {
  font-size: 12px;
  margin: 10px;
}
.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  top: 0;
  right: 0;
  text-decoration: none;
}

.status-badge.active {
  background: #c6f6d5;
  color: #000;
}

.status-badge.inactive {
  background: #dc2626;
  color: #fff;
}

.status-badge.total {
  background-color: #667eea;
  color: #fff;
  top: 30px;
}
.status-badge.early-paid {
  background-color: none;
  color: #fff;
  padding: 0 10px;
}
.status-badge.payment {
  background-color: darkorange;
  color: #fff;
  top: 60px;
}
.status-badge.paid {
  background-color: lightseagreen;
  color: #fff;
  top: 60px;
}
.status-badge.canceled {
  background-color: none;
  color: #444;
  top: 70px;
  font-size: 16px;
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
</style>
