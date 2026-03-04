<template>
  <div class="main-container">
    <header class="page-header">
      <h1>{{ title }}</h1>
      <router-link to="/" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons" aria-hidden="true"></i>Zurück
      </router-link>
    </header>
    <form v-if="user" @submit.prevent="updateUser">
      <!-- Personal Information -->
      <section class="sections">
        <div class="sections-title">
          <i class="bi bi-person icons" aria-hidden="true"></i>Persönlichedaten
        </div>
        <div class="form-row">
          <dl class="form-group">
            <dt class="form-label">Anrede</dt>
            <dd for="" class="inputs">{{ user.gender }}</dd>
          </dl>
          <dl class="form-group">
            <dt class="form-label">Vorname</dt>
            <dd for="" class="inputs">{{ user.first_name }}</dd>
          </dl>
        </div>
        <div class="form-row">
          <dl class="form-group">
            <dt class="form-field">Nachname</dt>
            <dd for="" class="inputs">{{ user.last_name }}</dd>
          </dl>
          <dl class="form-group">
            <dt class="form-field">E-Mail</dt>
            <dd for="" class="inputs">{{ user.email }}</dd>
          </dl>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="Kenntwort" class="form-field"
              >Passwort <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Kenntwort"
              v-model="user.password"
              type="password"
              class="inputs"
              placeholder="Neues Passwort eingeben"
            />
            <div v-if="error.Kenntwort" class="error" role="alert">{{ error.Kenntwort }}</div>
          </div>
          <div class="form-group">
            <label for="Telefon" class="form-field"
              >Telefon <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Telefon"
              v-model="user.phone"
              type="tel"
              class="inputs"
              placeholder="+49 30 12345678"
            />
            <div v-if="error.Telefon" class="error" role="alert">{{ error.Telefon }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="Webseite" class="form-field"
            >Webseite <i class="bi bi-pencil icons" aria-hidden="true"></i
          ></label>
          <input
            id="Webseite"
            v-model="user.website"
            type="url"
            class="inputs"
            placeholder="www.example.com"
          />
          <div v-if="error.Webseite" class="error" role="alert">{{ error.Webseite }}</div>
        </div>
      </section>

      <!-- Address Information -->
      <section class="sections">
        <div class="sections-title">
          <i class="bi bi-geo-alt" aria-hidden="true"></i>Adressdaten
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="Adresse" class="form-label"
              >Adresse <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Adresse"
              v-model="user.address"
              type="text"
              class="inputs"
              placeholder="Hauptstraße 123"
            />
            <div v-if="error.Adresse" class="error" role="alert">{{ error.Adresse }}</div>
          </div>

          <div class="form-group">
            <label for="Postleitzahl" class="form-label"
              >Postleitzahl <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Postleitzahl"
              v-model="user.postal_code"
              type="text"
              class="inputs"
              placeholder="10115"
            />
            <div v-if="error.Postleitzahl" class="error" role="alert">{{ error.Adresse }}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="Stadt" class="form-label"
              >Stadt <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input id="Stadt" v-model="user.city" type="text" class="inputs" placeholder="Berlin" />
            <div v-if="error.Stadt" class="error" role="alert">{{ error.Stadt }}</div>
          </div>
          <div class="form-group">
            <label for="state" class="form-label"
              >Bundesland (Deutschland) <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <select id="state" v-model="user.state" class="inputs">
              <option disabled value="">Bitte wählen</option>
              <option v-for="item in german_states" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            <div v-if="error.state" class="error" role="alert">{{ error.state }}</div>
          </div>
        </div>
      </section>

      <!-- Company Information -->
      <section v-if="user.company_details" class="sections">
        <div class="sections-title">
          <i class="bi bi-building icons" aria-hidden="true"></i>Unternehmensdaten
        </div>
        <div class="form-row">
          <dl class="form-group">
            <dt class="form-field">Firmenname</dt>
            <dd class="inputs">{{ user.company_name }}</dd>
          </dl>
          <div class="form-group">
            <label for="Unternehmensform" class="form-field"
              >Unternehmensform (Deutschland)
              <i class="bi bi-pencil icons" aria-hidden="true"></i>
            </label>
            <select id="Unternehmensform" v-model="user.company_details" class="inputs">
              <option disabled value="">-- Bitte wählen --</option>
              <option v-for="item in companies" :key="item.value" :value="item">
                {{ item.label }}
              </option>
            </select>
            <div v-if="error.Unternehmensform" class="error" role="alert">
              {{ error.Unternehmensform }}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="file" class="form-field"
              >Firmenlogo (Neues Logo hochladen)
              <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input id="file" type="file" @change="setLogo($event)" />
          </div>
          <div class="form-group">
            <label class="form-field"
              >Logo-Vorschau <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <img
              v-if="!selectedImage"
              :src="`uploads/user/${user.logo}`"
              class="user-logo"
              alt="Company Logo"
            />
            <img
              v-else
              :src="`${selectedImage}`"
              class="user-logo"
              alt="Company Logo"
              role="image"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <!-- Contact Person -->
      <section v-if="user.contact_person" class="sections">
        <div class="sections-title">
          <i class="bi bi-telephone icons" aria-hidden="true"></i>Kontaktdaten
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="Anrede" class="form-label"
              >Anrede <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <select id="Anrede" v-model="user.contact_person.gender" class="inputs">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
            <div v-if="error.Anrede" class="error" role="alert">{{ error.Anrede }}</div>
          </div>
          <div class="form-group">
            <label for="Vorname" class="form-label"
              >Vorname <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Vorname"
              v-model="user.contact_person.first_name"
              type="text"
              class="inputs"
              placeholder="Hans Mueller"
            />
            <div v-if="error.Vorname" class="error" role="alert">{{ error.Vorname }}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="Nachname" class="form-label">Nachname <i class="bi bi-pencil"></i></label>
            <input
              id="Nachname"
              v-model="user.contact_person.last_name"
              type="text"
              class="inputs"
              placeholder="Hans Mueller"
            />
            <div v-if="error.Nachname" class="error" role="alert">{{ error.Nachname }}</div>
          </div>
          <div class="form-group">
            <label for="Telefon" class="form-label"
              >Telefon <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Telefon"
              v-model="user.contact_person.phone"
              type="tel"
              class="inputs"
              placeholder="+49 30 12345678"
            />
            <div v-if="error.Telefon" class="error" role="alert">{{ error.Telefon }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="email" class="form-label"
            >E-Mail <i class="bi bi-pencil icons" aria-hidden="true"></i
          ></label>
          <input
            id="email"
            v-model="user.contact_person.email"
            type="email"
            class="inputs"
            placeholder="example@email.com"
          />
          <div v-if="error.email" class="error" role="alert">{{ error.email }}</div>
        </div>
      </section>

      <!-- Tax Information -->
      <section class="sections">
        <div class="sections-title">
          <i class="bi bi-briefcase icons" aria-hidden="true"></i>Steuerinformationen
        </div>
        <div class="form-row">
          <dl class="form-group">
            <dt class="form-label">Steuernummer</dt>
            <dd class="inputs">{{ user.tax_number }}</dd>
          </dl>
          <div class="form-group">
            <label for="Finanzamt" class="form-label"
              >Finanzamt <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Finanzamt"
              v-model="user.tax_office"
              type="text"
              class="inputs"
              placeholder="Finanzamt Berlin Mitte/Tiergarten"
            />
            <div v-if="error.Finanzamt" class="error" role="alert">{{ error.Finanzamt }}</div>
          </div>
        </div>
        <div class="form-row">
          <dl class="form-group">
            <dt class="form-label">USt-IdNr.</dt>
            <dd class="inputs">{{ user.vat_id }}</dd>
          </dl>
          <dl class="form-group">
            <dt class="form-label">Handelsregistereintrag</dt>
            <dd class="inputs">{{ user.court_registration }}</dd>
          </dl>
        </div>
        <dl class="form-group">
          <dt class="form-label">Gerichtsstand</dt>
          <dd class="inputs">{{ user.court_location }}</dd>
        </dl>
      </section>

      <!-- Bank Information -->
      <section class="sections">
        <div class="sections-title">
          <i class="bi bi-credit-card icons"></i>Zahlungsinformationen
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="Bankname" class="form-field"
              >Bankname <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Bankname"
              v-model="user.bank_name"
              type="text"
              class="inputs"
              placeholder="Deutsche Bank AG"
            />
            <div v-if="error.Bankname" class="error" role="alert">{{ error.Bankname }}</div>
          </div>
          <div class="form-group">
            <label for="BIC" class="form-field"
              >BIC <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="BIC"
              v-model="user.bic"
              type="text"
              class="inputs"
              placeholder="DEUTDEBBXXX"
            />
            <div v-if="error.BIC" class="error" role="alert">{{ error.BIC }}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="IBAN" class="form-field"
              >IBAN <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="IBAN"
              v-model="user.iban"
              type="text"
              class="inputs"
              placeholder="DE89370400440532013000"
            />
            <div v-if="error.IBAN" class="error" role="alert">{{ error.IBAN }}</div>
          </div>
          <div class="form-group">
            <label for="Kontoinhaber" class="form-field"
              >Kontoinhaber <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              id="Kontoinhaber"
              v-model="user.bank_account_holder"
              type="text"
              class="inputs"
              placeholder="TechSolutions GmbH"
            />
            <div v-if="error.Kontoinhaber" class="error" role="alert">{{ error.Kontoinhaber }}</div>
          </div>
        </div>
      </section>

      <!-- Company Signature -->
      <section class="sections">
        <div class="sections-title">
          <i class="bi bi-pen icons" aria-hidden="true"></i>
          Unternehmenssignatur
        </div>

        <label for="Signaturtext" class="form-field">
          Signaturtext <i class="bi bi-pencil icons" aria-hidden="true"></i>
        </label>
        <textarea
          id="Signaturtext"
          v-model="user.company_signature"
          rows="4"
          placeholder="Mit freundlichen Grüßen&#10;TechSolutions GmbH&#10;Hans Mueller&#10;Geschäftsführer"
        ></textarea>
        <div v-if="error.Signaturtext" class="error" role="alert">{{ error.Signaturtext }}</div>
      </section>

      <!-- Submit Button -->
      <div class="form-section btn-container">
        <button type="submit" :disabled="isSubmitting" class="btn btn-update">
          <span v-if="isSubmitting">Wird gespeichert...</span>
          <span v-else>Aktualisieren</span>
        </button>
      </div>
    </form>
    <!-- Messages -->
    <p v-if="isLoading" class="status-message loading">Profil wird geladen...</p>
    <p v-if="showSuccess" class="status-message success" role="status">
      <i class="bi bi-check-circle-fill text-success icons" aria-hidden="true"></i> Profil wurde
      erfolgreich aktualisiert!
    </p>
    <p v-if="errorMessage" class="status-message error" role="alert">
      <i class="bi bi-x-circle-fill text-danger icons" aria-hidden="true"></i> Fehler:
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'EditProfileForm',
  data() {
    return {
      title: 'Profil',
      user: null,
      isLoading: true,
      isSubmitting: false,
      showSuccess: false,
      errorMessage: '',
      error: {},
      selectedImage: null,
      blobImage: null,
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
        const result = await window.api.getUser()
        if (!result) return
        this.user = {
          ...result.rows,
          contact_person: JSON.parse(result.rows.contact_person),
          company_details: JSON.parse(result.rows.company_details)
        }
        this.isLoading = false
      } catch (error) {
        console.error(error)
      }
    },
    async setLogo(event) {
      const file = event.target.files[0]
      if (!file) return
      this.blobImage = await file.arrayBuffer()
      this.selectedImage = URL.createObjectURL(file)
      this.user.logo = 'user.png'
    },
    validateForm() {
      let valid = true
      this.error = {}
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

      // Password
      if (!this.user.password || this.user.password.length < 6) {
        this.error.Kenntwort = 'Passwort muss mindestens 6 Zeichen enthalten.'
        valid = false
      }

      // Phone (optional)
      if (this.user.phone && !/^\+?49\d{5,14}$/.test(this.user.phone)) {
        this.error.Telefon = 'Bitte geben Sie eine gültige deutsche Telefonnummer ein.'
        valid = false
      }

      // Website (optional)
      if (this.user.website) {
        const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}([/\w\-.?&=]*)*$/
        if (!urlPattern.test(this.user.website)) {
          this.error.Webseite = 'Bitte geben Sie eine gültige Website-Adresse ein.'
          valid = false
        }
      }

      // Address
      if (!this.user.address || this.user.address.trim().length < 3) {
        this.error.Adresse = 'Adresse muss mindestens 3 Zeichen enthalten.'
        valid = false
      } else if (!/^[A-Za-zÄÖÜäöüß\s\-.]+\s+\d+[A-Za-z]?$/.test(this.user.address)) {
        this.error.Adresse = 'Adresse muss Straße und Hausnummer enthalten (z.B. Musterstraße 12).'
        valid = false
      }

      // Postal code
      if (this.user.postal_code && !/^\d{5}$/.test(this.user.postal_code)) {
        this.error.Postleitzahl = 'Postleitzahl muss 5 Ziffern enthalten.'
        valid = false
      }

      // City
      if (this.user.city && this.user.city.length < 2) {
        this.error.Stadt = 'Stadt muss mindestens 2 Zeichen enthalten.'
        valid = false
      }

      // State
      if (!this.user.state) {
        this.error.state = 'Bitte Bundesland auswählen.'
        valid = false
      }

      // Company
      if (!this.user.company_details || !this.user.company_details.value) {
        this.error.Unternehmensform = 'Bitte Unternehmensform auswählen.'
        valid = false
      }

      // Contact person
      const cp = this.user.contact_person
      if (!cp.gender) {
        this.error.Anrede = 'Bitte Anrede auswählen.'
        valid = false
      }
      if (cp.first_name && cp.first_name.length < 2) {
        this.error.Vorname = 'Vorname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      if (cp.last_name && cp.last_name.length < 2) {
        this.error.Nachname = 'Nachname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }
      if (cp.email && !emailRegex.test(cp.email)) {
        this.error.emailCP = 'Ungültige E-Mail-Adresse.'
        valid = false
      }
      if (cp.phone && !/^\+?49\d{5,14}$/.test(cp.phone)) {
        this.error.TelefonCP = 'Bitte geben Sie eine gültige deutsche Telefonnummer ein.'
        valid = false
      }

      // Tax info
      if (this.user.tax_number && this.user.tax_number.trim() !== '') {
        const cleanTaxNumber = this.user.tax_number.replace(/[\s/-]/g, '')
        if (!/^\d+$/.test(cleanTaxNumber)) {
          this.error.tax_number = 'Steuernummer darf nur Zahlen enthalten.'
          valid = false
        } else if (cleanTaxNumber.length < 10 || cleanTaxNumber.length > 13) {
          this.error.tax_number = 'Steuernummer muss 10-13 Ziffern enthalten.'
          valid = false
        }
      }
      if (!this.user.tax_office) {
        this.error.Finanzamt = 'Bitte geben Sie eine gültige Finanzamt ein.'
        valid = false
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

      // Focus
      if (!valid) {
        this.$nextTick(() => {
          const firstErrorField = Object.keys(this.error)[0]
          if (firstErrorField) {
            const inputElement = document.getElementById(firstErrorField)
            if (inputElement) inputElement.focus()
          }
        })
      }

      return valid
    },
    formatIban() {
      let val = this.user.iban.toUpperCase().replace(/[^A-Z0-9]/g, '')
      val = val.match(/.{1,4}/g)?.join(' ') || val
      this.user.iban = val.substring(0, 27)
    },
    async updateUser() {
      if (!this.validateForm()) {
        this.showError = true
        this.errorMessage = 'Bitte alle Pflichtfelder korrekt ausfüllen.'
        console.log(this.error)
        return
      }
      if (this.user) {
        const data = {
          image_file: this.blobImage,
          user: JSON.parse(JSON.stringify(this.user))
        }
        const result = await window.api.updateUser(data)
        if (result.success) {
          this.errorMessage = ''
          this.$router.push('/login')
        }
      }
    }
  }
}
</script>
