<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/orders/create" class="link">Add New Order</router-link>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Orders'
    }
  }
}
</script>
