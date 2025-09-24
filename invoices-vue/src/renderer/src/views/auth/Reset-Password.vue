<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <h2>Reset Password</h2>
        <p>Please enter your data</p>
      </div>
      <form>
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
        <button class="form-btn" type="button" @click="reset()">Reset</button>
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
    async reset() {
      this.message = {}
      if (this.token == '') {
        this.message.token = { token: "Token don't be empty!" }
        return false
      }
      if (this.password == '') {
        this.message.password = { password: "Password don't be empty!" }
        return false
      }
      if (this.password !== this.passwordConfirmation) {
        this.message.confirm = { confirm: 'Password not match!' }
        return false
      }

      const data = { password: this.password, token: this.token }
      const res = await window.api.resetPassword(data)
      if (res.error) {
        this.message.credential = { credential: res.error }
      }
      this.message.success = res
    }
  }
}
</script>
