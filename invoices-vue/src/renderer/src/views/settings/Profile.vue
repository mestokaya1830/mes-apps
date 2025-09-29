<template>
  <div>
    <h1>{{ title }}</h1>
    <template v-for="(value, key) in profile" :key="key">
      <div class="profile-container">
        <div class="profile-label">{{ key }}:</div>
        {{ value }}
      </div>
      <img v-if="key === 'logo'" :src="`file://${value}`" alt="Logo" class="logo-img" />
    </template>
    <router-link to="/settings">Settings</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Profile',
      profile: {}
    }
  },
  mounted() {
    this.profile = this.$store.state.auth
  }
}
</script>

<style>
/* Stil tanımlamaları buraya eklenebilir */
</style>
