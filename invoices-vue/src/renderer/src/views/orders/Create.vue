<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Rechnung und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- base -->
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

      <!-- customer -->
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
        <div v-if="order.selected_customer && order.selected_customer.id">
          <div class="form-group">
            <label class="form-label">Kunden-Nr.</label>
            <input v-model="order.selected_customer.id" type="text" class="form-input" readonly />
          </div>
          <div v-if="order.selected_customer.company_name" class="form-group">
            <label class="form-label">Firmname</label>
            <input
              v-model="order.selected_customer.company_name"
              type="text"
              class="form-input"
              readonly
            />
          </div>
          <div v-if="order.selected_customer.first_name" class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname</label>
              <input
                v-model="order.selected_customer.first_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname</label>
              <input
                v-model="order.selected_customer.last_name"
                type="text"
                class="form-input"
                readonly
              />
            </div>
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
              <input
                v-model="order.selected_customer.city"
                type="text"
                class="form-input"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- contact person -->
      <div v-if="order.contact_person" class="form-section">
        <div class="form-section-title">👤 Sprachpartner (Optional)</div>

        <div class="form-group">
          <label class="form-label">Sprachpartner Vollname</label>
          <input v-model="order.contact_person.full_name" type="text" class="form-input" />
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

      <!-- currency -->
      <div class="form-section">
        <div class="form-section-title">💰 Währung</div>
        <div class="form-group">
          <label class="form-label">Waehrung</label>
          <select v-model="order.currency" class="form-input">
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
      <!-- payment terms -->
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

      <!-- positions -->
      <Positions store-name="orderPreview" store-commit="setOrderPreview" store-link="orders" />
    </div>
  </div>
</template>

<script>
import Positions from '../../components/Positions.vue'
export default {
  name: 'CreateOrder',
  components: {
    Positions
  },
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
  mounted() {
    if (this.$store?.state?.orderPreview) {
      const preview = this.$store.state.orderPreview
      if (preview) this.order = preview
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
    }
  }
}
</script>
