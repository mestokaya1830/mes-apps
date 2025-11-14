<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header-block">
        <div class="editor-title">
          📝{{ title }}
          <div class="editor-subtitle">Bearbeiten Sie die Profile</div>
        </div>
        <router-link to="/" class="add-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </router-link>
      </div>
      <form @submit.prevent="updateUser">
        <!-- Personal Information -->
        <section class="form-section">
          <h3 class="form-section-title">👤 Persönlichedaten</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Anrede</label>
              <select v-model="user.gender" class="form-input">
                <option value="" disabled>Bitte wählen</option>
                <option value="Herr">Herr</option>
                <option value="Frau">Frau</option>
                <option value="Divers">Divers</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Vorname</label>
              <input
                v-model="user.first_name"
                type="text"
                required
                placeholder="Enter your first name"
              />
            </div>
            <div class="form-group">
              <label class="form-field">Nachname</label>
              <input
                v-model="user.last_name"
                type="text"
                required
                placeholder="Enter your last name"
              />
            </div>
            <div class="form-group">
              <label class="form-field">E-Mail</label>
              <input v-model="user.email" type="email" required placeholder="example@email.com" />
            </div>
            <div class="form-group">
              <label class="form-field">Passwort</label>
              <input
                v-model="user.password"
                type="password"
                placeholder="Neues Passwort eingeben"
              />
            </div>
            <div class="form-group">
              <label class="form-field">Telefon</label>
              <input
                v-model="user.phone"
                type="tel"
                class="form-input"
                placeholder="+49 30 12345678"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-field">Webseite</label>
            <input
              v-model="user.website"
              type="url"
              class="form-input"
              placeholder="www.example.com"
            />
          </div>
        </section>

        <!-- Address Information -->
        <section class="form-section">
          <h3 class="form-section-title">📍 Adressdaten</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Adresse</label>
              <input
                v-model="user.address"
                type="text"
                class="form-input"
                placeholder="Hauptstraße 123"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Postleitzahl</label>
              <input
                v-model="user.postal_code"
                type="text"
                class="form-input"
                placeholder="10115"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt</label>
              <input v-model="user.city" type="text" class="form-input" placeholder="Berlin" />
            </div>
            <div class="form-group">
              <label class="form-label">🇩🇪 Bundesland (Deutschland)</label>
              <select v-model="user.state" class="form-input">
                <option disabled value="">Bitte wählen</option>
                <option v-for="item in german_states" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <!-- Company Information -->
        <section v-if="user.company_details" class="form-section">
          <h3 class="form-section-title">🏢 Unternehmensdaten</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-field">Firmenname</label>
              <input
                v-model="user.company_name"
                type="text"
                class="form-input"
                placeholder="TechSolutions GmbH"
              />
            </div>
            <div class="form-group">
              <label class="form-field">🇩🇪 Unternehmensform (Deutschland)</label>
              <select v-model="user.company_details" class="form-input">
                <option disabled value="">-- Bitte wählen --</option>
                <option v-for="item in companies" :key="item.value" :value="item">
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-field">Firmenlogo (Neues Logo hochladen)</label>
              <input type="file" @change="setLogo($event)" />
            </div>
            <div class="form-group">
              <label class="form-field">Logo-Vorschau</label>
              <img :src="selectedImage" class="logo-preview" alt="Company Logo" />
            </div>
          </div>
        </section>

        <!-- Contact Person -->
        <section v-if="user.contact_person" class="form-section">
          <h3 class="form-section-title">📞 Kontaktdaten</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Anrede</label>
              <select v-model="user.contact_person.gender" class="form-input">
                <option value="" disabled>Bitte wählen</option>
                <option value="Herr">Herr</option>
                <option value="Frau">Frau</option>
                <option value="Divers">Divers</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Vorname</label>
              <input
                v-model="user.contact_person.first_name"
                type="text"
                class="form-input"
                placeholder="Hans Mueller"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Vorname</label>
              <input
                v-model="user.contact_person.last_name"
                type="text"
                class="form-input"
                placeholder="Hans Mueller"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Telefon</label>
              <input
                v-model="user.contact_person.phone"
                type="tel"
                class="form-input"
                placeholder="+49 30 12345678"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">E-Mail</label>
            <input
              v-model="user.contact_person.email"
              type="email"
              class="form-input"
              placeholder="example@email.com"
            />
          </div>
        </section>

        <!-- Tax Information -->
        <section class="form-section">
          <h3 class="form-section-title">💼 Steuerinformationen</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Steuernummer</label>
              <input
                v-model="user.tax_number"
                type="text"
                class="form-input"
                placeholder="123/456/78901"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Finanzamt</label>
              <input
                v-model="user.tax_office"
                type="text"
                class="form-input"
                placeholder="Finanzamt Berlin Mitte/Tiergarten"
              />
            </div>
            <div class="form-group">
              <label class="form-label">USt-IdNr.</label>
              <input
                v-model="user.vat_id"
                type="text"
                class="form-input"
                placeholder="DE123456789"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Handelsregistereintrag</label>
              <input
                v-model="user.court_registration"
                type="text"
                class="form-input"
                placeholder="HRB 12345 B"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gerichtsstand</label>
            <input
              v-model="user.court_location"
              type="text"
              class="form-input"
              placeholder="Amtsgericht Berlin"
            />
          </div>
        </section>

        <!-- Bank Information -->
        <section class="form-section">
          <h3 class="form-section-title">💳 Zahlungsinformationen</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-field">Bankname</label>
              <input
                v-model="user.bank_name"
                type="text"
                class="form-input"
                placeholder="Deutsche Bank AG"
              />
            </div>
            <div class="form-group">
              <label class="form-field">BIC</label>
              <input v-model="user.bic" type="text" class="form-input" placeholder="DEUTDEBBXXX" />
            </div>
            <div class="form-group">
              <label class="form-field">IBAN</label>
              <input v-model="user.iban" type="text" class="form-input" placeholder="DE89370400440532013000" />
            </div>
            <div class="form-group">
              <label class="form-field">Kontoinhaber</label>
               <input
                v-model="user.bank_account_holder"
                type="text"
                class="form-input"
                placeholder="TechSolutions GmbH"
              />
            </div>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditProfileForm',
  data() {
    return {
      title: 'Profil',
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
<style>
/* EDITOR PANEL */
.editor-panel {
  width: 70%;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.editor-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.editor-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* FORM GROUPS */
.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row-4 {
  grid-template-columns: repeat(4, 1fr);
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
}

input:not([readonly]) {
  background: #fff;
}

/* POSITIONS */
.positions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.add-position-btn {
  display: flex;
  width: 100%;
  justify-content: center;
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 20px 0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-position-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 16px;
  cursor: pointer;
}

.positions-total {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.positions-total-item {
  margin-left: 16px;
}

.positions-total-item > div {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
}
/* SWITCH CONTROL */
.switch-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.switch-text {
  margin-left: 16px;
}
.switch {
  position: relative;
  display: inline-block;
  min-width: 50px;
  height: 28px;
  margin-left: 10px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 5px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
