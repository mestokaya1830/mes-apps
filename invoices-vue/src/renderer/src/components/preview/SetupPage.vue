<template>
  <div class="setup-container">
    <!-- Logo ve Başlık -->
    <div class="logo-header">
      <img src="/app_logo.png" class="app-logo" alt="Mes App Logo" />
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
</template>

<style>
.setup-page{
  width: 50%;
}
.setup-container {
  width: 100%;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
  margin-top: 100px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-header {
  margin-bottom: 35px;
  padding: 20px;
  display: inline-block;
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.setup-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 15px 0;
  line-height: 1.2;
}

.setup-description {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 40px 0;
  line-height: 1.5;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  padding: 25px 15px;
  border-radius: 16px;
}

.feature-icon {
  width: 55px;
  height: 55px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #12b486 0%, #0d8a6b 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon i {
  font-size: 26px;
  color: white;
}

.feature-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.feature-card p {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0;
}

@media screen and (min-width: 1610px) {
  .logo-header {
    margin-bottom: 45px;
  }

  .app-logo {
    max-width: 480px;
  }

  .setup-title {
    font-size: 40px;
  }

  .setup-description {
    font-size: 19px;
    margin-bottom: 50px;
  }

  .features-grid {
    gap: 28px;
    margin-bottom: 50px;
  }

  .feature-card {
    padding: 32px 20px;
  }

  .feature-icon {
    width: 68px;
    height: 68px;
    margin-bottom: 20px;
  }

  .feature-icon i {
    font-size: 32px;
  }

  .feature-card h3 {
    font-size: 18px;
  }

  .feature-card p {
    font-size: 15px;
  }
}
</style>