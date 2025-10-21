<template lang="">
  <div>
    <div class="form-section">
      <div class="form-section-title">📦 Positionen</div>
      <div v-if="global.positions && global.positions.length === 0">Keine Positionen vorhanden</div>
      <div v-else class="positions-editor">
        <div v-for="(pos, index) in global.positions" :key="index" class="position-item">
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

      <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
    </div>
    <button class="back-btn" @click="storePreview">Preview</button>
  </div>
</template>
<script>
export default {
  name: 'Positions',
  props: {
    storeName: {
      type: String,
      required: true
    },
    storeCommit: {
      type: String,
      required: true
    },
    storeLink: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      global: {}
    }
  },
  computed: {
    subtotal() {
      return this.global.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.global.positions.reduce((sum, p) => sum + (p.quantity * p.price * p.vat) / 100, 0)
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.global.paid_amount
    }
  },
  mounted() {
    console.log(this.$store.state[this.storeName])
    if (this.$store.state[this.storeName]) {
      const preview = this.$store.state[this.storeName]
      if (preview) this.global = preview
    } else {
      return this.global
    }
  },
  methods: {
    addPosition() {
      this.global.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      this.$store.commit(this.storeCommit, this.global.positions)
    },
    deletePosition(index) {
      if (this.global.positions.length > 0) {
        this.global.positions.splice(index, 1)
        this.$store.commit(this.storeString, this.global.positions)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    async storePreview() {
      try {
        this.global.positions = this.global.positions.map((pos) => ({
          ...pos,
          unit_total: parseFloat((pos.quantity * pos.price * (1 + pos.vat / 100)).toFixed(2))
        }))

        await this.$store.commit(this.storeCommit, {
          id: this.global.id,
          date: this.global.date,
          service_period: this.global.service_period,
          paid_amount: this.global.paid_amount,
          payment_terms: this.global.payment_terms,
          verwendung: this.global.verwendung,
          is_small_company: this.global.is_small_company,
          positions: this.global.positions,
          subtotal: this.subtotal.toFixed(2),
          vat_amount: this.vatAmount.toFixed(2),
          total: this.grandTotal.toFixed(2),
          outstanding: this.outstanding.toFixed(2),
          currency: this.global.currency,
          selected_customer: { ...this.global.selected_customer },
          contact_person: { ...this.global.contact_person }
        })
        this.$router.push(`/${this.storeLink}-preview`)
      } catch (error) {
        console.error('Error storing invoice preview:', error)
      }
    }
  }
}
</script>
<style lang=""></style>
