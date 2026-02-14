<template>
  <div v-if="customer" class="main-container">
    <header class="main-header">
      <label>
        {{ title }}
      </label>
      <router-link :to="`/customers/details/${customer.id}`" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill me-1 icons"></i>Zurück
      </router-link>
    </header>

    <section class="sections">
      <div class="sections-title">
        <i class="bi bi-building form-title icons"></i> Unternehmensinformationen
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Unternehmenstyp<span class="stars">*</span></label>
          <input v-model="customer.company_type" type="text" class="inputs" required />
        </div>
        <div class="form-group">
          <label class="form-label">Firmenname<span class="stars">*</span></label>
          <input v-model="customer.company_name" type="text" class="inputs" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Vorname<span class="stars">*</span></label>
          <input v-model="customer.first_name" type="text" class="inputs" required />
        </div>
        <div class="form-group">
          <label class="form-label">Nachname<span class="stars">*</span></label>
          <input v-model="customer.last_name" type="text" class="inputs" required />
        </div>
      </div>
    </section>

    <section class="sections">
      <div class="sections-title"><i class="bi bi-geo-alt form-title icons"></i> Adressdaten</div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Adresse <span class="stars">*</span></label>
          <input v-model="customer.address" type="text" class="inputs" required />
        </div>
        <div class="form-group">
          <label class="form-label">Postleitzahl <span class="stars">*</span></label>
          <input v-model="customer.postal_code" type="text" class="inputs" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Stadt <span class="stars">*</span></label>
          <input v-model="customer.city" type="text" class="inputs" required />
        </div>
        <div class="form-group">
          <label class="form-label">Land <span class="stars">*</span></label>
          <input v-model="customer.country" type="text" class="inputs" required />
        </div>
      </div>
    </section>

    <section class="sections">
      <div class="sections-title"><i class="bi bi-telephone form-title icons"></i> Kontaktdaten</div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">E-Mail<span class="stars">*</span></label>
          <input v-model="customer.email" type="text" class="inputs" required />
        </div>
        <div class="form-group">
          <label class="form-label">Telefonnummer<span class="stars">*</span></label>
          <input v-model="customer.phone" type="text" class="inputs" required />
        </div>
      </div>
    </section>

    <section class="sections">
      <div class="sections-title">
        <i class="bi bi-file-earmark-text form-title icons"></i> Steuerinformationen
      </div>
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
    </section>

    <section class="sections btn-container">
      <button type="button" class="btn btn-update" @click="updateCustomer">
        <i class="bi bi-save icons"></i> Aktualisierung
      </button>
    </section>
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
        const data = {
          id: this.$route.params.id,
          table_name: 'customers'
        }
        const result = await window.api.getCustomerById(data)
        if (!result.success) return
        this.customer = result.rows
      } catch (error) {
        console.error(error)
      }
    },

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

      if (!/^\d{5}$/.test(c.postal_code)) return 'Postleitzahl muss aus 5 Ziffern bestehen.'

      if (!c.city || c.city.length < 2) return 'Stadt muss mindestens 2 Zeichen enthalten.'

      if (!c.country || c.country.length < 2) return 'Land muss mindestens 2 Zeichen enthalten.'

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(c.email)) return 'Ungültige E-Mail-Adresse.'

      if (!/^\+?\d{3,}$/.test(c.phone)) return 'Telefonnummer muss mindestens 3 Zahlen enthalten.'

      if (!c.tax_number || c.tax_number.length < 3)
        return 'Steuernummer muss mindestens 3 Zeichen enthalten.'

      if (!c.vat_id || c.vat_id.length < 3) return 'USt-ID muss mindestens 3 Zeichen enthalten.'

      return null
    },

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
