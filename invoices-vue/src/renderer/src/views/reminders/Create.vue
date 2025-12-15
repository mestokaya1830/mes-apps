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

<style>
/* EDITOR PANEL */
.editor-panel {
  width: 100%;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.editor-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.editor-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* FORM GROUPS */
.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row-4 {
  grid-template-columns: repeat(4, 1fr);
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
}

input:not([readonly]) {
  background: #fff;
}
.stars {
  color: darkred;
  font-size: 16px;
}
.mahnung-container {
  background: #f5f5f5;
  padding: 40px 20px;
  min-height: 100vh;
}

/* Preview Actions */
.preview-actions {
  max-width: 210mm;
  margin: 0 auto 24px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.back-btn,
.download-btn,
.print-btn,
.send-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn {
  background: #6b7280;
  color: white;
}

.back-btn:hover {
  background: #4b5563;
}

.download-btn {
  background: #3b82f6;
  color: white;
}

.download-btn:hover {
  background: #2563eb;
}

.print-btn {
  background: #10b981;
  color: white;
}

.print-btn:hover {
  background: #059669;
}

.send-btn {
  background: #8b5cf6;
  color: white;
}

.send-btn:hover {
  background: #7c3aed;
}

/* Document */
.mahnung-document {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  padding: 48px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Header */
.document-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.company-info h1 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 8px;
}

.company-info p {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.document-type {
  text-align: right;
}

.mahnung-stufe {
  display: inline-block;
  padding: 8px 16px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.mahnung-stufe.stufe-2 {
  background: #fed7aa;
  color: #9a3412;
}

.mahnung-stufe.stufe-3 {
  background: #fecaca;
  color: #991b1b;
}

.document-number {
  font-size: 12px;
  color: #6b7280;
}

/* Recipient */
.recipient-section {
  margin-bottom: 32px;
}

.sender-line {
  font-size: 9px;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 2px;
  margin-bottom: 8px;
}

.recipient-address p {
  font-size: 13px;
  line-height: 1.6;
  margin: 2px 0;
}

.company-name {
  font-weight: 700;
  font-size: 14px;
}

/* Details */
.mahnung-details {
  margin-bottom: 32px;
}

.details-table {
  width: 100%;
  font-size: 12px;
  margin-bottom: 24px;
}

.details-table td {
  padding: 6px 8px;
}

.details-table .label {
  font-weight: 600;
  color: #4b5563;
  width: 180px;
}

.details-table .value {
  color: #1f2937;
}

/* level */
.level {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
}

/* Content */
.mahnung-content {
  font-size: 13px;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 24px;
}

.mahnung-content p {
  margin-bottom: 16px;
}

/* Invoice Details */
.invoice-details {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 20px;
  margin: 24px 0;
  border-radius: 4px;
}

.invoice-details h3 {
  font-size: 14px;
  color: #92400e;
  margin-bottom: 12px;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.invoice-table th {
  text-align: left;
  padding: 8px;
  background: #fffbeb;
  font-weight: 600;
  color: #78350f;
}

.invoice-table td {
  padding: 8px;
  border-bottom: 1px solid #fde68a;
}

.total-row {
  font-weight: 700;
  font-size: 14px;
  color: #92400e;
}

/* Payment Info */
.payment-info {
  background: #f3f4f6;
  padding: 20px;
  border-radius: 6px;
  margin: 24px 0;
}

.payment-info h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.payment-info p {
  font-size: 12px;
  line-height: 1.6;
  color: #4b5563;
  margin: 4px 0;
}

.payment-info strong {
  color: #1f2937;
}

/* Warning Box */
.warning-box {
  background: #fef2f2;
  border-left: 4px solid #ef4444;
  padding: 16px;
  margin: 24px 0;
  border-radius: 4px;
}

.warning-box p {
  font-size: 12px;
  color: #991b1b;
  line-height: 1.6;
  margin: 4px 0;
}

/* Closing */
.closing {
  margin-top: 32px;
  font-size: 13px;
  line-height: 1.6;
}

/* Footer */
.document-footer {
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  font-size: 10px;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
}

/* Print Styles */
@media print {
  .mahnung-container {
    background: white;
    padding: 0;
  }

  .preview-actions {
    display: none;
  }

  .mahnung-document {
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  @page {
    margin: 15mm;
  }
}
</style>
