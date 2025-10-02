<template>
  <div>
    <h1>{{ title }}</h1>
    <template v-for="(value, key) in user" :key="key">
      <div class="profile-container">
        <span class="profile-label">{{ key }}:</span>
        <span v-if="key !== 'logo'">{{ value }}</span>
        <img
          v-if="key === 'logo'"
          :src="`data:image/png;base64,${value}`"
          alt=""
          class="profile-logo"
        />
      </div>
    </template>
    <router-link to="/edit-user">Edit User</router-link>
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
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style>
.profile-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.profile-label {
  font-weight: bold;
  margin-right: 10px;
}
.profile-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 5px;
}
</style>