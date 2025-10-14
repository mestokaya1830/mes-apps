<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <div class="page" style="position: relative">
      <!-- HEADER -->
      <div class="header">
        <div class="company-info">
          <div class="company-name">{{ $store.state.auth.firm_name }}</div>
          <div class="company-details">
            {{ $store.state.auth.firm_address }}<br />
            Tel: {{ $store.state.auth.firm_phone }} • Fax: {{ $store.state.auth.firm_fax }}<br />
            E-Mail: {{ $store.state.auth.firm_email }} • {{ $store.state.auth.firm_website }}
          </div>
        </div>
        <img :src="logoSrc" alt="" class="preview-logo" />
      </div>

      <!-- EMPFÄNGER -->
      <div class="recipient">
        <div class="sender-line">
          {{ $store.state.auth.firm_name }} • {{ $store.state.auth.firm_address }} •
          {{ $store.state.auth.firm_postal_code }} {{ $store.state.auth.firm_city }}
        </div>
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
            <span class="meta-label">Angebotsnummer:</span>
            <span class="meta-value">ANG-2024-001</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Angebotsdatum:</span>
            <span class="meta-value">04. Oktober 2024</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Kundennummer:</span>
            <span class="meta-value">KU-2024-042</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Gültig bis:</span>
            <span class="meta-value">03. November 2024</span>
          </div>
        </div>
      </div>

      <!-- TITEL -->
      <div v-if="$store.state.offerPreview" class="document-title">
        {{ $store.state.offerPreview.offer_grund.offer_title || 'Angebot' }}
        <span class="validity-badge">Gültig 30 Tage</span>
      </div>

      <!-- REFERENZ BOX (PREMIUM FEATURE) -->
      <div class="reference-box">
        <div class="reference-label">📌 Bezug:</div>
        <div class="reference-text">
          Ihr Telefonat mit Frau Müller vom 01. Oktober 2024 • Projekt-ID: WEB-2024-042
        </div>
      </div>

      <!-- EINLEITUNGSTEXT -->
      <div class="intro-text">
        Sehr geehrter Herr Weber,<br /><br />
        vielen Dank für Ihre Anfrage vom 01. Oktober 2024. Gerne unterbreiten wir Ihnen folgendes
        Angebot für die Erstellung Ihrer neuen Unternehmenswebsite sowie SEO-Optimierung:
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
              <div class="artikel-nr">
                Art.-Nr.: WEB-001 <span class="premium-badge">⭐ NEU</span>
              </div>
              <div class="position-description">
                Professionelles, modernes Webdesign mit responsivem Layout für Desktop, Tablet und
                Mobile. Inklusive 5 Unterseiten (Home, Über uns, Leistungen, Referenzen, Kontakt),
                Kontaktformular und Google Maps Integration.
              </div>
            </td>
            <td class="center">1</td>
            <td class="center">Pauschal</td>
            <td class="right">2.500,00 €</td>
            <td class="right">19%</td>
            <td class="right">2.500,00 €</td>
          </tr>
        </tbody>
      </table>

      <!-- RABATT INFO (PREMIUM FEATURE) -->
      <div class="rabatt-info">
        <span class="rabatt-icon">🎉</span>
        <strong>Sonderrabatt für Neukunden: 10% auf die Gesamtsumme</strong>
      </div>

      <!-- SUMMEN -->
      <div class="totals">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">4.450,00 €</span>
        </div>
        <div class="total-row rabatt">
          <span class="total-label">Rabatt 10%:</span>
          <span class="total-value">- 445,00 €</span>
        </div>
        <div class="total-row subtotal">
          <span class="total-label">Summe nach Rabatt:</span>
          <span class="total-value">4.005,00 €</span>
        </div>
        <div class="total-row">
          <span class="total-label">MwSt. 19%:</span>
          <span class="total-value">760,95 €</span>
        </div>
        <div class="total-row final">
          <span class="total-label">Gesamtbetrag (brutto):</span>
          <span class="total-value">4.765,95 €</span>
        </div>
      </div>

      <!-- LIEFERZEIT BOX (PREMIUM FEATURE) -->
      <div class="delivery-box">
        <div class="delivery-title">
          <span>⏱️</span>
          Voraussichtliche Projektlaufzeit
        </div>
        <div>
          Die Fertigstellung erfolgt voraussichtlich 6-8 Wochen nach Auftragserteilung und Erhalt
          aller benötigten Inhalte (Texte, Bilder, Logos). Projektstart ist für den 15. Oktober 2024
          geplant.
        </div>
      </div>

      <!-- BEDINGUNGEN -->
      <div class="conditions">
        <div class="condition-grid">
          <div class="condition-section">
            <div class="condition-title">
              <span class="condition-icon">💳</span>
              Zahlungsbedingungen
            </div>
            <div class="condition-text">
              • 50% Anzahlung bei Auftragserteilung<br />
              • 50% nach Abnahme und Freigabe<br />
              • Zahlbar innerhalb von 14 Tagen netto
            </div>
          </div>

          <div class="condition-section">
            <div class="condition-title">
              <span class="condition-icon">📦</span>
              Leistungsumfang
            </div>
            <div class="condition-text">
              Die Website wird auf unserem Server gehostet<br />
              Erstes Jahr inklusive<br />
              Danach 15 €/Monat (optional)
            </div>
          </div>
        </div>

        <div class="condition-section">
          <div class="condition-title">
            <span class="condition-icon">📋</span>
            Gültigkeit des Angebots
          </div>
          <div class="condition-text">
            Dieses Angebot ist gültig bis zum 03. November 2024. Preise verstehen sich in Euro
            inklusive der gesetzlichen Mehrwertsteuer. Es gelten unsere allgemeinen
            Geschäftsbedingungen (AGB), die diesem Angebot beiliegen.
          </div>
        </div>
      </div>

      <!-- SCHLUSSTEXT -->
      <div class="closing">
        Wir freuen uns auf Ihre Auftragserteilung und stehen Ihnen für Rückfragen jederzeit gerne
        zur Verfügung. Für weitere Details oder eine persönliche Besprechung können Sie sich gerne
        direkt an Frau Müller wenden.<br /><br />
        Mit freundlichen Grüßen
      </div>

      <!-- KONTAKT BOX (PREMIUM FEATURE) -->
      <div v-if="$store.state.offerPreview.sprachpartner.fullname" class="contact-box">
        <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
        <div class="contact-person">
          <div class="contact-avatar">SM</div>
          <div class="contact-details">
            <div class="contact-name">{{ $store.state.offerPreview.sprachpartner.fullname }}</div>
            <div class="contact-info">
              Projektmanagement & Kundenbetreuung<br />
              📞 +{{ $store.state.offerPreview.sprachpartner.phone }} • 📧
              {{ $store.state.offerPreview.sprachpartner.email }}
            </div>
          </div>
        </div>
      </div>

      <!-- UNTERSCHRIFT -->
      <div class="signature">
        <div class="signature-block">
          <div class="signature-line">Berlin, 04. Oktober 2024</div>
        </div>
        <div class="signature-block">
          <div class="signature-line">Unterschrift / Firmenstempel</div>
        </div>
      </div>

      <!-- QR CODE (PREMIUM FEATURE) -->
      <div class="qr-section">
        <div class="qr-code">
          QR CODE<br />
          📱
        </div>
        <div class="qr-label">Angebot online ansehen</div>
      </div>

      <!-- PAGE NUMBER -->
      <div class="page-number">Seite 1 von 1</div>

      <!-- FOOTER -->
      <div class="footer">
        <h2>{{ $store.state.auth.firm_name }}</h2>
        <p>© 2024 {{ $store.state.auth.firm_name }}. Alle Rechte vorbehalten.</p>
      </div>
      <div class="footer">
        <router-link to="/offers/create" class="back-link"
          >← Zurück zur Angebotserstellung</router-link
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Angebot'
    }
  },
  computed: {
    logoSrc() {
      const logo = this.$store.state.auth.logo
      if (!logo) return null
      if (typeof logo === 'string') {
        if (logo.startsWith('data:image')) {
          return logo
        }
        return `data:image/png;base64,${logo}`
      }
      try {
        let binary = ''
        const bytes = new Uint8Array(Object.values(logo))
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const base64 = window.btoa(binary)
        return `data:image/png;base64,${base64}`
      } catch (error) {
        console.error(error)
        return null
      }
    }
  }
}
</script>

