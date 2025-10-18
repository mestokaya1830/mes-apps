<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Rechnung und sehen Sie die Vorschau live
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rechnungsnummer</label>
            <input v-model="order.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Rechnungsdatum</label>
            <input v-model="order.date" type="date" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Leistungszeitraum</label>
          <input v-model="order.service_period" type="text" class="form-input" />
        </div>
      </div>

      <div v-if="(order && order.selected_customer) || order.customers" class="form-section">
        <div class="form-section-title">👤 Kunde</div>
        <div class="form-group">
          <label class="form-label">Kundendaten</label>
          <select v-model="customerList" class="form-input" @change="getCustomerById">
            <option selected disabled>Wähle Kunden</option>
            <option v-for="item in customers" :key="item.id" :value="item.id">
              {{ item.company_name ? item.company_name : item.first_name + ' ' + item.last_name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Kunden-Nr.</label>
          <input v-model="order.selected_customer.id" type="text" class="form-input" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input :value="companyName" type="text" class="form-input" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Adresse</label>
          <input
            v-model="order.selected_customer.address"
            type="text"
            class="form-input"
            readonly
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ</label>
            <input
              v-model="order.selected_customer.postal_code"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input v-model="order.selected_customer.city" type="text" class="form-input" readonly />
          </div>
        </div>
      </div>

      <div v-if="order.contact_person" class="form-section">
        <div class="form-section-title">👤 Sprachpartner (Optional)</div>
        <div class="form-group">
          <label class="form-label">Sprachpartner Vollname</label>
          <input v-model="order.contact_person.fullname" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="order.contact_person.email" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Tel</label>
          <input v-model="order.contact_person.phone" type="text" class="form-input" />
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="order.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in order.positions" :key="index" class="position-item">
            <div class="position-header">
              <span class="position-number">Position {{ index + 1 }}</span>
              <button class="delete-btn" @click="deletePosition(index)">🗑️ Löschen</button>
            </div>
            <div class="form-group">
              <label class="form-label">Bezeichnung</label>
              <input v-model="pos.title" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Beschreibung</label>
              <input v-model="pos.description" type="text" class="form-input" />
            </div>
            <div class="position-inputs">
              <div class="form-group">
                <label class="form-label">Einheit</label>
                <select v-model="pos.unit" class="form-input">
                  <option>Stk</option>
                  <option>Std</option>
                  <option>Tag</option>
                  <option>Pauschal</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Menge</label>
                <input v-model.number="pos.quantity" type="number" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Preis (€)</label>
                <input v-model.number="pos.price" type="number" class="form-input" step="0.01" />
              </div>
              <div class="form-group">
                <label class="form-label">MwSt. (%)</label>
                <select v-model.number="pos.vat" class="form-input">
                  <option :value="0">0</option>
                  <option :value="7">7</option>
                  <option :value="19">19</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button class="add-position-btn" @click="addPosition">➕ Position hinzufügen</button>
      </div>

      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Anzahlung (bereits bezahlt)</label>
            <input
              v-model.number="order.paid_amount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="order.payment_terms" type="number" class="form-input" />
          </div>
        </div>
      </div>

      <button class="back-btn" @click="storePreview">Preview</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Auftrag erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      order: {
        id: '1',
        date: '',
        service_period: 'Okt - Dez 2024',
        verwendung: 'Nicht angegeben',
        paid_amount: 0,
        payment_terms: 14,
        positions: [],
        selected_customer: {
          id: '',
          company_name: '',
          first_name: '',
          last_name: '',
          address: '',
          postal_code: '',
          city: '',
          country: '',
          email: '',
          phone: '',
          tax_number: '',
          vat_id: ''
        },
        contact_person: {
          full_name: '',
          email: '',
          phone: ''
        }
      }
    }
  },
  computed: {
    subtotal() {
      return this.order.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.order.positions.reduce((sum, p) => sum + (p.quantity * p.price * p.vat) / 100, 0)
    },
    total() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.total - this.order.paid_amount
    },
    formattedDate() {
      const date = new Date(this.order.date)
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    },
    companyName() {
      return (
        this.order.selected_customer.company_name ||
        [this.order.selected_customer.first_name, this.order.selected_customer.last_name]
          .filter(Boolean)
          .join(' ')
      )
    },

    logoSrc() {
      const logo = this.$store.state.auth.logo
      if (!logo) return null
      return `data:image/png;base64,${logo}`
    }
  },
  mounted() {
    if (this.$store?.state?.orderPreview) {
      const preview = this.$store.state.orderPreview
      if (preview) this.order = { ...preview }
    }
    this.getCustomers()
  },
  methods: {
    async getCustomers() {
      try {
        const response = await window.api.getCustomers()
        if (response.success) {
          this.customers = response.customers
        } else {
          console.error('Error fetching customers:', response.message)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    },
    getCustomerById() {
      const customer = this.customers.find((item) => item.id === this.customerList)
      if (customer) this.order.selected_customer = { ...customer }
    },
    addPosition() {
      this.order.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      this.$store.commit('setOrderPreview', this.order.positions)
    },
    deletePosition(index) {
      if (this.order.positions.length > 0) {
        this.order.positions.splice(index, 1)
        this.$store.commit('setOrderPreview', this.order.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },

    async storePreview() {
      try {
        this.order.positions = this.order.positions.map((pos) => ({
          ...pos,
          unit_total: parseFloat((pos.quantity * pos.price * (1 + pos.vat / 100)).toFixed(2))
        }))

        await this.$store.commit('setOrderPreview', {
          id: this.order.id,
          date: this.order.date,
          service_period: this.order.service_period,
          paid_amount: this.order.paid_amount,
          payment_terms: this.order.payment_terms,
          verwendung: this.order.verwendung,
          positions: this.order.positions,
          subtotal: this.subtotal.toFixed(2),
          vat_amount: this.vatAmount.toFixed(2),
          total: this.total.toFixed(2),
          outstanding: this.outstanding.toFixed(2),
          contact_person: { ...this.order.contact_person },
          selected_customer: { ...this.order.selected_customer, company_name: this.companyName }
        })

        this.$router.push('/orders-preview')
      } catch (error) {
        console.error('Error storing order preview:', error)
      }
    }
  }
}
</script>
