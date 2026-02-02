<template>
  <div v-if="$route.params.id" class="main-container">
    <div class="main-header">
      <label>{{ title }}</label>
       <router-link :to="`/invoices/details/${$route.params.id}`" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons"></i>Zurück
      </router-link>
    </div>
    <div>
      <div class="printable">
        <!-- Header -->
        <h2>{{ title }}</h2>

        <div class="sections">
          <div class="custom-row">
            <div class="form-group">
              <label for="">Rechnung-Nr.:</label>
              <label class="inputs">{{ formatInvoiceId($route.params.id) }}</label>
            </div>

            <div class="form-group">
              <label for="">Storniert am<span class="stars">*</span></label>
              <input
                v-model="cancelled_at"
                type="date"
                class="inputs date"
                placeholder="Datum der Stornierung auswählen"
                required
              />
              <div v-if="error.cancelled_at" class="error">{{ error.cancelled_at }}</div>
            </div>

            <div class="form-group">
              <label for="">Storniert von<span class="stars">*</span></label>
              <input
                v-model="cancelled_by"
                type="text"
                class="inputs"
                placeholder="Name der Person, die storniert"
                required
              />
              <div v-if="error.cancelled_by" class="error">{{ error.cancelled_by }}</div>
            </div>

            <div class="form-group">
              <label for="">Stornierungsgrund<span class="stars">*</span></label>
              <textarea
                v-model="cancellation_reason"
                class="inputs"
                placeholder="Grund der Stornierung hier eingeben"
                required
              ></textarea>
              <div v-if="error.cancellation_reason" class="error">
                {{ error.cancellation_reason }}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="sections container-2">
      <button @click="updateInvoice" class="btn btn-update">Aktualisieren</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceEdit',
  inject: ['formatInvoiceId'],
  data() {
    return {
      title: 'Rechnung stornieren',
      cancelled_by: '',
      cancelled_at: '',
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
    async updateInvoice() {
      const id = this.$route.params.id
      const data = {
        id: id,
        is_active: 0,
        cancellation_reason: this.cancellation_reason,
        cancelled_by: this.cancled_by,
        cancelled_at: this.cancelled_at
      }
      if (!this.checkInputs()) return
      const result = await window.api.cancelInvoice(data)
      if (result.success) {
        this.$router.push('/invoices')
      }
    }
  }
}
</script>