<style scoped>
.page {
  width: 80%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: auto;
  padding: 40px;
  top: 20px;
}
/* HEADER mit Logo */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 3px solid #667eea;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.company-details {
  font-size: 11px;
  color: #666;
  line-height: 1.6;
}

/* EMPFÄNGER Adresse */
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

/* META INFORMATIONEN */
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
.preview-logo {
  width: 160px;
  height: 100px;
  object-fit: contain;
}
/* TITEL */
.document-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

.validity-badge {
  display: inline-block;
  background: #fff3cd;
  color: #856404;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  margin-left: 10px;
}

/* EINLEITUNGSTEXT */
.intro-text {
  margin-bottom: 25px;
  line-height: 1.6;
  font-size: 12px;
}

/* REFERENZ BOX (PREMIUM) */
.reference-box {
  background: #f0f9ff;
  border-left: 4px solid #667eea;
  padding: 12px 16px;
  margin-bottom: 25px;
  font-size: 11px;
}

.reference-label {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 4px;
}

.reference-text {
  color: #555;
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
  height: auto;
  margin-top: 10px;
}

/* ARTIKEL NUMMER (PREMIUM) */
.artikel-nr {
  font-size: 9px;
  color: #999;
  font-family: 'Courier New', monospace;
}

/* RABATT INFO (PREMIUM) */
.rabatt-info {
  background: #dcfce7;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 11px;
  color: #166534;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rabatt-icon {
  font-size: 16px;
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

.total-row.rabatt {
  color: #10b981;
}

.total-row.final {
  border-top: 2px solid #333;
  font-weight: bold;
  font-size: 14px;
  padding-top: 12px;
  margin-top: 8px;
  color: #667eea;
}

.total-label {
  color: #555;
}

.total-value {
  font-weight: 600;
  color: #333;
}

/* BEDINGUNGEN */
.conditions {
  margin-top: 40px;
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
  margin-bottom: 20px;
}

.condition-title {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 8px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.condition-icon {
  font-size: 14px;
}

.condition-text {
  font-size: 11px;
  line-height: 1.6;
  color: #555;
}

/* LIEFERZEIT BOX (PREMIUM) */
.delivery-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 11px;
}

.delivery-title {
  font-weight: 600;
  color: #92400e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* SCHLUSSTEXT */
.closing {
  margin-top: 30px;
  font-size: 12px;
  line-height: 1.6;
}

/* KONTAKT BOX (PREMIUM) */
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* UNTERSCHRIFT */
.signature {
  margin-top: 60px;
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
  margin-top: 50px;
}

/* FOOTER */
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  margin-top: 60px;
  border-top: 2px solid #667eea;
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

/* QR CODE (PREMIUM) */
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
