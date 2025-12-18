<template lang="">
  <div>
    <router-link :to="link" class="add-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span>Neu Kunde hinzufügen</span>
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
