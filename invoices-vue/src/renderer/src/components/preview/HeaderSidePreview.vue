<template>
  <div>
    <h1 class="header-title">{{ title }}</h1>
    <div v-if="headerData" class="header">
      <div class="company-info">
        <div class="company-name">{{ headerData.company_name }}</div>
        <div class="company-details">{{ headerData.address }}</div>
        <div class="company-details">{{ headerData.postal_code }} {{ headerData.city }}</div>
        <div class="company-details">Tel: {{ headerData.phone }}</div>
        <div class="company-details">Email: {{ headerData.email }}</div>
        <div class="company-details">Web: {{ headerData.website }}</div>
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
      type: String,
      required: true
    },
    auth: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      headerData: {}
    }
  },
  computed: {
    logoSrc() {
      const logo = this.headerData.logo
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
  },
  mounted() {
    if (this.auth) {
      this.headerData = this.auth
    }
  }
}
</script>