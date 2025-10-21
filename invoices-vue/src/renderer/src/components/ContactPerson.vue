<template lang="">
  <div>
    <div v-if="data.contact_person" class="contact-box">
      <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
      <div class="contact-person">
        <div class="contact-avatar">SM</div>
        <div class="contact-details">
          <div class="contact-name">{{ data.contact_person.full_name }}</div>
          <div class="contact-info">
            Projektmanagement & Kundenbetreuung<br />
            📞 +{{ data.contact_person.phone }}<br />
            📧 {{ data.contact_person.email }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContactPerson',
  props: {
    data: {
      type: Object
    }
  }
}
</script>
<style lang=""></style>
