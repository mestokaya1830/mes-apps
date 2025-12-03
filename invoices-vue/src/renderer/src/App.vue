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
      formatInvoiceId(value) {
        if (!value) return ''
        return `RE-${String(value).padStart(5, '0')}`
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
      // formatValidDays(baseDate, validDays) {
      //   if (!baseDate || !validDays) return ''
      //   const d = new Date(baseDate)
      //   d.setDate(d.getDate() + Number(validDays))
      //   return d.toLocaleDateString('de-DE', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric'
      //   })
      // },
      formatCurrency(value, currency) {
        if (currency == undefined) {
          currency = 'EUR.de-DE'
        }
        const num = parseFloat(value) || 0
        const [curr, locale] = currency.split('.')
        return new Intl.NumberFormat(locale, { style: 'currency', currency: curr }).format(num)
      },
      formatNumber(value) {
        return new Intl.NumberFormat('de-DE').format(value || 0)
      },
      checkServiceDates(start, end) {
        if (!start) {
          this.$refs.service_date.focus?.()
          return
        }

        if (!end) {
          this.$refs.date.focus?.()
          return
        }

        if (start > end) {
          this.$refs.date.focus?.()
          console.log(`❌ Startdatum darf nicht nach Enddatum liegen.`)
          return
        }
        return true
      },
      checkPositionsDates(positions) {
        for (let i = 0; i < positions.length; i++) {
          if (!positions[i].service_period_start) {
            this.$refs.service_period_start[i].focus?.()
            return
          }

          if (!positions[i].service_period_end) {
            this.$refs.service_period_end[i].focus?.()
            return
          }

          if (positions[i].service_period_start > positions[i].service_period_end) {
            this.$refs.service_period_end[i].focus?.()
            console.log(`❌ Position ${i + 1}: Startdatum darf nicht nach Enddatum liegen.`)
            return
          }
        }
        return true
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
