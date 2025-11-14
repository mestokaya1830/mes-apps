<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
      </div>
      <!-- Base -->
      <div class="form-section">
        <div class="form-section-title">🧾 Kundeninformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Unternehmenstyp *</label>
            <input v-model="customer.company_type" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Firmenname *</label>
            <input v-model="customer.company_name" type="date" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Vorname</label>
            <input v-model="customer.first_name" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Nachname</label>
            <input v-model="customer.last_name" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">E-Mail</label>
            <input v-model="customer.email" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Telefonnummer</label>
            <input v-model="customer.phone" type="date" class="form-input" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📍 Adressdaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Addresse *</label>
            <input v-model="customer.address" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Postleitzahl *</label>
            <input v-model="customer.postal_code" type="date" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input v-model="customer.city" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Land</label>
            <input v-model="customer.country" type="date" class="form-input" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">💼 Steuerinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Steuernummer *</label>
            <input v-model="customer.tax_number" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Postleitzahl *</label>
            <input v-model="customer.postal_code" type="text" class="form-input" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">USt-IdNr.</label>
          <input
            v-model="customer.vat_id"
            type="text"
            class="form-input"
            placeholder="DE123456789"
          />
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">⚙️ Systeminformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Status *</label>
            <select v-model="customer.is_active" class="form-input">
              <option value="">Select status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Erstellt *</label>
            <input v-model="customer.created_at" type="text" class="form-input" required />
          </div>
        </div>
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
        customer_type: 'individual',
        company_name: '',
        first_name: 'Maximilian',
        last_name: 'Weber',
        address: 'Friedrichstraße 158',
        postal_code: '10117',
        city: 'Berlin',
        country: 'Deutschland',
        email: 'max.weber@web.de',
        phone: '+49 30 7854321',
        tax_number: '11/456/78901',
        vat_id: '',
        is_active: true,
        created_at: ''
      }
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
        // Save the customer to the server
        if (result.error) {
          throw new Error(result.error)
        }
        this.showSuccess = true
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
