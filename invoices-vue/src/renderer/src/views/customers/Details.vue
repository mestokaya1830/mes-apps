<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <form class="customer-card" @submit.prevent="updateCustomer()">
      <div class="customer-card-item">
        <label>Company Type</label>
        <input v-model="customer.customer_type" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Company Name</label>
        <input v-model="customer.company_name" type="text" />
      </div>
      <div class="customer-card-item">
        <label>First Name</label>
        <input v-model="customer.first_name" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Last Name</label>
        <input v-model="customer.last_name" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Address</label>
        <input v-model="customer.address" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Postal Code</label>
        <input v-model="customer.postal_code" type="text" />
      </div>
      <div class="customer-card-item">
        <label>City</label>
        <input v-model="customer.cisty" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Conutry</label>
        <input v-model="customer.country" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Email</label>
        <input v-model="customer.email" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Phone</label>
        <input v-model="customer.phone" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Tax Number</label>
        <input v-model="customer.tax_number" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Vat Id</label>
        <input v-model="customer.vat_id" type="text" />
      </div>
      <div class="customer-card-item">
        <label>Status</label>
        <select v-model="customer.is_active">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div class="customer-card-item">
        <label>Created Time</label>
        <input v-model="customer.created_at" type="text" />
      </div>
      <button type="submit" class="form-btn">Update</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Customer List',
      customer: {
        customer_type: '',
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
        vat_id: '',
        is_active: '',
        created_at: ''
      }
    }
  },
  mounted() {
    this.customerDetails()
  },
  methods: {
    async customerDetails() {
      try {
        const result = await window.api.customerDetails(this.$route.params.id)
        this.customer = result.customer
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    },
    async updateCustomer() {
      try {
        const data = {
          id: this.$route.params.id,
          customer: JSON.parse(JSON.stringify(this.customer))
        }
        const result = await window.api.updateCustomer(data)
        if (result.success) {
          this.$router.push('/customers/index')
        }
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.customer-card {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.customer-card-item {
  min-width: 50%;
}
.customer-card h2 {
  margin-bottom: 15px;
  color: #333;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #555;
}

input, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4caf50;
  outline: none;
}

.form-btn {
  width: 100%;
  margin-top: 20px;
}
.link {
  text-decoration: none;
  color: white;
}
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
}
</style>
