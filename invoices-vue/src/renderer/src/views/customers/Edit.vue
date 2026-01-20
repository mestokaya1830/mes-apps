<template>
  <div v-if="customer" class="main-container">
    <div class="main-header">
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
          <input v-model="customer.company_type" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Firmenname</label>
          <input v-model="customer.company_name" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Vorname</label>
          <input v-model="customer.first_name" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Nachname</label>
          <input v-model="customer.last_name" type="text" class="inputs" />
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">📍 Adressdaten</div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Adresse</label>
          <input v-model="customer.address" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Postleitzahl</label>
          <input v-model="customer.postal_code" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Stadt</label>
          <input v-model="customer.city" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Land</label>
          <input v-model="customer.country" type="text" class="inputs" />
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">📞 Kontaktdaten</div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">E-Mail</label>
          <input v-model="customer.email" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Telefonnummer</label>
          <input v-model="customer.phone" type="text" class="inputs" />
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">💼 Steuerinformationen</div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Steuernummer</label>
          <input v-model="customer.tax_number" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">USt-IdNr.</label>
          <input v-model="customer.vat_id" type="text" class="inputs" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Erstellungsdatum</label>
        <input v-model="customer.created_at" type="text" class="inputs" />
      </div>
    </div>
    <button type="button" class="form-btn" @click="updateCustomer">Aktualisierung</button>
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
