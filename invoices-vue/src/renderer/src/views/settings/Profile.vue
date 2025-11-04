<template>
  <div>
    <h2>Profil Bearbeiten</h2>
    <form class="register-form" @submit.prevent="updateUser">
      <!-- Personal Information -->
      <div>
        <h3>Persönliche Informationen</h3>
        <div>
          <div class="md:col-span-2">
            <label>Anrede</label>
            <select v-model="user.gender" class="form-input">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
          </div>
          <div>
            <label>Vorname *</label>
            <input
              v-model="user.first_name"
              type="text"
              required
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label>Nachname *</label>
            <input
              v-model="user.last_name"
              type="text"
              required
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label>E-Mail *</label>
            <input v-model="user.email" type="email" required placeholder="example@email.com" />
          </div>
          <div>
            <label>Passwort (leer lassen, wenn nicht ändern)</label>
            <input v-model="user.password" type="password" placeholder="Neues Passwort eingeben" />
          </div>
          <div>
            <label>Telefon</label>
            <input v-model="user.phone" type="tel" placeholder="+49 30 12345678" />
          </div>
          <div>
            <label>Webseite</label>
            <input v-model="user.website" type="url" placeholder="www.example.com" />
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div>
        <h3>Adressinformationen</h3>
        <div>
          <div class="md:col-span-2">
            <label>Adresse</label>
            <input v-model="user.address" type="text" placeholder="Hauptstraße 123" />
          </div>
          <div>
            <label>Postleitzahl</label>
            <input v-model="user.postal_code" type="text" placeholder="10115" />
          </div>
          <div>
            <label>Stadt</label>
            <input v-model="user.city" type="text" placeholder="Berlin" />
          </div>
          <div class="md:col-span-2">
            <label>🇩🇪 Bundesland (Deutschland)</label>
            <select v-model="user.state" class="form-input">
              <option disabled value="">Bitte wählen</option>
              <option v-for="item in german_states" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Company Information -->
      <div v-if="user.company_details">
        <h3>Unternehmensinformationen</h3>
        <div>
          <div>
            <label>Firmenname</label>
            <input v-model="user.company_name" type="text" placeholder="TechSolutions GmbH" />
          </div>
          <div>
            <label>🇩🇪 Unternehmensform (Deutschland)</label>
            <select v-model="user.company_details" class="form-input">
              <option disabled value="">-- Bitte wählen --</option>
              <option v-for="item in companies" :key="item.value" :value="item">
                {{ item.label }}
              </option>
            </select>
          </div>
          <div>
            <label>Firmenlogo (Neues Logo hochladen)</label>
            <input type="file" placeholder="/assets/logo.png" @change="setLogo($event)" />
          </div>
          <div>
            <label>Logo-Vorschau</label>
            <img :src="selectedImage" class="logo-preview" alt="Company Logo" />
          </div>
        </div>
      </div>

      <!-- contact person -->
      <div v-if="user.contact_person">
        <h3>Ansprechpartner</h3>
        <div>
          <div class="md:col-span-2">
            <label>Anrede</label>
            <select v-model="user.contact_person.gender" class="form-input">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
          </div>
          <div>
            <label>Vorname</label>
            <input
              v-model="user.contact_person.first_name"
              type="text"
              placeholder="Hans Mueller"
            />
          </div>
          <div>
            <label>Nachname</label>
            <input v-model="user.contact_person.last_name" type="text" placeholder="Hans Mueller" />
          </div>
          <div>
            <label>Telefon</label>
            <input v-model="user.contact_person.phone" type="tel" placeholder="+49 30 12345678" />
          </div>
          <div>
            <label>E-Mail</label>
            <input
              v-model="user.contact_person.email"
              type="email"
              placeholder="example@email.com"
            />
          </div>
        </div>
      </div>

      <!-- Tax Information -->
      <div>
        <h3>Steuerinformationen</h3>
        <div>
          <div>
            <label>Steuernummer</label>
            <input v-model="user.tax_number" type="text" placeholder="123/456/78901" />
          </div>
          <div>
            <label>Finanzamt</label>
            <input
              v-model="user.tax_office"
              type="text"
              placeholder="Finanzamt Berlin Mitte/Tiergarten"
            />
          </div>
          <div>
            <label>USt-IdNr.</label>
            <input v-model="user.vat_id" type="text" placeholder="DE123456789" />
          </div>
          <div>
            <label>Handelsregistereintrag</label>
            <input v-model="user.court_registration" type="text" placeholder="HRB 12345 B" />
          </div>
          <div>
            <label>Gerichtsstand</label>
            <input v-model="user.court_location" type="text" placeholder="Amtsgericht Berlin" />
          </div>
        </div>
      </div>

      <!-- Bank Information -->
      <div>
        <h3>Bankinformationen</h3>
        <div>
          <div>
            <label>Bankname</label>
            <input v-model="user.bank_name" type="text" placeholder="Deutsche Bank AG" />
          </div>
          <div>
            <label>BIC</label>
            <input v-model="user.bic" type="text" placeholder="DEUTDEBBXXX" />
          </div>
          <div>
            <label>IBAN</label>
            <input v-model="user.iban" type="text" placeholder="DE89370400440532013000" />
          </div>
          <div>
            <label>Kontoinhaber</label>
            <input
              v-model="user.bank_account_holder"
              type="text"
              placeholder="TechSolutions GmbH"
            />
          </div>
        </div>
      </div>

      <!-- Company Signature -->
      <div>
        <h3>Unternehmenssignatur</h3>
        <div>
          <label>Signaturtext</label>
          <textarea
            v-model="user.company_signature"
            rows="4"
            placeholder="Mit freundlichen Grüßen&#10;TechSolutions GmbH&#10;Hans Mueller&#10;Geschäftsführer"
          ></textarea>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center pt-6">
        <button type="submit" :disabled="isSubmitting" class="form-btn">
          <span v-if="isSubmitting">Wird gespeichert...</span>
          <span v-else>Profil Aktualisieren</span>
        </button>
      </div>
    </form>

    <!-- Loading Message -->
    <div v-if="isLoading" class="loading-message">
      <p>Profil wird geladen...</p>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <p class="font-medium">✅ Profil wurde erfolgreich aktualisiert!</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      <p class="font-medium">❌ Fehler: {{ errorMessage }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EditProfileForm',
  data() {
    return {
      isLoading: true,
      isSubmitting: false,
      showSuccess: false,
      errorMessage: '',
      user: {},
      selectedImage: null,
      binaryImage: null,

      //data
      german_states: [
        { label: 'Baden-Württemberg', value: 'Baden-Württemberg' },
        { label: 'Bayern', value: 'Bayern' },
        { label: 'Berlin', value: 'Berlin' },
        { label: 'Brandenburg', value: 'Brandenburg' },
        { label: 'Bremen', value: 'Bremen' },
        { label: 'Hamburg', value: 'Hamburg' },
        { label: 'Hessen', value: 'Hessen' },
        { label: 'Mecklenburg-Vorpommern', value: 'Mecklenburg-Vorpommern' },
        { label: 'Niedersachsen', value: 'Niedersachsen' },
        { label: 'Nordrhein-Westfalen', value: 'Nordrhein-Westfalen' },
        { label: 'Rheinland-Pfalz', value: 'Rheinland-Pfalz' },
        { label: 'Saarland', value: 'Saarland' },
        { label: 'Sachsen', value: 'Sachsen' },
        { label: 'Sachsen-Anhalt', value: 'Sachsen-Anhalt' },
        { label: 'Schleswig-Holstein', value: 'Schleswig-Holstein' },
        { label: 'Thüringen', value: 'Thüringen' }
      ],

      companies: [
        { value: 'Einzelunternehmen', label: 'Einzelunternehmen', is_small_company: true },
        { value: 'Freiberufler', label: 'Freiberufler', is_small_company: true },
        { value: 'Gbr', label: 'GbR (Gesellschaft bürgerlichen Rechts)', is_small_company: true },
        { value: 'Ug', label: 'UG (haftungsbeschränkt)', is_small_company: true },
        {
          value: 'GmbH',
          label: 'GmbH (Gesellschaft mit beschränkter Haftung)',
          is_small_company: false
        },
        { value: 'Ohg', label: 'OHG (Offene Handelsgesellschaft)', is_small_company: false },
        { value: 'Kg', label: 'KG (Kommanditgesellschaft)', is_small_company: false },
        { value: 'GmbH_co_KG', label: 'GmbH & Co. KG', is_small_company: false },
        { value: 'Partg', label: 'PartG (Partnerschaftsgesellschaft)', is_small_company: false },
        {
          value: 'Partgmbb',
          label: 'PartGmbB (Partnerschaftsgesellschaft mit beschränkter Berufshaftung)',
          is_small_company: false
        },
        { value: 'Ek', label: 'e.K. (eingetragener Kaufmann)', is_small_company: true },
        { value: 'Ev', label: 'e.V. (eingetragener Verein)', is_small_company: false },
        { value: 'GgmbH', label: 'gGmbH (gemeinnützige GmbH)', is_small_company: false },
        { value: 'Stiftung', label: 'Stiftung', is_small_company: false },
        { value: 'Ag', label: 'AG (Aktiengesellschaft)', is_small_company: false },
        { value: 'Se', label: 'SE (Societas Europaea)', is_small_company: false }
      ]
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser() {
      this.isLoading = true
      try {
        const response = await window.api.getUser()
        if (response.success && response.user) {
          this.user = {
            ...response.user,
            contact_person: JSON.parse(response.user.contact_person),
            company_details: JSON.parse(response.user.company_details)
          }
          this.selectedImage = `data:${this.user.image_type};base64,${this.user.logo}`
          console.log(this.user)
        }
        this.isLoading = false
      } catch (error) {
        console.error(error)
      }
    },

    setLogo(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.selectedImage = e.target.result
        }
        reader.readAsDataURL(file)

        //binary for db storage
        const binaryReader = new FileReader()
        binaryReader.onload = () => {
          this.binaryImage = new Uint8Array(binaryReader.result) // ArrayBuffer → Uint8Array
        }
        this.user.image_type = file.type
        binaryReader.readAsArrayBuffer(file)
      }
    },

    // Update profile
    async updateUser() {
      if (this.user) {
        if (!this.binaryImage) return (this.errorMessage = 'Logo is required')
        const result = await window.api.updateUser(
          Array.from(this.binaryImage),
          JSON.parse(JSON.stringify(this.user))
        )
        if (result.success) {
          this.errorMessage = ''
          this.$router.push('/login')
        }
      }
    }
  }
}
</script>

<style scoped>
/* Genel Form Alanı */
.register-form {
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
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

/* Tek kolon alanları */
.md\:col-span-2 {
  grid-column: span 2;
}

.form-btn {
  margin-top: 2rem;
  padding: 0.85rem 2.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.form-btn:hover {
  background: #0056b3;
}

button:disabled {
  background: #bbb;
  cursor: not-allowed;
}

/* Loading Message */
.loading-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  background: #f0f0f0;
  color: #666;
}

/* Success & Error */
.success-message,
.error-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.success-message {
  background: #e7f9ed;
  color: #1e7e34;
}

.error-message {
  background: #fdeaea;
  color: #b71c1c;
}

.logo-preview {
  width: 100px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid #ddd;
}

/* Responsive */
@media (max-width: 768px) {
  form > div > div {
    grid-template-columns: 1fr;
  }
}
</style>
