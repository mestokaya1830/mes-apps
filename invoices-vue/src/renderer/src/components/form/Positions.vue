<template lang="">
  <div>
    <!-- small company -->
    <div class="form-section">
      <div class="form-section-title">
        <span>👤 Kleinunternehmer</span>
        <label for="kleinunternehmer-checkbox" class="switch">
          <input
            id="kleinunternehmer-checkbox"
            v-model="is_small_company"
            type="checkbox"
            class="switch-checkbox"
            @change="getSmallCompany()"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <!-- reverse charge -->
    <div class="form-section">
      <div class="form-section-title">
        <span>👤 Umkehrung der Steuerschuldnerschaft</span>
        <label for="kleinunternehmer-checkbox" class="switch">
          <input
            id="kleinunternehmer-checkbox"
            v-model="is_reverse_charge"
            type="checkbox"
            class="switch-checkbox"
            @change="getReverseCharge()"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </div>

    <!-- payment terms -->
    <div class="form-section">
      <div class="form-section-title">💳 Zahlungsinformationen</div>
      <div v-if="storeName === 'invoicesPreview'" class="form-row">
        <div class="form-group">
          <label class="form-label">Anzahlung (bereits bezahlt)</label>
          <input
            v-model.number="payment.paid_amount"
            type="number"
            class="form-input"
            step="0.01"
            @input="getPaymentTerms()"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Zahlungsziel (Tage)</label>
          <input
            v-model.number="payment.payment_terms"
            type="number"
            class="form-input"
            @input="getPaymentTerms()"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Zahlungsbedingungen / Payment Terms</label>
        <textarea
          v-model="payment.payment_conditions"
          class="form-input payment-terms"
          placeholder="50 % Anzahlung bei Auftragserteilung, Restzahlung nach Abschluss. / 50% upfront, balance upon completion."
          @input="getPaymentTerms()"
        ></textarea>
      </div>
    </div>

    <!-- currency -->
    <div class="form-section">
      <div class="form-section-title">💰 Währung</div>
      <div class="form-group">
        <label class="form-label">Waehrung</label>
        <select v-model="currency" class="form-input" @change="getCurrency()">
          <option selected disabled>Wähle Waehrung</option>
          <option value="EUR.de-DE">EUR</option>
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
    <!-- positions -->
    <div class="form-section-title">📦 Positionen</div>
    <div v-if="positions && positions.length === 0">Keine Positionen vorhanden</div>
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
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Von</label>
            <input v-model="pos.service_period_start" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungszeitraum Bis</label>
            <input v-model="pos.service_period_end" type="date" class="form-input" />
          </div>
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
            <input
              v-model.number="pos.price"
              type="number"
              class="form-input"
              step="0.01"
              @input="getUnitTotal(pos.quantity, pos.price, index)"
            />
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
        <div class="form-group">
          <label class="form-label">Unit Total (€)</label>
          <input
            v-model.number="pos.unit_total"
            type="number"
            class="form-input"
            step="0.01"
            readonly
          />
        </div>
      </div>
    </div>
    <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
  </div>
</template>
<script>
export default {
  name: 'Positions',
  props: {
    storeName: {
      type: String,
      required: true
    }
  },
  emits: ['get-positions'],
  data() {
    return {
      positions: [],
      is_small_company: false,
      is_reverse_charge: false,
      currency: 'Wähle Waehrung',
      payment: {
        paid_amount: 0,
        payment_terms: 0,
        payment_conditions: ''
      }
    }
  },
  computed: {
    subtotal() {
      return this.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.positions.reduce((sum, p) => sum + (p.quantity * p.price * p.vat) / 100, 0)
    },
    total() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.total - this.payment.paid_amount
    }
  },
  mounted() {
    if (this.$store.state[this.storeName] && this.$store.state[this.storeName].positions) {
      this.positions = this.$store.state[this.storeName].positions
    } else {
      return this.positions
    }
  },
  methods: {
    getSmallCompany() {
      console.log(this.is_small_company)
    },
    getReverseCharge() {
      console.log(this.is_reverse_charge)
    },
    getCurrency() {
      console.log(this.currency)
    },
    addPosition() {
      this.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19,
        unit_total: 0
      })
      this.$emit('get-positions', this.positions)
    },
    deletePosition(index) {
      if (this.positions.length > 0) {
        this.positions.splice(index, 1)
        this.$emit('get-positions', this.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.positions[index].vat || 0
      const base = quantity * price
      const total = this.is_small_company || this.is_reverse_charge ? base : base * (1 + vat / 100)

      this.positions[index].unit_total = total.toFixed(2)
      console.log(this.positions)
    }
  }
}
</script>
<style lang=""></style>
