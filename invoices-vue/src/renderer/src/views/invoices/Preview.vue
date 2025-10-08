<template>
  <div>
    <!-- PREVIEW PANEL -->
    <div class="preview-panel">
      <div class="preview-header">
        <div class="preview-title">📄 Live-Vorschau</div>
      </div>

      <div>
        <div class="header">
          <div>
            <div class="company-name">Ihre Firma GmbH</div>
            <div class="company-details">
              Musterstraße 123 • 10115 Berlin<br />
              Tel: +49 30 1234567 • info@ihre-firma.de
            </div>
          </div>
          <div class="logo-placeholder">LOGO</div>
        </div>

        <div class="recipient">
          <div class="sender-line">Ihre Firma GmbH • Musterstraße 123 • 10115 Berlin</div>
          <div class="recipient-address">
            <div class="recipient-name">{{ previewData.customerName }}</div>
            <div>{{ previewData.customerCompany }}</div>
            <div>{{ previewData.customerAddress }}</div>
            <div>{{ previewData.customerZip }} {{ previewData.customerCity }}</div>
          </div>
        </div>

        <div class="meta-info">
          <div>
            <div class="meta-row">
              <span class="meta-label">Ansprechpartnerin:</span>
              <span class="meta-value">Frau Müller</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Telefon:</span>
              <span class="meta-value">+49 30 1234-567</span>
            </div>
          </div>
          <div>
            <div class="meta-row">
              <span class="meta-label">Rechnungsnr.:</span>
              <span class="meta-value">{{ previewData.invoiceNumber }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ previewData.formattedDate }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kundennr.:</span>
              <span class="meta-value">{{ previewData.customerNumber }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Leistung:</span>
              <span class="meta-value">{{ previewData.servicePeriod }}</span>
            </div>
          </div>
        </div>

        <div class="document-title">
          Rechnung
          <span class="status-badge">⏱️ Teilweise bezahlt</span>
        </div>

        <div class="intro-text">
          Sehr geehrter Herr Weber,<br /><br />
          für die erbrachten Leistungen erlauben wir uns, Ihnen wie folgt in Rechnung zu stellen:
        </div>

        <table class="positions-table">
          <thead>
            <tr>
              <th style="width: 5%">Pos.</th>
              <th style="width: 40%">Bezeichnung</th>
              <th class="center" style="width: 8%">Menge</th>
              <th class="center" style="width: 10%">Einheit</th>
              <th class="right" style="width: 12%">Einzelpreis</th>
              <th class="right" style="width: 10%">MwSt.</th>
              <th class="right" style="width: 15%">Gesamtpreis</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in previewData.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ item.price }}</td>
              <td class="right">{{ item.vat }}%</td>
              <td class="right">{{ item.unitTotal }}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{ $store.state.invoicePreview.subtotal }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{ $store.state.invoicePreview.vatAmount }}</span>
          </div>
          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{ $store.state.invoicePreview.grandTotal }}</span>
          </div>
          <div class="total-row paid">
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value">- {{ $store.state.invoicePreview.paidAmount }}</span>
          </div>
          <div class="total-row final outstanding">
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{ $store.state.invoicePreview.outstanding }}</span>
          </div>
        </div>

        <div class="bank-box">
          <div class="bank-title">🏦 Bankverbindung</div>
          <div class="bank-info">
            <span class="bank-label">Bank:</span>
            <span class="bank-value">{{ previewData.bank }}</span>
            <span class="bank-label">IBAN:</span>
            <span class="bank-value">{{ previewData.iban }}</span>
            <span class="bank-label">BIC:</span>
            <span class="bank-value">{{ previewData.bic }}</span>
            <span class="bank-label">Verwendung:</span>
            <span class="bank-value">{{ invoiceNumber }}</span>
          </div>
        </div>

        <div class="footer">
          <div class="footer-row">
            <strong>Ihre Firma GmbH</strong> • Geschäftsführer: Max Mustermann • HRB 12345 B
          </div>
          <div class="footer-row">
            <strong>Bank:</strong> Berliner Sparkasse • IBAN: DE89 1005 0000 0123 4567 89
          </div>
          <div class="footer-row">
            <strong>Steuernr.:</strong> 12/345/67890 • <strong>USt-IdNr.:</strong> DE123456789
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Rechnungsvorschau',
      previewData: ''
    }
  },
  mounted() {
    this.getPreview()
  },
  methods: {
    async getPreview() {
      this.previewData = await this.$store.state.invoicePreview
    }
  }
}
</script>

