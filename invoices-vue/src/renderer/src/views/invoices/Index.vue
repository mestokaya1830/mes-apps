<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/invoices/create" class="link">Add New Invoice</router-link>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Invoices Page'
    }
  },
  mounted() {},
  methods: {}
}
</script>
