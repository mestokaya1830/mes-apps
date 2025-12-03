<template>
  <div class="settings-page">
    <h2 class="page-title">Benutzerregistrierungsformular</h2>

    <form class="settings-form" @submit.prevent="register">
      <!-- Personal Information -->
      <section class="section-personal">
        <h3 class="section-title">Persönliche Informationen</h3>
        <div class="form-blog">
          <!-- Gender -->
          <label class="form-field col-span-1">
            <span>Anrede</span>
            <select v-model="user.gender" class="form-input">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
            <div v-if="error.gender" class="error">{{ error.gender }}</div>
          </label>

          <!-- First Name -->
          <label class="form-field">
            <span>Vorname *</span>
            <input v-model="user.first_name" type="text" placeholder="Enter your first name" />
            <div v-if="error.first_name" class="error">{{ error.first_name }}</div>
          </label>

          <!-- Last Name -->
          <label class="form-field">
            <span>Nachname *</span>
            <input v-model="user.last_name" type="text" placeholder="Enter your last name" />
            <div v-if="error.last_name" class="error">{{ error.last_name }}</div>
          </label>

          <!-- Email -->
          <label class="form-field">
            <span>E-Mail *</span>
            <input v-model="user.email" type="email" placeholder="example@email.com" />
            <div v-if="error.email" class="error">{{ error.email }}</div>
          </label>

          <!-- Password -->
          <label class="form-field">
            <span>Passwort *</span>
            <input v-model="user.password" type="password" placeholder="Create a strong password" />
            <div v-if="error.password" class="error">{{ error.password }}</div>
          </label>

          <!-- Phone -->
          <label class="form-field">
            <span>Telefon</span>
            <input v-model="user.phone" type="tel" placeholder="+49 30 12345678" />
            <div v-if="error.phone" class="error">{{ error.phone }}</div>
          </label>

          <!-- Website -->
          <label class="form-field">
            <span>Webseite</span>
            <input v-model="user.website" type="url" placeholder="www.example.com" />
            <div v-if="error.website" class="error">{{ error.website }}</div>
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
            <div v-if="error.address" class="error">{{ error.address }}</div>
          </label>

          <label class="form-field">
            <span>Postleitzahl</span>
            <input v-model="user.postal_code" type="text" placeholder="10115" />
            <div v-if="error.postal_code" class="error">{{ error.postal_code }}</div>
          </label>

          <label class="form-field">
            <span>Stadt</span>
            <input v-model="user.city" type="text" placeholder="Berlin" />
            <div v-if="error.city" class="error">{{ error.city }}</div>
          </label>

          <label class="form-field">
            <span>🇩🇪 Bundesland (Deutschland)</span>
           <input v-model="user.state" type="text" placeholder="State" />
            <div v-if="error.state" class="error">{{ error.state }}</div>
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
            <div v-if="error.company_name" class="error">{{ error.company_name }}</div>
          </label>

          <label class="form-field">
            <span>🇩🇪 Unternehmensform (Deutschland)</span>
            <select v-model="user.company_details" class="form-input">
              <option disabled value="">-- Bitte wählen --</option>
              <option v-for="item in companies" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            <div v-if="error.company_details" class="error">{{ error.company_details }}</div>
          </label>

          <label class="form-field">
            <span>Firmenlogo</span>
            <input type="file" @change="setLogo($event)" />
            <div v-if="error.company_logo" class="error">{{ error.company_logo }}</div>
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
            <div v-if="error['contact_person.gender']" class="error">
              {{ error['contact_person.gender'] }}
            </div>
          </label>

          <label class="form-field">
            <span>Vorname</span>
            <input
              v-model="user.contact_person.first_name"
              type="text"
              placeholder="Hans Mueller"
            />
            <div v-if="error['contact_person.first_name']" class="error">
              {{ error['contact_person.first_name'] }}
            </div>
          </label>

          <label class="form-field">
            <span>Nachname</span>
            <input v-model="user.contact_person.last_name" type="text" placeholder="Hans Mueller" />
            <div v-if="error['contact_person.last_name']" class="error">
              {{ error['contact_person.last_name'] }}
            </div>
          </label>

          <label class="form-field">
            <span>Telefon</span>
            <input v-model="user.contact_person.phone" type="tel" placeholder="+49 30 12345678" />
            <div v-if="error['contact_person.phone']" class="error">
              {{ error['contact_person.phone'] }}
            </div>
          </label>

          <label class="form-field">
            <span>E-Mail</span>
            <input
              v-model="user.contact_person.email"
              type="email"
              placeholder="example@email.com"
            />
            <div v-if="error['contact_person.email']" class="error">
              {{ error['contact_person.email'] }}
            </div>
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
            <div v-if="error.tax_number" class="error">{{ error.tax_number }}</div>
          </label>

          <label class="form-field">
            <span>Finanzamt</span>
            <input
              v-model="user.tax_office"
              type="text"
              placeholder="Finanzamt Berlin Mitte/Tiergarten"
            />
            <div v-if="error.tax_office" class="error">{{ error.tax_office }}</div>
          </label>

          <label class="form-field">
            <span>USt-IdNr.</span>
            <input v-model="user.vat_id" type="text" placeholder="DE123456789" />
            <div v-if="error.vat_id" class="error">{{ error.vat_id }}</div>
          </label>

          <label class="form-field">
            <span>Handelsregistereintrag</span>
            <input v-model="user.court_registration" type="text" placeholder="HRB 12345 B" />
            <div v-if="error.court_registration" class="error">{{ error.court_registration }}</div>
          </label>

          <label class="form-field">
            <span>Gerichtsstand</span>
            <input v-model="user.court_location" type="text" placeholder="Amtsgericht Berlin" />
            <div v-if="error.court_location" class="error">{{ error.court_location }}</div>
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
            <div v-if="error.bank_name" class="error">{{ error.bank_name }}</div>
          </label>

          <label class="form-field">
            <span>BIC</span>
            <input v-model="user.bic" type="text" placeholder="DEUTDEBBXXX" />
            <div v-if="error.bic" class="error">{{ error.bic }}</div>
          </label>

          <label class="form-field">
            <span>IBAN</span>
            <input v-model="user.iban" type="text" placeholder="DE89370400440532013000" />
            <div v-if="error.iban" class="error">{{ error.iban }}</div>
          </label>

          <label class="form-field">
            <span>Kontoinhaber</span>
            <input
              v-model="user.bank_account_holder"
              type="text"
              placeholder="TechSolutions GmbH"
            />
            <div v-if="error.bank_account_holder" class="error">
              {{ error.bank_account_holder }}
            </div>
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
          <div v-if="error.company_signature" class="error">{{ error.company_signature }}</div>
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
  </div>
