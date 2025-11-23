<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="app-logo">
        <h2>Mes Rechnungs-App</h2>
      </div>
    </div>

    <nav>
      <div class="nav-menu">
        <li class="nav-item">
          <router-link to="/" exact-active-class="active" class="nav-link">
            <span class="nav-icon">🏠</span>
            <span>Startseite</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/customers" exact-active-class="active" class="nav-link">
            <span class="nav-icon">👥</span>
            <span>Kunden</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/invoices" exact-active-class="active" class="nav-link">
            <span class="nav-icon">📄</span>
            <span>Rechnungen</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/offers" exact-active-class="active" class="nav-link">
            <span class="nav-icon">📋</span>
            <span>Angebote</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/orders" exact-active-class="active" class="nav-link">
            <span class="nav-icon">📦</span>
            <span>Aufträge</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/deliveries" exact-active-class="active" class="nav-link">
            <span class="nav-icon">📦</span>
            <span>Lieferungen</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/remeinders" exact-active-class="active" class="nav-link">
            <span class="nav-icon">📦</span>
            <span>Mahnungen</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" exact-active-class="active" class="nav-link">
            <span class="nav-icon">👤</span>
            <span>Profil</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" exact-active-class="active" class="nav-link">
            <span class="nav-icon">ℹ️</span>
            <span>Über</span>
          </router-link>
        </li>
      </div>
    </nav>

    <div v-if="auth" class="sidebar-footer">
      <a href="#" class="nav-link logout-link" @click="logout()">
        <span class="nav-icon">🚪</span>
        <span>Abmelden</span>
      </a>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
export default {
  name: 'ModernSidebar',
  data() {
    return {
      auth: null
    }
  },
  mounted() {
    this.auth = store.state.auth
  },
  methods: {
    async logout() {
      try {
        await store.clearStore('auth')
        this.$router.push('/login')
      } catch (error) {
        console.error('Abmeldefehler:', error)
      }
    }
  }
}
</script>

<style scoped>
/* ===== SIDEBAR ===== */
.sidebar {
  width: 300px;
  background: #0f172a;
  padding: 0;
  position: relative;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.app-logo {
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.nav-menu {
  list-style: none;
  padding: 16px 12px;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s;
  font-size: 18px;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.nav-link.active {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.nav-icon {
  width: 36px;
  text-align: center;
  font-size: 24px;
}

.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.logout-link {
  color: #f87171;
}

.logout-link:hover {
  background: rgba(248, 113, 113, 0.1);
}

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
