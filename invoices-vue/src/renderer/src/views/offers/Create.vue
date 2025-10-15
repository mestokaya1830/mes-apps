<template>
  <div>
    <!-- EDITOR PANEL -->
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝 Angebot bearbeiten</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Angebotsdetails und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- GRUND DATEN -->
      <div class="form-section">
        <div class="form-section-title">📌 Abgebot Title</div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input v-model="offerGrund.offerTitle" type="text" class="form-input" />
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Angebotsnummer</label>
            <input v-model="offerGrund.offerNumber" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Angebotsdatum</label>
            <input v-model="offerGrund.offerDate" type="date" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Leistungszeitraum</label>
          <input v-model="offerGrund.servicePeriod" type="text" class="form-input" />
        </div>
      </div>

      <!-- KUNDE -->
      <div class="form-section">
        <div class="form-section-title">👤 Kunde</div>
        <div class="form-group">
          <label class="form-label">Kundenname</label>
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
        <div v-if="offerGrund.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in offerGrund.positions" :key="index" class="position-item">
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
              v-model.number="offerGrund.paidAmount"
              type="number"
              class="form-input"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input v-model.number="offerGrund.paymentTerms" type="number" class="form-input" />
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
      sprachPartner: {
        fullname: '',
        email: '',
        phone: ''
      },
      offerGrund: {
        offerTitle: 'Mein erstes Angebot',
        offerNumber: 'ANG-2024-001',
        offerDate: '2024-12-15',
        servicePeriod: 'Okt - Dez 2024',
        paidAmount: 0,
        paymentTerms: 14,
        positions: []
      }
    }
  },
  computed: {
    subtotal() {
      return this.offerGrund.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.offerGrund.positions.reduce(
        (sum, p) => sum + (p.quantity * p.price * p.vat) / 100,
        0
      )
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.offerGrund.paidAmount
    },
    formattedDate() {
      const date = new Date(this.offerGrund.offerDate)
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
    if (this.$store?.state?.offerPreview) {
      const preview = this.$store.state.offerPreview
      if (preview.offer_grund?.positions) this.offerGrund.positions = preview.offer_grund.positions
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
      this.offerGrund.positions.push({
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      this.$store.commit('setOfferPreview', this.offerGrund.positions)
    },
    deletePosition(index) {
      if (this.offerGrund.positions.length > 0) {
        this.offerGrund.positions.splice(index, 1)
        this.$store.commit('setOfferPreview', this.offerGrund.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    async storePreview() {
      try {
        this.offerGrund.positions = this.offerGrund.positions.map((pos) => ({
          ...pos,
          unitTotal: (pos.quantity * pos.price).toFixed(2)
        }))

        await this.$store.commit('setOfferPreview', {
          customer: { ...this.selectedCustomer, company_name: this.companyName },
          offer_grund: {
            offer_title: this.offerGrund.offerTitle,
            offer_number: this.offerGrund.offerNumber,
            offer_date: this.offerGrund.offerDate,
            service_period: this.offerGrund.servicePeriod,
            paidAmount: this.offerGrund.paidAmount,
            paymentTerms: this.offerGrund.paymentTerms,
            verwendung: this.offerGrund.verwendung,
            positions: this.offerGrund.positions,
            subtotal: this.subtotal.toFixed(2),
            vatAmount: this.vatAmount.toFixed(2),
            grandTotal: this.grandTotal.toFixed(2),
            outstanding: this.outstanding.toFixed(2)
          },
          sprach_partner: { ...this.sprachPartner }
        })

        this.$router.push('/offers-preview')
      } catch (error) {
        console.error('Error storing offer preview:', error)
      }
    }
  }
}
</script>
