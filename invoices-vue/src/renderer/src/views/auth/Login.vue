<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <h2>Welcome Back</h2>
        <p>Please sign in to your account</p>
      </div>

      <form>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="user.email"
            type="email"
            :class="{ error: error.email }"
            placeholder="Enter your email"
          />
          <div v-if="error.email" class="error-message">
            {{ error.email }}
          </div>
        </div>

        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            id="inputPassword"
            v-model="user.password"
            type="password"
            :class="{ error: error.password }"
            placeholder="Enter your password"
          />
          <div v-if="error.password" class="error-message">
            {{ error.password }}
          </div>
        </div>

        <div class="form-options">
          <router-link v-if="!checkRegister" to="register" class="forgot-password">
            Setup
          </router-link>
          <div v-else class="registered">Reistered</div>
          <router-link to="email-verfication" class="forgot-password">
            Forgot password?
          </router-link>
        </div>
        <div v-if="error.credential" class="text error-message">{{ error.credential }}</div>
        <button type="button" class="form-btn" @click="loginUser()">Sign In</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      error: {
        email: '',
        password: '',
        credential: ''
      },
      checkRegister: false
    }
  },
  methods: {
    async loginUser() {
      this.error = {}
      if (this.user.email == '') {
        this.error = { email: 'Email cant be null' }
      } else if (this.user.password == '') {
        this.error = { password: 'Password cant be null' }
      } else {
        const data = { email: this.user.email, password: this.user.password }
        const res = await window.api.login(data)
        console.log(res)
        if (!res.success) {
          this.error.credential = res.message
        } else {
          this.$store.commit('setAuth', res.user)
          this.$router.push('/')
        }
      }
    }
  }
}
</script>
