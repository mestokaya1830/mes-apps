<template>
  <div class="setup-page">
    <div v-if="!register">
      <setup-page />
    </div>
    <div v-else class="login-container">
      <header class="logo-header">
        <img src="/app_logo.png" class="app-logo" alt="Mes App Logo" />
      </header>

      <form class="login-form" @submit.prevent="loginUser">
        <h1 class="setup-title">Willkommen bei Mes App</h1>

        <div class="form-row">
          <div class="form-group">
            <label for="email" class="form-label">E-Mail-Adresse</label>
            <input
              id="email"
              v-model="user.email"
              type="email"
              :class="['inputs', { error: error.email }]"
              placeholder="Geben Sie Ihre E-Mail-Adresse ein"
            />
            <div v-if="error.email" class="error-message">{{ error.email }}</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="inputPassword" class="form-label">Passwort</label>
            <input
              id="inputPassword"
              v-model="user.password"
              type="password"
              :class="['inputs', { error: error.password }]"
              placeholder="Geben Sie Ihr Passwort ein"
            />
            <div v-if="error.password" class="error-message">{{ error.password }}</div>
          </div>
        </div>

        <router-link to="email-verfication" class="forgot-password">
          Passwort vergessen?
        </router-link>

        <div v-if="error.credential" class="text error-message">
          {{ error.credential }}
        </div>

        <button type="submit" class="btn">Anmelden</button>
      </form>

      <button class="btn btn-primary btn-setup right mt-20" @click="loginUser">
        <i class="bi bi-arrow-right ioncs"></i>
        <span>Anmelden</span>
      </button>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
import SetupPage from '../../components/preview/SetupPage.vue'

export default {
  name: 'Login',
  components: { SetupPage },
  inject: ['trimFormFields'],
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
        this.error.email = 'E-Mail darf nicht leer sein.'
        valid = false
      } else if (!this.user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        this.error.email = 'Ungültiges E-Mail-Format.'
        valid = false
      }

      if (!this.user.password) {
        this.error.password = 'Passwort darf nicht leer sein.'
        valid = false
      } else if (this.user.password.length < 6) {
        this.error.password = 'Das Passwort muss mindestens 6 Zeichen lang sein.'
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
          this.error.credential = res.message || 'Ungültige Anmeldedaten.'
          return
        }
        await store.setStore('auth', res.user)
        this.$router.push('/')
      } catch (err) {
        this.error.credential = err.message || 'Serverfehler.'
      }
    }
  }
}
</script>
