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
            <i class="bi bi-house nav-icon"></i>
            <span class="nav-text">Startseite</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/customers" exact-active-class="active" class="nav-link">
            <i class="bi bi-people nav-icon"></i>
            <span class="nav-text">Kunden</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/invoices" exact-active-class="active" class="nav-link">
            <i class="bi bi-receipt nav-icon"></i>
            <span class="nav-text">Rechnungen</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/offers" exact-active-class="active" class="nav-link">
            <i class="bi bi-file-earmark-text nav-icon"></i>
            <span class="nav-text">Angebote</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/orders" exact-active-class="active" class="nav-link">
            <i class="bi bi-bag-check nav-icon"></i>
            <span class="nav-text">Aufträge</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/about" exact-active-class="active" class="nav-link">
            <i class="bi bi-info-circle nav-icon"></i>
            <span class="nav-text">Über</span>
          </router-link>
        </li>

        <div class="nav-label">Verwaltung</div>

        <li class="nav-item">
          <router-link to="/reports" exact-active-class="active" class="nav-link">
            <i class="bi bi-bar-chart nav-icon"></i>
            <span class="nav-text">Berichte</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/profile" exact-active-class="active" class="nav-link">
            <i class="bi bi-gear nav-icon"></i>
            <span class="nav-text">Einstellungen</span>
          </router-link>
        </li>
      </div>
    </nav>

    <div v-if="checkLogout" class="sidebar-footer">
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
  computed:{
    checkLogout(){
      return store.state.auth
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
