<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/offers/create" class="link">Neues Angebot erstellen</router-link>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Angebote List'
    }
  }
}
</script>
