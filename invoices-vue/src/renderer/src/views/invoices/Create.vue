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
            <input v-model="invoice.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Datum</label>
            <input v-model="invoice.date" type="date" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Leistungszeitraum</label>
          <input v-model="invoice.service_period" type="text" class="form-input" />
        </div>
      </div>

      <div v-if="customers" class="form-section">
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
        <div v-if="invoice.selected_customer && invoice.selected_customer.id">
          <div class="form-group">
            <label class="form-label">Kunden-Nr.</label>
            <input v-model="invoice.selected_customer.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Name</label>
            <input :value="companyName" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input
              v-model="invoice.selected_customer.address"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ</label>
              <input
                v-model="invoice.selected_customer.postal_code"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt</label>
              <input
                v-model="invoice.selected_customer.city"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="invoice.contact_person" class="form-section">
        <div class="form-section-title">👤 Sprachpartner (Optional)</div>

        <div class="form-group">
          <label class="form-label">Sprachpartner Vollname</label>
          <input v-model="invoice.contact_person.full_name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="invoice.contact_person.email" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Tel</label>
          <input v-model="invoice.contact_person.phone" type="text" class="form-input" />
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">
          <span>👤 Kleinunternehmer</span>
          <label for="kleinunternehmer-checkbox" class="switch">
            <input
              id="kleinunternehmer-checkbox"
              v-model="invoice.is_small_company"
              type="checkbox"
              class="switch-checkbox"
            />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">💰 Währung</div>
        <div class="form-group">
          <label class="form-label">Waehrung</label>
          <select v-model="invoice.currency" class="form-input">
            <option value="EUR.de-DE" selected>EUR</option>
            <option value="USD.en-US">USD</option>
            <option value="GBP.en-GB">GBP</option>
            <option value="CHF.ch-CH">CHF</option>
            <option value="JPY.ja-JP">JPY</option>
            <option value="AUD.en-AU">AUD</option>
            <option value="CAD.en-CA">CAD</option>
            <option value="CNY.zh-CN">CNY</option>
            <option value="SEK.sv-SE">SEK</option>
            <option value="NZD.en-NZ">NZD</option>
          </select>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="invoice.positions && invoice.positions.length === 0">
          Keine Positionen vorhanden
        </div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in invoice.positions" :key="index" class="position-item">
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
              v-model.number="invoice.paid_amount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="invoice.payment_terms" type="number" class="form-input" />
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
      invoice: {
        id: 1,
        date: '',
        service_period: 'Okt - Dez 2024',
        verwendung: 'Nicht angegeben',
        paid_amount: 0,
        payment_terms: 14,
        is_small_company: false,
        positions: [],
        country: 'Deutschland',
        currency: 'EUR.de-DE',
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
      return this.invoice.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.invoice.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.invoice.paid_amount
    },
    companyName() {
      return (
        this.invoice.selected_customer.company_name ||
        [this.invoice.selected_customer.first_name, this.invoice.selected_customer.last_name]
          .filter(Boolean)
          .join(' ')
      )
    }
  },

  mounted() {
    if (this.$store?.state?.invoicePreview) {
      const preview = this.$store.state.invoicePreview
      if (preview && preview.positions) this.invoice = preview
    } else {
      return this.invoice
    }
    console.log(this.invoice)
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
      if (customer) this.invoice.selected_customer = { ...customer }
    },
    addPosition() {
      this.invoice.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      this.$store.commit('setInvoicePreview', this.invoice.positions)
    },
    deletePosition(index) {
      if (this.invoice.positions.length > 0) {
        this.invoice.positions.splice(index, 1)
        this.$store.commit('setInvoicePreview', this.invoice.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    async storePreview() {
      try {
        this.invoice.positions = this.invoice.positions.map((pos) => ({
          ...pos,
          unit_total: parseFloat((pos.quantity * pos.price * (1 + pos.vat / 100)).toFixed(2))
        }))

        await this.$store.commit('setInvoicePreview', {
          id: this.invoice.id,
          date: this.invoice.date,
          service_period: this.invoice.service_period,
          paid_amount: this.invoice.paid_amount,
          payment_terms: this.invoice.payment_terms,
          verwendung: this.invoice.verwendung,
          is_small_company: this.invoice.is_small_company,
          positions: this.invoice.positions,
          subtotal: this.subtotal.toFixed(2),
          vat_amount: this.vatAmount.toFixed(2),
          total: this.grandTotal.toFixed(2),
          outstanding: this.outstanding.toFixed(2),
          currency: this.invoice.currency,
          selected_customer: { ...this.invoice.selected_customer, company_name: this.companyName },
          contact_person: { ...this.invoice.contact_person }
        })
        this.$router.push('/invoices-preview')
      } catch (error) {
        console.error('Error storing invoice preview:', error)
      }
    }
  }
}
</script>
