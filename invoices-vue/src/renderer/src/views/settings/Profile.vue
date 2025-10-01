<template>
  <div>
    <h1>{{ title }}</h1>
    <template v-for="(value, key) in user" :key="key">
      <div class="profile-container">
        <span class="profile-label">{{ key }}:</span>
        <span v-if="key !== 'logo'">{{ value }}</span>
        <img v-if="key === 'logo'" :src="`data:image/png;base64,${value}`" alt="" />
      </div>
    </template>
    <router-link to="/settings">Settings</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Profile',
      user: {}
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser() {
      try {
        const response = await window.api.getUser()
        this.user = response.user
        console.log(this.user)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
