<template>
  <div>
    <h1>{{ title }}</h1>
    {{ settings }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Settings',
      settings: {}
    }
  },
  mounted() {
    this.settings = {
      bank: this.$store.state.auth.bank,
      iban: this.$store.state.auth.iban,
      bank_account_holder: this.$store.state.auth.bank_account_holder,
      bic: this.$store.state.auth.bic,
      language: this.$store.state.auth.language
    }
  }
}
</script>

<style>
/* Stil tanımlamaları buraya eklenebilir */
</style>