<style>
/* PREVIEW PANEL */
.preview-panel {
  width: 80%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 40px);
  padding: 20px;
  top: 20px;
}

.preview-header {
  padding: 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 12px 12px 0 0;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.page {
  padding: 40px;
  background: white;
  font-size: 11px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 3px solid #10b981;
}

.company-name {
  font-size: 18px;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 4px;
}

.company-details {
  font-size: 9px;
  color: #666;
  line-height: 1.6;
}

.logo-placeholder {
  width: 80px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  font-size: 10px;
}

/* RECIPIENT */
.recipient {
  margin-bottom: 20px;
}

.sender-line {
  font-size: 7px;
  color: #999;
  border-bottom: 1px solid #ddd;
  padding-bottom: 2px;
  margin-bottom: 10px;
}

.recipient-address {
  font-size: 10px;
  line-height: 1.6;
}

.recipient-name {
  font-weight: bold;
  font-size: 11px;
}

/* META INFO */
.meta-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 9px;
}

.meta-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  margin-bottom: 4px;
}

.meta-label {
  font-weight: 600;
  color: #555;
}

.meta-value {
  color: #333;
}

/* TITEL */
.document-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  margin-left: 8px;
  background: #fef3c7;
  color: #92400e;
}

/* INTRO */
.intro-text {
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 10px;
}

/* POSITIONS TABLE */
.positions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: 9px;
}

.positions-table thead {
  background: #f8f9fa;
}

.positions-table th {
  padding: 8px 6px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
  font-size: 9px;
}

.positions-table th.right,
.positions-table td.right {
  text-align: right;
}

.positions-table th.center,
.positions-table td.center {
  text-align: center;
}

.positions-table tbody tr {
  border-bottom: 1px solid #e9ecef;
}

.positions-table td {
  padding: 10px 6px;
  vertical-align: top;
}

.position-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
  font-size: 10px;
}

.position-description {
  color: #666;
  font-size: 8px;
  line-height: 1.4;
}

/* TOTALS */
.totals {
  margin-left: auto;
  width: 280px;
  margin-top: 8px;
  margin-bottom: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 10px;
}

.total-row.subtotal {
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
}

.total-row.paid {
  color: #10b981;
}

.total-row.outstanding {
  color: #dc2626;
  font-weight: 600;
}

.total-row.final {
  border-top: 2px solid #333;
  font-weight: bold;
  font-size: 12px;
  padding-top: 10px;
  margin-top: 6px;
  color: #10b981;
}

.total-label {
  color: #555;
}

.total-value {
  font-weight: 600;
  color: #333;
}

/* BANK BOX */
.bank-box {
  background: #f1f5f9;
  padding: 12px;
  border-radius: 6px;
  font-size: 9px;
  margin-bottom: 16px;
}

.bank-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 10px;
}

.bank-info {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 4px;
  line-height: 1.6;
}

.bank-label {
  color: #666;
}

.bank-value {
  font-weight: 600;
  color: #333;
}

/* FOOTER */
.footer {
  margin-top: 40px;
  padding-top: 16px;
  border-top: 2px solid #10b981;
  font-size: 7px;
  color: #666;
  text-align: center;
  line-height: 1.8;
}

.footer-row {
  margin-bottom: 4px;
}

.footer strong {
  color: #333;
}
</style>
