<template>
  <div v-if="$route.params.id" class="main-container">
    <div class="main-header">
      <label>{{ title }}</label>
       <router-link :to="`/payments/details/${$route.params.id}`" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons"></i>Zurück
      </router-link>
    </div>
    <div class="printable">
      <!-- Header -->
      <h2>{{ title }}</h2>

      <div class="sections">
        <div class="custom-row">
          <div class="form-group">
            <label for="">Zahlung-Nr.:</label>
            <label class="inputs">{{ formatPaymentId($route.params.id) }}</label>
          </div>

          <div class="form-group">
            <label for="">Storniert am</label>
            <input
              v-model="cancelled_at"
              type="date"
              class="inputs"
              placeholder="Datum der Stornierung auswählen"
            />
            <div v-if="error.cancelled_at" class="error">{{ error.cancelled_at }}</div>
          </div>

          <div class="form-group">
            <label for="">Storniert von</label>
            <input
              v-model="cancelled_by"
              type="text"
              class="inputs"
              placeholder="Name der Person, die storniert"
            />
            <div v-if="error.cancelled_by" class="error">{{ error.cancelled_by }}</div>
          </div>

          <div class="form-group">
            <label for="">Stornierungsgrund</label>
            <textarea
              v-model="cancellation_reason"
              class="inputs"
              placeholder="Grund der Stornierung hier eingeben"
            ></textarea>
            <div v-if="error.cancellation_reason" class="error">
              {{ error.cancellation_reason }}
            </div>
          </div>

          <button @click="updatePayment" class="btn btn-cancel">Stornieren</button>
        </div>
      </div>
    </div>
    <router-link :to="`/invoices/details/${$route.params.id}`" class="back-btn back-btn">
      ← Zurück zur Zahlungsdetails
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'PaymentEdit',
  inject: ['formatPaymentId'],
  data() {
    return {
      title: 'Zahlung stornieren',
      cancelled_at: '',
      cancelled_by: '',
      cancellation_reason: '',
      error: {}
    }
  },
  methods: {
    checkInputs() {
      if (!this.cancelled_at.trim()) {
        this.error.cancelled_at = 'Bitte ein Datum auswählen'
        return false
      } else {
        this.error.cancelled_at = ''
      }

      // Name prüfen
      if (!this.cancelled_by.trim() || this.cancelled_by.length < 3) {
        this.error.cancelled_by = 'Bitte einen Namen mit mindestens 3 Zeichen eingeben'
        return false
      } else {
        this.error.cancelled_by = ''
      }

      // Grund prüfen
      if (!this.cancellation_reason.trim() || this.cancellation_reason.length < 5) {
        this.error.cancellation_reason = 'Bitte einen Grund mit mindestens 5 Zeichen eingeben'
        return false
      } else {
        this.error.cancellation_reason = ''
      }

      return true
    },
    async updatePayment() {
      const data = {
        id: this.$route.query.id,
        invoice_id: this.$route.query.invoice_id,
        cancelled_at: this.cancelled_at,
        cancelled_by: this.cancelled_by,
        cancellation_reason: this.cancellation_reason
      }
      if (!this.checkInputs()) return
      const result = await window.api.cancelPaymentById(data)
      if (result.success) {
        this.$router.push('/invoices')
      }
    }
  }
}
</script>
