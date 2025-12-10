<template>
  <div>
    <!-- Payment Capture Panel -->
    <div v-if="payment" class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">💳 {{ title }}</div>
        <div class="editor-subtitle">
          Erfassen Sie eingehende Zahlungen für die ausgewählte Rechnung
        </div>
      </div>

      <div>
        <!-- 1️⃣ Invoice Information (readonly) -->
        <div class="form-section">
          <div class="form-section-title">📄 Ausgewählte Rechnung</div>
          <div class="customer-details" style="margin-top: 16px">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnung-Nr.:</label>
                <label class="form-input">{{ formatInvoiceId(payment.invoice_id) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Kunden-Nr.:</label>
                <label class="form-input">{{
                  formatCustomerId(payment.invoice_customer_id)
                }}</label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rechnungsdatum</label>
                <label class="form-input">{{ formatDate(payment.invoice_date) }}</label>
              </div>
              <div class="form-group">
                <label class="form-label">Fälligkeitsdatum</label>
                <label class="form-input">{{ formatDate(payment.invoice_due_date) }}</label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-input">
                <div>
                  Gesamtsumme:
                  {{ formatCurrency(payment.invoice_gross_total, payment.invoice_currency) }}
                </div>
                <div>
                  Bereits gezahlt:
                  {{ formatCurrency(payment.payment_total, payment.invoice_currency) }}
                </div>
                <div>
                  Offener Betrag:
                  {{ formatCurrency(outstanding, payment.invoice_currency) }}
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- 2️⃣ Counterparty Information -->
        <div class="form-section">
          <div class="form-section-title">🏦 Gegenpartei Informationen</div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Name der Gegenpartei</label>
              <input
                v-model="payment.counterparty_name"
                type="text"
                class="form-input"
                placeholder="z.B. Kunde / Lieferant"
              />
            </div>

            <div class="form-group">
              <label class="form-label">IBAN der Gegenpartei</label>
              <div style="display: flex; gap: 6px; align-items: center">
                <span v-if="ibanCountryFlag" style="font-size: 22px">{{ ibanCountryFlag }}</span>
                <input
                  v-model="payment.counterparty_iban"
                  type="text"
                  class="form-input"
                  placeholder="DE00 0000 0000 0000 0000 00"
                  @input="onIbanInput"
                />
              </div>
              <small v-if="ibanError" style="color: red">{{ ibanError }}</small>
              <small v-if="ibanValid" style="color: green">✓ IBAN ist gültig.</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">BIC / Swift (optional)</label>
              <input
                v-model="payment.counterparty_bic"
                type="text"
                class="form-input"
                placeholder="z.B. COBADEFFXXX"
                @input="onBicInput"
              />
              <small v-if="bicError" style="color: red">{{ bicError }}</small>
            </div>

            <div class="form-group">
              <label class="form-label">Bankname (automatisch)</label>
              <input v-model="payment.counterparty_bank" type="text" class="form-input" readonly />
            </div>
          </div>
        </div>

        <!-- 3️⃣ Currency -->
        <div class="form-section">
          <div class="form-section-title">💰 Währung</div>
          <div class="form-group">
            <label class="form-label">Waehrung</label>
            <select v-model="payment.invoice_currency" class="form-input">
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

        <!-- 4️⃣ Payment Details -->
        <div class="form-section">
          <div class="form-section-title">💰 Zahlungsdetails</div>

          <div class="form-group">
            <label class="form-label">Zahlungsdatum *</label>
            <input
              v-model="payment.payment_date"
              type="date"
              class="form-input"
              @input="updateOutstandingAmount"
            />
            <small class="form-hint">Datum des Zahlungseingangs</small>
          </div>

          <div class="form-group">
            <label class="form-label">Betrag (€) *</label>
            <input
              ref="payment_amount"
              v-model="payment.payment_amount"
              type="number"
              class="form-input"
              @input="updateOutstandingAmount"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <small class="form-label">Rabbat</small>
              <small v-if="payment.is_early_paid">{{
                payment.invoice.early_payment_discount
              }}</small>
              <small v-else>0</small>
            </div>
            <div class="form-group">
              <small class="form-label">Offener Betrag</small>
              <small>{{ formatCurrency(outstanding, payment.invoice_currency) }}</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zahlungsmethode</label>
              <select v-model="payment.payment_method" class="form-input">
                <option>Überweisung</option>
                <option>Bar</option>
                <option>PayPal</option>
                <option>Kreditkarte</option>
                <option>Lastschrift</option>
                <option>Scheck</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Zahlungsreferenz</label>
              <input
                v-model="payment.payment_reference"
                type="text"
                class="form-input"
                placeholder="z.B. Bankreferenz, Transaktions-ID"
              />
              <small class="form-hint">Optional</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Beleg / Zahlungsnachweis (optional)</label>
              <input type="file" class="form-input" accept=".pdf,image/*" @change="loadImage" />
              <small class="form-hint">PDF, JPG, PNG</small>
            </div>

            <div class="form-group">
              <label class="form-label">Ausgewählte Datei</label>
              <img v-if="selectedImage" :src="selectedImage" alt="" class="payment-image" />
              <div v-else>{{ payment.file_name }}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Notizen (optional)</label>
            <textarea v-model="payment.notes" class="form-input" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zahlungsstatus:</label>
              <div>
                <span v-if="payment.is_paid">✔ Vollständig bezahlt</span>
                <span v-else-if="payment.is_partially_paid">⚠ Teilweise bezahlt</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 5️⃣ Preview / Submit -->
        <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store/store'

// Small offline BIC → bank name table
// Mini BIC directory: DE, CH, AT
const bicDirectory = {
  // Germany (DE)
  MARKDEF1100: 'Sparkasse Mark Brandenburg',
  BYLADEM1001: 'Bayerische Landesbank (Sparkasse Bayern)',
  WELADEMMXXX: 'Sparkasse Wels',
  NOLADE21XXX: 'Sparkasse KölnBonn',
  SPKODEFFXXX: 'Sparkasse Ostholstein',
  COLSDE33XXX: 'Sparkasse Köln',
  SPKIDEFFXXX: 'Sparkasse Ilmenau',
  MALADE51XXX: 'Sparkasse Mainz',
  HELADEF1XXX: 'Sparkasse Hessen',
  SPSNDE66XXX: 'Sparkasse Nürnberg',
  SOLADES1XXX: 'Sparkasse Solingen',
  SPSWDE33XXX: 'Sparkasse Wiesbaden',
  SPKBSDE33XXX: 'Sparkasse Braunschweig',
  BSPADEFFXXX: 'Sparkasse Paderborn-Detmold',
  SPKHDE2HXXX: 'Sparkasse Hannover',
  DUSSDEDDXXX: 'Stadtsparkasse Düsseldorf',
  ESSEDE5FXXX: 'Sparkasse Essen',
  WELADED1XXX: 'Sparkasse Wetzlar',
  SSKMDEMMXXX: 'Sparkasse Mittelmosel',
  BYLADEM1ERD: 'Sparkasse Erding-Dorfen',
  SPBKDEFFXXX: 'Sparkasse Berlin',
  NASEDE55XXX: 'Sparkasse Neumünster',
  GENODEF1S12: 'Volksbank Stuttgart',
  COBADEFFXXX: 'Commerzbank',
  DEUTDEFFXXX: 'Deutsche Bank',
  DRESDEFFXXX: 'Commerzbank (vormals Dresdner Bank)',
  HYVEDEMMXXX: 'UniCredit Bank (HypoVereinsbank)',
  SOGEDEFFXXX: 'Société Générale',
  PBNKDEFFXXX: 'Postbank',
  DEUTDEDBBER: 'Deutsche Bank Berlin',
  DEUTDEFF500: 'Deutsche Bank Frankfurt',
  INGDDEFFXXX: 'ING-DiBa',
  CSDBDE71XXX: 'Santander Consumer Bank',
  GENODEF1M01: 'Volksbank München',
  GENODED1DKD: 'Volksbank Dortmund',
  GENODEM1GLS: 'GLS Bank',
  HASPDEHHXXX: 'Hamburg Commercial Bank',

  // Switzerland (CH)
  UBSWCHZH80A: 'UBS AG',
  CRESCHZZ80A: 'Credit Suisse AG',
  ZKBKCHZZ80A: 'Zürcher Kantonalbank',
  SGBSCHF0XXX: 'Swissquote Bank',
  RAIFCH22XXX: 'Raiffeisen Bank',
  BCITCHMMXXX: 'Bank CIC (Suisse) SA',
  // Austria (AT)
  BKAUATWW: 'Bank Austria',
  SPAAAT2LXXX: 'Erste Bank',
  RZBAATWW: 'Raiffeisen Bank Austria',
  VBOEATWW: 'Volksbank Österreich',
  HYPOAT2LXXX: 'Hypo Bank Austria'
}
//DE56 6305 0000 1011 6244 74
// IBAN country → emoji flag
const countryFlags = {
  // Europa (IBAN members)
  AD: '🇦🇩', // Andorra
  AE: '🇦🇪', // United Arab Emirates (non-EU IBAN)
  AL: '🇦🇱', // Albania
  AT: '🇦🇹', // Austria
  AZ: '🇦🇿', // Azerbaijan
  BA: '🇧🇦', // Bosnia and Herzegovina
  BE: '🇧🇪', // Belgium
  BG: '🇧🇬', // Bulgaria
  BH: '🇧🇭', // Bahrain
  BR: '🇧🇷', // Brazil
  CH: '🇨🇭', // Switzerland
  CR: '🇨🇷', // Costa Rica
  CY: '🇨🇾', // Cyprus
  CZ: '🇨🇿', // Czech Republic
  DE: '🇩🇪', // Germany
  DK: '🇩🇰', // Denmark
  DO: '🇩🇴', // Dominican Republic
  EE: '🇪🇪', // Estonia
  ES: '🇪🇸', // Spain
  FI: '🇫🇮', // Finland
  FO: '🇫🇴', // Faroe Islands
  FR: '🇫🇷', // France
  GB: '🇬🇧', // United Kingdom
  GE: '🇬🇪', // Georgia
  GI: '🇬🇮', // Gibraltar
  GL: '🇬🇱', // Greenland
  GR: '🇬🇷', // Greece
  GT: '🇬🇹', // Guatemala
  HR: '🇭🇷', // Croatia
  HU: '🇭🇺', // Hungary
  IE: '🇮🇪', // Ireland
  IL: '🇮🇱', // Israel
  IQ: '🇮🇶', // Iraq
  IS: '🇮🇸', // Iceland
  IT: '🇮🇹', // Italy
  JO: '🇯🇴', // Jordan
  KW: '🇰🇼', // Kuwait
  KZ: '🇰🇿', // Kazakhstan
  LB: '🇱🇧', // Lebanon
  LC: '🇱🇨', // Saint Lucia
  LI: '🇱🇮', // Liechtenstein
  LT: '🇱🇹', // Lithuania
  LU: '🇱🇺', // Luxembourg
  LV: '🇱🇻', // Latvia
  MC: '🇲🇨', // Monaco
  MD: '🇲🇩', // Moldova
  ME: '🇲🇪', // Montenegro
  MK: '🇲🇰', // North Macedonia
  MR: '🇲🇷', // Mauritania
  MT: '🇲🇹', // Malta
  MU: '🇲🇺', // Mauritius
  NL: '🇳🇱', // Netherlands
  NO: '🇳🇴', // Norway
  PK: '🇵🇰', // Pakistan
  PL: '🇵🇱', // Poland
  PS: '🇵🇸', // Palestine
  PT: '🇵🇹', // Portugal
  QA: '🇶🇦', // Qatar
  RO: '🇷🇴', // Romania
  RS: '🇷🇸', // Serbia
  SA: '🇸🇦', // Saudi Arabia
  SC: '🇸🇨', // Seychelles
  SE: '🇸🇪', // Sweden
  SI: '🇸🇮', // Slovenia
  SK: '🇸🇰', // Slovakia
  SM: '🇸🇲', // San Marino
  ST: '🇸🇹', // São Tomé and Príncipe
  SV: '🇸🇻', // El Salvador
  TL: '🇹🇱', // Timor-Leste
  TN: '🇹🇳', // Tunisia
  TR: '🇹🇷', // Turkey
  UA: '🇺🇦', // Ukraine
  VA: '🇻🇦', // Vatican
  VG: '🇻🇬', // British Virgin Islands
  XK: '🇽🇰' // Kosovo
}

export default {
  inject: ['formatInvoiceId', 'formatCustomerId', 'formatDate', 'formatCurrency'],

  data() {
    return {
      title: 'Zahlung erfassen',
      payment: null,
      selectedImage: '',
      ibanError: '',
      ibanValid: false,
      ibanCountryFlag: '',

      bicError: ''
    }
  },

  computed: {
    outstanding() {
      return (
        this.payment.invoice_gross_total -
        (this.payment.payment_amount + Number(this.payment.payment_total))
      ).toFixed(2)
    }
  },
  mounted() {
    this.getStore()
  },

  methods: {
    async getInvoice() {
      const id = this.$route.params.id
      if (!id) return
      try {
        const data = { id, table_name: 'payments' }
        const result = await window.api.getInvoiceById(data)
        if (!result.rows) return
        this.payment = {
          id: result.payment_id + 1,
          is_early_paid: false,
          payment_date: '',
          payment_amount: 0,
          payment_total: Number(result.payment_total).toFixed(2),
          payment_method: 'Überweisung',
          payment_reference: '',
          counterparty_name: '',
          counterparty_iban: '',
          counterparty_bic: '',
          counterparty_bank: '',
          notes: '',
          file_name: '',
          payment_status: 'partially_paid',
          invoice_id: result.rows.id,
          invoice_currency: result.rows.currency,
          invoice_customer_id: result.rows.customer_id,
          invoice_date: result.rows.date,
          invoice_due_date: result.rows.due_date,
          invoice_gross_total: result.rows.gross_total,
          invoice_total_after_discount: result.rows.total_after_discount,
          invoice_early_payment_days: result.rows.early_payment_days,
          invoice_early_payment_discount: result.rows.early_payment_discount,
          invoice_early_payment_percentage: result.rows.early_payment_percentage
        }
        //from payments db
        console.log('payments', result)
      } catch (error) {
        console.error(error)
      }
    },

    getStore() {
      // return this.getInvoice()
      if (!store.state.payment) return this.getInvoice()
      this.payment = JSON.parse(JSON.stringify(store.state.payment))
      this.selectedImage = this.payment.image_file
      console.log('store payment', this.payment)
    },

    loadImage(event) {
      const file = event.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        this.selectedImage = reader.result
        const timestamp = new Date().getTime()
        this.payment.file_name = `${this.payment.id}-${timestamp}.${file.name.split('.').pop()}`
      }
      reader.readAsDataURL(file)
    },

    updateOutstandingAmount() {
      if (!this.payment || !this.payment.invoice) return

      // if (this.payment.payment_date && this.payment.invoice_due_date) {
      //   const paymentDate = new Date(this.payment.payment_date)
      //   const dueDate = new Date(this.payment.invoice_due_date)
      //   const earlyPaymentDate = new Date(paymentDate)
      //   earlyPaymentDate.setDate(
      //     earlyPaymentDate.getDate() + (this.payment.invoice_early_payment_days || 0)
      //   )
      //   this.payment.is_early_paid = earlyPaymentDate < dueDate
      // } else {
      //   this.payment.is_early_paid = false
      // }
    },

    checkInputPayment() {
      if (!this.payment.payment_amount || this.payment.payment_amount <= 0) {
        this.$refs.payment_amount.focus()
        return false
      }
      return true
    },

    checkIsPaid() {
      if (this.payment.outstanding_amount == 0) {
        this.payment.is_paid = 1
        this.payment.is_partially_paid = 0
      } else if (this.payment.outstanding_amount < this.payment.invoice_total) {
        this.payment.is_paid = 0
        this.payment.is_partially_paid = 1
      } else {
        this.payment.is_paid = 0
        this.payment.is_partially_paid = 0
      }
    },
    onIbanInput() {
      let iban = this.payment.counterparty_iban.toUpperCase()
      iban = iban.replace(/[^A-Z0-9]/g, '')
      iban = iban.replace(/(.{4})/g, '$1 ').trim()
      this.payment.counterparty_iban = iban

      const country = iban.slice(0, 2)
      this.ibanCountryFlag = countryFlags[country] || ''

      const validation = this.validateIban(iban)
      if (!validation.valid) {
        this.ibanError = validation.message
        this.ibanValid = false
      } else {
        this.ibanError = ''
        this.ibanValid = true
      }
    },

    validateIban(ibanRaw) {
      const iban = ibanRaw.replace(/\s+/g, '').toUpperCase()

      if (iban.length < 4) return { valid: false, message: 'IBAN ist zu kurz.' }
      if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban))
        return { valid: false, message: 'Ungültiges IBAN-Format.' }

      // Rearrange IBAN for mod 97
      const rearranged = iban.slice(4) + iban.slice(0, 4)

      // Convert letters to numbers (A=10 ... Z=35)
      let numericIban = ''
      for (const ch of rearranged) {
        numericIban += /[A-Z]/.test(ch) ? ch.charCodeAt(0) - 55 : ch
      }

      // Mod 97 calculation (string-safe)
      let remainder = numericIban
      while (remainder.length > 2) {
        const block = remainder.slice(0, 9) // 9 digits safe for JS Number
        remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(block.length)
      }

      if (parseInt(remainder, 10) % 97 !== 1) {
        return { valid: false, message: 'Die IBAN-Prüfsumme ist ungültig.' }
      }

      return { valid: true }
    },

    onBicInput() {
      const bic = this.payment.counterparty_bic.toUpperCase().replace(/[^A-Z0-9]/g, '')
      this.payment.counterparty_bic = bic

      if (bic.length < 8) {
        this.bicError = 'Ungültiger BIC. Mindestens 8 Zeichen.'
        this.payment.counterparty_bank = ''
        return
      }

      if (!/^[A-Z0-9]{8,11}$/.test(bic)) {
        this.bicError = 'Ungültiges BIC-Format.'
        this.payment.counterparty_bank = ''
        return
      }

      this.bicError = ''

      // Bank lookup
      this.payment.counterparty_bank = bicDirectory[bic] || 'Unbekannte Bank'
    },
    async submitStore() {
      if (!this.checkInputPayment()) return
      this.checkIsPaid()
      this.payment.image_file = this.selectedImage
      await store.setStore('payment', JSON.parse(JSON.stringify(this.payment)))
      this.$router.push('/payments/preview')
    }
  }
}
</script>

<style>
/* Genel Form */
.form-section {
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.form-section-title {
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: #1f2937;
}

/* Satır ve grup düzeni */
.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Label */
.form-label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

/* Bilgilendirici alanlar */
.info-block {
  background-color: #f3f4f6; /* açık gri arka plan */
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  color: #111827;
  line-height: 1.5;
  margin-bottom: 12px;
}

/* Ödeme özet paneli */
.payment-summary {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px 20px;
  margin-top: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.payment-summary div {
  margin-bottom: 6px;
  font-size: 0.95rem;
  color: #374151;
}

/* Öne çıkan rakamlar */
.payment-summary .highlight {
  font-weight: 600;
  color: #111827;
}

/* Butonlar */
.preview-btn {
  margin-top: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.preview-btn:hover {
  background-color: #45a049;
}

.btn-secondary {
  margin-top: 16px;
  background-color: #e5e7eb;
  color: #111827;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}

/* Özel: Stars */
.stars {
  color: red;
}
.payment-image {
  width: 100px;
}
/* SWITCH CONTROL */
.switch-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.switch-text {
  margin-left: 16px;
}
.switch {
  position: relative;
  display: inline-block;
  min-width: 50px;
  height: 28px;
  margin-left: 10px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 5px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
