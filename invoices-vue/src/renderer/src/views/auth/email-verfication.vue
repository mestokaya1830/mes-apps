<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <h2>Email Verfication</h2>
        <p>Please enter your email</p>
      </div>
      <form>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div>
            <input id="email" v-model="email" type="email" class="form-control" />
            <p class="error-message">{{ message.error }}</p>
          </div>
        </div>
        <p class="active">{{ message.success }}</p>
        <button class="form-btn" type="button" @click="sendEmail()">Send Email</button>
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
