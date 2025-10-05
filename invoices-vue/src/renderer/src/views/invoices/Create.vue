<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <div class="page" style="position: relative">
      <!-- HEADER -->
      <div class="header">
        <div class="company-info">
          <div class="company-name">Ihre Firma GmbH</div>
          <div class="company-details">
            Musterstraße 123 • 10115 Berlin<br />
            Tel: +49 30 1234567 • Fax: +49 30 1234568<br />
            E-Mail: info@ihre-firma.de • www.ihre-firma.de
          </div>
        </div>
        <div class="logo-placeholder">LOGO</div>
      </div>

      <!-- EMPFÄNGER -->
      <div class="recipient">
        <div class="sender-line">Ihre Firma GmbH • Musterstraße 123 • 10115 Berlin</div>
        <div class="recipient-address">
          <div class="recipient-name">Herrn Maximilian Weber</div>
          <div>Weber Consulting GmbH</div>
          <div>Friedrichstraße 158</div>
          <div>10117 Berlin</div>
        </div>
      </div>

      <!-- META INFORMATIONEN -->
      <div class="meta-info">
        <div class="meta-left">
          <div class="meta-row">
            <span class="meta-label">Ihre Ansprechpartnerin:</span>
            <span class="meta-value">Frau Müller</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Telefon Durchwahl:</span>
            <span class="meta-value">+49 30 1234-567</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">E-Mail:</span>
            <span class="meta-value">mueller@ihre-firma.de</span>
          </div>
        </div>
        <div class="meta-right">
          <div class="meta-row">
            <span class="meta-label">Rechnungsnummer:</span>
            <span class="meta-value">RE-2024-001</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Rechnungsdatum:</span>
            <span class="meta-value">15. Dezember 2024</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Kundennummer:</span>
            <span class="meta-value">KU-2024-042</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Leistungszeitraum:</span>
            <span class="meta-value">Okt - Dez 2024</span>
          </div>
        </div>
      </div>

      <!-- TITEL -->
      <div class="document-title">
        Rechnung
        <span class="status-badge teilweise">💰 Teilweise bezahlt</span>
      </div>

      <!-- REFERENZ BOX -->
      <div class="reference-box">
        <div class="reference-label">📌 Bezug:</div>
        <div class="reference-text">
          Angebot ANG-2024-001 vom 04. Oktober 2024 • Auftrag AB-2024-001 vom 10. Oktober 2024 •
          Lieferschein LS-2024-001
        </div>
      </div>

      <!-- EINLEITUNGSTEXT -->
      <div class="intro-text">
        Sehr geehrter Herr Weber,<br /><br />
        vielen Dank für Ihren Auftrag. Für die erbrachten Leistungen erlauben wir uns, Ihnen wie
        folgt in Rechnung zu stellen:
      </div>

      <!-- POSITIONEN TABELLE -->
      <table class="positions-table">
        <thead>
          <tr>
            <th style="width: 5%">Pos.</th>
            <th style="width: 38%">Bezeichnung</th>
            <th class="center" style="width: 8%">Menge</th>
            <th class="center" style="width: 9%">Einheit</th>
            <th class="right" style="width: 13%">Einzelpreis</th>
            <th class="right" style="width: 9%">MwSt.</th>
            <th class="right" style="width: 13%">Gesamtpreis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <div class="position-title">Responsive Webdesign</div>
              <div class="artikel-nr">Art.-Nr.: WEB-001 • Lieferung: 10.12.2024</div>
              <div class="position-description">
                Professionelles Webdesign mit responsivem Layout. Inklusive 5 Unterseiten,
                Kontaktformular und Google Maps Integration.
              </div>
            </td>
            <td class="center">1</td>
            <td class="center">Pauschal</td>
            <td class="right">2.500,00 €</td>
            <td class="right">19%</td>
            <td class="right">2.500,00 €</td>
          </tr>
          <tr>
            <td>2</td>
            <td>
              <div class="position-title">Content Management System</div>
              <div class="artikel-nr">Art.-Nr.: CMS-002 • Lieferung: 12.12.2024</div>
              <div class="position-description">
                WordPress CMS Integration inkl. 2 Stunden Schulung für Ihr Team (durchgeführt am
                12.12.2024).
              </div>
            </td>
            <td class="center">1</td>
            <td class="center">Pauschal</td>
            <td class="right">800,00 €</td>
            <td class="right">19%</td>
            <td class="right">800,00 €</td>
          </tr>
          <tr>
            <td>3</td>
            <td>
              <div class="position-title">SEO-Optimierung</div>
              <div class="artikel-nr">Art.-Nr.: SEO-003 • Leistungszeitraum: Nov-Dez 2024</div>
              <div class="position-description">
                OnPage SEO für 10 Keywords. Meta-Tags, URL-Struktur, Ladezeit-Optimierung.
              </div>
            </td>
            <td class="center">10</td>
            <td class="center">Std</td>
            <td class="right">80,00 €</td>
            <td class="right">19%</td>
            <td class="right">800,00 €</td>
          </tr>
          <tr>
            <td>4</td>
            <td>
              <div class="position-title">Analytics Einrichtung</div>
              <div class="artikel-nr">Art.-Nr.: ANA-004 • Lieferung: 13.12.2024</div>
              <div class="position-description">
                Google Analytics 4 und Search Console Setup mit Tracking-Konfiguration.
              </div>
            </td>
            <td class="center">1</td>
            <td class="center">Pauschal</td>
            <td class="right">200,00 €</td>
            <td class="right">19%</td>
            <td class="right">200,00 €</td>
          </tr>
          <tr>
            <td>5</td>
            <td>
              <div class="position-title">DSGVO Cookie-Banner</div>
              <div class="artikel-nr">Art.-Nr.: DSG-005 • Lieferung: 14.12.2024</div>
              <div class="position-description">
                Rechtssicherer Cookie-Consent-Banner gemäß DSGVO inkl. Datenschutzerklärung.
              </div>
            </td>
            <td class="center">1</td>
            <td class="center">Pauschal</td>
            <td class="right">150,00 €</td>
            <td class="right">19%</td>
            <td class="right">150,00 €</td>
          </tr>
        </tbody>
      </table>

      <!-- SUMMEN -->
      <div class="totals">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">4.450,00 €</span>
        </div>
        <div class="total-row">
          <span class="total-label">MwSt. 19% auf 4.450,00 €:</span>
          <span class="total-value">845,50 €</span>
        </div>
        <div class="total-row subtotal">
          <span class="total-label">Rechnungsbetrag (brutto):</span>
          <span class="total-value">5.295,50 €</span>
        </div>
        <div class="total-row paid">
          <span class="total-label">✓ Bereits bezahlt (Anzahlung):</span>
          <span class="total-value">- 2.647,75 €</span>
        </div>
        <div class="total-row final outstanding">
          <span class="total-label">⚠️ Offener Betrag:</span>
          <span class="total-value">2.647,75 €</span>
        </div>
      </div>

      <!-- PAYMENT HISTORY (PREMIUM) -->
      <div class="payment-history">
        <div class="payment-history-title">
          <span>✓</span>
          Zahlungseingang
        </div>
        <div class="payment-entry">
          <div class="payment-date">25.10.2024</div>
          <div>Anzahlung (50%) per Überweisung</div>
          <div class="payment-amount">2.647,75 €</div>
        </div>
      </div>

      <!-- MWST BREAKDOWN (PREMIUM) -->
      <div class="mwst-breakdown">
        <div class="mwst-title">📊 Mehrwertsteuer Aufschlüsselung</div>
        <div class="mwst-table">
          <div class="mwst-row" style="font-weight: 600; border-bottom: 2px solid #e5e7eb">
            <div>MwSt.-Satz</div>
            <div>Nettobetrag</div>
            <div>MwSt.-Betrag</div>
            <div>Bruttobetrag</div>
          </div>
          <div class="mwst-row">
            <div>19%</div>
            <div>4.450,00 €</div>
            <div>845,50 €</div>
            <div>5.295,50 €</div>
          </div>
          <div class="mwst-row">
            <div><strong>Gesamt</strong></div>
            <div><strong>4.450,00 €</strong></div>
            <div><strong>845,50 €</strong></div>
            <div><strong>5.295,50 €</strong></div>
          </div>
        </div>
      </div>

      <!-- ZAHLUNGSINFO BOX (PREMIUM) -->
      <div class="payment-info-box">
        <div class="payment-info-title">
          <span>💳</span>
          Zahlungsinformationen
        </div>
        <div style="margin-bottom: 8px">
          Bitte überweisen Sie den offenen Betrag von <strong>2.647,75 €</strong> innerhalb von
          <strong>14 Tagen</strong> auf untenstehendes Konto.
        </div>
        <div class="payment-deadline">
          <span class="deadline-label">⏰ Zahlbar bis:</span>
          <span class="deadline-date">29. Dezember 2024</span>
        </div>
        <div class="payment-iban">DE89 3704 0044 0532 0130 00</div>
        <div class="payment-bic">HVBKDEFF</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Add New Invoice'
    }
  }
}
</script>
<style>
.page {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  padding: 40px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 3px solid #10b981;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 5px;
}

