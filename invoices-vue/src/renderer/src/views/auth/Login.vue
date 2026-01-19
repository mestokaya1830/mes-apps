<template>
  <div class="editor-panel">
    <div v-if="!register" class="form-card">
      <div class="form-header">
        <h2>Welcome To Mes App Setup</h2>
        <router-link to="register" class="forgot-password">Next</router-link>
      </div>
    </div>

    <div v-else class="form-card">
      <div class="form-header">
        <h2>Welcome Back</h2>
        <p>Please sign in to your account</p>
      </div>

      <form @submit.prevent="loginUser">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="user.email"
            type="email"
            :class="{ error: error.email }"
            placeholder="Enter your email"
          />
          <div v-if="error.email" class="error-message">{{ error.email }}</div>
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
          <div v-if="error.password" class="error-message">{{ error.password }}</div>
        </div>

        <div class="form-options">
          <router-link to="email-verfication" class="forgot-password">Forgot password?</router-link>
        </div>

        <div v-if="error.credential" class="text error-message">{{ error.credential }}</div>

        <button type="submit" class="form-btn">Sign In</button>
      </form>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'

export default {
  name: 'Login',
  inject:['trimFormFields'],
  data() {
    return {
      user: { email: '', password: '' },
      error: { email: '', password: '', credential: '' },
      register: false
    }
  },
  watch: {
    user: {
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
  mounted() {
    this.checkRegister()
  },
  methods: {
    async checkRegister() {
      try {
        const res = await window.api.checkRegister()
        this.register = res.success
      } catch (err) {
        console.error(err)
      }
    },
    validateForm() {
      let valid = true
      this.error = { email: '', password: '', credential: '' }

      if (!this.user.email) {
        this.error.email = 'Email cannot be empty'
        valid = false
      } else if (!this.user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        this.error.email = 'Invalid email format'
        valid = false
      }

      if (!this.user.password) {
        this.error.password = 'Password cannot be empty'
        valid = false
      } else if (this.user.password.length < 6) {
        this.error.password = 'Password must be at least 6 characters'
        valid = false
      }

      return valid
    },

    async loginUser() {
      this.trimFormFields(this.user)
      if (!this.validateForm()) return

      try {
        const res = await window.api.login(JSON.parse(JSON.stringify(this.user)))
        if (!res.success) {
          this.error.credential = res.message || 'Invalid credentials'
          return
        }
        await store.setStore('auth', res.user)
        this.$router.push('/')
      } catch (err) {
        this.error.credential = err.message || 'Server error'
      }
    }
  }
}
</script>
