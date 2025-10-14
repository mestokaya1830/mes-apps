<template lang="">
  <div>
    <h1>{{ title }}</h1>

    <button class="back-btn" @click="storePreview">Preview</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Neues Auftrag erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      selectedCustomer: {},
      sprachpartner: {
        fullname: '',
        email: '',
        phone: ''
      },
      orderGrund: {
        orderTitle: 'Mein erstes Auftrag',
        orderNumber: 'AUF-2024-001',
        orderDate: '2024-12-15',
        servicePeriod: 'Okt - Dez 2024',
        paidAmount: 0,
        paymentTerms: 14,
        positions: []
      }
    }
  },
  computed: {
    subtotal() {
      return this.orderGrund.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.orderGrund.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.orderGrund.paidAmount
    },
    formattedDate() {
      const date = new Date(this.orderGrund.orderDate)
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    },
    companyName() {
      return (
        this.selectedCustomer.company_name ||
        [this.selectedCustomer.first_name, this.selectedCustomer.last_name]
          .filter(Boolean)
          .join(' ')
      )
    }
  },
  mounted() {
    if (this.$store?.state?.orderPreview) {
      const preview = this.$store.state.orderPreview
      if (preview.positions) this.orderGrund.positions = preview.positions
      if (preview.customer) this.selectedCustomer = { ...preview.customer }
    }
    this.getCustomers()
  },
  methods: {
    async getCustomers() {
      try {
        const response = await window.api.getCustomers()
        if (response.success) {
          this.customers = response.customers
        } else {
          console.error('Error fetching customers:', response.message)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    },
    getCustomerById() {
      const customer = this.customers.find((item) => item.id === this.customerList)
      if (customer) this.selectedCustomer = { ...customer }
    },
    addPosition() {
      this.orderGrund.positions.push({
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      this.$store.commit('setorderPositions', this.orderGrund.positions)
    },
    deletePosition(index) {
      if (this.orderGrund.positions.length > 0) {
        this.orderGrund.positions.splice(index, 1)
        this.$store.commit('setorderPositions', this.orderGrund.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    async storePreview() {
      try {
        this.orderGrund.positions = this.orderGrund.positions.map((pos) => ({
          ...pos,
          unitTotal: (pos.quantity * pos.price).toFixed(2)
        }))

        await this.$store.commit('setOrderPreview', {
          customer: { ...this.selectedCustomer, company_name: this.companyName },
          order_grund: {
            order_title: this.orderGrund.orderTitle,
            order_number: this.orderGrund.orderNumber,
            order_date: this.orderGrund.orderDate,
            service_period: this.orderGrund.servicePeriod,
            paidAmount: this.orderGrund.paidAmount,
            paymentTerms: this.orderGrund.paymentTerms,
            verwendung: this.orderGrund.verwendung,
            positions: this.orderGrund.positions,
            subtotal: this.subtotal.toFixed(2),
            vatAmount: this.vatAmount.toFixed(2),
            grandTotal: this.grandTotal.toFixed(2),
            outstanding: this.outstanding.toFixed(2)
          },
          sprachpartner: { ...this.sprachpartner }
        })

        this.$router.push('/orders-preview')
      } catch (error) {
        console.error('Error storing order preview:', error)
      }
    }
  }
}
</script>
