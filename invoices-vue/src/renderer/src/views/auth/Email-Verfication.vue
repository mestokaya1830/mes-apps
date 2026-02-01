<template>
  <div>
    <div class="login-container">
      <div class="logo-section">
        <img src="/logo.png" class="app-logo" alt="Mes App Logo" />
      </div>

      <form class="login-form" @submit.prevent="sendEmail">
        <h2 class="setup-title">E-Mail-Verifizierung</h2>
        <!-- <p>Bitte geben Sie Ihre E-Mail-Adresse ein</p> -->
        <div class="form-row">
          <div class="form-group">
            <label for="email" class="form-label">E-Mail</label>
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
      </form>

      <button class="btn btn-primary btn-setup right mt-20" type="submit">E-Mail senden</button>
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
        this.error = 'Email cant be empty'
        return
      }

      if (!this.validateEmail(this.email.trim())) {
        this.error = 'Invalid email format'
        return
      }

      try {
        const res = await window.api.emailVerfication({ email: this.email })
        if (!res.success) {
          this.error = res || 'Something went wrong'
          return
        }
        this.success = res.success
        this.error = ''
        this.$router.push('/reset-password')
      } catch (err) {
        this.error = err || 'Server error'
      }
    }
  }
}
</script>
