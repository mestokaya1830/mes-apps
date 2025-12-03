<template>
  <div>
    <div v-if="customer" class="editor-panel">
      <div class="editor-header-block">
        <div class="editor-title">
          📝{{ title }} {{ formatCustomerId(customer.id) }}
          <div class="editor-subtitle">Bearbeiten Sie die Kundendaten</div>
        </div>
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
      <div class="form-section">
        <div class="form-section-title">🏢 Unternehmensinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Unternehmenstyp</label>
            <input v-model="customer.company_type" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Firmenname</label>
            <input v-model="customer.company_name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Vorname</label>
            <input v-model="customer.first_name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Nachname</label>
            <input v-model="customer.last_name" type="text" class="form-input" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📍 Adressdaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input v-model="customer.address" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Postleitzahl</label>
            <input v-model="customer.postal_code" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input v-model="customer.city" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Land</label>
            <input v-model="customer.country" type="text" class="form-input" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📞 Kontaktdaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">E-Mail</label>
            <input v-model="customer.email" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Telefonnummer</label>
            <input v-model="customer.phone" type="text" class="form-input" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">💼 Steuerinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Steuernummer</label>
            <input v-model="customer.tax_number" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">USt-IdNr.</label>
            <input v-model="customer.vat_id" type="text" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Erstellungsdatum</label>
          <input v-model="customer.created_at" type="text" class="form-input" />
        </div>
      </div>
      <button type="button" class="form-btn" @click="updateCustomer">Aktualisierung</button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['formatCustomerId', 'formatDate'],
  data() {
    return {
      title: 'Kunden bearbeiten',
      customer: null,
      errorMessage: ''
    }
  },
  mounted() {
    this.getCustomer()
  },
  methods: {
    async getCustomer() {
      try {
        const result = await window.api.getCustomerById(this.$route.params.id)
        if (!result.success) return
        this.customer = result.rows
      } catch (error) {
        console.error(error)
      }
    },

    // --------------------------
    // FORM VALIDASYON KONTROLÜ
    // --------------------------
    validateForm() {
      const c = this.customer

      if (!c.company_type || c.company_type.length < 2)
        return 'Unternehmenstyp muss mindestens 2 Zeichen enthalten.'

      if (!c.company_name || c.company_name.length < 3)
        return 'Firmenname muss mindestens 3 Zeichen enthalten.'

      if (!c.first_name || c.first_name.length < 2)
        return 'Vorname muss mindestens 2 Zeichen enthalten.'

      if (!c.last_name || c.last_name.length < 2)
        return 'Nachname muss mindestens 2 Zeichen enthalten.'

      if (!c.address || c.address.length < 3) return 'Adresse muss mindestens 3 Zeichen enthalten.'

      // Alman Postleitzahl — 5 haneli
      if (!/^\d{5}$/.test(c.postal_code)) return 'Postleitzahl muss aus 5 Ziffern bestehen.'

      if (!c.city || c.city.length < 2) return 'Stadt muss mindestens 2 Zeichen enthalten.'

      if (!c.country || c.country.length < 2) return 'Land muss mindestens 2 Zeichen enthalten.'

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(c.email)) return 'Ungültige E-Mail-Adresse.'

      // Telefon minimum 3 rakam — + kabul edilir
      if (!/^\+?\d{3,}$/.test(c.phone)) return 'Telefonnummer muss mindestens 3 Zahlen enthalten.'

      if (!c.tax_number || c.tax_number.length < 3)
        return 'Steuernummer muss mindestens 3 Zeichen enthalten.'

      if (!c.vat_id || c.vat_id.length < 3) return 'USt-ID muss mindestens 3 Zeichen enthalten.'

      return null
    },

    // --------------------------
    // UPDATE
    // --------------------------
    async updateCustomer() {
      this.errorMessage = ''

      const error = this.validateForm()
      if (error) {
        this.errorMessage = error
        return
      }

      try {
        const data = {
          id: this.$route.params.id,
          customer: JSON.parse(JSON.stringify(this.customer))
        }

        const result = await window.api.updateCustomerById(data)
        if (!result.success) return

        this.$router.push('/customers')
      } catch (error) {
        console.error(error)
        this.errorMessage = error.message
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
