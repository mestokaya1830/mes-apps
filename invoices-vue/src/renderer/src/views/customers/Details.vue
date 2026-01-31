<template>
  <div v-if="customer" class="main-container">
    <!-- Header -->
    <div class="main-header">
      <label>{{ title }}</label>
      <router-link to="/customers" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill me-1 icons"></i>Zurück
      </router-link>
    </div>

    <!-- Customer Info Card -->
    <div class="customer-info card">
      <div class="info-grid">
        <div class="info-item"><strong>Kunden-Nr.:</strong> {{ formatCustomerId(customer.id) }}</div>
        <div class="info-item"><strong>Datum:</strong> {{ formatDate(customer.date) }}</div>
        <div class="info-item"><strong>Firma:</strong> {{ customer.company_name }}</div>
        <div class="info-item"><strong>Firmentyp:</strong> {{ customer.company_type }}</div>
        <div class="info-item"><strong>Vorname:</strong> {{ customer.first_name }}</div>
        <div class="info-item"><strong>Nachname:</strong> {{ customer.last_name }}</div>
        <div class="info-item"><strong>Email:</strong> {{ customer.email }}</div>
        <div class="info-item"><strong>Adresse:</strong> {{ customer.address }}</div>
        <div class="info-item"><strong>PLZ:</strong> {{ customer.postal_code }}</div>
        <div class="info-item"><strong>Stadt:</strong> {{ customer.city }}</div>
        <div class="info-item"><strong>Telefon:</strong> {{ customer.phone }}</div>
        <div class="info-item"><strong>Website:</strong> {{ customer.website }}</div>
        <div class="info-item"><strong>USt-IdNr.:</strong> {{ customer.vat_id }}</div>
        <div class="info-item"><strong>Steuernummer:</strong> {{ customer.tax_number }}</div>
        <div class="info-item"><strong>Aktiv:</strong> {{ customer.is_active ? 'Ja' : 'Nein' }}</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="sections btn-container">
      <router-link :to="`/customers/edit/${customer.id}`">
        <button class="btn btn-edit">Edit</button>
      </router-link>
      <button class="btn btn-delete" @click="deleteCustomer(customer.id)">Löschen</button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['formatCustomerId', 'formatDate'],
  data() {
    return {
      title: 'Kunden Details',
      customer: null,
      counts: null
    }
  },
  mounted() {
    this.getCustomer()
  },
  methods: {
    async getCustomer() {
      try {
        const result = await window.api.customerDetails(this.$route.params.id)
        if (!result.success) return
        this.customer = result.data.customer
        this.counts = result.data.counts
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
          this.$router.push({ name: 'customers' })
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>

<style scoped>
/* Card */
.customer-info.card {
  padding: 30px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 20px;
}

/* Grid for customer info */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 40px;
}

.info-item {
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.info-item strong {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
</style>