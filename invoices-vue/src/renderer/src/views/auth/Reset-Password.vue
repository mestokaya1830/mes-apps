<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <h2>Reset Password</h2>
        <p>Please enter your data</p>
      </div>
      <form @submit.prevent="reset">
        <div class="form-group">
          <label for="token" class="form-label">Token</label>
          <div>
            <input id="token" v-model="token" type="text" class="form-control" />
            <div v-if="message.token" class="text error-message">{{ message.token }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="inputPassword" class="form-label">Password</label>
          <div>
            <input id="inputPassword" v-model="password" type="password" class="form-control" />
            <div v-if="message.password" class="text error-message">{{ message.password }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm_password" class="form-label">Confirm Password</label>
          <div>
            <input
              id="confirm_password"
              v-model="passwordConfirmation"
              type="password"
              class="form-control"
            />
            <div v-if="message.confirm" class="text error-message">{{ message.confirm }}</div>
          </div>
        </div>

        <div v-if="message.success" class="text text-success mt-3 mb-3">{{ message.success }}</div>
        <div v-if="message.credential" class="text error-message">{{ message.credential }}</div>

        <button class="form-btn" type="submit">Reset</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: '',
      password: '',
      passwordConfirmation: '',
      message: {
        success: '',
        credential: '',
        token: '',
        password: '',
        confirm: ''
      }
    }
  },
  methods: {
    validateForm() {
      let valid = true
      this.message = { success: '', credential: '', token: '', password: '', confirm: '' }

      if (!this.token) {
        this.message.token = "Token can't be empty!"
        valid = false
      }

      if (!this.password) {
        this.message.password = "Password can't be empty!"
        valid = false
      }

      if (
        this.password &&
        this.passwordConfirmation &&
        this.password !== this.passwordConfirmation
      ) {
        this.message.confirm = 'Passwords do not match!'
        valid = false
      }

      return valid
    },

    async reset() {
      if (!this.validateForm()) return

      try {
        const data = { password: this.password, token: this.token }
        const res = await window.api.resetPassword(data)

        if (res.error) {
          this.message.credential = res.error
        } else {
          this.message.success = 'Password reset successfully!'
          this.token = ''
          this.password = ''
          this.passwordConfirmation = ''
        }
      } catch (err) {
        this.message.credential = err.message || 'Server error'
      }
    }
  }
}
</script>
