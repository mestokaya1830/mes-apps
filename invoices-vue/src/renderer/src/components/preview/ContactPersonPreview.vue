<template lang="">
  <div>
    <div v-if="data" class="contact-box">
      <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
      <div class="contact-person">
        <div class="contact-avatar">SM</div>
        <div class="contact-details">
          <div class="contact-name">{{ data.full_name }}</div>
          <div class="contact-info">
            Projektmanagement & Kundenbetreuung<br />
            📞 +{{ data.phone }}<br />
            📧 {{ data.email }}
          </div>
          {{ data }}
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
      type: Object,
      required: true
    }
  }
}
</script>

