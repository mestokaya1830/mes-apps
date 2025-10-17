<template lang="">
  <div>
    <div id="titlebar">
      <span id="title">My App</span>
      <div id="window-controls">
        <button @click="minimize()">–</button>
        <!-- <button @click="maximize()">☐</button> -->
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
  provide() {
    return {
      formatCustomerId(value) {
        if (!value) return ''
        return `KU-${String(value).padStart(5, '0')}`
      },
      formatCurrency(value) {
        const num = parseFloat(value) || 0
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR'
        }).format(num)
      },
      formatDate(value) {
        if (!value) return ''
        try {
          const d = new Date(value)
          if (isNaN(d)) return ''
          return d.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        } catch (error) {
          return error.message || ''
        }
      },
      validityDate: (baseDate, validDays) => {
        if (!baseDate || !validDays) return ''
        const d = new Date(baseDate)
        d.setDate(d.getDate() + Number(validDays))
        return d.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    async minimize() {
      console.log('minimize')
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
  padding: 30px 20px;
  overflow-y: auto; /* İçerik taşarsa scroll */
}
#titlebar {
  height: 60px; /* Burada yüksekliği sen belirlersin */
  background: #2f3542;
  color: white;
  -webkit-app-region: drag; /* sürüklenebilirlik */
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

#window-controls button {
  -webkit-app-region: no-drag; /* butonlar tıklanabilir olmalı */
}
#window-controls button {
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
#window-controls button:hover {
  background-color: rgba(255, 255, 255, 0);
}
</style>
