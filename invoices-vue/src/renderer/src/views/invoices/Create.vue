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
            <label class="form-label">Rechnungs-Nr.</label>
            <input v-model="base.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Datum</label>
            <input v-model="base.date" type="date" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Leistungszeitraum</label>
          <input v-model="base.servicePeriod" type="text" class="form-input" />
        </div>
      </div>

      <div class="form-section">
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
          <input v-model="selectedCustomer.id" type="text" class="form-input" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input :value="companyName" type="text" class="form-input" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Adresse</label>
          <input v-model="selectedCustomer.address" type="text" class="form-input" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ</label>
            <input v-model="selectedCustomer.postal_code" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input v-model="selectedCustomer.city" type="text" class="form-input" readonly />
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">👤 Sprachpartner (Optional)</div>

        <div class="form-group">
          <label class="form-label">Sprachpartner Vollname</label>
          <input v-model="sprachPartner.fullname" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="sprachPartner.email" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Tel</label>
          <input v-model="sprachPartner.phone" type="text" class="form-input" />
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="base.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in base.positions" :key="index" class="position-item">
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
            <input v-model.number="base.paidAmount" type="number" class="form-input" step="0.01" />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="base.paymentTerms" type="number" class="form-input" />
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
      title: 'Rechnung erstellen',
      customers: [],
      customerList: 'Wähle Kunden',
      selectedCustomer: {},
      base: {
        id: 1,
        date: '',
        servicePeriod: 'Okt - Dez 2024',
        verwendung: 'Nicht angegeben',
        paidAmount: 0,
        paymentTerms: 14,
        positions: []
      },
      sprachPartner: {
        fullname: '',
        email: '',
        phone: ''
      }
    }
  },
  computed: {
    subtotal() {
      return this.base.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.base.positions.reduce((sum, p) => sum + (p.quantity * p.price * p.vat) / 100, 0)
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.base.paidAmount
    },
    companyName() {
      return (
        this.selectedCustomer.company_name ||
        [this.selectedCustomer.first_name, this.selectedCustomer.last_name]
          .filter(Boolean)
          .join(' ')
      )
    }
  },
  mounted() {
    if (this.$store?.state?.invoicePreview) {
      const preview = this.$store.state.invoicePreview
      if (preview.base?.positions) this.base.positions = preview.base.positions
      if (preview.customer) this.selectedCustomer = { ...preview.customer }
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
      if (customer) this.selectedCustomer = { ...customer }
    },
    addPosition() {
      this.base.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      this.$store.commit('setInvoicePreview', this.base.positions)
    },
    deletePosition(index) {
      if (this.base.positions.length > 0) {
        this.base.positions.splice(index, 1)
        this.$store.commit('setInvoicePreview', this.base.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    async storePreview() {
      try {
        this.base.positions = this.base.positions.map((pos) => ({
          ...pos,
          unit_total: parseFloat((pos.quantity * pos.price * (1 + pos.vat / 100)).toFixed(2))
        }))

        await this.$store.commit('setInvoicePreview', {
          customer: { ...this.selectedCustomer, company_name: this.companyName },
          base: {
            id: this.base.id,
            date: this.base.date,
            service_period: this.base.servicePeriod,
            paid_amount: this.base.paidAmount,
            payment_terms: this.base.paymentTerms,
            verwendung: this.base.verwendung,
            positions: this.base.positions,
            subtotal: this.subtotal.toFixed(2),
            vat_amount: this.vatAmount.toFixed(2),
            total: this.grandTotal.toFixed(2),
            outstanding: this.outstanding.toFixed(2)
          },
          sprach_partner: this.sprachPartner
        })

        this.$router.push('/invoices-preview')
      } catch (error) {
        console.error('Error storing invoice preview:', error)
      }
    }
  }
}
</script>
