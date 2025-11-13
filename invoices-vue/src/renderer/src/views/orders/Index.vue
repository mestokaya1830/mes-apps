<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/orders/create" class="link">Neuen Auftrag erstellen</router-link>
      <p v-if="ordersList">{{ ordersList }}</p>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Aufträge',
      ordersList: null
    }
  },
  mounted() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      try {
        const result = await window.api.getDocument('orders')
        this.ordersList = result.rows
        console.log(this.ordersList)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
