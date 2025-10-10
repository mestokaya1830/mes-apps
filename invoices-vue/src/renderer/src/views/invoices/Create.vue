<template>
  <div>
    <!-- EDITOR PANEL -->
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝 Rechnung bearbeiten</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Rechnung und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- GRUND DATEN -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rechnungsnummer</label>
            <input v-model="invoiceNumber" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Rechnungsdatum</label>
            <input v-model="invoiceDate" type="date" class="form-input" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Kundennummer</label>
            <input v-model="selectedCustomer.tax_number" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungszeitraum</label>
            <input v-model="servicePeriod" type="text" class="form-input" />
          </div>
        </div>
      </div>

      <!-- KUNDE -->
      <div class="form-section">
        <div class="form-section-title">👤 Kunde</div>
        <div class="form-group">
          <label class="form-label">Kundenname</label>
          <select v-model="customerList" @change="getCustomerById()" class="form-input">
            <option value="Wähle Kunden" selected disabled>Wähle Kunden</option>
            <option v-for="item in customers" :key="item.id" :value="item.id">
              {{ item.company_name ? item.company_name : item.first_name + ' ' + item.last_name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Firma</label>
          <input v-model="setCompany" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Adresse</label>
          <input v-model="selectedCustomer.customer_address" type="text" class="form-input" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ</label>
            <input v-model="selectedCustomer.customer_postal_code" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input v-model="selectedCustomer.customer_city" type="text" class="form-input" />
          </div>
        </div>
      </div>

      <!-- POSITIONEN -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in positions" :key="index" class="position-item">
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

      <!-- ZAHLUNGSINFORMATIONEN -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Anzahlung (bereits bezahlt)</label>
            <input v-model.number="paidAmount" type="number" class="form-input" step="0.01" />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="paymentTerms" type="number" class="form-input" />
          </div>
        </div>
      </div>
      <button class="back-btn" @click="storePreview()">Preview</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customers: [],
      customerList: 'Wähle Kunden',
      selectedCustomer: {},
      invoiceNumber: 'RE-2024-001',
      invoiceDate: '2024-12-15',
      servicePeriod: 'Okt - Dez 2024',
      paidAmount: 0,
      paymentTerms: 14,
      positions: []
    }
  },
  computed: {
    subtotal() {
      return this.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.positions.reduce((sum, p) => sum + (p.quantity * p.price * p.vat) / 100, 0)
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.paidAmount
    },
    formattedDate() {
      const date = new Date(this.invoiceDate)
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    },
    setCompany() {
      return (
        this.selectedCustomer.customer_company_name ||
        this.selectedCustomer.customer_first_name + ' ' + this.selectedCustomer.customer_last_name
      )
    }
  },
  mounted() {
    this.positions = this.$store.state.invoicePositions || []
    if (this.$store.state.invoicePreview !== '') {
      this.selectedCustomer = {
        tax_number: this.$store.state.invoicePreview.customer_tax_number,
        customer_company_name: this.$store.state.invoicePreview.customer_company_name,
        customer_address: this.$store.state.invoicePreview.customer_address,
        customer_postal_code: this.$store.state.invoicePreview.customer_postal_code,
        customer_city: this.$store.state.invoicePreview.customer_city,
        customer_country: this.$store.state.invoicePreview.customer_country
      }
      console.log(this.$store.state.invoicePreview.customer_address)
    }
    this.getCustomers()
  },
  methods: {
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Fetches all customers from the server
     * @returns {Promise<void>} - promise which resolves when the customers are fetched
     */

    /*******  295c00da-b814-4b9d-a6c1-d1d6c9b5480c  *******/
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
      if (customer) {
        this.selectedCustomer = {
          customer_tax_number: customer.tax_number,
          customer_company_name: customer.company_name,
          customer_first_name: customer.first_name,
          customer_last_name: customer.last_name,
          customer_address: customer.address,
          customer_postal_code: customer.postal_code,
          customer_city: customer.city,
          customer_country: customer.country
        }
      }
    },
    addPosition() {
      this.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19,
        unitTotal: this.price * this.quantity
      })
      this.$store.commit('setInvoicePositions', this.positions)
    },
    deletePosition(index) {
      if (this.positions.length > 0) {
        this.positions.splice(index, 1)
        this.$store.commit('setInvoicePositions', this.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
    },
    async storePreview() {
      try {
        this.positions = this.positions.map((pos) => ({
          ...pos,
          unitTotal: (pos.quantity * pos.price).toFixed(2)
        }))
        await this.$store.commit('setInvoicePreview', {
          invoice_number: this.invoiceNumber,
          invoice_date: this.invoiceDate,
          service_period: this.servicePeriod,
          customer_tax_number: this.selectedCustomer.customer_tax_number,
          customer_company_name: this.setCompany,
          customer_address: this.selectedCustomer.customer_address,
          customer_postal_code: this.selectedCustomer.customer_postal_code,
          customer_city: this.selectedCustomer.customer_city,
          customer_country: this.selectedCustomer.customer_country,
          paidAmount: this.paidAmount,
          paymentTerms: this.paymentTerms,
          positions: this.positions,
          subtotal: this.subtotal.toFixed(2),
          vatAmount: this.vatAmount.toFixed(2),
          grandTotal: this.grandTotal.toFixed(2),
          outstanding: this.outstanding.toFixed(2),
          bank: 'Berliner Sparkasse',
          iban: 'DE89 1005 0000 0123 4567 89',
          bic: 'BELADEBEXXX'
        })
        this.$router.push('/invoices-preview')
      } catch (error) {
        console.error('Error storing invoice preview:', error)
      }
    }
  }
}
</script>
<style>
/* EDITOR PANEL */
.editor-panel {
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

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* POSITIONS EDITOR */
.positions-editor {
  margin-top: 24px;
}

.position-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 2px solid #e5e7eb;
  position: relative;
}

.position-item:hover {
  border-color: #10b981;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.position-number {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fecaca;
}

.position-inputs {
  display: grid;
  grid-template-columns: 2fr 80px 100px 120px;
  gap: 8px;
  margin-bottom: 8px;
}

.add-position-btn {
  width: 100%;
  padding: 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-position-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}
</style>
