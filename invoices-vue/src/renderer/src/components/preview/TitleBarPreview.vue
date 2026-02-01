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
