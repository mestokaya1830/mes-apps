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
            <span class="meta-label">Projektleitung:</span>
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
            <span class="meta-label">Auftragsnummer:</span>
            <span class="meta-value">AB-2024-001</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Bestelldatum:</span>
            <span class="meta-value">10. Oktober 2024</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Kundennummer:</span>
            <span class="meta-value">KU-2024-042</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Liefertermin:</span>
            <span class="meta-value">15. Dezember 2024</span>
          </div>
        </div>
      </div>

      <!-- TITEL -->
      <div class="document-title">
        Auftragsbestätigung
        <span class="status-badge bestaetigt">✓ Bestätigt</span>
      </div>

      <!-- CONFIRMATION BOX (PREMIUM) -->
      <div class="confirmation-box">
        <div class="confirmation-icon">✅</div>
        <div class="confirmation-title">Vielen Dank für Ihren Auftrag!</div>
        <div class="confirmation-text">
          Wir bestätigen hiermit den Eingang Ihrer Bestellung und freuen uns auf die Zusammenarbeit.
          Ihr Projekt befindet sich bereits in Bearbeitung und wird gemäß dem unten stehenden
          Zeitplan durchgeführt.
        </div>
      </div>

      <!-- REFERENZ BOX -->
      <div class="reference-box">
        <div class="reference-label">📌 Bezug:</div>
        <div class="reference-text">
          Angebot ANG-2024-001 vom 04. Oktober 2024 • Ihre Bestellung vom 10. Oktober 2024
        </div>
      </div>

      <!-- EINLEITUNGSTEXT -->
      <div class="intro-text">
        Sehr geehrter Herr Weber,<br /><br />
        vielen Dank für Ihren Auftrag. Wir bestätigen Ihnen hiermit die Durchführung der folgenden
        Leistungen zu den vereinbarten Konditionen:
      </div>

      <!-- POSITIONEN TABELLE -->
      <table class="positions-table">
        <thead>
          <tr>
            <th style="width: 5%">Pos.</th>
            <th style="width: 40%">Bezeichnung</th>
            <th class="center" style="width: 8%">Menge</th>
            <th class="center" style="width: 10%">Einheit</th>
            <th class="right" style="width: 13%">Einzelpreis</th>
            <th class="right" style="width: 10%">MwSt.</th>
            <th class="right" style="width: 14%">Gesamtpreis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <div class="position-title">Responsive Webdesign</div>
              <div class="artikel-nr">Art.-Nr.: WEB-001</div>
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
              <div class="artikel-nr">Art.-Nr.: CMS-002</div>
              <div class="position-description">
                WordPress CMS Integration inkl. 2 Stunden Schulung.
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
              <div class="artikel-nr">Art.-Nr.: SEO-003</div>
              <div class="position-description">OnPage SEO für 10 Keywords.</div>
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
              <div class="artikel-nr">Art.-Nr.: ANA-004</div>
              <div class="position-description">Google Analytics 4 und Search Console Setup.</div>
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
              <div class="artikel-nr">Art.-Nr.: DSG-005</div>
              <div class="position-description">Rechtssicherer Cookie-Consent gemäß DSGVO.</div>
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
          <span class="total-label">MwSt. 19%:</span>
          <span class="total-value">845,50 €</span>
        </div>
        <div class="total-row final">
          <span class="total-label">Gesamtbetrag (brutto):</span>
          <span class="total-value">5.295,50 €</span>
        </div>
      </div>

      <!-- PAYMENT SCHEDULE (PREMIUM) -->
      <div class="payment-schedule">
        <div class="payment-schedule-title">💳 Zahlungsplan</div>
        <div class="payment-item">
          <div class="payment-milestone">Anzahlung</div>
          <div>Bei Auftragsbestätigung</div>
          <div class="payment-amount">2.647,75 € (50%)</div>
        </div>
        <div class="payment-item">
          <div class="payment-milestone">Restzahlung</div>
          <div>Nach Abnahme & Freigabe</div>
          <div class="payment-amount">2.647,75 € (50%)</div>
        </div>
      </div>

      <!-- DELIVERY SCHEDULE (PREMIUM) -->
      <div class="delivery-schedule-box">
        <div class="delivery-schedule-title">
          <span>📅</span>
          Projektzeitplan
        </div>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-date">15. Okt 2024</div>
            <div class="timeline-desc">Projektstart & Kick-off Meeting</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">01. Nov 2024</div>
            <div class="timeline-desc">Design-Entwurf zur Abstimmung</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">20. Nov 2024</div>
            <div class="timeline-desc">Entwicklung & CMS Integration</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">10. Dez 2024</div>
            <div class="timeline-desc">Test & Qualitätssicherung</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">15. Dez 2024</div>
            <div class="timeline-desc"><strong>Go-Live & Projektabschluss</strong></div>
          </div>
        </div>
      </div>

      <!-- BEDINGUNGEN -->
      <div class="conditions">
        <div class="condition-grid">
          <div class="condition-section">
            <div class="condition-title">📋 Zahlungsbedingungen</div>
            <div class="condition-text">
              Anzahlung von 50% innerhalb von 7 Tagen nach Auftragsbestätigung. Restzahlung nach
              erfolgreicher Abnahme innerhalb von 14 Tagen netto.
            </div>
          </div>

          <div class="condition-section">
            <div class="condition-title">⚙️ Mitwirkungspflichten</div>
            <div class="condition-text">
              Der Kunde stellt alle erforderlichen Inhalte (Texte, Bilder, Logos) bis spätestens 01.
              November 2024 bereit.
            </div>
          </div>
        </div>

        <div class="condition-section">
          <div class="condition-title">📦 Leistungsumfang & Gewährleistung</div>
          <div class="condition-text">
            Der Leistungsumfang ergibt sich aus der obigen Aufstellung. Erstes Jahr Hosting und
            Support inklusive. Die Gewährleistungsfrist beträgt 12 Monate ab Abnahme. Es gelten
            unsere Allgemeinen Geschäftsbedingungen (AGB).
          </div>
        </div>
      </div>

      <!-- KONTAKT BOX -->
      <div class="contact-box">
        <div class="contact-title">👤 Ihre Projektleitung</div>
        <div class="contact-person">
          <div class="contact-avatar">SM</div>
          <div class="contact-details">
            <div class="contact-name">Sandra Müller</div>
            <div class="contact-info">
              Projektmanagement & Kundenbetreuung<br />
              📞 +49 30 1234-567 • 📧 mueller@ihre-firma.de<br />
              Erreichbar: Mo-Fr 9:00-17:00 Uhr
            </div>
          </div>
        </div>
      </div>

      <!-- SCHLUSSTEXT -->
      <div class="closing">
        Wir freuen uns auf die Zusammenarbeit mit Ihnen und werden alles daran setzen, Ihr Projekt
        termingerecht und zu Ihrer vollsten Zufriedenheit umzusetzen. Bei Fragen steht Ihnen Frau
        Müller jederzeit gerne zur Verfügung.<br /><br />
        Mit freundlichen Grüßen
      </div>

      <!-- UNTERSCHRIFT -->
      <div class="signature">
        <div class="signature-block">
          <div class="signature-line">Berlin, 10. Oktober 2024</div>
        </div>
        <div class="signature-block">
          <div class="signature-line">Unterschrift / Firmenstempel</div>
        </div>
      </div>

      <!-- QR CODE -->
      <div class="qr-section">
        <div class="qr-code">
          QR CODE<br />
          📱
        </div>
        <div class="qr-label">Auftragsstatus online</div>
      </div>

      <!-- PAGE NUMBER -->
      <div
        class="page-number"
        style="position: absolute; bottom: 20px; right: 40px; font-size: 9px; color: #666"
      >
        Seite 1 von 1
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'New Order'
    }
  }
}
</script>
<style>
/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 3px solid #3b82f6;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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

