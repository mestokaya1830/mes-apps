<template>
  <div v-if="customer" class="main-container">
    <!-- Header -->
    <div class="main-header">
      <h1 class="main-title">{{ title }}</h1>
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
    <div class="action-btn">
      <router-link :to="`/customers/edit/${customer.id}`">
        <button class="btn edit-btn">Edit</button>
      </router-link>
      <button class="btn delete-btn" @click="deleteCustomer(customer.id)">Löschen</button>
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
/* Header */
.main-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.preview-title {
  font-size: 1.8rem;
  font-weight: bold;
}

/* Card */
.customer-info.card {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  margin-bottom: 20px;
}

/* Grid for customer info */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
}
.info-item {
  font-size: 0.95rem;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
.info-item:last-child {
  border-bottom: none;
}

/* Action Buttons */
.action-btn {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.edit-btn {
  width: fit-content;
  background-color: yellow;
}
.delete-btn {
  width: fit-content;
  background-color: #dc3545;
  color: #fff;
}

</style>
