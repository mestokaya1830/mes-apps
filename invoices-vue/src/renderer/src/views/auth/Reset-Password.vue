<template>
  <div class="editor-panel">
    <div class="form-card">
      <div class="form-header">
        <h2>Reset Password</h2>
        <p>Please enter your data</p>
      </div>
      <form @submit.prevent="reset">
        <div class="form-group">
          <label for="token" class="form-label">Token</label>
          <div>
            <input id="token" v-model="reset_data.token" type="text" class="form-control" />
            <div v-if="error.token" class="error">{{ error.token }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="inputPassword" class="form-label">Password</label>
          <div>
            <input
              id="inputPassword"
              v-model="reset_data.password"
              type="password"
              class="form-control"
            />
            <div v-if="error.password" class="error">{{ error.password }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm_password" class="form-label">Confirm Password</label>
          <div>
            <input
              id="confirm_password"
              v-model="reset_data.passwordConfirmation"
              type="password"
              class="form-control"
            />
            <div v-if="error.confirm" class="error">{{ error.confirm }}</div>
          </div>
        </div>

        <div v-if="error.success" class="text text-success mt-3 mb-3">{{ error.success }}</div>
        <div v-if="error.credential" class="error">{{ error.credential }}</div>

        <button class="form-btn" type="submit">Reset</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['trimFormFields'],
  data() {
    return {
      reset_data: {
        token: '',
        password: '',
        passwordConfirmation: ''
      },
      error: {}
    }
  },
  watch: {
    reset_data: {
      handler(newVal) {
        for (const key in newVal) {
          if (typeof newVal[key] === 'string' && newVal[key] && this.error[key]) {
            this.error[key] = ''
          }
        }
      },
      deep: true
    }
  },
  methods: {
    validateForm() {
      const rd = this.reset_data
      let valid = true

      if (!rd.token) {
        this.error.token = "Token can't be empty!"
        valid = false
      }

      if (!rd.password) {
        this.error.password = "Password can't be empty!"
        valid = false
      }

      if (rd.password && rd.passwordConfirmation && rd.password !== this.passwordConfirmation) {
        this.error.confirm = 'Passwords do not match!'
        valid = false
      }
      return valid
    },

    async reset() {
      this.trimFormFields(this.user)
      if (!this.validateForm()) return

      try {
        const data = {
          token: this.reset_data.token,
          password: this.reset_data.password
        }
        const res = await window.api.resetPassword(data)

        if (!res.success) {
          this.message.credential = res.error
          return
        }

        this.message.success = 'Password reset successfully!'
        this.token = ''
        this.password = ''
        this.passwordConfirmation = ''
      } catch (err) {
        this.message.credential = err.message || 'Server error'
      }
    }
  }
}
</script>

<style>
.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>
