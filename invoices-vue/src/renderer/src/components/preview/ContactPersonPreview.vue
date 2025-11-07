<template lang="">
  <div>
    <div v-if="contact" class="contact-box">
      <div class="bank-title">👤 Ansprechpartnerin</div>
      <div class="bank-info">
        <span class="bank-label">SM:</span>
        <span class="bank-value">{{ contact.first_name }} {{ contact.last_name }}</span>
        <span class="bank-label">Tel: </span>
        <span class="bank-value">+{{ contact.phone }}</span>
        <span class="bank-label">Email: </span>
        <span class="bank-value">{{ contact.email }}</span>
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
