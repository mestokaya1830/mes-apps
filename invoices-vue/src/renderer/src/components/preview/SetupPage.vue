<template>
  <main class="setup-container">
    <header class="logo-header">
      <img src="/app_logo.png" class="app-logo" alt="Mes App Logo" aria-hidden="true" />
    </header>

    <h1 class="setup-title">Willkommen beim Setup von Mes App</h1>
    <p class="setup-description">
      Erstellen Sie in wenigen Schritten Ihr professionelles Rechnungskonto
    </p>

    <!-- Features Grid -->
    <section class="features-grid">
      <article class="feature-card">
        <div class="feature-icon">
          <i class="bi bi-lightning-charge-fill" aria-hidden="true"></i>
        </div>
        <h3>Schnell & Einfach</h3>
        <p>Setup in 2 Minuten</p>
      </article>

      <article class="feature-card">
        <div class="feature-icon">
          <i class="bi bi-shield-check" aria-hidden="true"></i>
        </div>
        <h3>DSGVO-konform</h3>
        <p>Ihre Daten sind sicher</p>
      </article>

      <article class="feature-card">
        <div class="feature-icon">
          <i class="bi bi-file-earmark-text" aria-hidden="true"></i>
        </div>
        <h3>Professionell</h3>
        <p>Rechtskonforme Rechnungen</p>
      </article>
    </section>

    <!-- Action Button -->
    <footer>
      <router-link to="/register" class="btn btn-setup">
        <span>Weiter</span>
        <i class="bi bi-arrow-right" aria-hidden="true"></i>
      </router-link>
    </footer>
  </main>
</template>
