<template lang="">
  <div>
    <div v-if="customers" class="form-section">
      <div class="form-section-title">👤 Kunde</div>
      <div class="form-group">
        <label class="form-label">Kundendaten</label>
        <select v-model="customerList" class="form-input" @change="getCustomerById">
          <option selected disabled>Wähle Kunden</option>
          <option v-for="item in customers" :key="item.id" :value="item.id">
            {{ item.company_name ? item.company_name : item.first_name + ' ' + item.last_name }}
          </option>
        </select>
      </div>
      <div v-if="selected_customer && selected_customer.id">
        <div class="form-group">
          <label class="form-label">Kunden-Nr.</label>
          <input v-model="selected_customer.id" type="text" class="form-input" readonly />
        </div>
        <div v-if="selected_customer.company_name" class="form-group">
          <label class="form-label">Firmname</label>
          <input v-model="selected_customer.company_name" type="text" class="form-input" readonly />
        </div>
        <div v-if="selected_customer.first_name" class="form-row">
          <div class="form-group">
            <label class="form-label">Vorname</label>
            <input v-model="selected_customer.first_name" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Nachname</label>
            <input v-model="selected_customer.last_name" type="text" class="form-input" readonly />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Adresse</label>
          <input v-model="selected_customer.address" type="text" class="form-input" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ</label>
            <input
              v-model="selected_customer.postal_code"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input v-model="selected_customer.city" type="text" class="form-input" readonly />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SelectedCustomer',
  props: {
    customerData: {
      type: Object,
      required: false
    },
    storeName: {
      type: String,
      reuquired: true
    }
  },
  emits: ['get-selected-customer'],
  data() {
    return {
      customers: [],
      customerList: 'Wähle Kunden',
      selected_customer: {
        id: '',
        company_name: '',
        first_name: '',
        last_name: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
        email: '',
        phone: '',
        tax_number: '',
        vat_id: ''
      }
    }
  },
  mounted() {
    this.getCustomers()
    if (this.customerData) this.selected_customer = this.customerData
  },
  methods: {
    async getCustomers() {
      try {
        const response = await window.api.getCustomers()
        if (response.success) {
          this.customers = response.customers
        } else {
          console.error('Error fetching customers:', response.message)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    },
    getCustomerById() {
      const customer = this.customers.find((item) => item.id === this.customerList)
      if (customer) this.selected_customer = customer
      if (this.selected_customer) this.$emit('get-selected-customer', this.selected_customer)
    }
  }
}
</script>
<style lang=""></style>
