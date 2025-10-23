<template lang="">
  <div>
    <div v-if="data.payment_terms" class="payment">
      <strong>Zahlungsbedingungen:</strong> Zahlbar innerhalb von
      <strong class="payment-terms">{{ data.payment_terms }}</strong> Tagen ab Rechnungsdatum.
    </div>
  </div>
</template>
<script>
export default {
  name: 'PaymentTerms',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
