<template>
  <div>
    <TitleBar />
    <div class="container">
      <SideBar />
      <router-view class="layouts" />
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
    const self = this
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
      formatValidDays(baseDate, validDays) {
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
        if (currency == undefined) {
          currency = 'EUR.de-DE'
          const num = parseFloat(value) || 0
          const [curr, locale] = currency.split('.')
          return new Intl.NumberFormat(locale, { style: 'currency', currency: curr }).format(num)
        }
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
          pos.service_period_end = ''
        }
      },
      storePreview: self.storePreview
    }
  },

  data() {
    return {}
  },

  methods: {
    async storePreview(storeName, storeData) {
      if (!storeData || !store) return
      try {
        const subtotal = storeData.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
        const vatAmount = storeData.positions.reduce(
          (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
          0
        )
        const total = subtotal + vatAmount
        const paidAmount = storeData.payment?.paid_amount || 0
        const outstanding = total - paidAmount

        const data = {
          ...storeData,
          summary: {
            subtotal,
            vat_amount: vatAmount,
            total,
            paid_amount: paidAmount,
            outstanding
          }
        }

        if (data) {
          await store.setStore(storeName, JSON.parse(JSON.stringify(data)))
        }
      } catch (error) {
        console.error('Error storing preview:', error)
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
