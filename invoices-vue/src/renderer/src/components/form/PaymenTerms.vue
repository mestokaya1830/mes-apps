<template lang="">
  <div>
    <div class="form-section">
      <div class="form-section-title">💳 Zahlungsinformationen</div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Anzahlung (bereits bezahlt)</label>
          <input
            v-model.number="payment.paid_amount"
            type="number"
            class="form-input"
            step="0.01"
            @input="getPaymentTerms"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Zahlungsziel (Tage)</label>
          <input
            v-model.number="payment.payment_terms"
            type="number"
            class="form-input"
            @input="getPaymentTerms"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Zahlungsbedingungen / Payment Terms</label>
          <textarea
            v-model="payment.payment_conditions"
            class="form-input payment-terms"
            placeholder="50 % Anzahlung bei Auftragserteilung, Restzahlung nach Abschluss. / 50% upfront, balance upon completion."
            @input="getPaymentTerms"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PaymentTerms',
  emits: ['get-payment-terms'],
  data() {
    return {
      payment: {
        paid_amount: 0,
        payment_terms: 14,
        payment_conditions: ''
      }
    }
  },
  mounted() {
    if (this.$store.state[this.storeName] && this.$store.state[this.storeName].payment) {
      this.payment = this.$store.state[this.storeName].payment
    } else {
      return this.payment
    }
  },
  methods: {
    getPaymentTerms() {
      this.$emit('get-payment-terms', this.payment)
    }
  }
}
</script>
<style lang=""></style>
