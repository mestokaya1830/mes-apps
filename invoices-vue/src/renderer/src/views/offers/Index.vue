<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/offers/create" class="link">Neues Angebot erstellen</router-link>
      <p v-if="offersList">{{ offersList }}</p>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Angebote List',
      offersList: null
    }
  },
  mounted() {
    this.getOffersList()
  },
  methods: {
    async getOffersList() {
      try {
        const result = await window.api.getDocument('offers')
        this.offersList = result.rows
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