.company-details {
  font-size: 11px;
  color: #666;
  line-height: 1.6;
}

.logo-placeholder {
  width: 120px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 8px;
}

/* EMPFÄNGER */
.recipient {
  margin-bottom: 30px;
}

.sender-line {
  font-size: 8px;
  color: #999;
  border-bottom: 1px solid #ddd;
  padding-bottom: 3px;
  margin-bottom: 15px;
}

.recipient-address {
  font-size: 12px;
  line-height: 1.6;
}

.recipient-name {
  font-weight: bold;
  font-size: 13px;
}

/* META INFO */
.meta-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  font-size: 11px;
}

.meta-left,
.meta-right {
  flex: 1;
}

.meta-right {
  text-align: right;
}

.meta-row {
  display: flex;
  margin-bottom: 5px;
}

.meta-right .meta-row {
  justify-content: flex-end;
}

.meta-label {
  font-weight: 600;
  width: 140px;
  color: #555;
}

.meta-value {
  color: #333;
}

/* PREMIUM BADGE */
.premium-badge {
  display: inline-block;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  margin-left: 8px;
  vertical-align: middle;
}

/* STATUS BADGE */
.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 12px;
}

.status-badge.offen {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.bezahlt {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.ueberfaellig {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.teilweise {
  background: #dbeafe;
  color: #1e40af;
}

/* TITEL */
.document-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

/* REFERENZ BOX */
.reference-box {
  background: #f0fdf4;
  border-left: 4px solid #10b981;
  padding: 12px 16px;
  margin-bottom: 25px;
  font-size: 11px;
}

.reference-label {
  font-weight: 600;
  color: #10b981;
  margin-bottom: 4px;
}

.reference-text {
  color: #555;
}

/* EINLEITUNGSTEXT */
.intro-text {
  margin-bottom: 25px;
  line-height: 1.6;
  font-size: 12px;
}

/* POSITIONEN TABELLE */
.positions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 11px;
}

.positions-table thead {
  background: #f8f9fa;
}

.positions-table th {
  padding: 10px 8px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
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
  padding: 12px 8px;
  vertical-align: top;
}

.position-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.position-description {
  color: #666;
  font-size: 10px;
  line-height: 1.4;
}

.artikel-nr {
  font-size: 9px;
  color: #999;
  font-family: 'Courier New', monospace;
}

/* SUMMEN */
.totals {
  margin-left: auto;
  width: 350px;
  margin-top: 10px;
  margin-bottom: 30px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 12px;
}

.total-row.subtotal {
  border-top: 1px solid #dee2e6;
  padding-top: 12px;
}

.total-row.paid {
  color: #10b981;
}

.total-row.outstanding {
  color: #dc2626;
  font-weight: 600;
  background: #fef2f2;
  padding: 10px 12px;
  margin: 8px -12px;
  border-radius: 6px;
}

.total-row.final {
  border-top: 2px solid #333;
  font-weight: bold;
  font-size: 14px;
  padding-top: 12px;
  margin-top: 8px;
  color: #10b981;
}

.total-label {
  color: #555;
}

.total-value {
  font-weight: 600;
  color: #333;
}

/* MWST BREAKDOWN (PREMIUM) */
.mwst-breakdown {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  font-size: 11px;
}

.mwst-title {
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.mwst-table {
  width: 100%;
}

.mwst-row {
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px;
  padding: 6px 0;
  border-bottom: 1px solid #f3f4f6;
}

.mwst-row:last-child {
  border-bottom: none;
  padding-top: 10px;
  font-weight: 600;
}

.mwst-row div:last-child {
  text-align: right;
}

/* ZAHLUNGSINFO BOX (PREMIUM) */
.payment-info-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  margin-bottom: 20px;
  font-size: 11px;
}

.payment-info-title {
  font-weight: 600;
  color: #92400e;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.payment-deadline {
  background: white;
  padding: 10px 12px;
  border-radius: 6px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deadline-label {
  color: #92400e;
  font-weight: 600;
}

.deadline-date {
  color: #dc2626;
  font-weight: bold;
  font-size: 13px;
}

/* PAYMENT METHODS (PREMIUM) */
.payment-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.payment-method {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.payment-method.active {
  border-color: #10b981;
  background: #f0fdf4;
  color: #065f46;
}

.payment-method-icon {
  font-size: 18px;
}

/* BANKVERBINDUNG BOX */
.bank-box {
  background: #f1f5f9;
  padding: 16px;
  border-radius: 8px;
  font-size: 11px;
  margin-bottom: 20px;
}

.bank-title {
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  font-size: 12px;
}

.bank-info {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 6px;
  line-height: 1.8;
}

.bank-label {
  color: #666;
}

.bank-value {
  font-weight: 600;
  color: #333;
}

.verwendungszweck {
  background: #fef3c7;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 8px;
  font-weight: 600;
  color: #92400e;
}

/* PAYMENT HISTORY (PREMIUM) */
.payment-history {
  background: #f0fdf4;
  border: 1px solid #d1fae5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  font-size: 11px;
}

.payment-history-title {
  font-weight: 600;
  color: #065f46;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.payment-entry {
  display: grid;
  grid-template-columns: 100px 1fr 120px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  margin-bottom: 6px;
}

.payment-entry:last-child {
  margin-bottom: 0;
}

.payment-date {
  font-weight: 600;
  color: #10b981;
}

.payment-amount {
  text-align: right;
  font-weight: 600;
  color: #333;
}

/* BEDINGUNGEN */
.conditions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.condition-section {
  margin-bottom: 16px;
}

.condition-title {
  font-weight: 600;
  font-size: 11px;
  margin-bottom: 6px;
  color: #333;
}

.condition-text {
  font-size: 10px;
  line-height: 1.6;
  color: #666;
}

/* KONTAKT BOX */
.contact-box {
  background: #f0fdf4;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 11px;
}

.contact-title {
  font-weight: 600;
  color: #065f46;
  margin-bottom: 8px;
}

.contact-person {
  display: flex;
  gap: 16px;
  align-items: center;
}

.contact-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.contact-details {
  flex: 1;
}

.contact-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.contact-info {
  color: #666;
  line-height: 1.5;
}

/* SCHLUSSTEXT */
.closing {
  margin-top: 20px;
  font-size: 11px;
  line-height: 1.6;
}

/* UNTERSCHRIFT */
.signature {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
}

.signature-block {
  width: 45%;
}

.signature-line {
  border-top: 1px solid #333;
  padding-top: 5px;
  font-size: 10px;
  color: #666;
  margin-top: 40px;
}

/* QR CODE */
.qr-section {
  position: absolute;
  right: 40px;
  bottom: 100px;
  text-align: center;
}

.qr-code {
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #999;
  margin-bottom: 6px;
}

.qr-label {
  font-size: 8px;
  color: #666;
}

/* FOOTER */
.footer {
  margin-top: 60px;
  padding-top: 20px;
  border-top: 2px solid #10b981;
  font-size: 9px;
  color: #666;
  text-align: center;
  line-height: 1.8;
}

.footer-row {
  margin-bottom: 5px;
}

.footer strong {
  color: #333;
}

/* PAGE NUMBER */
.page-number {
  position: absolute;
  bottom: 30px;
  right: 40px;
  font-size: 9px;
  color: #999;
}
</style>
