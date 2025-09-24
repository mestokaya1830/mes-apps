<template>
  <div>
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="(value, key) in profile" :key="key">
        <strong>{{ key }}:</strong> {{ value }}
      </li>
    </ul>
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
