<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/devlivery/create" class="link">Add New Offer</router-link>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Delivery'
    }
  }
}
</script>
