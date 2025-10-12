<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/invoices/create" class="link">Neue Rechnung hinzufügen</router-link>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Rechnungen List'
    }
  },
  mounted() {},
  methods: {}
}
</script>
