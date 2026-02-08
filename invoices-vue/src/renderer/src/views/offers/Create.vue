

<script>
import store from '../../store/store.js'
export default {
  name: 'CreateOffer',
  inject: ['formatCurrency', 'checkServiceDates'],
  data() {
    return {
      title: 'Angebot erstellen',
      error: {},
      offer: {
        id: 0,
        customer_id: 0, //for foreing key

        date: '',
        valid_until: '',

        customer: null,

        subject: '',
        currency: 'EUR.de-DE',
        payment_terms: '',
        delivery_terms: '',
        delivery_time: '',

        introduction_text: '',
        closing_text: '',
        notes: '',
        internal_notes: '',

        status: 'draft',
        status_by: '',
        status_comments: '',

        is_active: 1,
        is_legal: 0,

        positions: [],
        net_total: 0,
        vat_total: 0,
        gross_total: 0
      }
    }
  },
  mounted() {
    this.getCustomer()
    this.getStore()
  },
  methods: {
    async getCustomer() {
      if (!this.$route.query.id) return
      try {
        const data = {
          id: this.$route.query.id,
          table_name: 'offers'
        }
        const result = await window.api.getCustomerById(data)
        console.log(result)
        if (!result.success) return
        this.offer.id = result.last_id == 0 ? 1 : result.last_id
        this.offer.customer = result.rows
        this.offer.customer_id = result.rows.id
      } catch (error) {
        console.error(error)
      }
    },
    getStore() {
      if (!store.state.offer) return
      this.offer = JSON.parse(JSON.stringify(store.state.offer))
    },
    addPosition() {
      if (!this.offer.positions) return
      this.offer.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        service_period_start: '',
        service_period_end: '',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19,
        unit_total: 0
      })
      this.error.positions = ''
    },
    deletePosition(index) {
      if (!this.offer.positions) return
      if (this.offer.positions.length > 0) {
        this.offer.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    validateDates() {
      let isValid = true

      // Check (service date)
      if (!this.offer.service_date) {
        this.error.service_date = 'Leistungsdatum ist erforderlich'
        this.$refs.service_date.focus()
        isValid = false
        return isValid
      }

      // Check (offer date)
      if (!this.offer.date) {
        this.error.date = 'Rechnungsdatum ist erforderlich'
        this.$refs.date.focus()
        isValid = false
        return isValid
      }

      // NEW: offer date cannot be before service date
      if (new Date(this.offer.date) < new Date(this.offer.service_date)) {
        this.error.date = 'Rechnungsdatum kann nicht vor dem Leistungsdatum liegen'
        this.$refs.date.focus()
        isValid = false
        return isValid
      }

      // Check dates in positions
      for (let i = 0; i < this.offer.positions.length; i++) {
        const position = this.offer.positions[i]

        // Check service period start date
        if (!position.service_period_start) {
          this.error.service_period_start = 'Leistungsdatum Von ist erforderlich'
          if (this.$refs[`service_period_start_${i}`]) {
            this.$refs[`service_period_start_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }

        // Check service period end date
        if (!position.service_period_end) {
          this.error.service_period_end = 'Leistungsdatum Bis ist erforderlich'
          if (this.$refs[`service_period_end_${i}`]) {
            this.$refs[`service_period_end_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }

        // NEW: End date cannot be before start date
        if (new Date(position.service_period_end) < new Date(position.service_period_start)) {
          this.error.service_period_end = 'Enddatum kann nicht vor dem Startdatum liegen'
          if (this.$refs[`service_period_end_${i}`]) {
            this.$refs[`service_period_end_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }
      }

      return isValid
    },
    positionTotal(item) {
      const net = item.quantity * item.price
      return (net * (1 + item.vat / 100)).toFixed(2)
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.offer.positions[index].vat || 0
      const base = quantity * price
      this.offer.positions[index].unit_total = base.toFixed(2)
      this.offer.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
    },
    summary() {
      let netTotal = 0
      let vatTotal = 0

      this.offer.positions.forEach((pos) => {
        const unitTotal = parseFloat(pos.unit_total || 0)
        const vatUnit = parseFloat(pos.vat_unit || 0)
        netTotal += unitTotal
        vatTotal += vatUnit
      })

      this.offer.net_total = netTotal.toFixed(2)
      this.offer.vat_total = vatTotal.toFixed(2)
      this.offer.gross_total = (netTotal + vatTotal).toFixed(2)
    },
    async submitStore() {
      if (!this.offer) return
      if (!this.checkServiceDates(this.offer.date, this.offer.valid_until, 'date', 'valid_until'))
        return
      this.summary()
      console.log(this.offer)
      await store.setStore('offer', JSON.parse(JSON.stringify(this.offer)))
      this.$router.push('/offers/preview')
    }
  }
}
</script>
