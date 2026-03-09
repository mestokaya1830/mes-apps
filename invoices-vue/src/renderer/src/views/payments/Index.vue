<template>
  <div v-if="payments" class="main-container">
    <header class="page-header">
      <h1>{{ title }} {{ total_count }} / {{ current_count }}</h1>
      <router-link to="/payments/create" class="btn btn-primary">
        <i class="bi bi-plus-circle icons" aria-hidden="treu"></i>
        <span>Neue Kunden erstellen</span>
      </router-link>
    </header>

        <section class="main-filter">
      <select
        v-model="categories_filter"
        aria-label="Kategorie"
        class="inputs select"
        @change="filterCategories"
      >
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
        aria-label="Suchen"
        placeholder="Kunde, Firma oder Rechnungs-ID suchen..."
        @input="searchFilter"
      />

      <div class="date-wrapper">
        <i class="bi bi-calendar calendar-icon"></i>
        <input
          ref="date_box_start"
          v-model="date_box_start"
          type="date"
          aria-label="Startdatum"
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
          aria-label="Enddatum"
          class="inputs date"
          @input="formDate()"
        />
      </div>

      <button class="sort-btn" aria-label="Sortirien" @click="sorting('id')">&#8645;</button>
      <button class="list-print-icon" aria-label="Drucken">
        <i class="bi bi-printer form-title icons" aria-hidden="true" @click="printDocument"></i>
      </button>
    </section>

    <section class="list-grid printable">
      <div v-for="item in payments" :key="item.id" class="list-card">
        <div class="card-header">
          <div class="card-header-left">
            <div class="list-avatar">
              {{ avatarStyle(item.first_name, item.last_name) }}
            </div>
            <div class="list-info">
              <h2 class="list-id">{{ formatCustomerId(item.id) }}</h2>
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
            <i class="bi bi-receipt icons"></i>
            Rechnung erstellen
          </router-link>

          <router-link
            :to="{ path: '/offers/create', query: { id: item.id } }"
            class="btn btn-angebot"
          >
            <i class="bi bi-file-earmark-text"></i>
            Neues Angebot erstellen
          </router-link>

          <router-link
            :to="{ path: '/orders/create', query: { id: item.id } }"
            class="btn btn-auftrag"
          >
            <i class="bi bi-box-seam"></i>
            Neues Auftrag erstellen
          </router-link>

          <router-link :to="'/payments/details/' + item.id" class="btn btn-details">
            <i class="bi bi-eye icons" aria-hidden="treu"></i>
            Details
          </router-link>
        </div>
      </div>
    </section>

    <div v-if="payments.length === 0" class="empty-state">
      <i class="bi bi-people icons" aria-hidden="treu"></i>
      <h3>Keine Kunden</h3>
      <p>Fügen Sie Kunden hinzu, um sie zu verwalten.</p>
    </div>
  </div>
</template>


<script>
import store from '../../store/store';
export default {
  name: 'Payments',
  inject: ['formatCustomerId'],
  data() {
    return {
      title: 'Kunden',
      payments: [],
      search_box: '',
      isSort: true,
      categories_filter: '',
      total_count: 0,
      current_count: 0
    }
  },
  mounted() {
    this.getPayments()
  },
  methods: {
    async getPayments() {
      try {
        const result = await window.api.getPayments()
        if (!result.success) return
        this.payments = result.rows
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
        this.getPayments()
        return
      }
      if (isNaN(term) && term.length < 3) {
        return
      }
      const result = await window.api.searchPayments(term)
      if (!result.success) return
      this.payments = result.rows
    },
    async filterCategories() {
      try {
        const result = await window.api.filterPaymentsCategories(this.categories_filter)
        if (!result.success) return
        this.payments = result.rows.map((row) => ({
          ...row,
          customer: row.customer ? JSON.parse(row.customer) : null
        }))
        this.total_count = result.total
        this.current_count = result.rows.length
        await store.setFilters('category_filter', JSON.parse(JSON.stringify(this.categories_filter)))
      } catch (error) {
        console.error(error)
      }
    },
    sorting(key) {
      if (!key) return
      this.payments.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    },
    printDocument(){
      window.print()
    }
  }
}
</script>
