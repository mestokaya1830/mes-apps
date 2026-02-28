<template>
  <div>
    <header>
      <h1 class="main-title">{{ title }}</h1>
    </header>

    <section v-if="headerData" class="header-component" aria-label="Seitenkopf">
      <div class="header-company-info">
        <h2 class="sr-only">Firmeninformationen</h2>
        <dl>
          <dt>Firma:</dt>
          <dd>{{ headerData.company_name }}</dd>

          <dt>Adresse:</dt>
          <dd>{{ headerData.address }}</dd>

          <dt>PLZ / Ort:</dt>
          <dd>{{ headerData.postal_code }} {{ headerData.city }}</dd>

          <dt>Tel:</dt>
          <dd>{{ headerData.phone }}</dd>

          <dt>Email:</dt>
          <dd>{{ headerData.email }}</dd>

          <dt>Web:</dt>
          <dd>{{ headerData.website }}</dd>
        </dl>
      </div>

      <img
        :src="`/uploads/user/${auth.logo}`"
        :alt="`${headerData.company_name} Logo`"
        class="header-user-logo"
        aria-hidden="true"
      />
    </section>
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
