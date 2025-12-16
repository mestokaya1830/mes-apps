<template>
  <div>
    <div v-if="offer" class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝 {{ title }}</div>
        <div class="editor-subtitle">
          Bearbeiten Sie das Angebot und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- Base -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-group">
          <label class="form-label">Angebotsnummer <span class="stars">*</span></label>
          <input v-model="offer.id" type="text" class="form-input" readonly />
          <small class="form-hint">Format: AN-YYYY-XXXX (automatisch generiert)</small>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Angebotsdatum <span class="stars">*</span></label>
            <input
              ref="date"
              v-model="offer.date"
              type="date"
              class="form-input date"
              required
              @input="error.date = ''"
            />
            <div v-if="error.date" class="error">{{ error.date }}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Gültigkeitsdatum <span class="stars">*</span></label>
            <input
              ref="valid_until"
              v-model="offer.valid_until"
              type="date"
              class="form-input date"
              required
              @input="error.valid_until = ''"
            />
            <div v-if="error.valid_until" class="error">{{ error.valid_until }}</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Betreff / Beschreibung</label>
          <input
            v-model="offer.subject"
            type="text"
            class="form-input"
            placeholder="z.B. Webentwicklung Projekt XYZ"
          />
        </div>
      </div>

      <!-- status -->
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">Status</label>
          <select v-model="offer.status" class="form-input">
            <option value="draft">Entwurf</option>
            <option value="sent">Gesendet</option>
            <option value="accepted">Angenommen</option>
            <option value="rejected">Abgelehnt</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Status geändert von</label>
          <input
            v-model="offer.status_by"
            type="text"
            class="form-input"
            placeholder="z. B. Max Mustermann"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Statuskommentar</label>
          <textarea
            v-model="offer.status_comments"
            class="form-input"
            rows="2"
            placeholder="Interne Anmerkung zum Status"
          ></textarea>
        </div>
      </div>

      <!-- Customer -->
      <div v-if="offer.customer" class="form-section">
        <div class="form-section-title">👤 Kundendaten</div>
        <div v-if="offer.customer?.id" class="customer-details">
          <div class="form-group">
            <label class="form-label">Kunden-Nr. <span class="stars">*</span></label>
            <input v-model="offer.customer.id" type="text" class="form-input" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Firmname <span class="stars">*</span></label>
            <input v-model="offer.customer.company_name" type="text" class="form-input" readonly />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vorname <span class="stars">*</span></label>
              <input v-model="offer.customer.first_name" type="text" class="form-input" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Nachname <span class="stars">*</span></label>
              <input v-model="offer.customer.last_name" type="text" class="form-input" readonly />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse <span class="stars">*</span></label>
            <input v-model="offer.customer.address" type="text" class="form-input" readonly />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">PLZ <span class="stars">*</span></label>
              <input v-model="offer.customer.postal_code" type="text" class="form-input" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Stadt <span class="stars">*</span></label>
              <input v-model="offer.customer.city" type="text" class="form-input" readonly />
            </div>
          </div>
        </div>
      </div>

      <!-- currency -->
      <div class="form-section">
        <div class="form-section-title">💰 Währung</div>
        <div class="form-group">
          <select v-model="offer.currency" class="form-input">
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

      <!-- Positionen -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>
        <div v-if="offer.positions && offer.positions.length === 0">Keine Positionen vorhanden</div>
        <div v-else class="positions-editor">
          <div v-for="(pos, index) in offer.positions" :key="index" class="position-item">
            <div class="positions-header">
              <span class="position-number">Position {{ index + 1 }}</span>
              <button class="delete-position-btn" @click="deletePosition(index)">🗑️ Löschen</button>
            </div>
            <div class="form-group">
              <label class="form-label">Bezeichnung</label>
              <input v-model="pos.title" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Beschreibung</label>
              <input v-model="pos.description" type="text" class="form-input" />
            </div>
            <div class="form-row form-row-4">
              <div class="form-group">
                <label class="form-label">Einheit</label>
                <select v-model="pos.unit" class="form-input">
                  <option value="Stk">Stk</option>
                  <option value="Std">Std</option>
                  <option value="Tag">Tag</option>
                  <option value="Monat">Monat</option>
                  <option value="Pauschal">Pauschal</option>
                  <option value="m²">m²</option>
                  <option value="kg">kg</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Menge</label>
                <input
                  v-model.number="pos.quantity"
                  type="number"
                  class="form-input"
                  @input="getUnitTotal(pos.quantity, pos.price, index)"
                />
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
            <div class="positions-total">
              <div class="positions-total-item">
                <label class="form-label">Vat Unit (€)</label>
                <div class="form-result-item">
                  {{ pos.vat_unit || '0.00' }}
                </div>
              </div>
              <div class="positions-total-item">
                <label class="form-label">Unit Total (€)</label>
                <div class="form-result-item">{{ pos.unit_total || '0.00' }}</div>
              </div>
            </div>
          </div>
        </div>
        <button class="add-position-btn" @click="addPosition()">➕ Position hinzufügen</button>
      </div>

      <!-- Zusätzliche Informationen -->
      <div class="form-section">
        <div class="form-section-title">📄 Zusätzliche Informationen</div>

        <div class="form-group">
          <label class="form-label">Zahlungsbedingungen</label>
          <textarea
            v-model="offer.payment_terms"
            class="form-input"
            rows="2"
            placeholder="z. B. 14 Tage netto, 2 % Skonto bei Zahlung innerhalb 8 Tagen"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Lieferbedingungen</label>
          <textarea
            v-model="offer.delivery_terms"
            class="form-input"
            rows="2"
            placeholder="z. B. frei Haus, ab Werk, DAP, EXW unserer Niederlassung in Berlin"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Lieferzeit</label>
          <input v-model="offer.delivery_time" type="date" class="form-input date" />
        </div>

        <div class="form-group">
          <label class="form-label">Einleitungstext</label>
          <textarea
            v-model="offer.introduction_text"
            class="form-input"
            rows="3"
            placeholder="Vielen Dank für Ihre Anfrage vom XX.XX.XXXX. Gerne unterbreiten wir Ihnen nachfolgend unser Angebot…"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Abschlusstext</label>
          <textarea
            v-model="offer.closing_text"
            class="form-input"
            rows="3"
            placeholder="Wir freuen uns auf Ihre Rückmeldung und stehen bei Rückfragen jederzeit gerne zur Verfügung. Mit freundlichen Grüßen"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Notizen (für Kunden sichtbar)</label>
          <textarea
            v-model="offer.notes"
            class="form-input"
            rows="3"
            placeholder="z. B. Preise verstehen sich zzgl. gesetzlicher MwSt. • Gültigkeit des Angebots: 30 Tage"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Interne Notizen</label>
          <textarea
            v-model="offer.internal_notes"
            class="form-input"
            rows="3"
            placeholder="z. B. Kunde wünscht Expressversand • Rabatt nur bei Vorkasse • Material aktuell knapp"
          ></textarea>
        </div>
      </div>

      <!-- Legally Binding -->
      <div class="switch-container">
        <label for="is_legal" class="switch">
          <input id="is_legal" v-model="offer.is_legal" type="checkbox" />
          <span class="slider round"></span>
        </label>
        <div class="switch-text">
          <strong>Legally binding signature</strong>
        </div>
      </div>

      <!-- Vorschau Button -->
      <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
    </div>
  </div>
