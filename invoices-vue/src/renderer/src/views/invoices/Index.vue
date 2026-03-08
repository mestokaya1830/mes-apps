<template>
  <div v-if="invoices" class="main-container">
    <header class="page-header">
      <h1>{{ title }} {{ total_count }} / {{ current_count }}</h1>

      <router-link to="/customers" class="btn btn-primary">
        <i class="bi bi-plus-circle icons" aria-hidden="true"></i>
        <span>Neue Rechnung erstellen</span>
      </router-link>
    </header>

     <section class="main-filter" aria-label="customer filter">
      <select
        v-model="categories_filter"
        class="inputs select"
        aria-label="Kategorien"
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
        placeholder="Kunde, Firma oder Rechnungs-ID suchen..."
        aria-label="Kunden, Firma oder Rechnungs-ID suchen"
        @input="searchInvoice"
      />

      <div class="date-wrapper">
        <i class="bi bi-calendar calendar-icon" aria-hidden="true"></i>
        <input
          ref="date_box_start"
          v-model="date_box_start"
          type="date"
          class="inputs date"
          aria-label="Startdatum"
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
          aria-label="Enddatum"
          @input="formDate()"
        />
      </div>

      <button class="sort-btn" aria-label="Sortieren" @click="sorting('id')">&#8645;</button>
      <button type="button" class="sort-btn" @click="printDocument" aria-label="Drucken">
        <i class="bi bi-printer" aria-hidden="true"></i>
      </button>
    </section>

    <!-- Hinweis -->
    <div v-if="search_box && search_box.length < 2" class="hint">Mindestens 2 Zeichen eingeben</div>

    <!-- Invoice List -->
    <section class="list-grid printable">
      <div v-for="item in invoices" :key="item.id" class="list-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-header-left">
            <div class="list-avatar">
              {{ avatarStyle(item.customer.first_name, item.customer.last_name) }}
            </div>

            <div class="list-info">
              <h2 class="list-id">
                {{ formatInvoiceId(item.id) }}
              </h2>

              <span class="list-type-badge">
                {{ item.customer.company_name }}
              </span>
              <br />

              <span class="list-name">
                {{ item.customer.first_name }} {{ item.customer.last_name }}
              </span>
            </div>
          </div>

          <div class="status-badge-container">
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
            >
              Zahlung erfassen
            </router-link>

            <div
              v-if="item.payment_status === 'paid' && item.is_active === 1"
              class="status-badge paid"
            >
              <i
                v-if="item.paid_at && item.paid_at < item.due_date"
                class="bi bi-clock-history"
                aria-hidden="true"
              ></i>
              Bezahlt
              <i
                v-if="item.early_paid_discount_applied"
                class="bi bi-currency-euro"
                aria-hidden="true"
              ></i>
            </div>

            <div v-if="item.is_active === 0" class="status-badge canceled">
              <small> Storniert am: {{ formatDate(item.cancelled_at) }} </small>
            </div>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <router-link :to="'/invoices/details/' + item.id" class="btn-details btn-details">
            <i class="bi bi-eye" aria-hidden="true"></i>
            Details
          </router-link>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <section v-if="!invoices || invoices.length === 0" class="empty-state">
      <i class="bi bi-receipt-cutoff empty-icon" aria-hidden="true"></i>
      <h3>Keine Rechnungen</h3>
      <p>Erstellen Sie neue Rechnungen, um sie hier zu sehen.</p>
    </section>
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
      total_count: 0,
      current_count: 0,
      isSort: true
    }
  },
  mounted() {
    if (store.state.date_filter) {
      this.date_box_start = store.state.date_filter.start
      this.date_box_end = store.state.date_filter.end
      this.filterDate()
      return
    }
    if (store.state.category_filter) {
      this.categories_filter = store.state.category_filter
      this.filterCategories()
      return
    }
    this.getInvoices()
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
        this.total_count = result.total
        this.current_count = result.rows.length
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
        const result = await window.api.filterInvoicesCategories(this.categories_filter)
        if (!result.success) return
        this.invoices = result.rows.map((row) => ({
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
    async searchFilter() {
      const term = this.search_box?.trim()
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
      this.total_count = result.total
      this.current_count = result.rows.length
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
          this.total_count = result.total
          this.current_count = result.rows.length
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
    printDocument() {
      window.print()
    }
  }
}
</script>
