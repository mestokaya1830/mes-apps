<template>
  <div>
    <h2>Benutzerregistrierungsformular</h2>
    <form @submit.prevent="register" class="register-form">
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
            <label>Passwort *</label>
            <input
              v-model="user.password"
              type="password"
              required
              placeholder="Create a strong password"
            />
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
      <div>
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
            <label>Firmenlogo</label>
            <input type="file" placeholder="/assets/logo.png" @change="setLogo($event)" />
          </div>
          <div>
            <label>Logo-Vorschau</label>
            <img :src="selectedImage" class="logo-preview" />
          </div>
        </div>
      </div>

      <!-- contact person -->
      <div>
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
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Benuzer speichern</span>
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div v-if="showSuccess">
      <p class="font-medium">✅ Benutzer wurde erfolgreich gespeichert!</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage">
      <p class="font-medium">❌ Fehler: {{ errorMessage }}</p>
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
        image_type: ''
      },
      binaryImage: null,
      selectedImage: null,
      invoice_approved: 'Rechnungsinformationen sind vom Benutzer genehmigt.',

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
      console.log(this.user)
      if (this.user) {
        if (!this.binaryImage) return (this.errorMessage = 'Logo is required')
        const result = await window.api.register(
          Array.from(this.binaryImage),
          JSON.parse(JSON.stringify(this.user))
        )
        // const result = await window.api.register(this.base64, JSON.parse(JSON.stringify(this.user)))
        console.log(result)
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
