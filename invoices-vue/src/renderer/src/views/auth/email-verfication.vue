<template>
  <div class="container border rounded p-5">
    <h3 style="margin-bottom: 30px">Email Verfication For Password Reset</h3>
    <p class="active">{{ message.success }}</p>
    <div class="mb-3 row">
      <label for="email" class="form-label">Email</label>
      <div>
        <input id="email" v-model="email" type="email" class="form-control" />
        <p class="error">{{ message.error }}</p>
      </div>
    </div>
    <div class="d-grid">
      <button class="btn btn-dark btn-lg" type="submit" @click="sendEmail()">Send Email</button>
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
    async sendEmail() {
      const data = { email: this.email }
      if (this.email == '') {
        this.message = { error: 'Email cant be null' }
        return false
      }
      const res = await window.api.emailVerfication(data)
      if (res.success) {
        this.message = { success: res.success }
        this.message = res
        this.$router.push('/reset-password')
        console.log(res)
      } else {
        this.message = { error: res.message }
        console.log(res)
      }
    }
  }
}
</script>
