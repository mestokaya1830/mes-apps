<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <h2>Mes invoice App</h2>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/" exact-active-class="active" class="nav-item">
        <span class="nav-icon material-icons">home</span>
        <span class="nav-text">Home</span>
      </router-link>

      <router-link to="/invoices" exact-active-class="active" class="nav-item">
        <span class="nav-icon material-icons">description</span>
        <span class="nav-text">Invoices</span>
      </router-link>

      <router-link to="/offers" exact-active-class="active" class="nav-item">
        <span class="nav-icon material-icons">description</span>
        <span class="nav-text">Offers</span>
      </router-link>

      <router-link to="/customers" exact-active-class="active" class="nav-item">
        <span class="nav-icon material-icons">people</span>
        <span class="nav-text">Customers</span>
      </router-link>

      <router-link to="/orders" exact-active-class="active" class="nav-item">
        <span class="nav-icon material-icons">description</span>
        <span class="nav-text">Orders</span>
      </router-link>

      <router-link to="/profile" exact-active-class="active" class="nav-item">
        <span class="nav-icon material-icons">admin_panel_settings</span>
        <span class="nav-text">Profile</span>
      </router-link>

      <router-link to="/about" exact-active-class="active" class="nav-item">
        <span class="nav-icon material-icons">info</span>
        <span class="nav-text">About</span>
      </router-link>
    </nav>

    <div v-if="$store.state.auth" class="sidebar-footer">
      <button class="logout-btn" @click="logout()">
        <span class="nav-icon material-icons">logout</span>
        <span class="nav-text logout">Logout</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModernSidebar',
  data() {
    return {}
  },
  methods: {
    async logout() {
      try {
        await this.$store.commit('setAuth', null)
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  height: 100%;
  background: #2f3542;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.025em;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  margin: 0.25rem 0;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-left-color: #3b82f6;
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border-left-color: #3b82f6;
  font-weight: 500;
  width: 96%;
  border: 5px solid transparent;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}

/* .nav-item.active::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #3b82f6;
} */

.nav-icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 25px;
  font-size: 30px;
}

.nav-text {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.025em;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.logout-btn .nav-icon {
  margin-right: 1.2rem;
}

/* Scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .nav-item {
    justify-content: center;
    padding: 1rem;
  }

  .nav-text {
    display: none;
  }

  .nav-icon {
    margin-right: 0;
  }
}
</style>
