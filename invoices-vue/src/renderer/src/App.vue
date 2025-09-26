<template lang="">
  <div>
    <div id="titlebar">
      <span id="title">My App</span>
      <div id="window-controls">
        <button @click="minimize()">–</button>
        <button @click="maximize()">☐</button>
        <button @click="close()">×</button>
      </div>
    </div>
    <div class="container">
      <SideBar></SideBar>
      <router-view class="layouts"></router-view>
    </div>
  </div>
</template>

<script>
import SideBar from './components/SideBar.vue'
export default {
  components: {
    SideBar
  },
  data() {
    return {}
  },
  methods: {
    async minimize() {
      console.log('minimize')
      await window.api.controlWindow('minimize')
    },
    async maximize() {
      await window.api.controlWindow('maximize')
    },
    async close() {
      await window.api.controlWindow('close')
    }
  }
}
</script>

<style>
.container {
  display: flex;
  width: 100%;
  height: calc(100vh - 60px);
  margin-top: 60px;
}

.layouts {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 50px;
  margin-left: 260px; /* Sidebar'ın genişliği kadar margin */
  overflow-y: auto; /* İçerik taşarsa scroll */
}
</style>
