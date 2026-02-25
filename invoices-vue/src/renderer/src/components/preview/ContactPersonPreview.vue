<template lang="">
  <main>
    <section v-if="contact" class="preview-box" aria-label="Kontaktdaten">
      <h2 class="preview-box-title">
        <i class="bi bi-person-lines-fill icons" aria-hidden="true"></i>Kontaktdaten
      </h2>
      <dl class="preview-box-content">
        <dt class="preview-box-label">SM:</dt>
        <dm class="preview-box-value">{{ contact.first_name }} {{ contact.last_name }}</dm>
        <dt class="preview-box-label">Tel:</dt>
        <dm class="preview-box-value">+{{ contact.phone }}</dm>
        <dt class="preview-box-label">Email:</dt>
        <dm class="preview-box-value">{{ contact.email }}</dm>
      </dl>
    </section>
  </main>
</template>
<script>
export default {
  name: 'ContactPerson',
  props: {
    contactData: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      contact: {}
    }
  },
  mounted() {
    if (this.contactData) this.contact = JSON.parse(this.contactData)
  }
}
</script>
