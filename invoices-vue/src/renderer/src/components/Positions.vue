<template lang="">
  <div>
    <div class="form-section">
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
      positions: []
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
    addPosition() {
      this.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
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
    }
  }
}
</script>
<style lang=""></style>
