<template lang="">
  <div>
    <TitleBar></TitleBar>
    <div class="container">
      <SideBar></SideBar>
      <router-view class="layouts"></router-view>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue'
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
        if (currency) {
          const num = parseFloat(value) || 0
          return new Intl.NumberFormat(currency.substr(4), {
            style: 'currency',
            currency: currency.substr(0, 3)
          }).format(num)
        }
      },
      storePreview: this.storePreview
    }
  },
  data() {
    return {
      dynamicData: null
    }
  },
  computed: {
    subtotal() {
      if (!this.dynamicData || !this.dynamicData.events) return 0
      return this.dynamicData.events.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      if (!this.dynamicData || !this.dynamicData.events) return 0
      return this.dynamicData.events.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    total() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      if (!this.dynamicData || !this.dynamicData.events) return 0
      if (this.dynamicData.events.payment.paid_amount) {
        return this.total - this.dynamicData.events.payment.paid_amount
      }
      return 0
    }
  },
  methods: {
    async storePreview(storeCommit, createData) {
      if (createData && storeCommit) {
        this.dynamicData = createData
        try {
          const invoices = {
            id: createData.id,
            title: createData.title,
            source_page: createData.source_page,
            date: createData.date,
            valid_days: createData.valid_days,
            verwendungzweck: createData.verwendungzweck,
            events: createData.events,
            summary: {
              subtotal: this.subtotal.toFixed(2),
              vat_amount: this.vatAmount.toFixed(2),
              total: this.total.toFixed(2),
              outstanding: this.outstanding.toFixed(2)
            },
            selected_customer: createData.selected_customer
          }
          await store[storeCommit](JSON.parse(JSON.stringify(invoices)))
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
