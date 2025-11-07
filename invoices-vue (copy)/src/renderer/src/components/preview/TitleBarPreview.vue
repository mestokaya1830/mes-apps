<template lang="">
  <div class="titlebar">
    <span class="title">My App</span>
    <div class="window-controls">
      <button @click="minimize()">–</button>
      <!-- <button @click="maximize()">☐</button> -->
      <button @click="close()">×</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppTitleBar',
  methods: {
    async minimize() {
      await window.api.controlWindow('minimize')
    },
    // async maximize() {
    //   await window.api.controlWindow('maximize')
    // },
    async close() {
      await window.api.controlWindow('close')
    }
  }
}
</script>
<style scoped>
.titlebar {
  height: 60px;
  background: #0f172a;
  color: white;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.window-controls button {
  -webkit-app-region: no-drag;
}
.window-controls button {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  margin: 0 5px;
  width: 30px;
  transition: background-color 0.3s ease;
}
.window-controls button:hover {
  background-color: rgba(255, 255, 255, 0);
}
</style>
