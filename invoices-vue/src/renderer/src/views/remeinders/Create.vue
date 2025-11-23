<template>
  <div>
    <div class="editor-panel">
      <div class="editor-header">
        <div class="editor-title">📝{{ title }}</div>
      </div>
      <!-- 1. level -->
      <div class="form-section">
        <label class="form-label">💼 Betreff</label>
        <div class="form-group">
          <select v-model="remeinders.level" class="form-input">
            <option value="" disabled>Wähle Betreff</option>
            <option value="1">Zahlungserinnerung / 1. Mahnung</option>
            <option value="2">2. Mahnung</option>
            <option value="3">Letzte Mahnung vor gerichtlichem Mahnverfahren</option>
          </select>
        </div>
        <div class="form-group">
          <!-- Intro Text -->
          <div class="intro-text">
            <label class="form-label">Intro Text (Mahnung)</label>
            <textarea v-model="intro[remeinders.level]" class="form-input"></textarea>
          </div>
        </div>
      </div>

      <!-- 4. Payment Deadline -->
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">Zahlungsfrist auswählen</label>
          <select v-model="remeinders.payment_deadline" class="form-input">
            <option value="" disabled selected>Bitte auswählen</option>
            <option value="Innerhalb von 7 Tagen">Innerhalb von 7 Tagen</option>
            <option value="Innerhalb von 5 Tagen">Innerhalb von 5 Tagen</option>
            <option value="Innerhalb von 14 Tagen">Innerhalb von 14 Tagen</option>
            <option value="Innerhalb von 30 Tagen">Innerhalb von 30 Tagen</option>
            <option value="Sofort fällig / Innerhalb von 3 Tagen">
              Sofort fällig / Innerhalb von 3 Tagen
            </option>
            <option value="Sofort zahlbar">Sofort zahlbar</option>
            <option value="Nach Vereinbarung">Nach Vereinbarung</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Mahngebühr</label>
            <input v-model="remeinders.remeinder_fee" type="number" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Verzugszinsen</label>
            <input v-model="remeinders.late_fee" type="number" class="form-input" />
          </div>
        </div>
      </div>
      <div v-if="remeinders.level" class="form-section">
        <div class="form-group">
          <!-- Warning Text -->
          <label class="form-label">⚠️ Warnung</label>
          <div class="warning-text">
            <textarea v-model="warning[remeinders.level]" class="form-input"></textarea>
          </div>
        </div>
        <div class="form-group">
          <!-- Closing Text -->
          <label class="form-label">📝 Endtext</label>
          <div class="closing-text">
            <textarea v-model="closing[remeinders.level]" class="form-input"></textarea>
          </div>
        </div>
      </div>
      <!-- Preview Button -->
      <router-link to="/remeinders/preview" class="preview-btn" @click="setStore">
        👁️ Vorschau anzeigen
      </router-link>
    </div>
  </div>
</template>

<script>
import store from '../../store/store'
export default {
  name: 'MahnungPreview',
  inject: ['storePreview'],
  data() {
    return {
      title: 'Zahlungserinnerung',
      remeinders: {
        id: '1',
        date: '2025-01-22',
        level: '',
        payment_deadline: '',
        remeinder_fee: 0,
        late_fee: 0,
        intro_text: '',
        closing_text: '',
        warning_text: '',
        selected_invoice: null
      },
      intro: [
        null,
        'Nach unserem Buchhaltungsstand ist der Rechnungsbetrag der unten aufgeführten Rechnung noch nicht auf unserem Konto eingegangen.',
        'Trotz unserer ersten Zahlungserinnerung ist der offene Betrag noch nicht bei uns eingegangen. Wir bitten Sie dringend, die Zahlung zu veranlassen.',
        'Trotz mehrfacher Mahnungen ist der unten aufgeführte Betrag noch immer nicht beglichen worden. Dies ist unsere letzte Mahnung vor Einleitung rechtlicher Schritte.'
      ],

      closing: [
        null,
        'Wir bitten Sie höflich, den offenen Betrag innerhalb von 7 Tagen zu überweisen.',
        'Wir fordern Sie auf, den offenen Betrag zzgl.Mahngebühr innerhalb von 5 Tagen zu begleichen.',
        'Dies ist Ihre letzte Möglichkeit, den offenen Betrag innerhalb von 3 Tagen zu begleichen.'
      ],
      warning: [
        null,
        null,
        'Sollte die Zahlung nicht innerhalb der angegebenen Frist erfolgen, sehen wir uns gezwungen, weitere Maßnahmen einzuleiten.Dies kann zusätzliche Kosten verursachen.',
        'Bei Nichtzahlung innerhalb der angegebenen Frist werden wir ohne weitere Ankündigung ein gerichtliches Mahnverfahren einleiten. Die entstehenden Gerichts- und Anwaltskosten gehen zu Ihren Lasten.'
      ]
    }
  },
  mounted() {
    this.getStore()
    if (!store.state.remeinders) {
      this.getSelectedInvoice()
    }
  },
  methods: {
    getStore() {
      if (store.state.remeinders) {
        this.remeinders = JSON.parse(JSON.stringify(store.state.remeinders))
      }
    },
    async getSelectedInvoice() {
      const row = await window.api.getDocumentById(this.$route.params.id, 'invoices')
      if (row.success) {
        this.remeinders.selected_invoice = {
          id: row.rows.id,
          date: row.rows.date,
          currency: row.rows.currency,
          customer: JSON.parse(row.rows.customer),
          payment: JSON.parse(row.rows.payment),
          summary: JSON.parse(row.rows.summary)
        }
        console.log(this.remeinders)
      }
    },
    setStore() {
      if (this.remeinders) {
        this.remeinders.intro_text = this.intro[this.remeinders.level]
        this.remeinders.closing_text = this.closing[this.remeinders.level]
        this.remeinders.warning_text = this.warning[this.remeinders.level]
        this.storePreview('remeinders', this.remeinders)
      }
    }
  }
}
</script>

<style scoped>
/* EDITOR PANEL */
.editor-panel {
  width: 70%;
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
