<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="fetchInvoicesThisMonth">This Month</button>
    <button @click="fetchInvoicesThreeMonth">Three Months</button>
    <button @click="fetchInvoicesSixMonth">Six Months</button>
    <button @click="fetchInvoicesTwelveMonth">Twelve Months</button>
    <input v-model="date_box_start" type="date" @input="dateFilter()" />
    <input v-model="date_box_end" type="date" @input="dateFilter()" />
  </div>
</template>
<script>
export default {
  name: 'InvoicesReport',
  inject: ['formatCustomerId', 'formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Rechnung Report',
      search: [],
      search_box: '',
      date_box_start: '',
      date_box_end: ''
    }
  },
  methods: {
    isoToGerman(value) {
      const [y, m, d] = value.split('-')
      return `${d}.${m}.${y}`
    },
    async fetchInvoicesThisMonth() {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)

      console.log('iso format:', start)
      console.log('iso german format:', this.isoToGerman(end))
    },
    async fetchInvoicesThreeMonth() {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 3, 0)

      console.log(start, end)
    },
    async fetchInvoicesSixMonth() {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 6, 0)

      console.log(start, end)
    },
    async fetchInvoicesTwelveMonth() {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 12, 0)

      console.log(start, end)
    },
    dateFilter() {
      console.log(this.date_box_start, this.date_box_end)
    }
  }
}
</script>
<style></style>
