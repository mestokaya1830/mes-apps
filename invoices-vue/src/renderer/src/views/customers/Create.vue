<template>
  <div class="">
    <h2 class="">Customer Registration Form</h2>
    <form @submit.prevent="saveCustomer">
      <!-- Customer Information -->
      <div class="">
        <h3 class="">Customer Information</h3>
        <div class="">
          <div>
            <label class="">Company Type *</label>
            <input
              v-model="customer.customer_type"
              type="text"
              required
              class=""
              placeholder="Enter company type"
            />
          </div>
          <div>
            <label class="">Company Name *</label>
            <input
              v-model="customer.company_name"
              type="text"
              required
              class=""
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label class="">First Name</label>
            <input
              v-model="customer.first_name"
              type="text"
              class=""
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label class="">Last Name</label>
            <input
              v-model="customer.last_name"
              type="text"
              class=""
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label class="">Email</label>
            <input v-model="customer.email" type="email" class="" placeholder="example@email.com" />
          </div>
          <div>
            <label class="">Phone</label>
            <input v-model="customer.phone" type="tel" class="" placeholder="+49 30 12345678" />
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="">
        <h3 class="">Address Information</h3>
        <div class="">
          <div class="md:col-span-2">
            <label class="">Address</label>
            <input v-model="customer.address" type="text" class="" placeholder="Hauptstraße 123" />
          </div>
          <div>
            <label class="">Postal Code</label>
            <input v-model="customer.postal_code" type="text" class="" placeholder="10115" />
          </div>
          <div>
            <label class="">City</label>
            <input v-model="customer.city" type="text" class="" placeholder="Berlin" />
          </div>
          <div>
            <label class="">Country</label>
            <input v-model="customer.country" type="text" class="" placeholder="Deutschland" />
          </div>
        </div>
      </div>

      <!-- Tax Information -->
      <div class="">
        <h3 class="">Tax Information</h3>
        <div class="">
          <div>
            <label class="">Steuernummer</label>
            <input v-model="customer.tax_number" type="text" class="" placeholder="123/456/78901" />
          </div>
          <div>
            <label class="">USt-IdNr.</label>
            <input v-model="customer.vat_id" type="text" class="" placeholder="DE123456789" />
          </div>
        </div>
      </div>

      <!-- Status Information -->
      <div class="">
        <h3 class="">Status Information</h3>
        <div class="">
          <div>
            <label class="">Status</label>
            <select v-model="customer.is_active" class="">
              <option value="">Select status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div>
            <label class="">Created At</label>
            <input v-model="customer.created_at" type="datetime-local" class="" />
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
      <p class="font-medium">✅ Customer successfully saved!</p>
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
        customer_type: 'individual',
        company_name: '',
        first_name: 'Maximilian',
        last_name: 'Weber',
        address: 'Friedrichstraße 158',
        postal_code: '10117',
        city: 'Berlin',
        country: 'Deutschland',
        email: 'max.weber@web.de',
        phone: '+49 30 7854321',
        tax_number: '11/456/78901',
        vat_id: '',
        is_active: true,
        created_at: ''
      }
    }
  },
  methods: {
    async saveCustomer() {
      this.isSubmitting = true
      this.showSuccess = false
      this.errorMessage = ''

      try {
        const data = JSON.parse(JSON.stringify(this.customer))
        const result = await window.api.addCustomer(data)
        // Save the customer to the server
        if (result.error) {
          throw new Error(result.error)
        }
        this.showSuccess = true
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
/* Register formundaki CSS'yi birebir kopyaladım */
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
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

.md\:col-span-2 {
  grid-column: span 2;
}

button:disabled {
  background: #bbb;
  cursor: not-allowed;
}

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
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

@media (max-width: 768px) {
  form > div > div {
    grid-template-columns: 1fr;
  }
}
</style>