</template>

<script>
import store from '../../store/store.js'
export default {
  name: 'CreateOffer',
  inject: ['formatCurrency', 'checkServiceDates'],
  data() {
    return {
      title: 'Angebot erstellen',
      error: {},
      offer: {
        id: 0,
        customer_id: 0, //for foreing key

        date: '',
        valid_until: '',

        customer: null,

        subject: '',
        currency: 'EUR.de-DE',
        payment_terms: '',
        delivery_terms: '',
        delivery_time: '',

        introduction_text: '',
        closing_text: '',
        notes: '',
        internal_notes: '',

        status: 'draft',
        status_by: '',
        status_comments: '',

        is_active: 1,
        is_legal: 0,

        positions: [],
        net_total: 0,
        vat_total: 0,
        gross_total: 0
      }
    }
  },
  mounted() {
    this.getCustomer()
    this.getStore()
  },
  methods: {
    async getCustomer() {
      if (!this.$route.query.id) return
      try {
        const data = {
          id: this.$route.query.id,
          table_name: 'offers'
        }
        const result = await window.api.getCustomerById(data)
        if (!result.success) return
        this.offer.id = result.data.last_id == 0 ? 1 : result.data.last_id
        this.offer.customer = result.data.customer
        this.offer.customer_id = result.data.customer.id
      } catch (error) {
        console.error(error)
      }
    },
    getStore() {
      if (!store.state.offer) return
      this.offer = JSON.parse(JSON.stringify(store.state.offer))
    },
    addPosition() {
      this.offer.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        unit: 'Stk',
        quantity: 1,
        price: 0,
        vat: 19,
        unit_total: '0.00',
        vat_unit: '0.00'
      })
    },
    deletePosition(index) {
      if (this.offer.positions.length > 0) {
        this.offer.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    getUnitTotal(quantity, price, index) {
      const vat = this.offer.positions[index].vat || 0
      const base = quantity * price
      this.offer.positions[index].unit_total = base.toFixed(2)
      this.offer.positions[index].vat_unit = (base * (vat / 100)).toFixed(2)
    },
    summary() {
      let netTotal = 0
      let vatTotal = 0

      this.offer.positions.forEach((pos) => {
        const unitTotal = parseFloat(pos.unit_total || 0)
        const vatUnit = parseFloat(pos.vat_unit || 0)
        netTotal += unitTotal
        vatTotal += vatUnit
      })

      this.offer.net_total = netTotal.toFixed(2)
      this.offer.vat_total = vatTotal.toFixed(2)
      this.offer.gross_total = (netTotal + vatTotal).toFixed(2)
    },
    async submitStore() {
      if (!this.offer) return
      if (!this.checkServiceDates(this.offer.date, this.offer.valid_until, 'date', 'valid_until'))
        return
      this.summary()
      console.log(this.offer)
      await store.setStore('offer', JSON.parse(JSON.stringify(this.offer)))
      this.$router.push('/offers/preview')
    }
  }
}
</script>
