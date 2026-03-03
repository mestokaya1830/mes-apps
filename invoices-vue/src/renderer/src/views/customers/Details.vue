<template>
  <main v-if="customer" class="main-container">
    <!-- Header -->
    <header class="page-header">
      <h1 for="">{{ title }}</h1>
      <router-link to="/customers" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons" aria-hidden="true"></i>Zurück
      </router-link>
    </header>

    <!-- Customer Info Card -->
    <section class="customer-info card" aria-label="Kundendaten">
      <dl class="info-grid">
        <div class="info-item">
          <dt>Kunden-Nr.:</dt>
          <dd>{{ formatCustomerId(customer.id) }}</dd>
        </div>
        <div class="info-item">
          <dt>Datum:</dt>
          <dd>{{ formatDate(customer.date) }}</dd>
        </div>
        <div class="info-item">
          <dt>Firma:</dt>
          <dd>{{ customer.company_name }}</dd>
        </div>
        <div class="info-item">
          <dt>Firmentyp:</dt>
          <dd>{{ customer.company_type }}</dd>
        </div>
        <div class="info-item">
          <dt>Vorname:</dt>
          <dd>{{ customer.first_name }}</dd>
        </div>
        <div class="info-item">
          <dt>Nachname:</dt>
          <dd>{{ customer.last_name }}</dd>
        </div>
        <div class="info-item">
          <dt>Email:</dt>
          <dd>{{ customer.email }}</dd>
        </div>
        <div class="info-item">
          <dt>Adresse:</dt>
          <dd>{{ customer.address }}</dd>
        </div>
        <div class="info-item">
          <dt>PLZ:</dt>
          <dd>{{ customer.postal_code }}</dd>
        </div>
        <div class="info-item">
          <dt>Stadt:</dt>
          <dd>{{ customer.city }}</dd>
        </div>
        <div class="info-item">
          <dt>Telefon:</dt>
          <dd>{{ customer.phone }}</dd>
        </div>
        <div class="info-item">
          <dt>Website:</dt>
          <dd>{{ customer.website }}</dd>
        </div>
        <div class="info-item">
          <dt>USt-IdNr.:</dt>
          <dd>{{ customer.vat_id }}</dd>
        </div>
        <div class="info-item">
          <dt>Steuernummer:</dt>
          <dd>{{ customer.tax_number }}</dd>
        </div>
        <div class="info-item">
          <dt>Aktiv:</dt>
          <dd>{{ customer.is_active ? 'Ja' : 'Nein' }}</dd>
        </div>
      </dl>
    </section>

    <!-- Actions -->
    <footer class="sections btn-container">
      <router-link :to="`/customers/edit/${customer.id}`" class="btn btn-edit">
        Bearbeiten
      </router-link>
      <button type="button" class="btn btn-delete" @click="deleteCustomer(customer.id)">Löschen</button>
    </footer>
  </main>
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
