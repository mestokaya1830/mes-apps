<template>
  <div>
    <TitleBar />
    <div class="app-container">
      <SideBar />
      <div ref="container" class="layouts">
        <router-view />
      </div>
    </div>
    <div v-if="showGoTop" class="go-top-button" @click="scrollToTop">
        <i class="bi bi-arrow-up go-top-icon"></i>
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
        if (!total || total === 0) return '0%'
        return ((value / total) * 100).toFixed(0) + '%'
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

<style>
.titlebar {
  height: 60px;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  color: white;
  -webkit-app-region: drag;
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

.window-controls button {
  -webkit-app-region: no-drag;
}
.window-controls button {
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
.window-controls button:hover {
  background-color: rgba(255, 255, 255, 0);
}
.app-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: calc(100vh - 60px);
  margin-top: 60px;
}

.layouts {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}
.go-top-button {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  color: white;
  border-radius: 50%;
  padding: 10px 18px;
  cursor: pointer;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.go-top-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.go-top-icon {
  font-size: 24px;
}

/* ===== SIDEBAR ===== */
.sidebar {
  display: flex;
  flex-direction: column;
  color: white;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  overflow-x: auto;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.app-logo {
  padding: 2rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.nav-menu {
  list-style: none;
  padding: 16px 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.95rem;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(59, 165, 92, 0.2) 0%, rgba(59, 165, 92, 0.05) 100%);
  color: white;
  font-weight: 600;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #12B486;
}

.nav-icon {
  width: 36px;
  text-align: center;
  font-size: 24px;
  color: #12B486;
}
.nav-label {
  padding: 0 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.2);
  margin-top: auto;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3ba55c 0%, #122c19 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.sidebar-footer h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.sidebar-footer p {
  margin-top: auto;
  font-size: 0.8rem;
  color: #9ca3af;
}

.logout-link {
  color: #f87171;
}

.logout-link:hover {
  background: rgba(248, 113, 113, 0.1);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .nav-item {
    justify-content: center;
    padding: 1rem;
  }

  .nav-text {
    display: none;
  }

  .nav-icon {
    margin-right: 0;
  }
}
</style>
