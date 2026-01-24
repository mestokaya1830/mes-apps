<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="app-logo">
        <h2>Mes App</h2>
      </div>
    </div>

    <nav>
      <div class="nav-menu">
        <div class="nav-label">Hauptmenü</div>
        <li class="nav-item">
          <router-link to="/" exact-active-class="active" class="nav-link">
            <span class="material-icons">home</span>
            <span>Startseite</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/customers" exact-active-class="active" class="nav-link">
            <span class="material-icons">home</span>
            <span>Kunden</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/invoices" exact-active-class="active" class="nav-link">
            <span class="material-icons">home</span>
            <span>Rechnungen</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/offers" exact-active-class="active" class="nav-link">
            <span class="material-icons">home</span>
            <span>Angebote</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/orders" exact-active-class="active" class="nav-link">
            <span class="material-icons">home</span>
            <span>Aufträge</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" exact-active-class="active" class="nav-link">
            <span class="material-icons">home</span>
            <span>Über</span>
          </router-link>
        </li>
        <div class="nav-label">Verwaltung</div>
        <li class="nav-item">
          <router-link to="/reports" exact-active-class="active" class="nav-link">
            <span class="material-icons">home</span>
            <span>Berichte</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" exact-active-class="active" class="nav-link">
            <span class="material-icons">home</span>
            <span>Einstellungen</span>
          </router-link>
        </li>
      </div>
    </nav>

    <div v-if="auth" class="sidebar-footer">
      <a href="#" class="nav-link" @click="logout()">
        <div class="user-avatar">MK</div>
        <div>
          <h4>Max Keller</h4>
          <p>Administrator</p>
        </div>
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
    this.clearDate()
  },
  methods: {
    async logout() {
      try {
        await store.clearStore('auth')
        this.$router.push('/login')
      } catch (error) {
        console.error('Abmeldefehler:', error)
      }
    },
    async clearDate() {
      try {
        await store.clearStore('date_filter')
        await store.clearStore('category_filter')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
/* ===== SIDEBAR ===== */
.sidebar {
  width: 300px;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.app-logo {
  padding: 2rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.nav-menu {
  list-style: none;
  padding: 16px 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.95rem;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(59, 165, 92, 0.2) 0%, rgba(59, 165, 92, 0.05) 100%);
  color: white;
  font-weight: 600;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3ba55c;
}

.nav-icon {
  width: 36px;
  text-align: center;
  font-size: 24px;
}
.nav-label {
  padding: 0 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.2);
  margin-top: auto;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3ba55c 0%, #2d8a47 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.sidebar-footer h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.sidebar-footer p {
  margin-top: auto;
  font-size: 0.8rem;
  color: #9ca3af;
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
