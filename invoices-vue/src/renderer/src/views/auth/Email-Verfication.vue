<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <h2>E-Mail-Verifizierung</h2>
        <p>Bitte geben Sie Ihre E-Mail-Adresse ein</p>
      </div>
      <form @submit.prevent="sendEmail">
        <div class="form-group">
          <label for="email" class="form-label">E-Mail</label>
          <div>
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
        </div>
        <p v-if="success" class="success">{{ success }}</p>
        <button class="btn" type="submit">E-Mail senden</button>
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
