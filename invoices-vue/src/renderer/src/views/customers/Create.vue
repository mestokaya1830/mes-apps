<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header-block">
        <div class="editor-title">📝{{ title }}</div>
        <router-link to="/customers" class="add-btn">
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

      <!-- Base -->
      <div class="form-section">
        <div class="form-section-title">🧾 Kundeninformationen</div>

        <div class="form-row">
          <!-- Unternehmenstyp -->
          <div class="form-group">
            <label class="form-label"> Unternehmenstyp <span class="stars">*</span> </label>
            <select v-model="customer.company_type" class="form-input">
              <option disabled value="">Wähle Unternehmenstyp</option>
              <option v-for="item in companies" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            <div v-if="error.company_type" class="error">
              {{ error.company_type }}
            </div>
          </div>

          <!-- Firmenname -->
          <div class="form-group">
            <label class="form-label">Firmenname <span class="stars">*</span></label>
            <input v-model="customer.company_name" type="text" class="form-input" />
            <div v-if="error.company_name" class="error">
              {{ error.company_name }}
            </div>
          </div>

          <!-- Vorname -->
          <div class="form-group">
            <label class="form-label">Vorname <span class="stars">*</span></label>
            <input v-model="customer.first_name" type="text" class="form-input" />
            <div v-if="error.first_name" class="error">
              {{ error.first_name }}
            </div>
          </div>

          <!-- Nachname -->
          <div class="form-group">
            <label class="form-label">Nachname <span class="stars">*</span></label>
            <input v-model="customer.last_name" type="text" class="form-input" />
            <div v-if="error.last_name" class="error">
              {{ error.last_name }}
            </div>
          </div>

          <!-- E-Mail -->
          <div class="form-group">
            <label class="form-label">E-Mail <span class="stars">*</span></label>
            <input v-model="customer.email" type="email" class="form-input" />
            <div v-if="error.email" class="error">
              {{ error.email }}
            </div>
          </div>

          <!-- Telefonnummer -->
          <div class="form-group">
            <label class="form-label">Telefonnummer <span class="stars">*</span></label>
            <input v-model="customer.phone" type="text" class="form-input" />
            <div v-if="error.phone" class="error">
              {{ error.phone }}
            </div>
          </div>
        </div>
      </div>

      <!-- Adressdaten -->
      <div class="form-section">
        <div class="form-section-title">📍 Adressdaten</div>
        <div class="form-row">
          <!-- Address -->
          <div class="form-group">
            <label class="form-label">Adresse <span class="stars">*</span></label>
            <input v-model="customer.address" type="text" class="form-input" />
            <div v-if="error.address" class="error">
              {{ error.address }}
            </div>
          </div>

          <!-- Postleitzahl -->
          <div class="form-group">
            <label class="form-label">Postleitzahl <span class="stars">*</span></label>
            <input v-model="customer.postal_code" type="text" class="form-input" />
            <div v-if="error.postal_code" class="error">
              {{ error.postal_code }}
            </div>
          </div>

          <!-- Stadt -->
          <div class="form-group">
            <label class="form-label">Stadt <span class="stars">*</span></label>
            <input v-model="customer.city" type="text" class="form-input" />
            <div v-if="error.city" class="error">
              {{ error.city }}
            </div>
          </div>

          <!-- Land -->
          <div class="form-group">
            <label class="form-label">Land <span class="stars">*</span></label>
            <input v-model="customer.country" type="text" class="form-input" />
            <div v-if="error.country" class="error">
              {{ error.country }}
            </div>
          </div>
        </div>
      </div>

      <!-- Steuer -->
      <div class="form-section">
        <div class="form-section-title">💼 Steuerinformationen</div>

        <div class="form-row">
          <!-- Steuernummer -->
          <div class="form-group">
            <label class="form-label">Steuernummer <span class="stars">*</span></label>
            <input v-model="customer.tax_number" type="text" class="form-input" />
            <div v-if="error.tax_number" class="error">
              {{ error.tax_number }}
            </div>
          </div>

          <!-- VAT ID -->
          <div class="form-group">
            <label class="form-label">USt-IdNr. <span class="stars">*</span></label>
            <input v-model="customer.vat_id" type="text" class="form-input" />
            <div v-if="error.vat_id" class="error">
              {{ error.vat_id }}
            </div>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="form-section">
        <div v-if="showSuccess" class="">
          <p class="font-medium">✅ Kunde erfolgreich gespeichert!</p>
        </div>

        <div class="flex justify-center pt-6">
          <button type="button" class="form-btn" @click="saveCustomer">Speichern</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerRegistrationForm',
  inject: ['trimFormFields'],
  data() {
    return {
      title: 'Kundenregistrierungsformular',
      isSubmitting: false,
      showSuccess: false,
      error: {},
      customer: {
        company_type: '',
        company_name: '',
        first_name: '',
        last_name: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
        email: '',
        phone: '+49',
        website: '',
        tax_number: '',
        vat_id: ''
      },
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
    customer: {
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
    validateForm() {
      const c = this.customer
      this.error = {}
      let valid = true

      if (!c.company_type) {
        this.error.company_type = 'Bitte Unternehmenstyp auswählen.'
        valid = false
      }
      if (!c.company_name) {
        this.error.company_name = 'Firmenname muss mindestens 2 Zeichen enthalten..'
        valid = false
      }

      if (!c.first_name || c.first_name.length < 2) {
        this.error.first_name = 'Vorname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }

      if (!c.last_name || c.last_name.length < 2) {
        this.error.last_name = 'Nachname muss mindestens 2 Zeichen enthalten.'
        valid = false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(c.email)) {
        this.error.email = 'Ungültige E-Mail-Adresse.'
        valid = false
      }

      if (!/^\+?[0-9\s\-()]{7,15}$/.test(c.phone)) {
        this.error.phone = 'Telefonnummer muss zwischen 7 und 15 Ziffern enthalten.'
        valid = false
      }

      if (!c.address || c.address.trim().length < 3) {
        this.error.address = 'Adresse muss mindestens 3 Zeichen enthalten.'
        valid = false
      } else if (!/^[A-Za-zÄÖÜäöüß\s\-.]+\s+\d+[A-Za-z]?$/.test(c.address)) {
        this.error.address = 'Adresse muss Straße und Hausnummer enthalten (z. B. Musterstraße 12).'
        valid = false
      }

      if (!/^\d{5}$/.test(c.postal_code)) {
        this.error.postal_code = 'Postleitzahl muss aus 5 Zahlen bestehen.'
        valid = false
      }

      if (!c.city || c.city.length < 2) {
        this.error.city = 'Stadt muss mindestens 2 Zeichen enthalten.'
        valid = false
      }

      if (!c.country || c.country.length < 2) {
        this.error.country = 'Land muss mindestens 2 Zeichen enthalten.'
        valid = false
      }

      if (!/^[0-9]{10,11}$/.test(c.tax_number)) {
        this.error.tax_number = 'Steuernummer muss 10–11 Ziffern enthalten.'
        valid = false
      }

      if (!/^DE[0-9]{9}$/.test(c.vat_id)) {
        this.error.vat_id = 'Die deutsche USt-ID muss mit "DE" beginnen und 9 Ziffern enthalten.'
        valid = false
      }

      return valid
    },
    async saveCustomer() {
      this.showSuccess = false
      this.trimFormFields(this.customer)
      if (!this.validateForm()) return

      try {
        this.isSubmitting = true
        const data = { customer: JSON.parse(JSON.stringify(this.customer)) }
        const result = await window.api.addCustomer(data)

        if (result.success) {
          this.showSuccess = true
          setTimeout(() => this.$router.push('/customers'), 1000)
        }
      } catch (error) {
        console.error(error)
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
/* EDITOR PANEL */
.editor-panel {
  width: 100%;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.editor-header-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
  min-height: 42px;
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
.stars {
  color: darkred;
  font-size: 16px;
}
</style>
