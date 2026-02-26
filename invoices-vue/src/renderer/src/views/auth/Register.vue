<template>
  <main class="main-container">
    <header>
      <h2 class="page-title">
        <i class="bi bi-person-plus-fill icons" aria-hidden="true"></i>
        Benutzerregistrierungsformular
      </h2>
    </header>

    <form class="settings-form" @submit.prevent="register">
      <!-- Personal Information -->
      <section class="sections">
        <h3 class="section-title">
          <i class="bi bi-person-circle" aria-hidden="true"></i> Persönliche Informationen
        </h3>
        <div class="form-row">
          <div class="form-group">
            <span>Anrede <span class="stars">*</span></span>
            <select v-model="user.gender" class="inputs">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
            <div v-if="error.gender" class="error" role="alert">{{ error.gender }}</div>
          </div>
        </div>
        <div class="form-row">
          <!-- First Name -->
          <div class="form-group">
            <span>Vorname <span class="stars">*</span></span>
            <input v-model="user.first_name" type="text" class="inputs" placeholder="Max" />
            <div v-if="error.first_name" class="error">{{ error.first_name }}</div>
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <span>Nachname <span class="stars">*</span></span>
            <input v-model="user.last_name" type="text" class="inputs" placeholder="Mustermann" />
            <div v-if="error.last_name" class="error" role="alert">{{ error.last_name }}</div>
          </div>
        </div>
        <div class="form-row">
          <!-- Email -->
          <div class="form-group">
            <span>E-Mail <span class="stars">*</span></span>
            <input v-model="user.email" type="email" class="inputs" placeholder="max@beispiel.de" />
            <div v-if="error.email" class="error" role="alert">{{ error.email }}</div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <span>Passwort <span class="stars">*</span></span>
            <input
              v-model="user.password"
              type="password"
              class="inputs"
              placeholder="Mindestens 6 Zeichen"
            />
            <div v-if="error.password" class="error" role="alert">{{ error.password }}</div>
          </div>
        </div>
        <div class="form-row">
          <!-- Phone -->
          <div class="form-group">
            <span>Telefon</span>
            <input v-model="user.phone" type="tel" class="inputs" placeholder="+49 30 12345678" />
            <small class="hint">Für Rückfragen empfohlen</small>
            <div v-if="error.phone" class="error" role="alert">{{ error.phone }}</div>
          </div>

          <!-- Website -->
          <div class="form-group">
            <span>Webseite</span>
            <input
              v-model="user.website"
              type="url"
              class="inputs"
              placeholder="https://www.beispiel.de"
            />
            <div v-if="error.website" class="error" role="alert">{{ error.website }}</div>
          </div>
        </div>
      </section>

      <!-- Address Information -->
      <section class="sections">
        <h3 class="section-title">
          <i class="bi bi-geo-alt-fill" aria-hidden="true"></i> Adressinformationen
        </h3>
        <div class="form-row">
          <div class="form-group">
            <span>Adresse <span class="stars">*</span></span>
            <input
              v-model="user.address"
              type="text"
              class="inputs"
              placeholder="Hauptstraße 123"
            />
            <small class="hint">Straße und Hausnummer (z.B. Musterstraße 12)</small>
            <div v-if="error.address" class="error" role="alert">{{ error.address }}</div>
          </div>

          <div class="form-group">
            <span>Postleitzahl <span class="stars">*</span></span>
            <input
              v-model="user.postal_code"
              type="text"
              class="inputs"
              placeholder="10115"
              maxlength="5"
            />
            <div v-if="error.postal_code" class="error" role="alert">{{ error.postal_code }}</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <span>Stadt <span class="stars">*</span></span>
            <input v-model="user.city" type="text" class="inputs" placeholder="Berlin" />
            <div v-if="error.city" class="error" role="alert">{{ error.city }}</div>
          </div>

          <div class="form-group">
            <span>🇩🇪 Bundesland <span class="stars">*</span></span>
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
            <div v-if="error.state" class="error" role="alert">{{ error.state }}</div>
          </div>
        </div>
      </section>

      <!-- Company Information -->
      <section class="sections">
        <h3 class="section-title">
          <i class="bi bi-building" aria-hidden="true"></i> Unternehmensinformationen
        </h3>
        <div class="form-row">
          <div class="form-group">
            <span>Firmenname <span class="stars">*</span></span>
            <input
              v-model="user.company_name"
              type="text"
              class="inputs"
              placeholder="Beispiel GmbH"
            />
            <div v-if="error.company_name" class="error" role="alert">{{ error.company_name }}</div>
          </div>

          <div class="form-group">
            <span>🇩🇪 Unternehmensform <span class="stars">*</span></span>
            <select v-model="user.company_details" class="inputs">
              <option :value="null" disabled>-- Bitte wählen --</option>
              <option v-for="item in companies" :key="item.value" :value="item">
                {{ item.label }}
              </option>
            </select>
            <div v-if="error.company_details" class="error" role="alert">{{ error.company_details }}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <span>Firmenlogo</span>
            <input type="file" @change="setLogo($event)" accept="image/*" />
            <small class="hint">PNG, JPG oder SVG (max. 2MB)</small>
            <div v-if="error.company_logo" class="error" role="alert">{{ error.company_logo }}</div>
          </div>

          <figure class="form-group logo-preview-wrapper">
            <figcaption>Logo-Vorschau</figcaption>
            <img :src="selectedImage" class="user-logo" alt="Company Logo" aria-hidden="true" />
            <div v-if="error.selectedImage" class="error" role="alert">{{ error.selectedImage }}</div>
          </figure>
        </div>
      </section>

      <!-- Contact Person -->
      <section class="sections">
        <h3 class="section-title">
          <i class="bi bi-person-badge"></i> Ansprechpartner
          <small class="text-muted">(Optional - falls abweichend)</small>
        </h3>
        <div class="form-row">
          <div class="form-group col-span-1">
            <span>Anrede</span>
            <select v-model="user.contact_person.gender" class="inputs">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
            <div v-if="error['contact_person.gender']" class="error" role="alert">
              {{ error['contact_person.gender'] }}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <span>Vorname</span>
            <input
              v-model="user.contact_person.first_name"
              type="text"
              class="inputs"
              placeholder="Anna"
            />
            <div v-if="error['contact_person.first_name']" class="error" role="alert">
              {{ error['contact_person.first_name'] }}
            </div>
          </div>

          <div class="form-group">
            <span>Nachname</span>
            <input
              v-model="user.contact_person.last_name"
              type="text"
              class="inputs"
              placeholder="Schmidt"
            />
            <div v-if="error['contact_person.last_name']" class="error" role="alert">
              {{ error['contact_person.last_name'] }}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <span>Telefon</span>
            <input
              v-model="user.contact_person.phone"
              type="tel"
              class="inputs"
              placeholder="+49 30 98765432"
            />
            <div v-if="error['contact_person.phone']" class="error" role="alert">
              {{ error['contact_person.phone'] }}
            </div>
          </div>

          <div class="form-group">
            <span>E-Mail</span>
            <input
              v-model="user.contact_person.email"
              type="email"
              class="inputs"
              placeholder="buchhaltung@beispiel.de"
            />
            <div v-if="error['contact_person.email']" class="error" role="alert">
              {{ error['contact_person.email'] }}
            </div>
          </div>
        </div>
      </section>

      <!-- Tax Information -->
      <section class="sections">
        <h3 class="section-title">
          <i class="bi bi-calculator" aria-hidden="true"></i> Steuerinformationen
        </h3>
        <div class="alert-info">
          <i class="bi bi-info-circle" aria-hidden="true"></i>
          <strong>Wichtig:</strong> Für rechtsgültige Rechnungen ist mindestens eine Steuernummer
          oder USt-IdNr. erforderlich.
        </div>
        <div class="form-row">
          <div class="form-group">
            <span>Steuernummer <span class="stars">*</span></span>
            <input
              v-model="user.tax_number"
              type="text"
              class="inputs"
              placeholder="123/456/78901"
              maxlength="15"
            />
            <small class="hint">Format: 123/456/78901 (je nach Bundesland)</small>
            <div v-if="error.tax_number" class="error">{{ error.tax_number }}</div>
          </div>

          <div class="form-group">
            <span>USt-IdNr. <span class="stars">*</span></span>
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
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <span>Finanzamt</span>
            <input
              v-model="user.tax_office"
              type="text"
              class="inputs"
              placeholder="Finanzamt Berlin Mitte/Tiergarten"
            />
            <div v-if="error.tax_office" class="error">{{ error.tax_office }}</div>
          </div>

          <div class="form-group">
            <span>Handelsregistereintrag</span>
            <input
              v-model="user.court_registration"
              type="text"
              class="inputs"
              placeholder="HRB 12345 B"
            />
            <small class="hint">Für GmbH, AG, UG erforderlich</small>
            <div v-if="error.court_registration" class="error">{{ error.court_registration }}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <span>Gerichtsstand</span>
            <input
              v-model="user.court_location"
              type="text"
              class="inputs"
              placeholder="Amtsgericht Berlin"
            />
            <div v-if="error.court_location" class="error">{{ error.court_location }}</div>
          </div>
        </div>
      </section>

      <!-- Bank Information -->
      <section class="sections">
        <h3 class="section-title">
          <i class="bi bi-bank" aria-hidden="true"></i> Bankinformationen
        </h3>
        <div class="form-row">
          <div class="form-group">
            <span>IBAN <span class="stars">*</span></span>
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
          </div>

          <div class="form-group">
            <span>Kontoinhaber <span class="stars">*</span></span>
            <input
              v-model="user.bank_account_holder"
              type="text"
              class="inputs"
              placeholder="Beispiel GmbH"
            />
            <div v-if="error.bank_account_holder" class="error">
              {{ error.bank_account_holder }}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <span>Bankname</span>
            <input
              v-model="user.bank_name"
              type="text"
              class="inputs"
              placeholder="Deutsche Bank AG"
            />
            <div v-if="error.bank_name" class="error">{{ error.bank_name }}</div>
          </div>

          <div class="form-group">
            <span>BIC</span>
            <input
              v-model="user.bic"
              type="text"
              class="inputs"
              placeholder="DEUTDEBBXXX"
              maxlength="11"
            />
            <small class="hint">Für internationale Überweisungen empfohlen</small>
            <div v-if="error.bic" class="error">{{ error.bic }}</div>
          </div>
        </div>
      </section>

      <!-- Company Signature -->
      <section class="sections">
        <h3 class="section-title">
          <i class="bi bi-pen" aria-hidden="true"></i> Unternehmenssignatur
        </h3>
        <div class="form-group">
          <span>Signaturtext</span>
          <textarea
            v-model="user.company_signature"
            rows="4"
            class="inputs"
            placeholder="Mit freundlichen Grüßen&#10;Beispiel GmbH&#10;Max Mustermann&#10;Geschäftsführer"
          ></textarea>
          <small class="hint">Wird automatisch am Ende Ihrer Rechnungen eingefügt</small>
          <div v-if="error.company_signature" class="error">{{ error.company_signature }}</div>
        </div>
      </section>

      <!-- Submit Button -->
      <section class="sections btn-container">
        <button type="button" class="btn btn-secondary" @click="fillExampleData">
          <i class="bi bi-clipboard-data" aria-hidden="true"></i> Beispieldaten füllen
        </button>
        <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
          <i class="bi bi-save icons" aria-hidden="true"></i>
          <span v-if="isSubmitting">Wird gespeichert...</span>
          <span v-else>Benutzer speichern</span>
        </button>
      </section>
    </form>

    <!-- Messages -->
    <p v-if="showSuccess" class="status-message success" role="status">
      ✅ Benutzer wurde erfolgreich gespeichert!
    </p>
    <p v-if="showError" class="status-message error" role="alert">❌ {{ errorMessage }}</p>
  </main>
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
        bank_account_holder: '',
        logo: 'user.png'
      },
      selectedImage: null,
      blobImage: null,
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
    fillExampleData() {
      this.user = {
        gender: 'Herr',
        first_name: 'Maximilian',
        last_name: 'Schmidt',
        password: '121212',
        email: 'admin@admin.de',
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
        bank_account_holder: 'Beispiel Consulting GmbH',
        logo: ''
      }
    },

    formatVatId() {
      let val = this.user.vat_id.toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (val && !val.startsWith('DE')) {
        if (/^\d/.test(val)) {
          val = 'DE' + val
        }
      }
      this.user.vat_id = val.substring(0, 11)
    },

    formatIban() {
      let val = this.user.iban.toUpperCase().replace(/[^A-Z0-9]/g, '')
      val = val.match(/.{1,4}/g)?.join(' ') || val
      this.user.iban = val.substring(0, 27)
    },

    async setLogo(event) {
      const file = event.target.files[0]
      if (!file) return
      this.blobImage = await file.arrayBuffer() //to send to backend
      this.selectedImage = URL.createObjectURL(file)
      this.user.logo = 'user.png'
    },

    validateForm() {
      let valid = true
      this.error = {}

      // Personal info
      if (!this.user.gender) {
        this.error.gender = 'Bitte Anrede auswählen.'
        valid = false
      }
      if (!this.user.first_name || this.user.first_name.length < 2) {
        this.error.first_name = 'Vorname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      if (!this.user.last_name || this.user.last_name.length < 2) {
        this.error.last_name = 'Nachname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(this.user.email)) {
        this.error.email = 'Ungültige E-Mail-Adresse.'
        valid = false
      }
      if (this.user.password.length < 6) {
        this.error.password = 'Passwort muss mindestens 6 Zeichen enthalten.'
        valid = false
      }

      // Address
      if (!this.user.address || this.user.address.trim().length < 3) {
        this.error.address = 'Adresse muss mindestens 3 Zeichen enthalten.'
        valid = false
      } else if (!/^[A-Za-zÄÖÜäöüß\s\-.]+\s+\d+[A-Za-z]?$/.test(this.user.address)) {
        this.error.address = 'Adresse muss Straße und Hausnummer enthalten (z.B. Musterstraße 12).'
        valid = false
      }

      if (this.user.postal_code && !/^\d{5}$/.test(this.user.postal_code)) {
        this.error.postal_code = 'Postleitzahl muss 5 Ziffern enthalten.'
        valid = false
      }
      if (this.user.city && this.user.city.length < 2) {
        this.error.city = 'Stadt muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      if (!this.user.state) {
        this.error.state = 'Bitte Bundesland auswählen.'
        valid = false
      }

      // Company
      if (!this.user.company_name || this.user.company_name.length < 3) {
        this.error.company_name = 'Firmenname muss mindestens 3 Zeichen enthalten.'
        valid = false
      }
      if (!this.user.company_details || !this.user.company_details.value) {
        this.error.company_details = 'Bitte Unternehmensform auswählen.'
        valid = false
      }
      if (!this.selectedImage) {
        this.error.selectedImage = 'Bitte Unternehmenlogo auswählen.'
        valid = false
      }

      // Contact person
      const cp = this.user.contact_person
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
      if (this.user.tax_number && this.user.tax_number.trim() !== '') {
        const cleanTaxNumber = this.user.tax_number.replace(/[\s\/\-]/g, '')
        if (!/^\d+$/.test(cleanTaxNumber)) {
          this.error.tax_number = 'Steuernummer darf nur Zahlen enthalten.'
          valid = false
        } else if (cleanTaxNumber.length < 10 || cleanTaxNumber.length > 13) {
          this.error.tax_number = 'Steuernummer muss 10-13 Ziffern enthalten.'
          valid = false
        }
      }

      if (this.user.vat_id && this.user.vat_id.trim() !== '') {
        const cleanVatId = this.user.vat_id.replace(/\s/g, '').toUpperCase()
        if (!/^DE\d{9}$/.test(cleanVatId)) {
          this.error.vat_id = 'USt-IdNr. muss mit "DE" beginnen und 9 Ziffern enthalten.'
          valid = false
        }
      }

      // Bank info
      if (this.user.iban && this.user.iban.trim() !== '') {
        const cleanIban = this.user.iban.replace(/\s/g, '')
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
          image_file: this.blobImage,
          user: JSON.parse(JSON.stringify(this.user))
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
