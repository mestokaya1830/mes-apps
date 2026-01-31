<template>
  <div class="main-container">
    <div class="main-header">
      <label>{{ title }} {{ offers.length }}</label>
      <router-link to="/customers" class="btn add-btn">
         <i class="bi bi-plus-circle add-icon"></i>
        <span>Neues Angebot erstellen</span>
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
        type="search"
        placeholder="Suce..."
        class="inputs"
        @input="searchOffer()"
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

    <!-- Offers Grid -->
    <div class="list-grid">
      <div v-for="item in offers" :key="item.id" class="list-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-header-left">
            <div class="list-avatar">
              {{ getInitials(item.customer.first_name, item.customer.last_name) }}
            </div>
            <div class="list-info">
              <h3 class="list-name">{{ formatOfferId(item.id) }}</h3>
              <span class="list-type-badge">{{ item.customer.company_name }}</span>
            </div>
          </div>
          <div class="status-badge">
            {{
              item.status === 'draft'
                ? 'Entwurf'
                : item.status === 'sent'
                  ? 'Gesendet'
                  : item.status === 'accepted'
                    ? 'Angenommen'
                    : 'Abgelehnt'
            }}
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <router-link :to="'/offers/details/' + item.id" class="details-btn btn-details">
            <i class="bi bi-eye"></i>
            Details
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="offers" class="empty-state">
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
      <h3>Keine Angebote</h3>
      <p>Erstellen Sie neue Angebote, um sie hier zu sehen.</p>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['formatOfferId'],
  data() {
    return {
      title: 'Angebote',
      offers: [],
      search_box: '',
      date_box_start: '',
      date_box_end: '',
      isSort: true
    }
  },
  mounted() {
    this.getOffers()
  },
  methods: {
    async getOffers() {
      try {
        const result = await window.api.getOffers()
        this.offers = result.rows.map((item) => ({
          ...item,
          customer: JSON.parse(item.customer)
        }))
        console.log(this.offers)
      } catch (error) {
        console.error(error)
      }
    },
    getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '??'
    },
    sorting(key) {
      if (!key) return
      this.offers.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    }
  }
}
</script>
