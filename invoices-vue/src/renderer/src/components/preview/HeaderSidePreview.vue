<template>
  <div>
    <h1 class="main-title">{{ title }}</h1>
    <div v-if="headerData" class="header-component">
      <div class="header-company-info">
        <label class="header-company-name">{{ headerData.company_name }}</label>
        <div class="header-compnay-label">{{ headerData.address }}</div>
        <div class="header-compnay-label">{{ headerData.postal_code }} {{ headerData.city }}</div>
        <div class="header-compnay-label">Tel: {{ headerData.phone }}</div>
        <div class="header-compnay-label">Email: {{ headerData.email }}</div>
        <div class="header-compnay-label">Web: {{ headerData.website }}</div>
      </div>
      <img :src="`/uploads/user/${auth.logo}`" alt="Logo" class="header-user-logo" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeaderSidePreview',
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
.header-component {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 15px;
  align-items: center;
  border-top: 0.5px solid #ddd;
  border-bottom: 3px solid #91a7c5;
}

.header-company-name {
  font-size: 18px;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 4px;
}
.header-compnay-label {
  font-size: 13px;
  color: var(--darkColor);
  line-height: 1.6;
}
.header-user-logo {
  width: 140px;
  max-width: 160px;
  display: block;
}
</style>