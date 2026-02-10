<template>
  <div v-if="reminder" class="main-container">
    <div class="main-header">
      <div class="main-title">{{ title }}</div>
      <router-link :to="`/invoices/details/${reminder.invoice_id}`" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons"></i>Zurück
      </router-link>
    </div>

    <div class="sections">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Versandtermin <span class="stars">*</span></label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input v-model="reminder.date" type="datetime-local" class="inputs date" />
          </div>
          <small v-if="error.date" class="error">{{ error.date }}</small>
        </div>
        <div class="form-group">
          <label class="form-label">Versandart <span class="stars">*</span></label>
          <select v-model="reminder.sent_method" class="inputs">
            <option value="" disabled>Wählen</option>
            <option value="email">Email</option>
            <option value="post">Post</option>
            <option value="einschreiben">Einschreiben</option>
            <option value="portal">Portal</option>
          </select>
          <small v-if="error.sent_method" class="error">{{ error.sent_method }}</small>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Zahlungsnachweis</label>
          <input v-model="reminder.proof_type" type="text" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">💼 Betreff (Level) <span class="stars">*</span></label>
          <select v-model="reminder.level" class="inputs" @change="updateTexts">
            <option value="" disabled>Wähle Betreff</option>
            <option value="1">Zahlungserinnerung / 1. Mahnung</option>
            <option value="2">2. Mahnung</option>
            <option value="3">Letzte Mahnung vor gerichtlichem Mahnverfahren</option>
          </select>
          <small v-if="error.level" class="error">{{ error.level }}</small>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Mahngebühr</label>
          <input v-model="reminder.reminder_fee" type="number" class="inputs" />
        </div>
        <div class="form-group">
          <label class="form-label">Verzugszinsen</label>
          <input v-model="reminder.late_interest" type="number" class="inputs" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Zahlungsfrist auswählen <span class="stars">*</span></label>
        <select v-model="reminder.payment_deadline" class="inputs" @change="updateTexts">
          <option value="" disabled selected>Bitte auswählen</option>
          <option value="innerhalb von 7 Tagen">Innerhalb von 7 Tagen</option>
          <option value="innerhalb von 5 Tagen">Innerhalb von 5 Tagen</option>
          <option value="innerhalb von 14 Tagen">Innerhalb von 14 Tagen</option>
          <option value="innerhalb von 30 Tagen">Innerhalb von 30 Tagen</option>
          <option value="sofort / innerhalb von 3 Tagen">
            Sofort fällig / Innerhalb von 3 Tagen
          </option>
          <option value="sofort zahlbar">Sofort zahlbar</option>
          <option value="nach Vereinbarung">Nach Vereinbarung</option>
        </select>
        <small v-if="error.payment_deadline" class="error">{{ error.payment_deadline }}</small>
      </div>
    </div>

    <div v-if="reminder.level" class="sections">
      <div class="form-group">
        <label class="form-label">Intro Text <span class="stars">*</span></label>
        <textarea v-model="reminder.intro_text" class="inputs"></textarea>
      </div>

      <div v-if="reminder.level != '1'" class="form-group">
        <label class="form-label">Warnung <span class="stars">*</span></label>
        <textarea v-model="reminder.warning_text" class="inputs"></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Endtext <span class="stars">*</span></label>
        <textarea v-model="reminder.closing_text" class="inputs"></textarea>
      </div>
    </div>

    <div class="sections">
      <div class="compliance-notice legal">
        <i class="bi bi-shield-check icons"></i><strong>Rechtliche Hinweise (Deutschland):</strong>
        <ul>
          <li>Mahngebühren müssen angemessen sein (üblicherweise 5-10€ für 1. Mahnung)</li>
          <li>Verzugszinsen: Basiszinssatz + 5% (B2C) oder + 9% (B2B) gem. §§ 288, 247 BGB</li>
          <li>Bei Einschreiben mit Rückschein wird Zustellung rechtssicher dokumentiert</li>
          <li>Verjährungsfrist beachten: 3 Jahre ab Ende des Jahres der Fälligkeit (§ 195 BGB)</li>
          <li>Mahnung muss bestimmt sein und Zahlungsaufforderung enthalten</li>
        </ul>
      </div>
    </div>

    <div class="sections btn-container">
      <button class="btn btn-preview" @click="submitStore">
        <i class="bi bi-eye icons"></i>Vorschau anzeigen
      </button>
    </div>
  </div>