/* STATUS BADGE */
.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 12px;
}

.status-badge.bestaetigt {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.in-bearbeitung {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.abgeschlossen {
  background: #d1fae5;
  color: #065f46;
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

/* TITEL */
.document-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

/* CONFIRMATION BOX (PREMIUM) */
.confirmation-box {
  background: #dbeafe;
  border-left: 4px solid #3b82f6;
  padding: 16px;
  margin-bottom: 25px;
  font-size: 12px;
}

.confirmation-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.confirmation-title {
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
  font-size: 13px;
}

.confirmation-text {
  color: #1e3a8a;
  line-height: 1.6;
}

/* REFERENZ BOX */
.reference-box {
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
  padding: 12px 16px;
  margin-bottom: 25px;
  font-size: 11px;
}

.reference-label {
  font-weight: 600;
  color: #3b82f6;
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

/* LIEFERTERMIN BOX (PREMIUM) */
.delivery-schedule-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  margin-bottom: 20px;
  font-size: 11px;
}

.delivery-schedule-title {
  font-weight: 600;
  color: #92400e;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.timeline {
  display: grid;
  gap: 12px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  padding: 10px;
  background: white;
  border-radius: 6px;
}

.timeline-date {
  font-weight: 600;
  color: #92400e;
}

.timeline-desc {
  color: #666;
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

.total-row.final {
  border-top: 2px solid #333;
  font-weight: bold;
  font-size: 14px;
  padding-top: 12px;
  margin-top: 8px;
  color: #3b82f6;
}

.total-label {
  color: #555;
}

.total-value {
  font-weight: 600;
  color: #333;
}

/* PAYMENT SCHEDULE (PREMIUM) */
.payment-schedule {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.payment-schedule-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  font-size: 12px;
}

.payment-item {
  display: grid;
  grid-template-columns: 100px 1fr 120px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 11px;
  border: 1px solid #f3f4f6;
}

.payment-item:last-child {
  margin-bottom: 0;
}

.payment-milestone {
  font-weight: 600;
  color: #3b82f6;
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

.condition-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.condition-section {
  margin-bottom: 16px;
}

.condition-title {
  font-weight: 600;
  font-size: 11px;
  margin-bottom: 6px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.condition-text {
  font-size: 10px;
  line-height: 1.6;
  color: #666;
}

/* KONTAKT BOX */
.contact-box {
  background: #f0f9ff;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 11px;
}

.contact-title {
  font-weight: 600;
  color: #0369a1;
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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

/* FOOTER */
.footer {
  margin-top: 60px;
  padding-top: 20px;
  border-top: 2px solid #3b82f6;
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

/* PAGE NUMBER */
.page-number {
  position: absolute;
  bottom: 30px;
  right: 40px;
  font-size: 9px;
  color: #999;
}
</style>
