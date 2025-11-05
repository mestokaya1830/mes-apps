<template>
  <div>
    <button class="back-btn" @click="storePreview()">Vorschau</button>
  </div>
</template>
<script>
export default {
  name: 'StorePreview',
  props: {
    data: {
      type: Object,
      require: true
    },
    storeLink: {
      type: String,
      require: true
    },
    storeCommit: {
      type: String,
      require: true
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
    storePreview() {
      if (this.data) this.dinamicData = this.data
      try {
        this.$store.commit(this.storeCommit, {
          id: this.data.id,
          title: this.data.title,
          source_page: this.data.source_page,
          date: this.data.date,
          valid_days: this.data.valid_days,
          verwendungzweck: this.data.verwendungzweck,
          events: { ...this.data.events },
          summary: {
            subtotal: this.subtotal.toFixed(2),
            vat_amount: this.vatAmount.toFixed(2),
            total: this.total.toFixed(2),
            outstanding: this.outstanding.toFixed(2)
          },
          selected_customer: { ...this.data.selected_customer },
        })
        this.$router.push(`/${this.storeLink}-preview`)
      } catch (error) {
        console.error('Error storing invoice preview:', error)
      }
    }
  }
}
</script>
<style lang=""></style>