</template>

<script>
export default {
  name: 'UserRegistrationForm',
  data() {
    return {
      isSubmitting: false,
      error: {},
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
      state: '',
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
  watch: {
    user: {
      handler(newVal) {
        for (const key in newVal) {
          if (typeof newVal[key] === 'string' && newVal[key] && this.error[key]) {
            this.error[key] = ''
          }
        }
      },
      deep: true
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

    trimFormFields() {
      for (const item in this.user) {
        if (typeof this.user[item] === 'string') {
          this.user[item] = this.user[item].trim()
        }
      }
    },

    validateForm() {
      const u = this.user
      let valid = true

      if (!u.gender) {
        this.error.gender = 'Bitte Anrede auswählen.'
        valid = false
      }

      if (!u.first_name || u.first_name.length < 2) {
        this.error.first_name = 'Vorname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      if (!u.last_name || u.last_name.length < 2) {
        this.error.last_name = 'Nachname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(u.email)) {
        this.error.email = 'Ungültige E-Mail-Adresse.'
        valid = false
      }
      if (u.password.length < 6) {
        this.error.password = 'Passwort muss mindestens 6 Zeichen enthalten.'
        valid = false
      }

      const cp = u.contact_person
      if (!cp.gender) {
        this.error['contact_person.gender'] = 'Bitte Anrede auswählen.'
        valid = false
      }
      if (cp.first_name && cp.first_name.length < 2) {
        this.error['contact_person.first_name'] = 'Vorname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      if (cp.last_name && cp.last_name.length < 2) {
        this.error['contact_person.last_name'] = 'Nachname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      if (cp.email && !emailRegex.test(cp.email)) {
        this.error['contact_person.email'] = 'Ungültige E-Mail-Adresse.'
        valid = false
      }

      if (!u.address || u.address.trim().length < 3) {
        this.error.address = 'Adresse muss mindestens 3 Zeichen enthalten.'
        valid = false
      } else if (!/^[A-Za-zÄÖÜäöüß\s\-.]+\s+\d+[A-Za-z]?$/.test(u.address)) {
        this.error.address = 'Adresse muss Straße und Hausnummer enthalten (z. B. Musterstraße 12).'
        valid = false
      }

      if (u.postal_code && !/^\d{5}$/.test(u.postal_code)) {
        this.error.postal_code = 'Postleitzahl muss 5 Ziffern enthalten.'
        valid = false
      }
      if (u.city && u.city.length < 2) {
        this.error.city = 'Stadt muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      if (!u.state) {
        this.error.state = 'Bitte Bundesland auswählen.'
        valid = false
      }

      if (!u.company_name || u.company_name.length < 3) {
        this.error.company_name = 'Firmenname muss mindestens 3 Zeichen enthalten.'
        valid = false
      }
      if (!u.company_details || !u.company_details.company_type) {
        this.error.company_details = 'Bitte Unternehmensform auswählen.'
        valid = false
      }

      if (u.tax_number && !/^[0-9]{10,11}$/.test(u.tax_number)) {
        this.error.tax_number = 'Steuernummer muss 10–11 Ziffern enthalten.'
        valid = false
      }
      if (u.vat_id && !/^DE[0-9]{9}$/.test(u.vat_id)) {
        this.error.vat_id = 'Die deutsche USt-ID muss mit "DE" beginnen und 9 Ziffern enthalten.'
        valid = false
      }

      if (u.iban && !/^DE\d{20}$/.test(u.iban.replace(/\s+/g, ''))) {
        this.error.iban = 'Ungültige IBAN.'
        valid = false
      }

      return valid
    },

    async register() {
      this.trimFormFields()
      this.error = this.validateForm()
      if (!this.validateForm()) return
      this.isSubmitting = true

      try {
        const data = {
          image: Array.from(this.binaryImage),
          data: JSON.parse(JSON.stringify(this.user))
        }
        const result = await window.api.register(data)
        if (result.success) {
          this.error = result.message || 'Fehler beim Speichern'
          return
        }
        this.$router.push('/login')
      } catch (err) {
        this.error = err.message || 'Fehler beim Speichern'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style>
.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>
