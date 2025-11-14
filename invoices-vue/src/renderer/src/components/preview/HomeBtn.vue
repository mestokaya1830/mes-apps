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
<style>
.home-btn {
  position: fixed;
  top: 105px;
  right: 40px;
  background: #667eea;
  color: white;
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  cursor: pointer;
  transition: all 0.2s ease;
}

.home-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}
</style>
