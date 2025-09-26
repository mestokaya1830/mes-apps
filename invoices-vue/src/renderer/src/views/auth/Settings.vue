<template>
  <div>
    <h1>{{ title }}</h1>
    <form>
      <div>
        <label for="bank">Bank Name</label>
        <input id="bank" v-model="settings.bank_name" type="text" />
      </div>
      <div>
        <label for="iban">Iban</label>
        <input id="iban" v-model="settings.iban" type="text" />
      </div>
      <div>
        <label for="bank_account_holder">Bank Account Holder</label>
        <input id="bank_account_holder" v-model="settings.bank_account_holder" type="text" />
      </div>
      <div>
        <label for="bic">Bic</label>
        <input id="bic" v-model="settings.bic" type="text" />
      </div>
      <div>
        <label for="language">Language</label>
        <input id="language" v-model="settings.language" type="text" />
      </div>
    </form>
    {{ settings }}
    <button @click="saveSettings()">Save</button>
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
      bank_name: this.$store.state.auth.bank_name,
      iban: this.$store.state.auth.iban,
      bank_account_holder: this.$store.state.auth.bank_account_holder,
      bic: this.$store.state.auth.bic,
      language: this.$store.state.auth.language
    }
  },
  methods: {
    async saveSettings() {
      console.log(this.settings)
    }
  }
}
</script>

<style>
/* Stil tanımlamaları buraya eklenebilir */
</style>
