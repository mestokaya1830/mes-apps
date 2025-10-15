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
            <input v-model="invoiceGrund.invoiceNumber" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Rechnungsdatum</label>
            <input v-model="invoiceGrund.invoiceDate" type="date" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Leistungszeitraum</label>
          <input v-model="invoiceGrund.servicePeriod" type="text" class="form-input" />
        </div>
      </div>

      <!-- KUNDE -->
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
          <label class="form-label">Kundennummer</label>
          <input v-model="selectedCustomer.tax_number" type="text" class="form-input" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Kundenname</label>
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
      <!-- Sprachpartner -->
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
      <!-- POSITIONEN -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="invoiceGrund.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in invoiceGrund.positions" :key="index" class="position-item">
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
            <input
              v-model.number="invoiceGrund.paidAmount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="invoiceGrund.paymentTerms" type="number" class="form-input" />
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
      customers: [],
      customerList: 'Wähle Kunden',
      selectedCustomer: {},
      invoiceGrund: {
        invoiceNumber: 'RE-2024-001',
        invoiceDate: '2024-12-15',
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
      return this.invoiceGrund.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.invoiceGrund.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.invoiceGrund.paidAmount
    },
    formattedDate() {
      const date = new Date(this.invoiceGrund.invoiceDate)
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
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
      if (preview.invoice_grund?.positions)
        this.invoiceGrund.positions = preview.invoice_grund.positions
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
      this.invoiceGrund.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      this.$store.commit('setInvoicePreview', this.invoiceGrund.positions)
    },
    deletePosition(index) {
      if (this.invoiceGrund.positions.length > 0) {
        this.invoiceGrund.positions.splice(index, 1)
        this.$store.commit('setInvoicePreview', this.invoiceGrund.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    async storePreview() {
      try {
        this.invoiceGrund.positions = this.invoiceGrund.positions.map((pos) => ({
          ...pos,
          unitTotal: (pos.quantity * pos.price).toFixed(2)
        }))

        await this.$store.commit('setInvoicePreview', {
          customer: { ...this.selectedCustomer, company_name: this.companyName },
          invoice_grund: {
            invoice_number: this.invoiceGrund.invoiceNumber,
            invoice_date: this.invoiceGrund.invoiceDate,
            service_period: this.invoiceGrund.servicePeriod,
            paidAmount: this.invoiceGrund.paidAmount,
            paymentTerms: this.invoiceGrund.paymentTerms,
            verwendung: this.invoiceGrund.verwendung,
            positions: this.invoiceGrund.positions,
            subtotal: this.subtotal.toFixed(2),
            vatAmount: this.vatAmount.toFixed(2),
            grandTotal: this.grandTotal.toFixed(2),
            outstanding: this.outstanding.toFixed(2)
          },
          sprach_partner: { ...this.sprachPartner }
        })

        this.$router.push('/invoices-preview')
      } catch (error) {
        console.error('Error storing invoice preview:', error)
      }
    }
  }
}
</script>
