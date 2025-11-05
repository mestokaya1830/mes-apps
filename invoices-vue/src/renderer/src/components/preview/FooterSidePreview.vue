<template lang="">
  <div>
    <div class="footer">
      <div class="footer-line">
        <strong>{{ $store.state.auth.firm_name }}</strong> • Geschäftsführer:
        {{ $store.state.auth.ceo }} • {{ $store.state.auth.register_court }} HRB
        {{ $store.state.auth.register_number }}
        {{ $store.state.auth.address }}
        {{ $store.state.auth.postal_code }} {{ $store.state.auth.city }}
      </div>
      <div class="footer-line">
        <strong>Bankverbindung:</strong> {{ $store.state.auth.bank_name }} • IBAN:{{
          $store.state.auth.iban
        }}
        • BIC:
        {{ $store.state.auth.bic }}
      </div>
      <div class="footer-line">
        <strong>Steuernummer:</strong> 12/345/67890 • <strong>USt-IdNr.:</strong> DE123456789
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FooterSide'
}
</script>
<style scoped>
.footer {
  padding: 28px 40px;
  color: #ddd;
  font-weight: 600;
  font-size: 11px;
  line-height: 1.9;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.footer-line {
  margin-bottom: 4px;
  color: #666;
}

.footer-line strong {
  color: #444;
}
</style>
