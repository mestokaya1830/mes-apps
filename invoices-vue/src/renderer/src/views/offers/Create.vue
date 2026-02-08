<template>
  <div v-if="offer" class="main-container">
    <div class="main-header">
      <label>{{ title }}</label>
      <router-link to="/offers" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill me-1 icons"></i>Zurück
      </router-link>
    </div>

    <!-- Grunddaten -->
    <div class="sections">
      <div class="sections-title"><i class="bi bi-pin-angle-fill form-title"></i>Grunddaten</div>
      <div class="form-group">
        <label class="form-label">Angebotsnummer <span class="stars">*</span></label>
        <input v-model="offer.id" type="text" class="inputs" readonly />
        <small class="form-hint">Format: AN-YYYY-XXXX (automatisch generiert)</small>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Angebotsdatum <span class="stars">*</span></label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input
              ref="date"
              v-model="offer.date"
              type="date"
              class="inputs date"
              required
              @input="error.date = ''"
            />
          </div>
          <div v-if="error.date" class="error">{{ error.date }}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Gültigkeitsdatum <span class="stars">*</span></label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input
              ref="valid_until"
              v-model="offer.valid_until"
              type="date"
              class="inputs date"
              required
              @input="error.valid_until = ''"
            />
          </div>
          <div v-if="error.valid_until" class="error">{{ error.valid_until }}</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Betreff / Beschreibung</label>
        <input
          v-model="offer.subject"
          type="text"
          class="inputs"
          placeholder="z.B. Webentwicklung Projekt XYZ"
        />
      </div>
    </div>

    <!-- Kundendaten -->
    <div v-if="offer.customer" class="sections">
      <div class="sections-title">
        <i class="bi bi-person-fill form-title icons"></i>Kundendaten
      </div>
      <div v-if="offer.customer?.id" class="customer-details">
        <div class="form-group">
          <label class="form-label">Kunden-Nr. <span class="stars">*</span></label>
          <input v-model="offer.customer.id" type="text" class="inputs" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">Firmname <span class="stars">*</span></label>
          <input v-model="offer.customer.company_name" type="text" class="inputs" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Vorname <span class="stars">*</span></label>
            <input v-model="offer.customer.first_name" type="text" class="inputs" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Nachname <span class="stars">*</span></label>
            <input v-model="offer.customer.last_name" type="text" class="inputs" readonly />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Adresse <span class="stars">*</span></label>
          <input v-model="offer.customer.address" type="text" class="inputs" readonly />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ <span class="stars">*</span></label>
            <input v-model="offer.customer.postal_code" type="text" class="inputs" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt <span class="stars">*</span></label>
            <input v-model="offer.customer.city" type="text" class="inputs" readonly />
          </div>
        </div>
      </div>
    </div>

    <!-- Status -->
    <div class="sections">
      <div class="sections-title"><i class="bi bi-info-circle form-title icons"></i>Status</div>

      <div class="form-group">
        <label class="form-label">Status</label>
        <select v-model="offer.status" class="inputs">
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
          class="inputs"
          placeholder="z. B. Max Mustermann"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Statuskommentar</label>
        <textarea
          v-model="offer.status_comments"
          class="inputs"
          rows="2"
          placeholder="Interne Anmerkung zum Status"
        ></textarea>
      </div>
    </div>

    <!-- Währung -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-currency-exchange form-title icons"></i>Währung
      </div>
      <div class="form-group">
        <select v-model="offer.currency" class="inputs">
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

    <!-- Positions -->
    <div class="sections positions-error">
      <div class="sections-title">
        <i class="bi bi-box-seam icons"></i>
        Positionen <span class="stars">*</span>
      </div>

      <div v-if="offer.positions && offer.positions.length === 0">Keine Positionen vorhanden</div>
      <div v-if="error.positions" class="error">
        {{ error.positions }}
      </div>
      <div v-else class="positions-editor">
        <div v-for="(item, index) in offer.positions" :key="index" class="position-item">
          <div class="sections">
            <div class="positions-header">
              <span class="position-number"> Position {{ index + 1 }} </span>
              <button type="button" class="delete-position-btn" @click="deletePosition(index)">
                <i class="bi bi-trash3 me-1"></i>Löschen
              </button>
            </div>
            <!-- FORM FIELDS -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Leistungsdatum Von <span class="stars">*</span></label>
                <div class="date-wrapper">
                  <i class="bi bi-calendar3 calendar-icon"></i>
                  <input
                    :ref="`service_period_start_${index}`"
                    v-model="item.service_period_start"
                    type="date"
                    class="inputs date"
                    required
                    @input="error.service_period_start = ''"
                  />
                </div>
                <div v-if="error.service_period_start" class="error">
                  {{ error.service_period_start }}
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Leistungsdatum Bis <span class="stars">*</span></label>
                <div class="date-wrapper">
                  <i class="bi bi-calendar3 calendar-icon"></i>
                  <input
                    :ref="`service_period_end_${index}`"
                    v-model="item.service_period_end"
                    type="date"
                    class="inputs date"
                    required
                    @input="error.service_period_end = ''"
                  />
                </div>
                <div v-if="error.service_period_end" class="error">
                  {{ error.service_period_end }}
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Bezeichnung</label>
                <input
                  v-model="item.title"
                  type="text"
                  class="inputs"
                  placeholder="Produkt / Leistung"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Beschreibung</label>
                <input
                  v-model="item.description"
                  type="text"
                  class="inputs"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Menge</label>
                <input v-model.number="item.quantity" type="number" class="inputs" min="1" />
              </div>

              <div class="form-group">
                <label class="form-label">Einzelpreis</label>
                <input v-model.number="item.price" type="number" class="inputs" step="0.01" />
              </div>

              <div class="form-group">
                <label class="form-label">MwSt %</label>
                <select v-model.number="item.vat" class="inputs">
                  <option :value="0">0 %</option>
                  <option :value="7">7 %</option>
                  <option :value="19">19 %</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Gesamt</label>
                <input type="text" class="inputs" :value="positionTotal(item)" disabled />
              </div>
            </div>
          </div>
        </div>
        <div v-if="offer.positions.length > 0" class="sections">
          <div class="container-2">
            <div class="summary-item">
              <label class="form-label">Nettobetrag</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.net_total, offer.currency) }}
              </div>
            </div>
            <div class="summary-item">
              <label class="form-label">MwSt Gesamt</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.vat_total, offer.currency) }}
              </div>
            </div>
            <div class="summary-item">
              <label class="form-label">Bruttobetrag</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.gross_total, offer.currency) }}
              </div>
            </div>
            <div class="summary-item">
              <label class="form-label">Rabatt</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.early_payment_discount, offer.currency) }}
              </div>
            </div>
            <div class="summary-item">
              <label class="form-label">Endbetrag</label>
              <div class="form-result-item">
                {{ formatCurrency(summary.gross_total_after_discount, offer.currency) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="add-position-btn" @click="addPosition">
        <i class="bi bi-plus-circle icons"></i>
        Position hinzufügen
      </button>
    </div>

    <!-- Zusätzliche Informationen -->
    <div class="sections">
      <div class="sections-title">
        <i class="bi bi-file-text-fill form-title icons"></i>Zusätzliche Informationen
      </div>

      <div class="form-group">
        <label class="form-label">Zahlungsbedingungen</label>
        <textarea
          v-model="offer.payment_terms"
          class="inputs"
          rows="2"
          placeholder="z. B. 14 Tage netto, 2 % Skonto bei Zahlung innerhalb 8 Tagen"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Lieferbedingungen</label>
        <textarea
          v-model="offer.delivery_terms"
          class="inputs"
          rows="2"
          placeholder="z. B. frei Haus, ab Werk, DAP, EXW unserer Niederlassung in Berlin"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Lieferzeit</label>
        <div class="date-wrapper">
          <input v-model="offer.delivery_time" type="date" class="inputs date" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Einleitungstext</label>
        <textarea
          v-model="offer.introduction_text"
          class="inputs"
          rows="3"
          placeholder="Vielen Dank für Ihre Anfrage vom XX.XX.XXXX. Gerne unterbreiten wir Ihnen nachfolgend unser Angebot…"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Abschlusstext</label>
        <textarea
          v-model="offer.closing_text"
          class="inputs"
          rows="3"
          placeholder="Wir freuen uns auf Ihre Rückmeldung und stehen bei Rückfragen jederzeit gerne zur Verfügung. Mit freundlichen Grüßen"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Notizen (für Kunden sichtbar)</label>
        <textarea
          v-model="offer.notes"
          class="inputs"
          rows="3"
          placeholder="z. B. Preise verstehen sich zzgl. gesetzlicher MwSt. • Gültigkeit des Angebots: 30 Tage"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Interne Notizen</label>
        <textarea
          v-model="offer.internal_notes"
          class="inputs"
          rows="3"
          placeholder="z. B. Kunde wünscht Expressversand • Rabatt nur bei Vorkasse • Material aktuell knapp"
        ></textarea>
      </div>
    </div>

    <div class="switch-container">
      <label for="is_legal" class="switch">
        <input id="is_legal" v-model="offer.is_legal" type="checkbox" />
        <span class="slider round"></span>
      </label>
      <div class="switch-text">
        <i class="bi bi-pencil-square form-title icons"></i
        ><strong>Legally binding signature</strong>
      </div>
    </div>

    <div class="btn-container">
      <button class="btn btn-preview" @click="submitStore">
        <i class="bi bi-eye icons"></i>Vorschau anzeigen
      </button>
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
        console.log(result)
        if (!result.success) return
        this.offer.id = result.last_id == 0 ? 1 : result.last_id
        this.offer.customer = result.rows
        this.offer.customer_id = result.rows.id
      } catch (error) {
        console.error(error)
      }
    },
    getStore() {
      if (!store.state.offer) return
      this.offer = JSON.parse(JSON.stringify(store.state.offer))
    },
    addPosition() {
      if (!this.offer.positions) return
      this.offer.positions.push({
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
      this.error.positions = ''
    },
    deletePosition(index) {
      if (!this.offer.positions) return
      if (this.offer.positions.length > 0) {
        this.offer.positions.splice(index, 1)
      } else {
        alert('Keine Positionen vorhanden!')
      }
    },
    validateDates() {
      let isValid = true

      // Check (offer date)
      if (!this.offer.date) {
        this.error.date = 'Rechnungsdatum ist erforderlich'
        this.$refs.date.focus()
        isValid = false
        return isValid
      }

      // Check (service date)
      if (!this.offer.valid_until) {
        this.error.valid_until = 'Leistungsdatum ist erforderlich'
        this.$refs.valid_until.focus()
        isValid = false
        return isValid
      }

      // NEW: offer date cannot be before service date
      if (new Date(this.offer.date) < new Date(this.offer.valid_until)) {
        this.error.date = 'Rechnungsdatum kann nicht vor dem Leistungsdatum liegen'
        this.$refs.date.focus()
        isValid = false
        return isValid
      }

      // Check dates in positions
      for (let i = 0; i < this.offer.positions.length; i++) {
        const position = this.offer.positions[i]

        // Check service period start date
        if (!position.service_period_start) {
          this.error.service_period_start = 'Leistungsdatum Von ist erforderlich'
          if (this.$refs[`service_period_start_${i}`]) {
            this.$refs[`service_period_start_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }

        // Check service period end date
        if (!position.service_period_end) {
          this.error.service_period_end = 'Leistungsdatum Bis ist erforderlich'
          if (this.$refs[`service_period_end_${i}`]) {
            this.$refs[`service_period_end_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }

        // NEW: End date cannot be before start date
        if (new Date(position.service_period_end) < new Date(position.service_period_start)) {
          this.error.service_period_end = 'Enddatum kann nicht vor dem Startdatum liegen'
          if (this.$refs[`service_period_end_${i}`]) {
            this.$refs[`service_period_end_${i}`][0].focus()
          }
          isValid = false
          return isValid
        }
      }

      return isValid
    },
    positionTotal(item) {
      const net = item.quantity * item.price
      return (net * (1 + item.vat / 100)).toFixed(2)
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
      if (!this.validateDates()) {
        return
      }

      // Check positions exist
      if (!this.offer.positions || this.offer.positions.length === 0) {
        this.error.positions = 'Mindestens eine Position ist erforderlich'
        this.$nextTick(() => {
          const positionsError = document.querySelector('.positions-error')
          if (positionsError) {
            positionsError.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
        return false
      }

      this.summary()
      console.log(this.offer)
      await store.setStore('offer', JSON.parse(JSON.stringify(this.offer)))
      this.$router.push('/offers/preview')
    }
  }
}
</script>
