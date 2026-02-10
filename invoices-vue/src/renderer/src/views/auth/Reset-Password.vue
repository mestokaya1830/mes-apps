<template>
  <div class="setup-page">
    <div class="logo-section">
      <img src="/app_logo.png" class="app-logo" alt="Mes App Logo" />
    </div>

    <div class="form-card">
      <div class="form-header">
        <h2 class="setup-title">Passwort zurücksetzen</h2>
        <p>Bitte geben Sie Ihre Daten ein</p>
      </div>

      <form @submit.prevent="reset">
        <div class="form-group">
          <label for="token" class="form-label">Token</label>
          <div>
            <input id="token" v-model="reset_data.token" type="text" class="inputs" />
            <div v-if="error.token" class="error">{{ error.token }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="inputPassword" class="form-label">Passwort</label>
          <div>
            <input
              id="inputPassword"
              v-model="reset_data.password"
              type="password"
              class="inputs"
            />
            <div v-if="error.password" class="error">{{ error.password }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm_password" class="form-label">Passwort bestätigen</label>
          <div>
            <input
              id="confirm_password"
              v-model="reset_data.passwordConfirmation"
              type="password"
              class="inputs"
            />
            <div v-if="error.confirm" class="error">{{ error.confirm }}</div>
          </div>
        </div>

        <div v-if="error.success" class="text text-success mt-3 mb-3">
          {{ error.success }}
        </div>

        <div v-if="error.credential" class="error">
          {{ error.credential }}
        </div>

        <button class="btn btn-primary btn-setup right mt-20" type="submit">Zurücksetzen</button>
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
        this.error.token = 'Token darf nicht leer sein.'
        valid = false
      }

      if (!rd.password) {
        this.error.password = 'Passwort darf nicht leer sein.'
        valid = false
      }

      if (rd.password && rd.passwordConfirmation && rd.password !== rd.passwordConfirmation) {
        this.error.confirm = 'Die Passwörter stimmen nicht überein.'
        valid = false
      }

      return valid
    },

    async reset() {
      this.trimFormFields(this.reset_data)
      if (!this.validateForm()) return

      try {
        const data = {
          token: this.reset_data.token,
          password: this.reset_data.password
        }
        const res = await window.api.resetPassword(data)

        if (!res.success) {
          this.error.credential = res.error || 'Ungültige Anfrage.'
          return
        }

        this.error.success = 'Passwort wurde erfolgreich zurückgesetzt.'
        this.reset_data.token = ''
        this.reset_data.password = ''
        this.reset_data.passwordConfirmation = ''
      } catch (err) {
        this.error.credential = err.message || 'Serverfehler.'
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
