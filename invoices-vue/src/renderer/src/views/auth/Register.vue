<template>
  <div class="">
    <h2 class="">User Registration Form</h2>
    <form @submit.prevent="saveUser">
      <!-- Personal Information -->
      <div class="">
        <h3 class="">Personal Information</h3>
        <div class="">
          <div>
            <label class="">First Name *</label>
            <input
              v-model="user.first_name"
              type="text"
              required
              class=""
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label class="">Last Name *</label>
            <input
              v-model="user.last_name"
              type="text"
              required
              class=""
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label class="">Email *</label>
            <input
              v-model="user.email"
              type="email"
              required
              class=""
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label class="">Password *</label>
            <input
              v-model="user.password"
              type="password"
              required
              class=""
              placeholder="Create a strong password"
            />
          </div>
          <div>
            <label class="">Phone</label>
            <input v-model="user.phone" type="tel" class="" placeholder="+49 30 12345678" />
          </div>
          <div>
            <label class="">Website</label>
            <input v-model="user.website" type="url" class="" placeholder="www.example.com" />
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="">
        <h3 class="">Address Information</h3>
        <div class="">
          <div class="md:col-span-2">
            <label class="">Address</label>
            <input v-model="user.address" type="text" class="" placeholder="Hauptstraße 123" />
          </div>
          <div>
            <label class="">Postal Code</label>
            <input v-model="user.postal_code" type="text" class="" placeholder="10115" />
          </div>
          <div>
            <label class="">City</label>
            <input v-model="user.city" type="text" class="" placeholder="Berlin" />
          </div>
          <div>
            <label class="">Country</label>
            <input v-model="user.country" type="text" class="" placeholder="Deutschland" />
          </div>
        </div>
      </div>

      <!-- Company Information -->
      <div class="">
        <h3 class="">Company Information</h3>
        <div class="">
          <div>
            <label class="">Company Name</label>
            <input v-model="user.firm_name" type="text" class="" placeholder="TechSolutions GmbH" />
          </div>
          <div>
            <label class="">Managing Director</label>
            <input
              v-model="user.managing_director"
              type="text"
              class=""
              placeholder="Hans Mueller"
            />
          </div>
          <div>
            <label class="">Logo URL</label>
            <input v-model="user.logo" type="text" class="" placeholder="/assets/logo.png" />
          </div>
        </div>
      </div>

      <!-- Tax Information -->
      <div class="">
        <h3 class="">Tax Information</h3>
        <div class="">
          <div>
            <label class="">Tax Number</label>
            <input v-model="user.tax_number" type="text" class="" placeholder="123/456/78901" />
          </div>
          <div>
            <label class="">Tax Office</label>
            <input
              v-model="user.tax_office"
              type="text"
              class=""
              placeholder="Finanzamt Berlin Mitte/Tiergarten"
            />
          </div>
          <div>
            <label class="">VAT ID</label>
            <input v-model="user.vat_id" type="text" class="" placeholder="DE123456789" />
          </div>
          <div>
            <label class="">Court Registration</label>
            <input
              v-model="user.court_registration"
              type="text"
              class=""
              placeholder="HRB 12345 B"
            />
          </div>
          <div>
            <label class="">Court Location</label>
            <input
              v-model="user.court_location"
              type="text"
              class=""
              placeholder="Amtsgericht Berlin"
            />
          </div>
        </div>
      </div>

      <!-- Bank Information -->
      <div class="">
        <h3 class="">Bank Information</h3>
        <div class="">
          <div>
            <label class="">Bank Name</label>
            <input v-model="user.bank_name" type="text" class="" placeholder="Deutsche Bank AG" />
          </div>
          <div>
            <label class="">BIC</label>
            <input v-model="user.bic" type="text" class="" placeholder="DEUTDEBBXXX" />
          </div>
          <div>
            <label class="">IBAN</label>
            <input v-model="user.iban" type="text" class="" placeholder="DE89370400440532013000" />
          </div>
          <div>
            <label class="">Account Holder</label>
            <input
              v-model="user.bank_account_holder"
              type="text"
              class=""
              placeholder="TechSolutions GmbH"
            />
          </div>
        </div>
      </div>

      <!-- Company Signature -->
      <div class="">
        <h3 class="">Company Signature</h3>
        <div>
          <label class="">Signature Text</label>
          <textarea
            v-model="user.company_signature"
            rows="4"
            class=""
            placeholder="Mit freundlichen Grüßen&#10;TechSolutions GmbH&#10;Hans Mueller&#10;Geschäftsführer"
          ></textarea>
        </div>
      </div>
      <!-- Submit Button -->
      <div class="flex justify-center pt-6">
        <button type="submit" :disabled="isSubmitting" class="">
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Save User</span>
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
  name: 'UserRegistrationForm',
  data() {
    return {
      isSubmitting: false,
      showSuccess: false,
      errorMessage: '',
      user: {
        first_name: '',
        last_name: '',
        password: '',
        email: '',
        phone: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
        website: '',
        firm_name: '',
        legal_form: '',
        managing_director: '',
        tax_number: '',
        tax_office: '',
        vat_id: '',
        court_registration: '',
        court_location: '',
        logo: '',
        company_signature: '',
        bank_name: '',
        bic: '',
        iban: '',
        bank_account_holder: ''
      }
    }
  },
  methods: {
    // Submit form
    async saveUser() {
      // this.isSubmitting = true
      // this.showSuccess = false
      // this.errorMessage = ''
      console.log('Saving user:', this.user)
    }
  }
}
</script>

<style scoped>
/* Optional: Add any component-specific styles here */
</style>
