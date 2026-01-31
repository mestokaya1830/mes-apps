<template>
  <div class="page-setup">
    <div class="setup-container">
      <!-- Logo ve Başlık -->
      <div class="logo-section">
        <img src="/logo.png" class="app-logo" alt="Mes App Logo" />
      </div>

      <h1 class="setup-title">Willkommen beim Setup von Mes App</h1>
      <p class="setup-description">
        Erstellen Sie in wenigen Schritten Ihr professionelles Rechnungskonto
      </p>

      <!-- Features Grid -->
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="bi bi-lightning-charge-fill"></i>
          </div>
          <h3>Schnell & Einfach</h3>
          <p>Setup in 2 Minuten</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <i class="bi bi-shield-check"></i>
          </div>
          <h3>DSGVO-konform</h3>
          <p>Ihre Daten sind sicher</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <i class="bi bi-file-earmark-text"></i>
          </div>
          <h3>Professionell</h3>
          <p>Rechtskonforme Rechnungen</p>
        </div>
      </div>

      <!-- Action Button -->
      <router-link to="/register" class="btn btn-primary btn-setup">
        <span>Weiter</span>
        <i class="bi bi-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>

