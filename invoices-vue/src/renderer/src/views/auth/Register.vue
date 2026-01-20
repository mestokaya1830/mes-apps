<template>
  <div class="form-container">
    <h2 class="page-title">Benutzerregistrierungsformular</h2>

    <form class="settings-form" @submit.prevent="register">
      <!-- Personal Information -->
      <section class="section-personal">
        <h3 class="section-title">Persönliche Informationen</h3>
        <div class="form-blog">
          <!-- Gender -->
          <label class="form-field col-span-1">
            <span>Anrede *</span>
            <select v-model="user.gender" class="inputs">
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
            <input v-model="user.first_name" type="text" class="inputs" placeholder="Max" />
            <div v-if="error.first_name" class="error">{{ error.first_name }}</div>
          </label>

          <!-- Last Name -->
          <label class="form-field">
            <span>Nachname *</span>
            <input v-model="user.last_name" type="text" class="inputs" placeholder="Mustermann" />
            <div v-if="error.last_name" class="error">{{ error.last_name }}</div>
          </label>

          <!-- Email -->
          <label class="form-field">
            <span>E-Mail *</span>
            <input v-model="user.email" type="email" class="inputs" placeholder="max@beispiel.de" />
            <div v-if="error.email" class="error">{{ error.email }}</div>
          </label>

          <!-- Password -->
          <label class="form-field">
            <span>Passwort *</span>
            <input
              v-model="user.password"
              type="password"
              class="inputs"
              placeholder="Mindestens 6 Zeichen"
            />
            <div v-if="error.password" class="error">{{ error.password }}</div>
          </label>

          <!-- Phone -->
          <label class="form-field">
            <span>Telefon</span>
            <input v-model="user.phone" type="tel" class="inputs" placeholder="+49 30 12345678" />
            <div v-if="error.phone" class="error">{{ error.phone }}</div>
          </label>

          <!-- Website -->
          <label class="form-field">
            <span>Webseite</span>
            <input
              v-model="user.website"
              type="url"
              class="inputs"
              placeholder="https://www.beispiel.de"
            />
            <div v-if="error.website" class="error">{{ error.website }}</div>
          </label>
        </div>
      </section>

      <!-- Address Information -->
      <section class="section-address">
        <h3 class="section-title">Adressinformationen</h3>
        <div class="form-blog">
          <label class="form-field">
            <span>Adresse *</span>
            <input
              v-model="user.address"
              type="text"
              class="inputs"
              placeholder="Hauptstraße 123"
            />
            <small class="hint">Straße und Hausnummer (z.B. Musterstraße 12)</small>
            <div v-if="error.address" class="error">{{ error.address }}</div>
          </label>

          <label class="form-field">
            <span>Postleitzahl *</span>
            <input
              v-model="user.postal_code"
              type="text"
              class="inputs"
              placeholder="10115"
              maxlength="5"
            />
            <div v-if="error.postal_code" class="error">{{ error.postal_code }}</div>
          </label>

          <label class="form-field">
            <span>Stadt *</span>
            <input v-model="user.city" type="text" class="inputs" placeholder="Berlin" />
            <div v-if="error.city" class="error">{{ error.city }}</div>
          </label>

          <label class="form-field">
            <span>🇩🇪 Bundesland *</span>
            <select v-model="user.state" class="inputs">
              <option value="" disabled>Bitte wählen</option>
              <option value="Baden-Württemberg">Baden-Württemberg</option>
              <option value="Bayern">Bayern</option>
              <option value="Berlin">Berlin</option>
              <option value="Brandenburg">Brandenburg</option>
              <option value="Bremen">Bremen</option>
              <option value="Hamburg">Hamburg</option>
              <option value="Hessen">Hessen</option>
              <option value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</option>
              <option value="Niedersachsen">Niedersachsen</option>
              <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
              <option value="Rheinland-Pfalz">Rheinland-Pfalz</option>
              <option value="Saarland">Saarland</option>
              <option value="Sachsen">Sachsen</option>
              <option value="Sachsen-Anhalt">Sachsen-Anhalt</option>
              <option value="Schleswig-Holstein">Schleswig-Holstein</option>
              <option value="Thüringen">Thüringen</option>
            </select>
            <div v-if="error.state" class="error">{{ error.state }}</div>
          </label>
        </div>
      </section>

      <!-- Company Information -->
      <section class="section-company">
        <h3 class="section-title">Unternehmensinformationen</h3>
        <div class="form-blog">
          <label class="form-field">
            <span>Firmenname *</span>
            <input
              v-model="user.company_name"
              type="text"
              class="inputs"
              placeholder="Beispiel GmbH"
            />
            <div v-if="error.company_name" class="error">{{ error.company_name }}</div>
          </label>

          <label class="form-field">
            <span>🇩🇪 Unternehmensform *</span>
            <select v-model="user.company_details" class="inputs">
              <option :value="null" disabled>-- Bitte wählen --</option>
              <option v-for="item in companies" :key="item.value" :value="item">
                {{ item.label }}
              </option>
            </select>
            <div v-if="error.company_details" class="error">{{ error.company_details }}</div>
          </label>
          {{ user.company_details }}

          <label class="form-field">
            <span>Firmenlogo</span>
            <input type="file" @change="setLogo($event)" accept="image/*" />
            <small class="hint">PNG, JPG oder SVG (max. 2MB)</small>
            <div v-if="error.company_logo" class="error">{{ error.company_logo }}</div>
          </label>

          <figure v-if="selectedImage" class="form-field logo-preview-wrapper">
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
            <span>Anrede *</span>
            <select v-model="user.contact_person.gender" class="inputs">
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
              class="inputs"
              placeholder="Anna"
            />
            <div v-if="error['contact_person.first_name']" class="error">
              {{ error['contact_person.first_name'] }}
            </div>
          </label>

          <label class="form-field">
            <span>Nachname</span>
            <input
              v-model="user.contact_person.last_name"
              type="text"
              class="inputs"
              placeholder="Schmidt"
            />
            <div v-if="error['contact_person.last_name']" class="error">
              {{ error['contact_person.last_name'] }}
            </div>
          </label>

          <label class="form-field">
            <span>Telefon</span>
            <input
              v-model="user.contact_person.phone"
              type="tel"
              class="inputs"
              placeholder="+49 30 98765432"
            />
            <div v-if="error['contact_person.phone']" class="error">
              {{ error['contact_person.phone'] }}
            </div>
          </label>

          <label class="form-field">
            <span>E-Mail</span>
            <input
              v-model="user.contact_person.email"
              type="email"
              class="inputs"
              placeholder="buchhaltung@beispiel.de"
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
            <input
              v-model="user.tax_number"
              type="text"
              class="inputs"
              placeholder="123/456/78901"
              maxlength="15"
            />
            <small class="hint">Format: 123/456/78901 (je nach Bundesland)</small>
            <div v-if="error.tax_number" class="error">{{ error.tax_number }}</div>
          </label>

          <label class="form-field">
            <span>Finanzamt</span>
            <input
              v-model="user.tax_office"
              type="text"
              class="inputs"
              placeholder="Finanzamt Berlin Mitte/Tiergarten"
            />
            <div v-if="error.tax_office" class="error">{{ error.tax_office }}</div>
          </label>

          <label class="form-field">
            <span>USt-IdNr.</span>
            <input
              v-model="user.vat_id"
              type="text"
              class="inputs"
              placeholder="DE123456789"
              maxlength="11"
              @input="formatVatId"
            />
            <small class="hint">Format: DE + 9 Ziffern</small>
            <div v-if="error.vat_id" class="error">{{ error.vat_id }}</div>
          </label>

          <label class="form-field">
            <span>Handelsregistereintrag</span>
            <input
              v-model="user.court_registration"
              type="text"
              class="inputs"
              placeholder="HRB 12345 B"
            />
            <div v-if="error.court_registration" class="error">{{ error.court_registration }}</div>
          </label>

          <label class="form-field">
            <span>Gerichtsstand</span>
            <input
              v-model="user.court_location"
              type="text"
              class="inputs"
              placeholder="Amtsgericht Berlin"
            />
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
            <input
              v-model="user.bank_name"
              type="text"
              class="inputs"
              placeholder="Deutsche Bank AG"
            />
            <div v-if="error.bank_name" class="error">{{ error.bank_name }}</div>
          </label>

          <label class="form-field">
            <span>BIC</span>
            <input
              v-model="user.bic"
              type="text"
              class="inputs"
              placeholder="DEUTDEBBXXX"
              maxlength="11"
            />
            <div v-if="error.bic" class="error">{{ error.bic }}</div>
          </label>

          <label class="form-field">
            <span>IBAN</span>
            <input
              v-model="user.iban"
              type="text"
              class="inputs"
              placeholder="DE89 3704 0044 0532 0130 00"
              maxlength="27"
              @input="formatIban"
            />
            <small class="hint">DE + 20 Ziffern</small>
            <div v-if="error.iban" class="error">{{ error.iban }}</div>
          </label>

          <label class="form-field">
            <span>Kontoinhaber</span>
            <input
              v-model="user.bank_account_holder"
              type="text"
              class="inputs"
              placeholder="Beispiel GmbH"
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
            placeholder="Mit freundlichen Grüßen&#10;Beispiel GmbH&#10;Max Mustermann&#10;Geschäftsführer"
          ></textarea>
          <div v-if="error.company_signature" class="error">{{ error.company_signature }}</div>
        </label>
      </section>

      <!-- Submit Button -->
      <div class="form-actions">
        <button type="button" @click="fillExampleData" class="btn">📝 Beispieldaten füllen</button>
        <button type="submit" :disabled="isSubmitting" class="btn">
          <span v-if="isSubmitting">Wird gespeichert...</span>
          <span v-else>Benutzer speichern</span>
        </button>
      </div>
    </form>

    <!-- Messages -->
    <p v-if="showSuccess" class="status-message success">
      ✅ Benutzer wurde erfolgreich gespeichert!
    </p>
    <p v-if="showError" class="status-message error">❌ {{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'UserRegistrationForm',
  inject: ['trimFormFields'],
  data() {
    return {
      isSubmitting: false,
      showSuccess: false,
      showError: false,
      errorMessage: '',
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
        company_details: null,
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
    'user.company_details'(newVal) {
      if (newVal && this.error.company_details) {
        this.error.company_details = ''
      }
    }
  },
  methods: {
    // ✅ Örnek veriyi doldur
    fillExampleData() {
      this.user = {
        gender: 'Herr',
        first_name: 'Maximilian',
        last_name: 'Schmidt',
        password: 'Test123!',
        email: 'max.schmidt@beispiel-gmbh.de',
        phone: '+49 30 12345678',
        address: 'Friedrichstraße 123',
        postal_code: '10117',
        city: 'Berlin',
        state: 'Berlin',
        country: 'Deutschland',
        website: 'https://www.beispiel-gmbh.de',
        company_name: 'Beispiel Consulting GmbH',
        company_details: this.companies.find((c) => c.value === 'GmbH'),
        company_signature:
          'Mit freundlichen Grüßen\nBeispiel Consulting GmbH\nMaximilian Schmidt\nGeschäftsführer',
        contact_person: {
          gender: 'Frau',
          first_name: 'Julia',
          last_name: 'Müller',
          email: 'buchhaltung@beispiel-gmbh.de',
          phone: '+49 30 12345679'
        },
        tax_number: '12/345/67890',
        tax_office: 'Finanzamt Berlin Mitte/Tiergarten',
        vat_id: 'DE123456789',
        court_registration: 'HRB 12345 B',
        court_location: 'Amtsgericht Charlottenburg',
        bank_name: 'Deutsche Bank',
        bic: 'DEUTDEBBXXX',
        iban: 'DE89370400440532013000',
        bank_account_holder: 'Beispiel Consulting GmbH'
      }
    },

    // USt-IdNr auto-format
    formatVatId() {
      let val = this.user.vat_id.toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (val && !val.startsWith('DE')) {
        if (/^\d/.test(val)) {
          val = 'DE' + val
        }
      }
      this.user.vat_id = val.substring(0, 11)
    },

    // IBAN auto-format (with spaces every 4 chars)
    formatIban() {
      let val = this.user.iban.toUpperCase().replace(/[^A-Z0-9]/g, '')
      // Add space every 4 characters
      val = val.match(/.{1,4}/g)?.join(' ') || val
      this.user.iban = val.substring(0, 27)
    },

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

    validateForm() {
      const u = this.user
      let valid = true
      this.error = {}

      // Personal info
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

      // Address
      if (!u.address || u.address.trim().length < 3) {
        this.error.address = 'Adresse muss mindestens 3 Zeichen enthalten.'
        valid = false
      } else if (!/^[A-Za-zÄÖÜäöüß\s\-.]+\s+\d+[A-Za-z]?$/.test(u.address)) {
        this.error.address = 'Adresse muss Straße und Hausnummer enthalten (z.B. Musterstraße 12).'
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

      // Company
      if (!u.company_name || u.company_name.length < 3) {
        this.error.company_name = 'Firmenname muss mindestens 3 Zeichen enthalten.'
        valid = false
      }
      if (!u.company_details || !u.company_details.value) {
        this.error.company_details = 'Bitte Unternehmensform auswählen.'
        valid = false
      }

      // Contact person
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

      // Tax info - ✅ DÜZELTME
      if (u.tax_number && u.tax_number.trim() !== '') {
        const cleanTaxNumber = u.tax_number.replace(/[\s\/\-]/g, '')
        if (!/^\d+$/.test(cleanTaxNumber)) {
          this.error.tax_number = 'Steuernummer darf nur Zahlen enthalten.'
          valid = false
        } else if (cleanTaxNumber.length < 10 || cleanTaxNumber.length > 13) {
          this.error.tax_number = 'Steuernummer muss 10-13 Ziffern enthalten.'
          valid = false
        }
      }

      if (u.vat_id && u.vat_id.trim() !== '') {
        const cleanVatId = u.vat_id.replace(/\s/g, '').toUpperCase()
        if (!/^DE\d{9}$/.test(cleanVatId)) {
          this.error.vat_id = 'USt-IdNr. muss mit "DE" beginnen und 9 Ziffern enthalten.'
          valid = false
        }
      }

      // Bank info
      if (u.iban && u.iban.trim() !== '') {
        const cleanIban = u.iban.replace(/\s/g, '')
        if (!/^DE\d{20}$/.test(cleanIban)) {
          this.error.iban = 'Ungültige deutsche IBAN (Format: DE + 20 Ziffern).'
          valid = false
        }
      }

      return valid
    },

    async register() {
      this.trimFormFields(this.user)

      if (!this.validateForm()) {
        this.showError = true
        this.errorMessage = 'Bitte alle Pflichtfelder korrekt ausfüllen.'
        return
      }

      this.isSubmitting = true
      this.showSuccess = false
      this.showError = false

      try {
        const data = {
          image: this.binaryImage ? Array.from(this.binaryImage) : [],
          data: JSON.parse(JSON.stringify(this.user))
        }

        const result = await window.api.register(data)

        if (!result.success) {
          this.showError = true
          this.errorMessage = result.message || 'Fehler beim Speichern'
          return
        }

        this.showSuccess = true
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      } catch (err) {
        console.error('Register error:', err)
        this.showError = true
        this.errorMessage = err.message || 'Fehler beim Speichern'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.hint {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
  font-style: italic;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.status-message {
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.logo-preview-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.logo-preview {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #f8f9fa;
}
</style>
