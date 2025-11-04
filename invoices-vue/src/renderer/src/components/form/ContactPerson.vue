<template lang="">
  <div>
    <div v-if="contact_person" class="form-section">
      <div class="form-section-title">👥 Contact Person</div>
      <div class="form-group">
        <label class="form-label">Sprachpartner Vollname</label>
        <input
          v-model="contact_person.full_name"
          type="text"
          class="form-input"
          @input="getContectPerson"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input
          v-model="contact_person.email"
          type="text"
          class="form-input"
          @input="getContectPerson"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Tel</label>
        <input
          v-model="contact_person.phone"
          type="text"
          class="form-input"
          @input="getContectPerson"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContactPerson',
  props: {
    storeName: {
      type: String,
      required: true
    }
  },
  emits: ['get-contact-person'],
  data() {
    return {
      contact_person: {
        full_name: '',
        email: '',
        phone: ''
      }
    }
  },
  mounted() {
    if (this.$store.state[this.storeName] && this.$store.state[this.storeName].contact_person) {
      this.contact_person = this.$store.state[this.storeName].contact_person
    } else {
      return this.contact_person
    }
  },
  methods: {
    getContectPerson() {
      if (this.contact_person) this.$emit('get-contact-person', this.contact_person)
    }
  }
}
</script>
