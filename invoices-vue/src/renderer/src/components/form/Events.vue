<template lang="">
  <div>
    <!-- small company -->
    <div class="form-section">
      <div class="form-section-title">
        <span>👤 Kleinunternehmer</span>
        <label for="kleinunternehmer-checkbox" class="switch">
          <input
            id="kleinunternehmer-checkbox"
            v-model="events.is_small_company"
            type="checkbox"
            class="switch-checkbox"
            @change="reCalculateTotal(events.is_small_company, 'is_small_company')"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <!-- reverse charge -->
    <div class="form-section">
      <div class="form-section-title">
        <span>👤 Umkehrung der Steuerschuldnerschaft</span>
        <label for="reverse_charge-checkbox" class="switch">
          <input
            id="reverse_charge-checkbox"
            v-model="events.is_reverse_charge"
            type="checkbox"
            class="switch-checkbox"
            @change="reCalculateTotal(events.is_reverse_charge, 'is_reverse_charge')"
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
            v-model.number="events.payment.paid_amount"
            type="number"
            class="form-input"
            step="0.01"
            @input="getPaymentTerms()"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Zahlungsziel (Tage)</label>
          <input
            v-model.number="events.payment.payment_terms"
            type="number"
            class="form-input"
            @input="getPaymentTerms()"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Zahlungsbedingungen / Payment Terms</label>
        <textarea
          v-model="events.payment.payment_conditions"
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
        <select v-model="events.currency" class="form-input" @change="getCurrency()">
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
    <div v-if="events.positions && events.positions.length === 0">Keine Positionen vorhanden</div>
    <div v-else class="positions-editor">
      <div v-for="(pos, index) in events.positions" :key="index" class="position-item">
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
            <select
              v-if="!events.is_small_company && !events.is_reverse_charge"
              v-model.number="pos.vat"
              class="form-input"
              @change="getUnitTotal(pos.quantity, pos.price, index)"
            >
              <option :value="0">0</option>
              <option :value="7">7</option>
              <option :value="19">19</option>
            </select>
          </div>
        </div>
        <div class="form-result">
          <div>
            <label class="form-label">Vat Unit (€)</label>
            <div class="form-result-item">
              {{ pos.vat_unit }}
            </div>
          </div>
          <div>
            <label class="form-label">Unit Total (€)</label>
            <div class="form-result-item">{{ pos.unit_total }}</div>
          </div>
        </div>
      </div>
    </div>
    <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
  </div>
</template>
<script>
export default {
  name: 'Events',
  props: {
    storeName: {
      type: String,
      required: true
    }
  },
  emits: ['get-events'],
  data() {
    return {
      events: {
        positions: [
          {
            title: 'Neue Position',
            description: 'Beschreibung',
            service_period_start: '',
            service_period_end: '',
            quantity: 1,
            unit: 'Stk',
            price: 0,
            vat: 19,
            vat_unit: 0,
            unit_total: 0
          }
        ],
        is_small_company: false,
        is_reverse_charge: false,
        currency: 'EUR.de-DE',
        payment: {
          paid_amount: 0,
          payment_terms: 0,
          payment_conditions: ''
        }
      }
    }
  },
  mounted() {
    if (this.$store.state[this.storeName] && this.$store.state[this.storeName].events) {
      this.events = this.$store.state[this.storeName].events
    } else {
      return this.events
    }
  },
  methods: {
    reCalculateTotal(value, input) {
      if (input === 'is_small_company') {
        this.events.is_reverse_charge = false
      }
      if (input === 'is_reverse_charge') {
        this.events.is_small_company = false
      }
      if (value) {
        this.events.positions.map((item, index) => {
          this.events.positions[index].unit_total = (item.quantity * item.price).toFixed(2)
          this.events.positions[index].vat_unit = 0
        })
      } else {
        this.events.positions.map((item, index) => {
          this.events.positions[index].unit_total = (
            item.quantity *
            item.price *
            (1 + item.vat / 100)
          ).toFixed(2)
          this.events.positions[index].vat_unit = (
            item.quantity *
            item.price *
            (item.vat / 100)
          ).toFixed(2)
        })
      }
    },
    getReverseCharge() {
      console.log(this.events.is_reverse_charge)
    },
    getCurrency() {
      console.log(this.events.currency)
    },
    addPosition() {
      this.events.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        service_period_start: '',
        service_period_end: '',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19,
        unit_total: 0
      })
      this.$emit('get-events', this.events)
    },
    deletePosition(index) {
      if (this.events.positions.length > 0) {
        this.events.positions.splice(index, 1)
        this.$emit('get-events', this.events.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.events.positions[index].vat || 0
      const base = quantity * price
      const total =
        this.events.is_small_company || this.events.is_reverse_charge
          ? base
          : base * (1 + vat / 100)

      this.events.positions[index].unit_total = total.toFixed(2)
      this.events.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
    }
  }
}
</script>
<style lang=""></style>
