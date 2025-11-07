<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/orders/create" class="link">Neuen Auftrag erstellen</router-link>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Aufträge'
    }
  }
}
</script>
