<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Angebotsdetails und sehen Sie die Vorschau live
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">📌 Abgebot Title</div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input v-model="offer.title" type="text" class="form-input" />
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Angebotsnummer</label>
            <input v-model="offer.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Angebotsdatum</label>
            <input v-model="offer.date" type="date" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Leistungszeitraum</label>
          <input v-model="offer.service_period" type="text" class="form-input" />
        </div>
      </div>

      <div v-if="offer.selected_customer || offer.customers" class="form-section">
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
          <label class="form-label">KundeNr.</label>
          <input v-model="offer.selected_customer.id" type="text" class="form-input" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input :value="companyName" type="text" class="form-input" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Adresse</label>
          <input
            v-model="offer.selected_customer.address"
            type="text"
            class="form-input"
            readonly
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ</label>
            <input
              v-model="offer.selected_customer.postal_code"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input v-model="offer.selected_customer.city" type="text" class="form-input" readonly />
          </div>
        </div>
      </div>

      <div v-if="offer.contact_person" class="form-section">
        <div class="form-section-title">👤 Sprachpartner (Optional)</div>

        <div class="form-group">
          <label class="form-label">Sprachpartner Vollname</label>
          <input v-model="offer.contact_person.full_name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="offer.contact_person.email" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Tel</label>
          <input v-model="offer.contact_person.phone" type="text" class="form-input" />
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">
          <span>👤 Rechtsgültigkeit</span>
          <label for="rechtsgültigkeit-checkbox" class="switch">
            <input
              id="rechtsgültigkeit-checkbox"
              v-model="offer.is_legal_validity"
              type="checkbox"
              class="switch-checkbox"
            />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="offer.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in offer.positions" :key="index" class="position-item">
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
              v-model.number="offer.paid_amount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="offer.payment_terms" type="number" class="form-input" />
          </div>
        </div>
      </div>

      <button class="back-btn" @click="storePreview">Preview</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateOffer',
  data() {
    return {
      title: 'Angebot erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      offer: {
        title: 'Mein erstes Angebot',
        id: '1',
        date: '2024-12-15',
        service_period: 'Okt - Dez 2024',
        paid_amount: 0,
        payment_terms: 14,
        is_legal_validity: false,
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
      return this.offer.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.offer.positions.reduce((sum, p) => sum + (p.quantity * p.price * p.vat) / 100, 0)
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.offer.paid_amount
    },
    companyName() {
      return (
        this.offer.selected_customer.company_name ||
        [this.offer.selected_customer.first_name, this.offer.selected_customer.last_name]
          .filter(Boolean)
          .join(' ')
      )
    }
  },
  mounted() {
    if (this.$store?.state?.offerPreview) {
      const preview = this.$store.state.offerPreview
      if (preview) this.offer = { ...preview }
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
      if (customer) this.offer.selected_customer = { ...customer }
    },
    addPosition() {
      this.offer.positions.push({
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      this.$store.commit('setOfferPreview', this.offer.positions)
    },
    deletePosition(index) {
      if (this.offer.positions.length > 0) {
        this.offer.positions.splice(index, 1)
        this.$store.commit('setOfferPreview', this.offer.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    async storePreview() {
      try {
        this.offer.positions = this.offer.positions.map((pos) => ({
          ...pos,
          unit_total: parseFloat((pos.quantity * pos.price * (1 + pos.vat / 100)).toFixed(2))
        }))

        await this.$store.commit('setOfferPreview', {
          title: this.offer.title,
          id: this.offer.id,
          date: this.offer.date,
          valid_days: 20,
          service_period: this.offer.service_period,
          paid_amount: this.offer.paid_amount,
          payment_terms: this.offer.payment_terms,
          is_legal_validity: this.offer.is_legal_validity,
          verwendung: this.offer.verwendung,
          positions: this.offer.positions,
          subtotal: this.subtotal.toFixed(2),
          vat_amount: this.vatAmount.toFixed(2),
          total: this.grandTotal.toFixed(2),
          outstanding: this.outstanding.toFixed(2),
          contact_person: { ...this.offer.contact_person },
          selected_customer: { ...this.offer.selected_customer, company_name: this.companyName }
        })

        this.$router.push('/offers-preview')
      } catch (error) {
        console.error('Error storing offer preview:', error)
      }
    }
  }
}
</script>
