<template>
  <div class="">
    <h2 class="">Customer Registration Form</h2>
    <form @submit.prevent="saveCustomer">
      <!-- Personal Information -->
      <div class="">
        <h3 class="">Customer Information</h3>
        <div class="">
          <div>
            <label class="">Company Type *</label>
            <input
              v-model="customer.company_type"
              type="text"
              required
              class=""
              placeholder="Enter your company type"
            />
          </div>
        </div>
        <div class="">
          <div>
            <label class="">Company Name *</label>
            <input
              v-model="customer.company_name"
              type="text"
              required
              class=""
              placeholder="Enter your company name"
            />
          </div>
        </div>
      </div>
      <!-- Submit Button -->
      <div class="flex justify-center pt-6">
        <button type="submit" :disabled="isSubmitting" class="form-btn">
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Save Customer</span>
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div v-if="showSuccess" class="">
      <p class="font-medium">✅ User successfully saved!</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="">
      <p class="font-medium">❌ Error: {{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerRegistrationForm',
  data() {
    return {
      isSubmitting: false,
      showSuccess: false,
      errorMessage: '',
      customer: {
        customer_type: null,
        company_name: null,
        first_name: null,
        last_name: null,
        address: null,
        postal_code: null,
        city: null,
        country: null,
        email: null,
        phone: null,
        tax_number: null,
        vat_id: null,
        is_active: null,
        created_at: null
      }
    }
  },
  methods: {
    async saveCustomer() {
      try {
        console.log('Saving customer:', this.customer)
        this.showSuccess = true
        this.errorMessage = ''
      } catch (err) {
        console.error('Failed to save customer:', err)
        this.showSuccess = false
        this.errorMessage = 'Failed to save customer'
      }
    }
  }
}
</script>

<style scoped>
form {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #333;
}

h3 {
  margin: 1.5rem 0 1rem;
  font-size: 1.2rem;
  color: #444;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.3rem;
}
form > div > div {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

form > div > div > div {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #333;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

/* Tek kolon alanları */
.md\:col-span-2 {
  grid-column: span 2;
}

button:disabled {
  background: #bbb;
  cursor: not-allowed;
}

/* Success & Error */
[v-cloak] {
  display: none;
}

div[v-if='showSuccess'],
div[v-if='errorMessage'] {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

div[v-if='showSuccess'] {
  background: #e7f9ed;
  color: #1e7e34;
}

div[v-if='errorMessage'] {
  background: #fdeaea;
  color: #b71c1c;
}

.logo-preview {
  width: 100px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
}
.form-btn {
  margin-top: 2rem;
}
/* Responsive */
@media (max-width: 768px) {
  form > div > div {
    grid-template-columns: 1fr;
  }
}
</style>