</template>

<script>
import store from '../../store/store'

export default {
  name: 'MahnungPreview',
  data() {
    return {
      title: 'Zahlungserinnerung',
      reminder: {
        id: '',
        invoice_id: '', //for foreign key
        customer_id: '', //for foreign key
        is_active: 1,
        date: null,
        level: '',
        proof_type: 'Zahlungserinnerung',
        reminder_fee: 0,
        late_interest: 0,
        intro_text: '',
        closing_text: '',
        warning_text: '',
        sent_method: '',
        payment_deadline: '',
        customer: null,
        invoice: null
      },
      error: {
        date: '',
        sent_method: '',
        level: '',
        payment_deadline: ''
      },
      introTexts: [
        null,
        'Nach unserem Buchhaltungsstand ist der Rechnungsbetrag der unten aufgeführten Rechnung noch nicht auf unserem Konto eingegangen.',
        'Trotz unserer ersten Mahnung ist der offene Betrag noch nicht bei uns eingegangen. Wir bitten Sie dringend, die Zahlung zu veranlassen.',
        'Trotz mehrfacher Mahnungen ist der unten aufgeführte Betrag noch immer nicht beglichen worden. Dies ist unsere letzte Mahnung vor Einleitung rechtlicher Schritte.'
      ],
      warningTexts: [
        null,
        '',
        'Sollte die Zahlung nicht innerhalb der angegebenen Frist erfolgen, sehen wir uns gezwungen, weitere Maßnahmen einzuleiten. Dies kann zusätzliche Kosten verursachen.',
        'Bei Nichtzahlung innerhalb der angegebenen Frist werden wir ohne weitere Ankündigung ein gerichtliches Mahnverfahren einleiten. Die entstehenden Gerichts- und Anwaltskosten gehen zu Ihren Lasten.'
      ],
      closingTexts: [
        null,
        'Wir bitten Sie höflich, den offenen Betrag {{payment_deadline}} zu überweisen.',
        'Wir fordern Sie auf, den offenen Betrag zzgl. Mahngebühr {{payment_deadline}} zu begleichen.',
        'Dies ist Ihre letzte Möglichkeit, den offenen Betrag {{payment_deadline}} zu begleichen.'
      ]
    }
  },
  mounted() {
    this.getStore()
  },
  methods: {
    updateTexts() {
      const lvl = this.reminder.level
      const deadline = this.reminder.payment_deadline || ''
      this.reminder.intro_text = this.introTexts[lvl] || ''
      this.reminder.warning_text = this.warningTexts[lvl] || ''
      this.reminder.closing_text = (this.closingTexts[lvl] || '').replace(
        '{{payment_deadline}}',
        deadline
      )
    },
    async getStore() {
      // await store.clearStore('reminder')
      if (!store.state.reminder) return this.getInvoice()
      this.reminder = JSON.parse(JSON.stringify(store.state.reminder))
      this.updateTexts()
    },
    async getInvoice() {
      const data = {
        id: this.$route.params.id,
        table_name: 'reminders'
      }
      const result = await window.api.getInvoiceById(data)
      if (!result.success) return
      this.reminder.invoice = result.rows
      this.reminder.customer = JSON.parse(result.rows.customer)
      this.reminder.id = result.reminder_id + 1
      this.reminder.invoice_id = this.reminder.invoice.id
      this.reminder.customer_id = this.reminder.customer.id

      this.updateTexts()
      console.log('create-reminder', result)
    },
    validate() {
      let isValid = true
      if (!this.reminder.date) {
        this.error.date = 'Versandtermin ist erforderlich'
        isValid = false
      }
      if (!this.reminder.sent_method) {
        this.error.sent_method = 'Versandart ist erforderlich'
        isValid = false
      }
      if (!this.reminder.level) {
        this.error.level = 'Betreff (Level) ist erforderlich'
        isValid = false
      }
      if (!this.reminder.payment_deadline) {
        this.error.payment_deadline = 'Zahlungsfrist ist erforderlich'
        isValid = false
      }
      return isValid
    },
    submitStore() {
      if (!this.reminder) return
      if (!this.validate()) return
      store.setStore('reminder', JSON.parse(JSON.stringify(this.reminder)))
      this.$router.push('/reminders/preview')
    }
  }
}
</script>
