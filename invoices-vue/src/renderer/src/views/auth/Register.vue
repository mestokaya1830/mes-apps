<template>
  <div class="settings-page">
    <h2 class="page-title">Benutzerregistrierungsformular</h2>

    <form class="settings-form" @submit.prevent="register">
      <!-- Personal Information -->
      <section class="section-personal">
        <h3 class="section-title">Persönliche Informationen</h3>
        <div class="form-blog">
          <label class="form-field col-span-1">
            <span>Anrede</span>
            <select v-model="user.gender" class="form-input">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
          </label>

          <label class="form-field">
            <span>Vorname *</span>
            <input
              v-model="user.first_name"
              type="text"
              required
              placeholder="Enter your first name"
            />
          </label>

          <label class="form-field">
            <span>Nachname *</span>
            <input
              v-model="user.last_name"
              type="text"
              required
              placeholder="Enter your last name"
            />
          </label>

          <label class="form-field">
            <span>E-Mail *</span>
            <input v-model="user.email" type="email" required placeholder="example@email.com" />
          </label>

          <label class="form-field">
            <span>Passwort *</span>
            <input
              v-model="user.password"
              type="password"
              required
              placeholder="Create a strong password"
            />
          </label>

          <label class="form-field">
            <span>Telefon</span>
            <input v-model="user.phone" type="tel" placeholder="+49 30 12345678" />
          </label>

          <label class="form-field">
            <span>Webseite</span>
            <input v-model="user.website" type="url" placeholder="www.example.com" />
          </label>
        </div>
      </section>

      <!-- Address Information -->
      <section class="section-address">
        <h3 class="section-title">Adressinformationen</h3>
        <div class="form-blog">
          <label class="form-field">
            <span>Adresse</span>
            <input v-model="user.address" type="text" placeholder="Hauptstraße 123" />
          </label>

          <label class="form-field">
            <span>Postleitzahl</span>
            <input v-model="user.postal_code" type="text" placeholder="10115" />
          </label>

          <label class="form-field">
            <span>Stadt</span>
            <input v-model="user.city" type="text" placeholder="Berlin" />
          </label>

          <label class="form-field">
            <span>🇩🇪 Bundesland (Deutschland)</span>
            <select v-model="user.state" class="form-input">
              <option disabled value="">Bitte wählen</option>
              <option v-for="item in german_states" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </label>
        </div>
      </section>

      <!-- Company Information -->
      <section class="section-company">
        <h3 class="section-title">Unternehmensinformationen</h3>
        <div class="form-blog">
          <label class="form-field">
            <span>Firmenname</span>
            <input v-model="user.company_name" type="text" placeholder="TechSolutions GmbH" />
          </label>

          <label class="form-field">
            <span>🇩🇪 Unternehmensform (Deutschland)</span>
            <select v-model="user.company_details" class="form-input">
              <option disabled value="">-- Bitte wählen --</option>
              <option v-for="item in companies" :key="item.value" :value="item">
                {{ item.label }}
              </option>
            </select>
          </label>

          <label class="form-field">
            <span>Firmenlogo</span>
            <input type="file" @change="setLogo($event)" />
          </label>

          <figure class="form-field logo-preview-wrapper">
            <figcaption>Logo-Vorschau</figcaption>
            <img :src="selectedImage" class="logo-preview" alt="Company Logo" />
          </figure>
        </div>
      </section>

      <!-- Contact Person -->
      <section class="section-contact-person">
        <h3 class="section-title">Ansprechpartner</h3>
        <div class="form-blog">
          <label class="form-field col-span-1">
            <span>Anrede</span>
            <select v-model="user.contact_person.gender" class="form-input">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
          </label>

          <label class="form-field">
            <span>Vorname</span>
            <input
              v-model="user.contact_person.first_name"
              type="text"
              placeholder="Hans Mueller"
            />
          </label>

          <label class="form-field">
            <span>Nachname</span>
            <input v-model="user.contact_person.last_name" type="text" placeholder="Hans Mueller" />
          </label>

          <label class="form-field">
            <span>Telefon</span>
            <input v-model="user.contact_person.phone" type="tel" placeholder="+49 30 12345678" />
          </label>

          <label class="form-field">
            <span>E-Mail</span>
            <input
              v-model="user.contact_person.email"
              type="email"
              placeholder="example@email.com"
            />
          </label>
        </div>
      </section>

      <!-- Tax Information -->
      <section class="section-tax">
        <h3 class="section-title">Steuerinformationen</h3>
        <div class="form-blog">
          <label class="form-field">
            <span>Steuernummer</span>
            <input v-model="user.tax_number" type="text" placeholder="123/456/78901" />
          </label>

          <label class="form-field">
            <span>Finanzamt</span>
            <input
              v-model="user.tax_office"
              type="text"
              placeholder="Finanzamt Berlin Mitte/Tiergarten"
            />
          </label>

          <label class="form-field">
            <span>USt-IdNr.</span>
            <input v-model="user.vat_id" type="text" placeholder="DE123456789" />
          </label>

          <label class="form-field">
            <span>Handelsregistereintrag</span>
            <input v-model="user.court_registration" type="text" placeholder="HRB 12345 B" />
          </label>

          <label class="form-field">
            <span>Gerichtsstand</span>
            <input v-model="user.court_location" type="text" placeholder="Amtsgericht Berlin" />
          </label>
        </div>
      </section>

      <!-- Bank Information -->
      <section class="section-bank">
        <h3 class="section-title">Bankinformationen</h3>
        <div class="form-blog">
          <label class="form-field">
            <span>Bankname</span>
            <input v-model="user.bank_name" type="text" placeholder="Deutsche Bank AG" />
          </label>

          <label class="form-field">
            <span>BIC</span>
            <input v-model="user.bic" type="text" placeholder="DEUTDEBBXXX" />
          </label>

          <label class="form-field">
            <span>IBAN</span>
            <input v-model="user.iban" type="text" placeholder="DE89370400440532013000" />
          </label>

          <label class="form-field">
            <span>Kontoinhaber</span>
            <input
              v-model="user.bank_account_holder"
              type="text"
              placeholder="TechSolutions GmbH"
            />
          </label>
        </div>
      </section>

      <!-- Company Signature -->
      <section class="section-signature">
        <h3 class="section-title">Unternehmenssignatur</h3>
        <label class="form-field">
          <span>Signaturtext</span>
          <textarea
            v-model="user.company_signature"
            rows="4"
            placeholder="Mit freundlichen Grüßen&#10;TechSolutions GmbH&#10;Hans Mueller&#10;Geschäftsführer"
          ></textarea>
        </label>
      </section>

      <!-- Submit Button -->
      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting" class="form-btn">
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Benutzer speichern</span>
        </button>
      </div>
    </form>

    <!-- Messages -->
    <p v-if="showSuccess" class="status-message success">
      ✅ Benutzer wurde erfolgreich gespeichert!
    </p>
    <p v-if="errorMessage" class="status-message error">❌ Fehler: {{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'UserRegistrationForm',
  data() {
    return {
      isSubmitting: false,
      errorMessage: '',
      user: {
        gender: '',
        first_name: '',
        last_name: '',
        password: '',
        email: '',
        phone: '',
        address: '',
        postal_code: '',
        city: '',
        state: '',
        country: 'Deutschland',
        website: '',
        company_name: '',
        company_details: { company_type_short: '', company_type: '' },
        company_signature: '',
        contact_person: {
          gender: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: ''
        },
        tax_number: '',
        tax_office: '',
        vat_id: '',
        court_registration: '',
        court_location: '',
        bank_name: '',
        bic: '',
        iban: '',
        bank_account_holder: ''
      },
      binaryImage: null,
      selectedImage: null,
      german_states: [
        /* ... aynı liste ... */
      ],
      companies: [
        /* ... aynı liste ... */
      ]
    }
  },
  methods: {
    async setLogo(event) {
      const file = event.target.files[0]
      if (!file) return

      this.user.image_type = file.type

      // Preview
      const previewReader = new FileReader()
      previewReader.onload = () => {
        this.selectedImage = previewReader.result
      }
      previewReader.readAsDataURL(file)

      // Binary
      const binaryReader = new FileReader()
      binaryReader.onload = () => {
        this.binaryImage = new Uint8Array(binaryReader.result)
      }
      binaryReader.readAsArrayBuffer(file)
    },

    validateEmail(value) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(value)
    },
    validateMin(value, min) {
      return value?.length >= min
    },
    validateNumber(value) {
      return /^[0-9]+$/.test(value)
    },
    validatePhone(value) {
      return /^\+?[0-9 ]{3,15}$/.test(value)
    },
    validateIBAN(value) {
      return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(value.replace(/\s/g, ''))
    },

    validateForm() {
      const u = this.user

      // Personal Info
      if (!u.first_name || !this.validateMin(u.first_name, 3)) return 'Vorname min. 3 Zeichen'
      if (!u.last_name || !this.validateMin(u.last_name, 3)) return 'Nachname min. 3 Zeichen'
      if (!u.email || !this.validateEmail(u.email)) return 'Ungültige E-Mail-Adresse'
      if (u.phone && !this.validatePhone(u.phone)) return 'Ungültige Telefonnummer'

      // Address
      if (u.postal_code && !this.validateNumber(u.postal_code)) return 'Postleitzahl nur Zahlen'
      if (u.postal_code && u.postal_code.length < 5) return 'Postleitzahl min. 5 Zeichen'
      if (!u.city || !this.validateMin(u.city, 2)) return 'Stadt min. 2 Zeichen'

      // Bank Info
      if (u.iban && !this.validateIBAN(u.iban)) return 'Ungültige IBAN'

      // Logo
      if (!this.binaryImage) return 'Firmenlogo ist erforderlich'

      return null
    },

    async register() {
      this.errorMessage = ''
      const error = this.validateForm()
      if (error) {
        this.errorMessage = error
        return
      }

      this.isSubmitting = true

      try {
        const data = {
          image: Array.from(this.binaryImage),
          data: JSON.parse(JSON.stringify(this.user))
        }
        const result = await window.api.register(data)
        if (result.success) {
          this.$router.push('/login')
        } else {
          this.errorMessage = result.message || 'Fehler beim Speichern'
        }
      } catch (err) {
        this.errorMessage = err.message || 'Fehler beim Speichern'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>
