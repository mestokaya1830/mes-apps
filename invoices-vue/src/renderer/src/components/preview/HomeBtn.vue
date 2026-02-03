<template lang="">
  <div>
    <router-link :to="link" class="add-btn">
      <i class="bi bi-person-plus-fill"></i>
      <span>Neu Kunde hinzufügen</span>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'HomeBtn',
  props: {
    link: {
      type: String,
      required: true
    }
  }
}
</script>
