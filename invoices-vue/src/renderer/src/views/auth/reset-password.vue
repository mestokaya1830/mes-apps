<template>
  <div class="container border rounded p-5">
    <h3 style="margin-bottom: 30px">Reset Password</h3>
    <div class="mb-3 row">
      <label for="token" class="form-label">Token</label>
      <div>
        <input id="token" v-model="token" type="text" class="form-control" />
        <div v-if="message.token" class="text text-danger mt-3 mb-3">{{ message.token }}</div>
      </div>
    </div>
    <div class="mb-3 row">
      <label for="inputPassword" class="form-label">Password</label>
      <div>
        <input id="inputPassword" v-model="password" type="password" class="form-control" />
        <div v-if="message.password" class="text text-danger mt-3 mb-3">{{ message.password }}</div>
      </div>
    </div>
    <div class="mb-3 row">
      <label for="confirm_password" class="form-label">Confirm Password</label>
      <div>
        <input
          id="confirm_password"
          v-model="passwordConfirmation"
          type="password"
          class="form-control"
        />
        <div v-if="message.confirm" class="text text-danger mt-3 mb-3">{{ message.confirm }}</div>
      </div>
    </div>
    <div v-if="message.success" class="text text-success mt-3 mb-3">{{ message.success }}</div>
    <div v-if="message.credential" class="text text-danger mt-3 mb-3">{{ message.credential }}</div>
    <div class="d-grid">
      <button class="btn btn-dark btn-lg" @click="reset()">Reset</button>
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
      message: {}
    }
  },
  methods: {
    async reset() {
      this.message = {}
      if (this.token == '') {
        this.token = { token: "Token don't be empty!" }
        return false
      }
      if (this.password == '') {
        this.message = { password: "Password don't be empty!" }
        return false
      }
      if (this.password !== this.passwordConfirmation) {
        this.message = { confirm: 'Password not match!' }
        return false
      }

      const data = { password: this.password, token: this.token }
      console.log(data)
      const res = await window.api.resetPassword(data)
      this.message = res
    }
  }
}
</script>
