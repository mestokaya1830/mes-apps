<template>
  <div class="mahnung-container">
    <!-- Actions -->
    <div class="preview-actions">
      <button class="back-btn" @click="goBack">⬅️ Zurück</button>
      <div class="action-buttons">
        <button class="download-btn" @click="downloadPDF">📥 PDF herunterladen</button>
        <button class="print-btn" @click="printMahnung">🖨️ Drucken</button>
        <button class="send-btn" @click="sendMahnung">📧 Per E-Mail senden</button>
      </div>
    </div>

    <!-- Mahnung Document -->
    <div id="mahnung-preview" class="mahnung-document">
      <!-- Header -->
      <div class="document-header">
        <div class="company-info">
          <h1>{{ companyInfo.name }}</h1>
          <p>
            {{ companyInfo.address }}<br />
            {{ companyInfo.postal_code }} {{ companyInfo.city }}<br />
            Tel: {{ companyInfo.phone }}<br />
            E-Mail: {{ companyInfo.email }}
          </p>
        </div>
        <div class="document-type">
          <div class="mahnung-stufe" :class="`stufe-${mahnung.level}`">
            {{ mahnung.level }}. Mahnung
          </div>
          <p class="document-number">Mahnung-Nr.: {{ mahnung.number }}</p>
        </div>
      </div>

      <!-- Recipient Address -->
      <div class="recipient-section">
        <div class="sender-line">
          {{ companyInfo.name }} · {{ companyInfo.address }} · {{ companyInfo.postal_code }}
          {{ companyInfo.city }}
        </div>
        <div class="recipient-address">
          <p v-if="mahnung.customer.company_name" class="company-name">
            {{ mahnung.customer.company_name }}
          </p>
          <p>{{ mahnung.customer.first_name }} {{ mahnung.customer.last_name }}</p>
          <p>{{ mahnung.customer.address }}</p>
          <p>{{ mahnung.customer.postal_code }} {{ mahnung.customer.city }}</p>
        </div>
      </div>

      <!-- Details -->
      <div class="mahnung-details">
        <table class="details-table">
          <tr>
            <td class="label">Unsere Kundennummer:</td>
            <td class="value">{{ mahnung.customer.customer_number }}</td>
          </tr>
          <tr>
            <td class="label">Datum:</td>
            <td class="value">{{ formatDate(mahnung.date) }}</td>
          </tr>
        </table>
      </div>

      <!-- Subject -->
      <div class="subject">{{ getSubject() }}</div>

      <!-- Content -->
      <div class="mahnung-content">
        <p class="greeting">Sehr geehrte Damen und Herren,</p>

        <p v-html="getIntroText()"></p>

        <p v-if="mahnung.level === 1">
          Sollte sich Ihre Zahlung mit diesem Schreiben überschnitten haben, betrachten Sie diese
          Mahnung bitte als gegenstandslos.
        </p>
      </div>

      <!-- Invoice Details -->
      <div class="invoice-details">
        <h3>📄 Offene Rechnung(en)</h3>
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Rechnungsnummer</th>
              <th>Rechnungsdatum</th>
              <th>Fälligkeitsdatum</th>
              <th>Betrag</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in mahnung.invoices" :key="invoice.number">
              <td>{{ invoice.number }}</td>
              <td>{{ formatDate(invoice.date) }}</td>
              <td>{{ formatDate(invoice.due_date) }}</td>
              <td>{{ formatCurrency(invoice.amount) }}</td>
            </tr>
            <tr v-if="mahnung.reminder_fee > 0">
              <td colspan="3">Mahngebühr:</td>
              <td>{{ formatCurrency(mahnung.reminder_fee) }}</td>
            </tr>
            <tr v-if="mahnung.late_fee > 0">
              <td colspan="3">Verzugszinsen:</td>
              <td>{{ formatCurrency(mahnung.late_fee) }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3">Offener Gesamtbetrag:</td>
              <td>{{ formatCurrency(getTotalAmount()) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payment Info -->
      <div class="payment-info">
        <h3>💳 Zahlungsinformationen</h3>
        <p><strong>Empfänger:</strong> {{ companyInfo.name }}</p>
        <p><strong>IBAN:</strong> {{ companyInfo.iban }}</p>
        <p><strong>BIC:</strong> {{ companyInfo.bic }}</p>
        <p><strong>Bank:</strong> {{ companyInfo.bank }}</p>
        <p>
          <strong>Verwendungszweck:</strong> {{ mahnung.invoices.map((i) => i.number).join(', ') }}
        </p>
        <p><strong>Zahlungsziel:</strong> {{ getPaymentDeadline() }}</p>
      </div>

      <!-- Warning Box (für 2. und 3. Mahnung) -->
      <div v-if="mahnung.level >= 2" class="warning-box">
        <p v-if="mahnung.level === 2">
          <strong>⚠️ Wichtiger Hinweis:</strong><br />
          Sollte die Zahlung nicht innerhalb der angegebenen Frist erfolgen, sehen wir uns
          gezwungen, weitere Maßnahmen einzuleiten. Dies kann zusätzliche Kosten verursachen.
        </p>
        <p v-if="mahnung.level === 3">
          <strong>🚨 Letzte Mahnung:</strong><br />
          Bei Nichtzahlung innerhalb der angegebenen Frist werden wir ohne weitere Ankündigung ein
          gerichtliches Mahnverfahren einleiten. Die entstehenden Gerichts- und Anwaltskosten gehen
          zu Ihren Lasten.
        </p>
      </div>

      <div class="mahnung-content">
        <p v-html="getClosingText()"></p>

        <p v-if="mahnung.level <= 2">
          Sollten Sie Fragen zu dieser Rechnung haben oder sollte es Probleme mit der Zahlung geben,
          kontaktieren Sie uns bitte umgehend.
        </p>
      </div>

      <!-- Closing -->
      <div class="closing">
        <p>Mit freundlichen Grüßen</p>
        <br />
        <p><strong>{{ companyInfo.name }}</strong></p>
      </div>

      <!-- Footer -->
      <div class="document-footer">
        <p>
          {{ companyInfo.name }} · {{ companyInfo.address }} · {{ companyInfo.postal_code }}
          {{ companyInfo.city }}<br />
          Geschäftsführer: {{ companyInfo.ceo }} · {{ companyInfo.registration }}<br />
          USt-IdNr.: {{ companyInfo.tax_id }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MahnungPreview',
  data() {
    return {
      companyInfo: {
        name: 'Ihre Firma GmbH',
        address: 'Musterstraße 123',
        postal_code: '70173',
        city: 'Stuttgart',
        phone: '+49 711 123456',
        email: 'info@ihrefirma.de',
        iban: 'DE89 3704 0044 0532 0130 00',
        bic: 'COBADEFFXXX',
        bank: 'Commerzbank',
        ceo: 'Max Müller',
        registration: 'Amtsgericht Stuttgart HRB 12345',
        tax_id: 'DE123456789'
      },
      mahnung: {
        number: 'M-2025-00001',
        date: '2025-01-22',
        level: 1, // 1, 2, oder 3
        reminder_fee: 0, // Mahngebühr
        late_fee: 0, // Verzugszinsen
        customer: {
          customer_number: 'K-1001',
          company_name: 'Kunde GmbH',
          first_name: 'Max',
          last_name: 'Mustermann',
          address: 'Beispielweg 456',
          postal_code: '70174',
          city: 'Stuttgart'
        },
        invoices: [
          {
            number: 'RE-2025-00042',
            date: '2025-01-05',
            due_date: '2025-01-19',
            amount: 1428.0
          }
        ]
      }
    }
  },
  mounted() {
    this.loadMahnungData()
  },
  methods: {
    loadMahnungData() {
      // Store oder localStorage'dan veri yükle
      const storedData = localStorage.getItem('mahnungPreview')
      if (storedData) {
        const data = JSON.parse(storedData)
        this.mahnung = { ...this.mahnung, ...data }
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    },
    getTotalAmount() {
      const invoiceTotal = this.mahnung.invoices.reduce((sum, inv) => sum + inv.amount, 0)
      return invoiceTotal + this.mahnung.reminder_fee + this.mahnung.late_fee
    },
    getSubject() {
      const subjects = {
        1: 'Zahlungserinnerung / 1. Mahnung',
        2: '2. Mahnung',
        3: 'Letzte Mahnung vor gerichtlichem Mahnverfahren'
      }
      return subjects[this.mahnung.level] || 'Zahlungserinnerung'
    },
    getIntroText() {
      const intros = {
        1: 'nach unserem Buchhaltungsstand ist der Rechnungsbetrag der unten aufgeführten Rechnung noch nicht auf unserem Konto eingegangen.',
        2: 'trotz unserer ersten Zahlungserinnerung ist der offene Betrag noch nicht bei uns eingegangen. Wir bitten Sie dringend, die Zahlung zu veranlassen.',
        3: 'trotz mehrfacher Mahnungen ist der unten aufgeführte Betrag noch immer nicht beglichen worden. Dies ist unsere <strong>letzte Mahnung</strong> vor Einleitung rechtlicher Schritte.'
      }
      return intros[this.mahnung.level] || intros[1]
    },
    getClosingText() {
      const closings = {
        1: 'Wir bitten Sie höflich, den offenen Betrag <strong>innerhalb von 7 Tagen</strong> nach Erhalt dieses Schreibens auf unser Konto zu überweisen.',
        2: 'Wir fordern Sie auf, den offenen Betrag zzgl. Mahngebühr <strong>innerhalb von 5 Tagen</strong> zu begleichen, um weitere Maßnahmen zu vermeiden.',
        3: 'Dies ist Ihre <strong>letzte Möglichkeit</strong>, den offenen Betrag innerhalb von <strong>3 Tagen</strong> zu begleichen, bevor wir rechtliche Schritte einleiten.'
      }
      return closings[this.mahnung.level] || closings[1]
    },
    getPaymentDeadline() {
      const deadlines = {
        1: 'Innerhalb von 7 Tagen',
        2: 'Innerhalb von 5 Tagen',
        3: 'Sofort fällig / Innerhalb von 3 Tagen'
      }
      return deadlines[this.mahnung.level] || 'Sofort zahlbar'
    },
    goBack() {
      this.$router.push('/mahnungen')
    },
    printMahnung() {
      window.print()
    },
    async downloadPDF() {
      const element = document.getElementById('mahnung-preview')
      const opt = {
        margin: 10,
        filename: `${this.mahnung.number}_Mahnung.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      try {
        if (window.html2pdf) {
          await window.html2pdf().set(opt).from(element).save()
        } else {
          alert('PDF-Download erfordert html2pdf Bibliothek')
        }
      } catch (error) {
        console.error('PDF-Fehler:', error)
        alert('Fehler beim Erstellen der PDF')
      }
    },
    sendMahnung() {
      // E-Mail senden (Backend API)
      alert('Mahnung wird per E-Mail versendet...')
      // API call hier implementieren
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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

/* Subject */
.subject {
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