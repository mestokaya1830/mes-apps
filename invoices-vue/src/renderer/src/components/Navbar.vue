<template lang="">
  <div>
    <nav>
      <router-link to="/" exact-active-class="active">Home</router-link>
      <router-link to="/invoices" exact-active-class="active">Invoices</router-link>
      <router-link to="/customers" exact-active-class="active">Customers</router-link>
      <router-link to="/about" exact-active-class="active">About</router-link>
      <router-link to="#" exact-active-class="active" @click="logout()">Logout</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    async logout() {
      await this.$store.commit('setAuth', null)
      this.$router.push('/login')
    }
  }
}
</script>