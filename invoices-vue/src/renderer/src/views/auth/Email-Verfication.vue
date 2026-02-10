<template>
  <div>
    <div class="login-container">
      <div class="logo-section">
        <img src="/app_logo.png" class="app-logo" alt="Mes App Logo" />
      </div>

      <form class="login-form" @submit.prevent="sendEmail">
        <h2 class="setup-title">E-Mail-Verifizierung</h2>
        <!-- <p>Bitte geben Sie Ihre E-Mail-Adresse ein</p> -->
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
            <p v-if="error" class="error">{{ error }}</p>
          </div>
          <p v-if="success" class="success">{{ success }}</p>
        </div>
        <div class="btn-container">
          <button class="btn btn-primary mt-20" type="submit">E-Mail senden</button>
        </div>
      </form>
    </div>
  </div>
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
