<template lang="">
  <div>
    <div class="form-section">
      <div class="form-section-title">
        <span>👤 Kleinunternehmer</span>
        <label for="kleinunternehmer-checkbox" class="switch">
          <input
            id="kleinunternehmer-checkbox"
            v-model="is_small_company"
            type="checkbox"
            class="switch-checkbox"
            @change="getSmallCompany"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SmallCompany',
  props: {
    storeName: {
      type: String,
      required: true
    }
  },
  emits: ['get-small-company'],
  data() {
    return {
      is_small_company: false
    }
  },
  mounted() {
    if (this.$store.state[this.storeName] && this.$store.state[this.storeName].is_small_company) {
      this.is_small_company = this.$store.state[this.storeName].is_small_company
    } else {
      return this.is_small_company
    }
  },
  methods: {
    getSmallCompany() {
      this.$emit('get-small-company', this.is_small_company)
    }
  }
}
</script>
