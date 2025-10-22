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
      formatCurrency(value, currency) {
        if (currency) {
          const num = parseFloat(value) || 0
          return new Intl.NumberFormat(currency.substr(4), {
            style: 'currency',
            currency: currency.substr(0, 3)
          }).format(num)
        }
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
      },
      storePreview: this.storePreview
    }
  },
  data() {
    return {
      dinamicStore: {}
    }
  },
  computed: {
    subtotal() {
      return this.dinamicStore.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.dinamicStore.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.dinamicStore.paid_amount
    }
  },
  methods: {
    storePreview(data, storeLink, storeCommit) {
      if (data) this.dinamicStore = data
      try {
        this.dinamicStore.positions = this.dinamicStore.positions.map((pos) => ({
          ...pos,
          unit_total: parseFloat((pos.quantity * pos.price * (1 + pos.vat / 100)).toFixed(2))
        }))
        //i used commit because "this" keyword not working in provider
        this.$store.commit(storeCommit, {
          id: this.dinamicStore.id,
          date: this.dinamicStore.date,
          service_period: this.dinamicStore.service_period,
          paid_amount: this.dinamicStore.paid_amount,
          payment_terms: this.dinamicStore.payment_terms,
          verwendung: this.dinamicStore.verwendung,
          is_small_company: this.dinamicStore.is_small_company,
          positions: this.dinamicStore.positions,
          subtotal: this.subtotal.toFixed(2),
          vat_amount: this.vatAmount.toFixed(2),
          total: this.grandTotal.toFixed(2),
          outstanding: this.outstanding.toFixed(2),
          currency: this.dinamicStore.currency,
          selected_customer: { ...this.dinamicStore.selected_customer },
          contact_person: { ...this.dinamicStore.contact_person }
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
