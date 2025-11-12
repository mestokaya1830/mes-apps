<template>
  <div>
    <TitleBar></TitleBar>
    <div class="container">
      <SideBar></SideBar>
      <router-view class="layouts"></router-view>
    </div>
  </div>
</template>

<script>
import store from './store/store.js'
import TitleBar from './components/preview/TitleBarPreview.vue'
import SideBar from './components/preview/SideBarPreview.vue'
export default {
  components: {
    TitleBar,
    SideBar
  },
  provide() {
    return {
      formatCustomerId(value) {
        if (!value) return ''
        return `KU-${String(value).padStart(5, '0')}`
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
      formatValidDays: (baseDate, validDays) => {
        if (!baseDate || !validDays) return ''
        const d = new Date(baseDate)
        d.setDate(d.getDate() + Number(validDays))
        return d.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      },
      formatCurrency(value, currency) {
        if (!currency) return '0,00 €' // Default değer
        const num = parseFloat(value) || 0
        return new Intl.NumberFormat(currency.substr(4), {
          style: 'currency',
          currency: currency.substr(0, 3)
        }).format(num)
      },
      formatNumber(value) {
        return new Intl.NumberFormat('de-DE').format(value || 0)
      },
      validateServicePeriod(pos) {
        if (!pos.service_period_start || !pos.service_period_end) return

        const start = new Date(pos.service_period_start)
        const end = new Date(pos.service_period_end)

        if (start > end) {
          alert('❌ Das Startdatum darf nicht nach dem Enddatum liegen.')
          pos.service_period_end = '' // ← Reactive veri güncelleniyor
        }
      },
      storePreview: this.storePreview
    }
  },

  data() {
    return {
      storeData: null
    }
  },
  computed: {
    subTotal() {
      if (!this.storeData) return 0
      return this.storeData.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      if (!this.storeData) return 0
      return this.storeData.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    total() {
      return this.subTotal + this.vatAmount // Parantez kaldırıldı
    },
    outstanding() {
      if (!this.storeData) return 0
      if (this.storeData.payment.paid_amount) {
        return this.total - this.storeData.payment.paid_amount // Parantez kaldırıldı
      }
      return 0
    }
  },
  methods: {
    async storePreview(storeCommit, createData) {
      // console.log('Create data...', storeCommit, createData)
      if (createData && storeCommit) {
        try {
          this.storeData = {
            ...createData,
            summary: {
              subtotal: this.subTotal,
              vat_amount: this.vatAmount,
              total: this.total,
              paid_amount: createData.payment.paid_amount || 0,
              outstanding: this.outstanding || 0
            }
          }
          await store[storeCommit](JSON.parse(JSON.stringify(this.storeData)))
          console.log('storeData', this.storeData)
        } catch (error) {
          console.error('Error storing preview:', error)
        }
      }
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
  overflow-y: auto;
}
</style>
