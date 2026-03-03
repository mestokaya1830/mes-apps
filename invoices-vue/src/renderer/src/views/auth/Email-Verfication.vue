<template>
  <section class="login-container">
    <img src="/app_logo.png" class="app-logo" alt="Mes App Logo" />
    <form class="login-form" @submit.prevent="sendEmail">
      <h2 class="setup-title">E-Mail-Verifizierung</h2>
      <div class="form-row">
        <div class="form-group">
          <label for="email" class="form-label">E-Mail-Adresse</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="inputs"
            placeholder="beispiel@email.com"
            @input="error = ''"
          />
          <p v-if="error" class="error" role="alert" aria-live="assertive">
            {{ error }}
          </p>
        </div>
      </div>
      <button class="btn btn-setup mt-20" type="submit">E-Mail senden</button>
      <p v-if="success" class="success" role="status" aria-live="polite">
        {{ success }}
      </p>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      success: '',
      error: ''
    }
  },
  methods: {
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },

    async sendEmail() {
      this.success = ''
      this.error = ''

      if (!this.email.trim()) {
        this.error = 'E-Mail darf nicht leer sein.'
        return
      }

      if (!this.validateEmail(this.email.trim())) {
        this.error = 'Ungültiges E-Mail-Format.'
        return
      }

      try {
        const res = await window.api.emailVerfication({ email: this.email })
        if (!res.success) {
          this.error = res || 'Etwas ist schiefgelaufen.'
          return
        }
        this.success = 'E-Mail wurde erfolgreich gesendet.'
        this.error = ''
        this.$router.push('/reset-password')
      } catch (error) {
        console.log(error)
        this.error = 'Serverfehler.'
      }
    }
  }
}
</script>
