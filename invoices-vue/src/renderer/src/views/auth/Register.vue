<template>
  <div class="">
    <h2 class="">User Registration Form</h2>
    <form @submit.prevent="register">
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
            <input type="file" placeholder="/assets/logo.png" class="" @change="setLogo($event)" />
          </div>
          <div>
            <label class="">Preview Logo</label>
            <img :src="selectedImage" class="logo-preview" />
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
        <button type="submit" :disabled="isSubmitting" class="form-btn">
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
        first_name: 'Max',
        last_name: 'Mustermann',
        password: '121212',
        email: 'user@user.de',
        phone: '+49 30 12345678',
        address: 'Musterstraße 12',
        postal_code: '10115',
        city: 'Berlin',
        country: 'Germany',
        website: 'https://www.example.de',
        firm_name: 'Musterfirma GmbH',
        legal_form: 'GmbH', // Almanya’daki limited şirket
        managing_director: 'Max Mustermann',
        tax_number: '12/345/67890',
        tax_office: 'Finanzamt Berlin-Mitte',
        vat_id: 'DE123456789',
        court_registration: 'Amtsgericht Berlin',
        court_location: 'Berlin',
        company_signature: 'https://www.example.de/signature.png',
        bank_name: 'Deutsche Bank',
        bic: 'DEUTDEBBXXX',
        iban: 'DE89370400440532013000',
        bank_account_holder: 'Max Mustermann'
      },
      binaryImage: null,
      selectedImage: null
    }
  },
  methods: {
    async setLogo(event) {
      const file = event.target.files[0]
      if (!file) return
      const previewReader = new FileReader()
      previewReader.onload = () => {
        this.selectedImage = previewReader.result // Base64 string, <img> için
      }
      previewReader.readAsDataURL(file)

      // DB  binary
      const binaryReader = new FileReader()
      binaryReader.onload = () => {
        this.binaryImage = new Uint8Array(binaryReader.result) // ArrayBuffer → Uint8Array
      }
      binaryReader.readAsArrayBuffer(file)
    },
    // Submit form
    async register() {
      if (this.user) {
        if (!this.binaryImage) return (this.errorMessage = 'Logo is required')
        const result = await window.api.register(
          Array.from(this.binaryImage),
          JSON.parse(JSON.stringify(this.user))
        )
        // const result = await window.api.register(this.base64, JSON.parse(JSON.stringify(this.user)))
        if (result.success) {
          this.errorMessage = ''
          this.$router.push('/login')
        }
      }
      console.log('Saving user:', this.user)
    }
  }
}
</script>

<style scoped>
/* Genel Form Alanı */
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

/* Başlıklar */
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

/* Grid Yapısı */
form > div > div {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

form > div > div > div {
  display: flex;
  flex-direction: column;
}

/* Label */
label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #333;
}

/* Input ve Textarea */
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
