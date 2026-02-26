<template>
  <main v-if="offers" class="main-container">
    <header class="main-header">
      <h1>{{ title }} {{ total_count }} / {{ current_count }}</h1>
      <router-link to="/customers" class="btn btn-primary">
        <i class="bi bi-plus-circle-fill icons" aria-hidden="true"></i>
        <span>Neues Angebot erstellen</span>
      </router-link>
    </header>

    <!-- FILTER -->
    <section class="main-filter">
      <select v-model="categories_filter" class="inputs select" @change="filterCategories">
        <option value="" disabled>Status</option>
        <option value="all">Alle</option>
        <option value="draft">Entwurf</option>
        <option value="sent">Gesendet</option>
        <option value="accepted">Angenommen</option>
        <option value="rejected">Abgelehnt</option>
        <option value="expired">Abgelaufen</option>
        <option value="canceled">Storniert</option>
      </select>

      <input
        v-model="search_box"
        class="inputs"
        placeholder="Kunde, Firma oder Angebots-ID suchen... "
        @input="searchFilter"
      />

      <div class="date-wrapper">
        <i class="bi bi-calendar-event calendar-icon" aria-hidden="true"></i>
        <input v-model="date_box_start" type="date" class="inputs date" @input="filterDate" />
      </div>

      <div class="date-wrapper">
        <i class="bi bi-calendar-check calendar-icon" aria-hidden="true"></i>
        <input v-model="date_box_end" type="date" class="inputs date" @input="filterDate" />
      </div>

      <div class="sort-btn" @click="sorting('id')">
        <i class="bi bi-arrow-down-up"></i>
      </div>
      <i
        class="bi bi-printer form-title icons list-print-icon"
        aria-hidden="true"
        @click="printDocument"
      ></i>
    </section>

    <!-- LIST -->
    <section class="list-grid printable">
      <div v-for="item in offers" :key="item.id" class="list-card">
        <div class="card-header">
          <div class="card-header-left">
            <div class="list-avatar">
              {{ avatarStyle(item.customer?.first_name, item.customer?.last_name) }}
            </div>
            <div class="list-info">
              <h3 class="list-id">{{ formatOfferId(item.id) }}</h3>

              <span class="list-type-badge">
                <i class="bi bi-building icons" aria-hidden="true"></i>
                {{ item.customer?.company_name }}
              </span>
              <br />

              <span class="list-name">
                {{ item.customer?.first_name }} {{ item.customer?.last_name }}
              </span>
            </div>
          </div>

          <div class="status-badge-container">
            <div class="status-badge" :class="item.status">
              {{ statusLabel(item.status) }}
            </div>

            <div class="status-badge total">
              {{ formatCurrency(item.gross_total, item.currency) }}
            </div>

            <div class="offer-dates">
              <small>Gültig bis: {{ formatDate(item.valid_until) }}</small>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <router-link :to="'/offers/details/' + item.id" class="details-btn btn-details">
            <i class="bi bi-eye-fill icons" aria-hidden="true"></i>
            Details
          </router-link>
        </div>
      </div>
    </section>

    <!-- EMPTY -->
    <section v-if="!offers || offers.length === 0" class="empty-state text-center py-5">
      <i
        class="bi bi-file-earmark-x text-muted icons"
        aria-hidden="true"
        style="font-size: 4rem"
      ></i>
      <h3 class="mt-3">Keine Angebote</h3>
      <p>Erstellen Sie neue Angebote, um sie hier zu sehen.</p>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Offers',
  inject: ['formatOfferId', 'formatDate', 'formatCurrency'],

  data() {
    return {
      title: 'Angebote',
      offers: [],
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
    this.getOffers()
  },

  methods: {
    async getOffers() {
      const result = await window.api.getOffers()
      if (!result.success) return

      this.offers = result.rows.map((row) => ({
        ...row,
        customer: row.customer ? JSON.parse(row.customer) : null
      }))

      this.total_count = result.total
      this.current_count = result.rows.length
    },

    avatarStyle(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '??'
    },

    statusLabel(status) {
      const labels = {
        draft: 'Entwurf',
        sent: 'Gesendet',
        accepted: 'Angenommen',
        rejected: 'Abgelehnt',
        expired: 'Abgelaufen',
        canceled: 'Storniert'
      }
      return labels[status] || status
    },

    async filterCategories() {
      const result = await window.api.filterOffersCategories(this.categories_filter)
      if (!result.success) return

      this.offers = result.rows.map((row) => ({
        ...row,
        customer: row.customer ? JSON.parse(row.customer) : null
      }))

      this.total_count = result.total
      this.current_count = result.rows.length
    },

    async searchFilter() {
      const term = this.search_box?.trim()
      if (!term) return this.getOffers()
      if (term.length < 3) return

      const result = await window.api.searchOffers(term)
      if (!result.success) return

      this.offers = result.rows.map((row) => ({
        ...row,
        customer: row.customer ? JSON.parse(row.customer) : null
      }))

      this.total_count = result.total
      this.current_count = result.rows.length
    },

    async filterDate() {
      if (!this.date_box_start || !this.date_box_end) return
      if (this.date_box_start > this.date_box_end) return

      const result = await window.api.filterOffersDate({
        start: this.date_box_start,
        end: this.date_box_end
      })

      if (!result.success) return

      this.offers = result.rows.map((row) => ({
        ...row,
        customer: row.customer ? JSON.parse(row.customer) : null
      }))

      this.total_count = result.total
      this.current_count = result.rows.length
    },

    sorting(key) {
      if (!key) return

      this.offers.sort((a, b) => {
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
