<template>
  <div>
    <section class="sections" aria-label="Bank- und Partnerinformationen">
      <div class="form-row">
        <!-- Name der Gegenpartei -->
        <div class="form-group">
          <label for="partner-name" class="form-label">
            Name der Gegenpartei <span class="stars">*</span>
          </label>
          <input
            id="partner-name"
            v-model="localNamePartner"
            type="text"
            class="inputs"
            placeholder="z.B. Kunde / Lieferant"
            :aria-invalid="nameError ? 'true' : 'false'"
            aria-required="true"
            @input="updateName"
          />
          <p v-if="nameError" class="error" role="alert">{{ nameError }}</p>
        </div>

        <!-- IBAN -->
        <div class="form-group">
          <label for="iban" class="form-label">IBAN <span class="stars">*</span></label>
          <input
            id="iban"
            type="text"
            :value="iban"
            placeholder="DE89 3704 0044 0532 0130 00"
            class="inputs"
            :aria-invalid="ibanError ? 'true' : 'false'"
            aria-required="true"
            @input="handleIban($event.target.value)"
          />
          <span v-if="ibanCountryFlag" class="flag" aria-hidden="true">{{ ibanCountryFlag }}</span>
          <p v-if="ibanError" class="error" role="alert">{{ ibanError }}</p>
        </div>
      </div>

      <div class="form-row">
        <!-- BIC -->
        <div class="form-group">
          <label for="bic" class="form-label">BIC <span class="stars">*</span></label>
          <input
            id="bic"
            type="text"
            :value="bic"
            placeholder="DEUTDEFF500"
            class="inputs"
            :aria-invalid="bicError ? 'true' : 'false'"
            aria-required="true"
            @input="handleBic($event.target.value)"
          />
          <p v-if="bicError" class="error" role="alert">{{ bicError }}</p>
        </div>

        <!-- Bankname -->
        <div class="form-group">
          <label for="bank-name" class="form-label"
            >Bankname (automatisch) <span class="stars">*</span></label
          >
          <input
            id="bank-name"
            type="text"
            :value="bankName"
            readonly
            class="inputs"
            aria-readonly="true"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'IbanComponent',
  emits: [
    'update:localNamePartner',
    'update:iban',
    'update:bic',
    'update:bank',
    'ibanValid',
    'bicValid',
    'nameValid'
  ],
  data() {
    return {
      iban: '',
      bic: '',
      ibanError: '',
      bicError: '',
      ibanCountryFlag: '',
      bankName: '',
      localNamePartner: '',
      nameError: '',
      nameValid: false,
      ibanTouched: false,
      bicTouched: false,
      // BIC directory
      bicDirectory: {
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
        HASPDEHHXXX: 'Hamburg Commercial Bank'
      },

      // Country flags
      countryFlags: {
        DE: '🇩🇪',
        AT: '🇦🇹',
        CH: '🇨🇭',
        AD: '🇦🇩',
        AE: '🇦🇪',
        AL: '🇦🇱',
        AZ: '🇦🇿',
        BA: '🇧🇦',
        BE: '🇧🇪',
        BG: '🇧🇬',
        BH: '🇧🇭',
        BR: '🇧🇷',
        CR: '🇨🇷',
        CY: '🇨🇾',
        CZ: '🇨🇿',
        DK: '🇩🇰',
        DO: '🇩🇴',
        EE: '🇪🇪',
        ES: '🇪🇸',
        FI: '🇫🇮',
        FO: '🇫🇴',
        FR: '🇫🇷',
        GB: '🇬🇧',
        GE: '🇬🇪',
        GI: '🇬🇮',
        GL: '🇬🇱',
        GR: '🇬🇷',
        GT: '🇬🇹',
        HR: '🇭🇷',
        HU: '🇭🇺',
        IE: '🇮🇪',
        IL: '🇮🇱',
        IQ: '🇮🇶',
        IS: '🇮🇸',
        IT: '🇮🇹',
        JO: '🇯🇴',
        KW: '🇰🇼',
        KZ: '🇰🇿',
        LB: '🇱🇧',
        LC: '🇱🇨',
        LI: '🇱🇮',
        LT: '🇱🇹',
        LU: '🇱🇺',
        LV: '🇱🇻',
        MC: '🇲🇨',
        MD: '🇲🇩',
        ME: '🇲🇪',
        MK: '🇲🇰',
        MR: '🇲🇷',
        MT: '🇲🇹',
        MU: '🇲🇺',
        NL: '🇳🇱',
        NO: '🇳🇴',
        PK: '🇵🇰',
        PL: '🇵🇱',
        PS: '🇵🇸',
        PT: '🇵🇹',
        QA: '🇶🇦',
        RO: '🇷🇴',
        RS: '🇷🇸',
        SA: '🇸🇦',
        SC: '🇸🇨',
        SE: '🇸🇪',
        SI: '🇸🇮',
        SK: '🇸🇰',
        SM: '🇸🇲',
        ST: '🇸🇹',
        SV: '🇸🇻',
        TL: '🇹🇱',
        TN: '🇹🇳',
        TR: '🇹🇷',
        UA: '🇺🇦',
        VA: '🇻🇦',
        VG: '🇻🇬',
        XK: '🇽🇰'
      }
    }
  },

  // DE89370400440532013000
  methods: {
    updateName() {
      if (!this.localNamePartner.trim()) {
        this.nameError = 'Name ist erforderlich'
        this.nameValid = false
      } else if (this.localNamePartner.length < 2) {
        this.nameError = 'Name ist zu kurz'
        this.nameValid = false
      } else {
        this.nameError = ''
        this.nameValid = true
      }

      this.$emit('update:localNamePartner', this.localNamePartner)
      this.$emit('nameValid', this.nameValid)
    },
    handleIban(input) {
      this.ibanTouched = true

      let iban = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
      iban = iban.replace(/(.{4})/g, '$1 ').trim()
      this.iban = iban

      if (!iban) {
        this.ibanError = 'IBAN ist erforderlich'
        this.$emit('ibanValid', false)
        this.$emit('update:iban', '')
        return
      }

      const country = iban.slice(0, 2)
      this.ibanCountryFlag = this.countryFlags[country] || ''

      const v = this.validateIban(iban)
      this.ibanError = v.valid ? '' : v.message

      this.$emit('update:iban', iban)
      this.$emit('ibanValid', v.valid)
    },

    handleBic(input) {
      this.bicTouched = true

      const bic = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
      this.bic = bic

      if (!bic) {
        this.bicError = 'BIC ist erforderlich'
        this.bankName = ''
        this.$emit('update:bic', '')
        this.$emit('update:bank', '')
        this.$emit('bicValid', false)
        return
      }

      if (bic.length < 8 || bic.length > 11) {
        this.bicError = 'Ungültiger BIC'
        this.bankName = ''
        this.$emit('update:bic', bic)
        this.$emit('update:bank', '')
        this.$emit('bicValid', false)
        return
      }

      this.bicError = ''
      this.bankName = this.bicDirectory[bic] || 'Unbekannte Bank'

      this.$emit('update:bic', bic)
      this.$emit('update:bank', this.bankName)
      this.$emit('bicValid', true)
    },

    validateIban(ibanRaw) {
      const iban = ibanRaw.replace(/\s+/g, '').toUpperCase()
      if (iban.length < 4) return { valid: false, message: 'IBAN ist zu kurz.' }
      if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban))
        return { valid: false, message: 'Ungültiges IBAN-Format.' }

      const rearranged = iban.slice(4) + iban.slice(0, 4)
      let numeric = ''
      for (const ch of rearranged) numeric += /[A-Z]/.test(ch) ? ch.charCodeAt(0) - 55 : ch
      let remainder = numeric
      while (remainder.length > 2) {
        const block = remainder.slice(0, 9)
        remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(block.length)
      }
      if (parseInt(remainder, 10) % 97 !== 1)
        return { valid: false, message: 'Die IBAN-Prüfsumme ist ungültig.' }
      return { valid: true }
    }
  }
}
</script>
