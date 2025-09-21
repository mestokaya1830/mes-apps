<template lang="">
  <div class="container">
    <SideBar></SideBar>
    <router-view class="layouts"></router-view>
  </div>
</template>

<script>
import SideBar from './components/SideBar.vue'
export default {
  components: {
    SideBar
  }
}
</script>

<style>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.layouts {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 50px;
  margin-left: 260px; /* Sidebar'ın genişliği kadar margin */
  overflow-y: auto; /* İçerik taşarsa scroll */
}
</style>