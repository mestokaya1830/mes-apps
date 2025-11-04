<template>
  <section class="setting-page">
    <h2 class="page-title">Profil Bearbeiten</h2>

    <form class="settings-form" @submit.prevent="updateUser">
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
            <span>Passwort (leer lassen, wenn nicht ändern)</span>
            <input v-model="user.password" type="password" placeholder="Neues Passwort eingeben" />
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
      <section v-if="user.company_details" class="section-company">
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
            <span>Firmenlogo (Neues Logo hochladen)</span>
            <input type="file" @change="setLogo($event)" />
          </label>

          <figure class="form-field logo-preview-wrapper">
            <figcaption>Logo-Vorschau</figcaption>
            <img :src="selectedImage" class="logo-preview" alt="Company Logo" />
          </figure>
        </div>
      </section>

      <!-- Contact Person -->
      <section v-if="user.contact_person" class="section-contact-person">
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
        <label class="form-field col-span-2">
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
          <span v-if="isSubmitting">Wird gespeichert...</span>
          <span v-else>Profil Aktualisieren</span>
        </button>
      </div>
    </form>

    <!-- Messages -->
    <p v-if="isLoading" class="status-message loading">Profil wird geladen...</p>
    <p v-if="showSuccess" class="status-message success">
      ✅ Profil wurde erfolgreich aktualisiert!
    </p>
    <p v-if="errorMessage" class="status-message error">❌ Fehler: {{ errorMessage }}</p>
  </section>
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
