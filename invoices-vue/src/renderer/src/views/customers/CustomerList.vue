<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <router-link to="/customer-new" exact-active-class="active">Add New Customer</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Customer List'
    }
  }
}
</script>
