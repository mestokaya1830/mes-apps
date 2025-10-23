<template lang="">
  <div>
    <div class="form-section">
      <div class="form-section-title">💰 Währung</div>
      <div class="form-group">
        <label class="form-label">Waehrung</label>
        <select v-model="currency" class="form-input" @change="getCurrency()">
          <option selected disabled>Wähle Waehrung</option>
          <option value="EUR.de-DE">EUR</option>
          <option value="USD.en-US">USD</option>
          <option value="GBP.en-GB">GBP</option>
          <option value="CHF.ch-CH">CHF</option>
          <option value="JPY.ja-JP">JPY</option>
          <option value="AUD.en-AU">AUD</option>
          <option value="CAD.en-CA">CAD</option>
          <option value="CNY.zh-CN">CNY</option>
          <option value="SEK.sv-SE">SEK</option>
          <option value="NZD.en-NZ">NZD</option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Currency',
  props: {
    storeName: {
      type: String,
      required: true
    }
  },
  emits: ['get-currency'],
  data() {
    return {
      currency: 'Wähle Waehrung'
    }
  },
  mounted() {
    if (this.$store.state[this.storeName] && this.$store.state[this.storeName].currency) {
      this.currency = this.$store.state[this.storeName].currency
    } else {
      return this.currency
    }
  },
  methods: {
    getCurrency() {
      if (this.currency) this.$emit('get-currency', this.currency)
    }
  }
}
</script>
