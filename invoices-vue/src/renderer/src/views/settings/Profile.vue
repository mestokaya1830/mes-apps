<template>
  <div>
    <h1>{{ title }}</h1>
    <template v-for="(value, key) in profile" :key="key">
      <div class="profile-container">
        <div class="profile-label">{{ key }}:</div>
        {{ value }}
      </div>
      <img
        v-if="key === 'logo'"
        class="profile-logo"
        src="@renderer/assets/Musterfirma_GmbH.png"
        alt=""
      />
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

</style>
