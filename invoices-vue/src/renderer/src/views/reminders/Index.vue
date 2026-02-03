<template>
  <div v-if="reminders" class="main-container">
    <div class="main-header">
      <label>{{ title }} {{ total_count }} / {{ current_count }}</label>
      <router-link to="/reminders/create" class="btn btn-primary">
        <i class="bi bi-plus-circle icons"></i>
        <span>Neue Kunden erstellen</span>
      </router-link>
    </div>

    <div class="main-filter">
      <select v-model="categories_filter" class="inputs select" @change="filterCategories">
        <option value="" disabled>Kategorie</option>
        <option value="all">Alle</option>
        <option value="active">Aktiv</option>
        <option value="canceled">Storniert</option>
        <option value="is_paid">Bezahlt</option>
        <option value="is_partially_paid">Teilweise bezahlt</option>
        <option value="unpaid">Unbezahlt</option>
        <option value="overdue">Überfällig</option>
        <option value="outstanding">Ausstehend</option>
        <option value="is_early_paid">Frühzahlung</option>
        <option value="is_late_paid">Spät bezahlt</option>
        <option value="is_reminded">Erinnert</option>
      </select>

      <input
        v-model="search_box"
        class="inputs"
        placeholder="Kunde, Firma oder Rechnungs-ID suchen..."
        @input="searchInvoice"
      />

      <div class="date-wrapper">
        <i class="bi bi-calendar calendar-icon"></i>
        <input
          ref="date_box_start"
          v-model="date_box_start"
          type="date"
          class="inputs date"
          @input="formDate()"
        />
      </div>

      <div class="date-wrapper">
        <i class="bi bi-calendar calendar-icon"></i>
        <input
          ref="date_box_end"
          v-model="date_box_end"
          type="date"
          class="inputs date"
          @input="formDate()"
        />
      </div>

      <div class="sort-btn" @click="sorting('id')">&#8645;</div>
    </div>
    <div class="list-grid">
      <div v-for="item in reminders" :key="item.id" class="list-card">
        <div class="card-header">
          <div class="card-header-left">
            <div class="list-avatar">
              {{ avatarStyle(item.first_name, item.last_name) }}
            </div>
            <div class="list-info">
              <h3 class="list-id">{{ formatCustomerId(item.id) }}</h3>
              <span class="list-type-badge">{{ item.company_type || 'Standard' }}</span>
              <span class="list-name">{{ item.first_name }} {{ item.last_name }}</span>
            </div>
          </div>
          <div class="status-badge" :class="item.is_active ? 'active' : 'inactive'">
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </div>
        </div>

        <div class="card-actions">
          <router-link
            :to="{ path: '/invoices/create', query: { id: item.id } }"
            class="btn btn-rechnung"
          >
            <i class="bi bi-receipt"></i>
            Rechnung erstellen
          </router-link>

          <router-link
            :to="{ path: '/offers/create', query: { id: item.id } }"
            class="btn btn-angebot"
          >
            <i class="bi bi-file-earmark-tex icons"></i>
            Neues Angebot erstellen
          </router-link>

          <router-link
            :to="{ path: '/orders/create', query: { id: item.id } }"
            class="btn btn-auftrag"
          >
            <i class="bi bi-box-seam"></i>
            Neues Auftrag erstellen
          </router-link>

          <router-link :to="'/reminders/details/' + item.id" class="btn btn-details">
            <i class="bi bi-eye icons"></i>
            Details
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="reminders.length === 0" class="empty-state">
      <i class="bi bi-people icons"></i>
      <h3>Keine Kunden</h3>
      <p>Fügen Sie Kunden hinzu, um sie zu verwalten.</p>
    </div>
  </div>
</template>


<script>
import store from '../../store/store';
export default {
  name: 'Reminders',
  inject: ['formatCustomerId'],
  data() {
    return {
      title: 'Kunden',
      reminders: [],
      search_box: '',
      isSort: true,
      categories_filter: '',
      total_count: 0,
      current_count: 0
    }
  },
  mounted() {
    this.getReminders()
  },
  methods: {
    async getReminders() {
      try {
        const result = await window.api.getReminders()
        if (!result.success) return
        this.reminders = result.rows
        console.log(this.reminders)
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
        this.getReminders()
        return
      }
      if (isNaN(term) && term.length < 3) {
        return
      }
      const result = await window.api.searchReminders(term)
      if (!result.success) return
      this.reminders = result.rows
    },
    async filterCategories() {
      try {
        const result = await window.api.filterRemindersCategories(this.categories_filter)
        if (!result.success) return
        this.reminders = result.rows.map((row) => ({
          ...row,
          customer: row.customer ? JSON.parse(row.customer) : null
        }))
        this.total_count = result.total
        this.current_count = result.rows.length
        await store.setStore('category_filter', JSON.parse(JSON.stringify(this.categories_filter)))
      } catch (error) {
        console.error(error)
      }
    },
    sorting(key) {
      if (!key) return
      this.reminders.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    }
  }
}
</script>

<style>
.card-actions {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, 1fr);
}

.action-btn,
.details-btn, .preview-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  padding: 0.55rem 0.65rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: transparent;
  color: #374151;
  transition: all 0.2s ease;
}

.btn-rechnung i {
  color: #16a34a;
}
.btn-angebot i {
  color: #2563eb;
}
.btn-auftrag i {
  color: #f97316;
}
.btn-details i {
  color: #6b7280;
}

.btn-rechnung:hover {
  background-color: rgba(22, 163, 52, 0.1);
  border-color: #16a34a;
}
.btn-angebot:hover {
  background-color: rgba(37, 99, 235, 0.1);
  border-color: #2563eb;
}
.btn-auftrag:hover {
  background-color: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
}
.btn-details:hover {
  background-color: rgba(107, 114, 128, 0.1);
  border-color: #6b7280;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1;
}

.card-header {
  align-items: center;
}

.list-info h3,
.list-info span {
  line-height: 1.25;
}
.list-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>