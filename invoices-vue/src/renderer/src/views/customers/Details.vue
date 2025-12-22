<template>
  <div>
    <div v-if="customer" class="editor-panel">
      <div class="editor-header-block">
        <div class="editor-title">📝 {{ title }}</div>
      </div>

      <div class="customer-info">
        <p><strong>Firmentyp:</strong> {{ customer.company_type }}</p>
        <p><strong>Firmentyp:</strong> {{ customer.company_type }}</p>
        <p><strong>Kunden.Nr.:</strong> {{ formatCustomerId(customer.id) }}</p>
        <p><strong>Vorname:</strong> {{ customer.first_name }}</p>
        <p><strong>Nachname:</strong> {{ customer.last_name }}</p>
        <p><strong>Email:</strong> {{ customer.email }}</p>
        <p><strong>Steuernummer:</strong> {{ customer.tax_number }}</p>
        <p><strong>Adresse:</strong> {{ customer.address }}</p>
        <p><strong>Aktiv:</strong> {{ customer.is_active ? 'Ja' : 'Nein' }}</p>
       
        <button class="action-btn delete-btn" @click="deleteCustomer(customer.id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            ></path>
          </svg>
          Löschen
        </button>
      </div>
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
