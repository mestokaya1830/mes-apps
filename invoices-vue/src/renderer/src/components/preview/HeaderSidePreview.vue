<template>
  <div>
    <h1 class="header-title" :style="{ color: color }">{{ title }}</h1>
    <div class="header">
      <div class="company-info">
        <div class="company-name">{{ $store.state.auth.firm_name }}</div>
        <div class="company-details">{{ $store.state.auth.address }}</div>
        <div class="company-details">
          {{ $store.state.auth.postal_code }} {{ $store.state.auth.city }}
        </div>
        <div class="company-details">Tel: {{ $store.state.auth.phone }}</div>
        <div class="company-details">Email: {{ $store.state.auth.email }}</div>
        <div class="company-details">Web: {{ $store.state.auth.website }}</div>
      </div>
      <img :src="logoSrc" alt="Logo" class="preview-logo" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeaderSide',
  props: {
    title: {
      type: String
    },
    color: {
      type: String
    }
  },
  computed: {
    logoSrc() {
      const logo = this.$store.state.auth.logo
      if (!logo) return null
      if (typeof logo === 'string') {
        if (logo.startsWith('data:image')) return logo
        return `data:image/png;base64,${logo}`
      }
      try {
        let binary = ''
        const bytes = new Uint8Array(Object.values(logo))
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
        return `data:image/png;base64,${window.btoa(binary)}`
      } catch (error) {
        console.error(error)
        return null
      }
    }
  }
}
</script>
<style>
/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 15px;
  align-items: center;
  border-bottom: 3px solid #10b981;
}
.header-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
.logo-container {
  flex-shrink: 0;
  margin-left: 20px;
}
.section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 16px;
}
.company-name {
  font-size: 20px;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 4px;
}
.company-name-subtitle {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.company-details {
  font-size: 12px;
  color: var(--darkColor);
  line-height: 1.6;
}

.preview-logo {
  max-width: 160px;
  max-height: 100px;
  width: auto;
  height: auto;
  display: block;
  /* margin: 0 auto; */
}
</style>
