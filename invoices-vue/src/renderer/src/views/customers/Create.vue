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
          <div class="form-group">
            <label class="form-label">Unternehmenstyp <span class="stars">*</span></label>
            <select v-model="customer.customer_type" class="form-input">
              <option disabled value="">Wähle Unternehmenstyp</option>
              <option v-for="item in companies" :key="item.value" :value="item">
                {{ item.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Firmenname <span class="stars">*</span></label>
            <input v-model="customer.company_name" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Vorname <span class="stars">*</span></label>
            <input v-model="customer.first_name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Nachname <span class="stars">*</span></label>
            <input v-model="customer.last_name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">E-Mail <span class="stars">*</span></label>
            <input v-model="customer.email" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Telefonnummer <span class="stars">*</span></label>
            <input v-model="customer.phone" type="number" class="form-input" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📍 Adressdaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Addresse <span class="stars">*</span></label>
            <input v-model="customer.address" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Postleitzahl <span class="stars">*</span></label>
            <input v-model="customer.postal_code" type="number" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt <span class="stars">*</span></label>
            <input v-model="customer.city" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Land <span class="stars">*</span></label>
            <input v-model="customer.country" type="text" class="form-input" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">💼 Steuerinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Steuernummer <span class="stars">*</span></label>
            <input v-model="customer.tax_number" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">USt-IdNr. <span class="stars">*</span></label>
            <input v-model="customer.vat_id" type="text" class="form-input" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div v-if="showSuccess" class="">
          <p class="font-medium">✅ Kunde erfolgreich gespeichert!</p>
        </div>

        <div v-if="errorMessage" class="">
          <p class="font-medium">❌ Error: {{ errorMessage }}</p>
        </div>
        <div class="flex justify-center pt-6">
          <button type="submit" :disabled="isSubmitting" class="form-btn">
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Save Customer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Kundenregistrierungsformular',
  data() {
    return {
      title: 'Kundenregistrierungsformular',
      isSubmitting: false,
      showSuccess: false,
      errorMessage: '',
      customer: {
        customer_type: '',
        company_name: '',
        first_name: '',
        last_name: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
        email: '',
        phone: '+49',
        tax_number: '',
        vat_id: '',
        created_at: ''
      },
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
    async saveCustomer() {
      this.isSubmitting = true
      this.showSuccess = false
      this.errorMessage = ''

      try {
        const data = JSON.parse(JSON.stringify(this.customer))
        const result = await window.api.addCustomer(data)
        if (result.success) {
          this.showSuccess = true
        }
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
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

.editor-header-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.stars{
  color: darkred;
  font-size: 16px;
}
</style>
