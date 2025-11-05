<template lang="">
  <div>
    <div v-if="contact_person" class="contact-box">
      <div class="bank-title">👤 Ansprechpartnerin</div>
      <div class="bank-info">
        <span class="bank-label">SM:</span>
        <span class="bank-value"
          >{{ contact_person.first_name }} {{ contact_person.last_name }}</span
        >
        <span class="bank-label">Tel: </span>
        <span class="bank-value">+{{ contact_person.phone }}</span>
        <span class="bank-label">Email: </span>
        <span class="bank-value">{{ contact_person.email }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContactPerson',
  data() {
    return {
      contact_person: null
    }
  },
  mounted() {
    this.contact_person = this.$store.state.auth.contact_person
  }
}
</script>
