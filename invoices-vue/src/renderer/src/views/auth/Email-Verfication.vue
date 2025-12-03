<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <h2>Email Verification</h2>
        <p>Please enter your email</p>
      </div>
      <form @submit.prevent="sendEmail">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="example@email.com"
            />
            <p class="error-message" v-if="message.error">{{ message.error }}</p>
          </div>
        </div>
        <p class="success-message" v-if="message.success">{{ message.success }}</p>
        <button class="form-btn" type="submit">Send Email</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      message: {
        success: '',
        error: ''
      }
    }
  },
  methods: {
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },

    async sendEmail() {
      this.message = { success: '', error: '' }

      if (!this.email) {
        this.message.error = 'Email cant be empty'
        return
      }

      if (!this.validateEmail(this.email)) {
        this.message.error = 'Invalid email format'
        return
      }

      try {
        const res = await window.api.emailVerfication({ email: this.email })
        if (res.success) {
          this.message.success = res.success
          this.message.error = ''
          this.$router.push('/reset-password')
        } else {
          this.message.error = res.message || 'Something went wrong'
        }
      } catch (err) {
        this.message.error = err.message || 'Server error'
      }
    }
  }
}
</script>
