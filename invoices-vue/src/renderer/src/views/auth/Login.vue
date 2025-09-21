<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
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
          <label class="checkbox">
            <input id="rememberMe" type="checkbox" />
            <span class="checkmark"></span>
            Remember me
          </label>
          <router-link to="email-verfication" class="forgot-password">
            Forgot password?
          </router-link>
        </div>

        <button type="button" class="login-btn" @click="loginUser()">Sign In</button>
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
        password: ''
      }
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
        if (res.success) {
          this.$store.commit('setAuth', res.user)
          this.$router.push('/')
        }
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #1e293b 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 50%;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
}

.login-header p {
  margin: 0;
  color: #718096;
  font-size: 16px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: #f7fafc;
}

input[type='email']:focus,
input[type='password']:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input.error {
  border-color: #e53e3e;
  background: #fed7d7;
}

.error-message {
  margin-top: 6px;
  color: #e53e3e;
  font-size: 14px;
  font-weight: 500;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.checkbox {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #718096;
  cursor: pointer;
  position: relative;
}

.checkbox input[type='checkbox'] {
  width: auto;
  margin-right: 8px;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
}

.login-btn:active {
  transform: translateY(0);
}

.signup-link {
  text-align: center;
  font-size: 14px;
  color: #718096;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    margin: 10px;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
