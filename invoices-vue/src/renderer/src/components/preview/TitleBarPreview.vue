<template lang="">
  <main class="titlebar">
    <header class="titlebar-title">
      <h1>My App</h1>
    </header>

    <div class="window-controls" role="toolbar" aria-label="Fenstersteuerung">
      <button aria-label="Minimieren" @click="minimize()">–</button>
      <button aria-label="Schließen" @click="close()">×</button>
    </div>
  </main>
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
