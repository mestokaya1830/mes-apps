<template>
  <div>
    <div v-if="reminder" class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
      </div>

      <!-- 4. Send Info -->
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">Sent At</label>
          <input v-model="reminder.date" type="datetime-local" class="form-input date" />
        </div>
        <div class="form-group">
          <label class="form-label">Sent Method</label>
          <select v-model="reminder.sent_method" class="form-input">
            <option value="" disabled>Wählen</option>
            <option value="email">Email</option>
            <option value="post">Post</option>
            <option value="einschreiben">Einschreiben</option>
            <option value="portal">Portal</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Zahlungsnachweis</label>
        <input v-model="reminder.proof_type" type="text" class="form-input" />
      </div>

      <!-- 1. Level -->
      <div class="form-section">
        <label class="form-label">💼 Betreff (Level)</label>
        <div class="form-group">
          <select v-model="reminder.level" class="form-input" @change="updateTexts">
            <option value="" disabled>Wähle Betreff</option>
            <option value="1">Zahlungserinnerung / 1. Mahnung</option>
            <option value="2">2. Mahnung</option>
            <option value="3">Letzte Mahnung vor gerichtlichem Mahnverfahren</option>
          </select>
        </div>
      </div>

      <!-- 2. Payment Deadline -->
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">Zahlungsfrist auswählen</label>
          <select v-model="reminder.payment_deadline" class="form-input" @change="updateTexts">
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
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Mahngebühr</label>
            <input v-model="reminder.reminder_fee" type="number" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Verzugszinsen</label>
            <input v-model="reminder.late_interest" type="number" class="form-input" />
          </div>
        </div>
      </div>

      <!-- 3. Text Sections -->
      <div v-if="reminder.level" class="form-section">
        <div class="form-group">
          <label class="form-label">Intro Text</label>
          <textarea v-model="reminder.intro_text" class="form-input"></textarea>
        </div>

        <div v-if="reminder.level != '1'" class="form-group">
          <label class="form-label">⚠️ Warnung</label>
          <textarea v-model="reminder.warning_text" class="form-input"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">📝 Endtext</label>
          <textarea v-model="reminder.closing_text" class="form-input"></textarea>
        </div>
      </div>

      <!-- Vorschau Button -->
      <button class="preview-btn" @click="submitStore">👁️ Vorschau anzeigen</button>
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
    submitStore() {
      if (!this.reminder) return
      store.setStore('reminder', JSON.parse(JSON.stringify(this.reminder)))
      this.$router.push('/reminders/preview')
    }
  }
}
</script>
