<template lang="">
  <div>
    <div v-if="contact" class="preview-box">
      <div class="preview-box-title"><i class="bi bi-person-lines-fill icons"></i>Kontaktdaten</div>
      <div class="preview-box-content">
        <span class="preview-box-label">SM:</span>
        <span class="preview-box-value">{{ contact.first_name }} {{ contact.last_name }}</span>
        <span class="preview-box-label">Tel: </span>
        <span class="preview-box-value">+{{ contact.phone }}</span>
        <span class="preview-box-label">Email: </span>
        <span class="preview-box-value">{{ contact.email }}</span>
      </div>
    </div>
  </div>
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
