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
      showSuccess: false,
      errorMessage: '',
      placeholder: { value: null, label: '-- Bitte wählen --' },
      user: {
        gender: '',
        first_name: 'Max',
        last_name: 'Mustermann',
        password: '121212',
        email: 'user@user.de',
        phone: '+49 30 12345678',
        address: 'Musterstraße 12',
        postal_code: '10115',
        city: 'Berlin',
        state: '',
        country: 'Deutschland',
        website: 'https://www.example.de',
        company_name: 'Musterfirma GmbH',
        company_details: {
          company_type_short: '',
          company_type: '',
          is_small_company: false
        },
        company_signature: 'https://www.example.de/signature.png',
        contact_person: {
          gender: '',
          first_name: 'Max',
          last_name: 'Mustermann',
          email: 'user@user.de',
          phone: '+49 30 12345678'
        },
        tax_number: '12/345/67890',
        tax_office: 'Finanzamt Berlin-Mitte',
        vat_id: 'DE123456789',
        court_registration: 'Amtsgericht Berlin',
        court_location: 'Berlin',
        bank_name: 'Deutsche Bank',
        bic: 'DEUTDEBBXXX',
        iban: 'DE89370400440532013000',
        bank_account_holder: 'Max Mustermann',
        image_type: '',
        invoice_approved: 'Rechnungsinformationen sind vom Benutzer genehmigt.'
      },
      binaryImage: null,
      selectedImage: null,

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
        // Şahıs işletmesi – en yaygın küçük işletme türü (Kleinunternehmer §19 UStG)
        { value: 'Freiberufler', label: 'Freiberufler', is_small_company: true },
        // Serbest meslek (doktor, mimar, mühendis, yazar vb.) – KDV bazen muaf
        { value: 'Gbr', label: 'GbR (Gesellschaft bürgerlichen Rechts)', is_small_company: true },
        // Adi ortaklık – serbest meslek sahipleri veya küçük işletmeler
        { value: 'Ug', label: 'UG (haftungsbeschränkt)', is_small_company: true },
        // Mini GmbH – düşük sermaye ile limited şirket
        {
          value: 'GmbH',
          label: 'GmbH (Gesellschaft mit beschränkter Haftung)',
          is_small_company: false
        },
        // Limited şirket – genelde KDV yükümlüsü
        { value: 'Ohg', label: 'OHG (Offene Handelsgesellschaft)', is_small_company: false },
        // Ticari ortaklık – küçük sayılmaz
        { value: 'Kg', label: 'KG (Kommanditgesellschaft)', is_small_company: false },
        // Komandit ortaklık – orta veya büyük ölçekli işletmeler
        { value: 'GmbH_co_KG', label: 'GmbH & Co. KG', is_small_company: false },
        // GmbH'nin komandit ortak olduğu özel ortaklık türü
        { value: 'Partg', label: 'PartG (Partnerschaftsgesellschaft)', is_small_company: false },
        // Profesyonel meslekler (avukat, doktor, diş hekimi, mimar vb.) için ortaklık
        {
          value: 'Partgmbb',
          label: 'PartGmbB (Partnerschaftsgesellschaft mit beschränkter Berufshaftung)',
          is_small_company: false
        },
        // Sınırlı mesleki sorumluluklu ortaklık
        { value: 'Ek', label: 'e.K. (eingetragener Kaufmann)', is_small_company: true },
        // Tescilli tacir – genelde küçük veya orta işletmeler
        { value: 'Ev', label: 'e.V. (eingetragener Verein)', is_small_company: false },
        // Dernek – kâr amacı gütmeyen organizasyonlar
        { value: 'GgmbH', label: 'gGmbH (gemeinnützige GmbH)', is_small_company: false },
        // Kar amacı gütmeyen limited şirket – özel vergi durumu (§4 UStG)
        { value: 'Stiftung', label: 'Stiftung', is_small_company: false },
        // Vakıf – genellikle kamu yararına çalışan kuruluşlar
        { value: 'Ag', label: 'AG (Aktiengesellschaft)', is_small_company: false },
        // Anonim şirket – büyük ölçekli işletmeler
        { value: 'Se', label: 'SE (Societas Europaea)', is_small_company: false }
        // Avrupa şirketi – uluslararası düzeyde faaliyet gösteren büyük firmalar
      ]
    }
  },
  methods: {
    async setLogo(event) {
      const file = event.target.files[0]
      this.user.image_type = file.type
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
        if (result.success) {
          this.errorMessage = ''
          this.$router.push('/login')
        }
      }
    }
  }
}
</script>
