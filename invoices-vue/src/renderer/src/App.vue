<template>
  <div>
    <TitleBar />
    <div class="container">
      <SideBar />
      <div ref="container" class="layouts">
        <router-view class="router" />
      </div>
    </div>
    <div v-if="showGoTop" class="go-top-button" @click="scrollToTop">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <span>Go Top</span>
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
    const year = new Date().getFullYear()
    return {
      formatCustomerId(value) {
        if (!value) return ''
        return `KU-${year}-${String(value).padStart(5, '0')}`
      },
      formatInvoiceId(value) {
        if (!value) return ''
        return `RE-${year}-${String(value).padStart(5, '0')}`
      },
      formatOfferId(value) {
        if (!value) return ''
        return `ANG-${year}-${String(value).padStart(5, '0')}`
      },
      formatOrderId(value) {
        if (!value) return ''
        return `AUF-${year}-${String(value).padStart(5, '0')}`
      },
      formatPaymentId(value) {
        if (!value) return ''
        return `ZA-${year}-${String(value).padStart(5, '0')}`
      },
      formatReminderId(value) {
        if (!value) return ''
        return `MA-${year}-${String(value).padStart(5, '0')}`
      },
      formatDeliveryId(value) {
        if (!value) return ''
        return `LI-${year}-${String(value).padStart(5, '0')}`
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
        }
        const num = parseFloat(value) || 0
        const [curr, locale] = currency.split('.')
        return new Intl.NumberFormat(locale, { style: 'currency', currency: curr }).format(num)
      },
      checkServiceDates(start, end, ref1, ref2) {
        if (!start) {
          this.$refs[ref1].focus?.()
          this.error[ref1] = 'Startdatum darf nicht leer sein.'
          return
        }

        if (!end) {
          this.$refs[ref2].focus?.()
          this.error[ref2] = 'Enddatum darf nicht leer sein.'
          return
        }

        if (start > end) {
          this.$refs[ref2].focus?.()
          this.error[ref2] = 'Startdatum darf nicht nach Enddatum liegen.'
          return
        }
        return true
      },
      checkPositionsDates(positions) {
        for (let i = 0; i < positions.length; i++) {
          if (!positions[i].service_period_start) {
            this.$refs.service_period_start[i].focus?.()
            this.error.service_period_start = 'Startdatum darf nicht leer sein.'
            return
          }

          if (!positions[i].service_period_end) {
            this.$refs.service_period_end[i].focus?.()
            this.error.service_period_end = 'Enddatum darf nicht leer sein.'
            return
          }

          if (positions[i].service_period_start > positions[i].service_period_end) {
            this.$refs.service_period_end[i].focus?.()
            this.error.service_period_end = 'Startdatum darf nicht nach Enddatum liegen.'
            return
          }
        }
        return true
      },
      trimFormFields(data) {
        for (const item in data) {
          if (typeof data[item] === 'string') {
            data[item] = data[item].trim()
          }
        }
      },
      checkDueDate(value) {
        if (!value) return false
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const due_date = new Date(value)
        due_date.setHours(0, 0, 0, 0)

        return new Date(due_date) < today
      },
      formatPercentage(value, total) {
        if (!total || total === 0) return '0.00%'
        return ((value / total) * 100).toFixed(2) + '%'
      }
    }
  },

  data() {
    return {
      showGoTop: false
    }
  },
  mounted() {
    const container = this.$refs.container
    if (container) {
      container.addEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    handleScroll(event) {
      this.showGoTop = event.target.scrollTop > 300
    },
    scrollToTop() {
      const container = this.$refs.container
      if (container) {
        container.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style scoped>
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
.router {
  width: 90%;
}
.go-top-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #007bff;
  color: white;
  border-radius: 50px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;
}

.go-top-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.go-top-button svg {
  width: 20px;
  height: 20px;
}

.go-top-button span {
  font-size: 14px;
  font-weight: 500;
}
@media (max-width: 1260px) {
  .router {
    width: 90%;
  }
}
</style>
