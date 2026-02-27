<template>
  <main class="main-container">
    <header class="main-header">
      <h1>{{ title }}</h1>
      <router-link to="/" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons" aria-hidden="true"></i>Zurück
      </router-link>
    </header>
    <form v-if="user" @submit.prevent="updateUser">
      <!-- Personal Information -->
      <section class="sections">
        <dvi class="sections-title">
          <i class="bi bi-person icons" aria-hidden="true"></i>Persönlichedaten
        </dvi>
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
            <label class="form-field"
              >Passwort <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              v-model="user.password"
              type="password"
              class="inputs"
              placeholder="Neues Passwort eingeben"
            />
          </div>
          <div class="form-group">
            <label class="form-field"
              >Telefon <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input v-model="user.phone" type="tel" class="inputs" placeholder="+49 30 12345678" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-field"
            >Webseite <i class="bi bi-pencil icons" aria-hidden="true"></i
          ></label>
          <input v-model="user.website" type="url" class="inputs" placeholder="www.example.com" />
        </div>
      </section>

      <!-- Address Information -->
      <section class="sections">
        <div class="sections-title"><i class="bi bi-geo-alt" aria-hidden="true"></i>Adressdaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label"
              >Adresse <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              v-model="user.address"
              type="text"
              class="inputs"
              placeholder="Hauptstraße 123"
            />
          </div>
          <div class="form-group">
            <label class="form-label"
              >Postleitzahl <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input v-model="user.postal_code" type="text" class="inputs" placeholder="10115" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label"
              >Stadt <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input v-model="user.city" type="text" class="inputs" placeholder="Berlin" />
          </div>
          <div class="form-group">
            <label for="city" class="form-label"
              ><i class="bi bi-flag" aria-hidden="true"></i>Bundesland (Deutschland)
              <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <select v-model="user.state" class="inputs" id="city">
              <option disabled value="">Bitte wählen</option>
              <option v-for="item in german_states" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <!-- Company Information -->
      <section v-if="user.company_details" class="sections">
        <div class="sections-title">
          <i class="bi bi-building icons" aria-hidden="true"></i>Unternehmensdaten
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-field">Firmenname</label>
            <label for="" class="inputs">{{ user.company_name }}</label>
          </div>
          <div class="form-group">
            <label for="Unternehmensform" class="form-field"
              ><i class="bi bi-flag icons" aria-hidden="true"></i>Unternehmensform
              (Deutschland)</label
            >
            <select v-model="user.company_details" class="inputs" id="Unternehmensform">
              <option disabled value="">-- Bitte wählen --</option>
              <option v-for="item in companies" :key="item.value" :value="item">
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="file" class="form-field"
              >Firmenlogo (Neues Logo hochladen)
              <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input type="file" id="file" @change="setLogo($event)" />
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
            <img v-else :src="`${selectedImage}`" class="user-logo" alt="Company Logo" />
          </div>
        </div>
      </section>

      <!-- Contact Person -->
      <section v-if="user.contact_person" class="sections">
        <div class="sections-title"><i class="bi bi-telephone me-2 icons"></i>Kontaktdaten</div>
        <div class="form-row">
          <div class="form-group">
            <label for="Anrede" class="form-label"
              >Anrede <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <select v-model="user.contact_person.gender" class="inputs" id="Anrede">
              <option value="" disabled>Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label"
              >Vorname <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              v-model="user.contact_person.first_name"
              type="text"
              class="inputs"
              placeholder="Hans Mueller"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nachname <i class="bi bi-pencil"></i></label>
            <input
              v-model="user.contact_person.last_name"
              type="text"
              class="inputs"
              placeholder="Hans Mueller"
            />
          </div>
          <div class="form-group">
            <label class="form-label"
              >Telefon <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              v-model="user.contact_person.phone"
              type="tel"
              class="inputs"
              placeholder="+49 30 12345678"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label"
            >E-Mail <i class="bi bi-pencil icons" aria-hidden="true"></i
          ></label>
          <input
            v-model="user.contact_person.email"
            type="email"
            class="inputs"
            placeholder="example@email.com"
          />
        </div>
      </section>

      <!-- Tax Information -->
      <section class="sections">
        <div class="sections-title">
          <i class="bi bi-briefcase icons" aria-hidden="true"></i>Steuerinformationen
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Steuernummer</label>
            <label for="" class="inputs">{{ user.tax_number }}</label>
          </div>
          <div class="form-group">
            <label class="form-label"
              >Finanzamt <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              v-model="user.tax_office"
              type="text"
              class="inputs"
              placeholder="Finanzamt Berlin Mitte/Tiergarten"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">USt-IdNr.</label>
            <label for="" class="inputs">{{ user.vat_id }}</label>
          </div>
          <div class="form-group">
            <label class="form-label">Handelsregistereintrag</label>
            <label for="" class="inputs">{{ user.court_registration }}</label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label"
            >Gerichtsstand <i class="bi bi-pencil" aria-hidden="true"></i
          ></label>
          <label for="" class="inputs">{{ user.court_location }}</label>
        </div>
      </section>

      <!-- Bank Information -->
      <section class="sections">
        <div class="sections-title"><i class="bi bi-credit-card icons"></i>Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-field"
              >Bankname <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              v-model="user.bank_name"
              type="text"
              class="inputs"
              placeholder="Deutsche Bank AG"
            />
          </div>
          <div class="form-group">
            <label class="form-field"
              >BIC <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input v-model="user.bic" type="text" class="inputs" placeholder="DEUTDEBBXXX" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-field"
              >IBAN <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              v-model="user.iban"
              type="text"
              class="inputs"
              placeholder="DE89370400440532013000"
            />
          </div>
          <div class="form-group">
            <label class="form-field"
              >Kontoinhaber <i class="bi bi-pencil icons" aria-hidden="true"></i
            ></label>
            <input
              v-model="user.bank_account_holder"
              type="text"
              class="inputs"
              placeholder="TechSolutions GmbH"
            />
          </div>
        </div>
      </section>

      <!-- Company Signature -->
      <section class="sections">
        <div class="sections-title">
          <i class="bi bi-pen icons" style="cursor: pointer"></i>
          Unternehmenssignatur
        </div>

        <label class="form-field">
          <span>Signaturtext <i class="bi bi-pencil icons" aria-hidden="true"></i></span>
        </label>
        <textarea
          v-model="user.company_signature"
          rows="4"
          placeholder="Mit freundlichen Grüßen&#10;TechSolutions GmbH&#10;Hans Mueller&#10;Geschäftsführer"
        ></textarea>
      </section>

      <!-- Submit Button -->
      <footer class="form-section btn-container">
        <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
          <span v-if="isSubmitting">Wird gespeichert...</span>
          <span v-else>Profil Aktualisieren</span>
        </button>
      </footer>
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
  </main>
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
      user: null,
      selectedImage: null,
      blobImage: null,

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
      this.blobImage = await file.arrayBuffer() //to send to backend
      this.selectedImage = URL.createObjectURL(file)
      this.user.logo = 'user.png'
    },
    // Update profile
    async updateUser() {
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
