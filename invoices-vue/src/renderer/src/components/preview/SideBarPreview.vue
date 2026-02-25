<template>
  <main>
    <header class="sidebar-header">
      <img src="/app_logo.png" class="sidebar-logo" alt="" aria-hidden="true">
    </header>

    <nav aria-label="Hauptnavigation">
      <section>
        <h3 class="nav-label">Hauptmenü</h3>
        <ul>
          <li class="nav-item">
            <router-link to="/" exact-active-class="active" class="nav-link">
              <i class="bi bi-house nav-icon" aria-hidden="true"></i>
              <span class="nav-text">Startseite</span>
            </router-link>
          </li>
  
          <li class="nav-item">
            <router-link to="/customers" exact-active-class="active" class="nav-link">
              <i class="bi bi-people nav-icon" aria-hidden="true"></i>
              <span class="nav-text">Kunden</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/invoices" exact-active-class="active" class="nav-link">
              <i class="bi bi-receipt nav-icon" aria-hidden="true"></i>
              <span class="nav-text">Rechnungen</span>
            </router-link>
          </li>
  
          <li class="nav-item">
            <router-link to="/offers" exact-active-class="active" class="nav-link">
              <i class="bi bi-file-earmark-text nav-icon" aria-hidden="true"></i>
              <span class="nav-text">Angebote</span>
            </router-link>
          </li>
  
          <li class="nav-item">
            <router-link to="/orders" exact-active-class="active" class="nav-link">
              <i class="bi bi-bag-check nav-icon" aria-hidden="true"></i>
              <span class="nav-text">Aufträge</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" exact-active-class="active" class="nav-link">
              <i class="bi bi-info-circle nav-icon" aria-hidden="true"></i>
              <span class="nav-text">Über</span>
            </router-link>
          </li>
        </ul>
      </section>
     <section>
       <ul>
         <h3 class="nav-label">Verwaltung</h3>
          <li class="nav-item">
            <router-link to="/reports" exact-active-class="active" class="nav-link">
              <i class="bi bi-bar-chart nav-icon" aria-hidden="true"></i>
              <span class="nav-text">Berichte</span>
            </router-link>
          </li>
  
          <li class="nav-item">
            <router-link to="/profile" exact-active-class="active" class="nav-link">
              <i class="bi bi-gear nav-icon" aria-hidden="true"></i>
              <span class="nav-text">Einstellungen</span>
            </router-link>
          </li>
        </ul>
     </section>
    </nav>

    <footer v-if="checkLogout" class="sidebar-footer">
      <a href="#" class="logout-link" @click="logout()">
        <i class="bi bi-box-arrow-left logout-icon"></i>
        <span class="logout-text">Abmelden</span>
      </a>
    </footer>
  </main>
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
  computed: {
    checkLogout() {
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
