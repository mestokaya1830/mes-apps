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
      dinamicData: null
    }
  },
  computed: {
    subtotal() {
      return this.dinamicData.events.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.dinamicData.events.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    total() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      if (this.dinamicData.events.payment.paid_amount) {
        return this.total - this.dinamicData.events.payment.paid_amount
      }
      return 0
    }
  },
  methods: {
    storePreview(data, storeLink, storeCommit) {
      if (data) this.dinamicData = data
      try {
        // this.dinamicStore.positions = this.dinamicStore.positions.map((pos) => ({
        //   ...pos,
        //   unit_total: parseFloat((pos.quantity * pos.price * (1 + pos.vat / 100)).toFixed(2))
        // }))
        //i used commit because "this" keyword not working in provider
        this.$store.commit(storeCommit, {
          id: data.id,
          source_page: data.source_page,
          date: data.date,
          valid_days: data.valid_days,
          verwendungzweck: data.verwendungzweck,
          events: { ...data.events },
          summary: {
            subtotal: this.subtotal.toFixed(2),
            vat_amount: this.vatAmount.toFixed(2),
            total: this.total.toFixed(2),
            outstanding: this.outstanding.toFixed(2)
          },
          selected_customer: { ...data.selected_customer },
          contact_person: { ...data.contact_person }
        })
        this.$router.push(`/${storeLink}-preview`)
      } catch (error) {
        console.error('Error storing invoice preview:', error)
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
