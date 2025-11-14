<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/invoices/create" class="link">Neue Rechnung erstellen</router-link>
      <p v-if="invoiceList">{{ invoiceList }}</p>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Rechnungen List',
      invoiceList: null
    }
  },
  mounted() {
    this.getInvoiceList()
  },
  methods: {
    async getInvoiceList() {
      try {
        const result = await window.api.getDocument('invoices')
        this.invoiceList = result.rows
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
