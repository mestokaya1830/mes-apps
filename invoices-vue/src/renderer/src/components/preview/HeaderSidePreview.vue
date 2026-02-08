<template>
  <div>
    <h1 class="main-title">{{ title }}</h1>
    <div v-if="headerData" class="header">
      <div class="company-info">
        <div class="company-name">{{ headerData.company_name }}</div>
        <div class="company-details">{{ headerData.address }}</div>
        <div class="company-details">{{ headerData.postal_code }} {{ headerData.city }}</div>
        <div class="company-details">Tel: {{ headerData.phone }}</div>
        <div class="company-details">Email: {{ headerData.email }}</div>
        <div class="company-details">Web: {{ headerData.website }}</div>
      </div>
      <img :src="`/uploads/user/${auth.logo}`" alt="Logo" class="user-logo" />
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
      headerData: {},
      selected_image: ''
    }
  },
  mounted() {
    if (this.auth) {
      this.headerData = this.auth
    }
  }
}
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 15px;
  align-items: center;
  border-top: 0.5px solid #ddd;
  border-bottom: 3px solid #91a7c5;
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
.user-logo {
  max-width: 160px;
  max-height: 100px;
  width: auto;
  height: auto;
  display: block;
}
</style>