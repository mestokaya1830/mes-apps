<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <div class="preview-panel">
      <!-- HEADER -->
      <div class="header">
        <div class="company-info">
          <div class="company-name">{{ $store.state.auth.firm_name }}</div>
          <div class="company-details">
            {{ $store.state.auth.address }} {{ $store.state.auth.postal_code }}
            {{ $store.state.auth.city }}<br />
            Tel: {{ $store.state.auth.phone }} <br />
            E-Mail: {{ $store.state.auth.email }} <br />
            {{ $store.state.auth.website }}
          </div>
        </div>
        <img :src="logoSrc" alt="" class="preview-logo" />
      </div>

      <!-- EMPFÄNGER -->
      <div class="recipient">
        <div class="recipient-address">
          <div class="recipient-name">Herrn Maximilian Weber</div>
          <div>Weber Consulting GmbH</div>
          <div>Friedrichstraße 158</div>
          <div>10117 Berlin</div>
        </div>
        <!-- META INFORMATIONEN -->
        <div v-if="previewData && previewData.customer">
          <div class="meta-row">
            <span class="meta-label">AngebotNr.:</span>
            <span class="meta-value">ANG-2024-001</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ previewData.offer_grund.offer_date }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">KundenNr:</span>
            <span class="meta-value">{{ formattedCustomerNumber(previewData.customer.id) }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">SteuerNr.:</span>
            <span class="meta-value">{{ previewData.customer.tax_number }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">USt-IdNr.:</span>
            <span class="meta-value">{{ previewData.customer.vat_id }}</span>
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
            <th style="width: 40%">Bezeichnung</th>
            <th class="center" style="width: 8%">Menge</th>
            <th class="center" style="width: 10%">Einheit</th>
            <th class="right" style="width: 12%">Einzelpreis</th>
            <th class="right" style="width: 10%">MwSt.</th>
            <th class="right" style="width: 15%">Gesamtpreis</th>
          </tr>
        </thead>
        <tbody v-if="previewData && previewData.offer_grund && previewData.offer_grund.positions">
          <tr v-for="(item, index) in previewData.offer_grund.positions" :key="index">
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
      <div v-if="$store.state.offerPreview.sprach_partner" class="contact-box">
        <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
        <div class="contact-person">
          <div class="contact-avatar">SM</div>
          <div class="contact-details">
            <div class="contact-name">{{ $store.state.offerPreview.sprach_partner.fullname }}</div>
            <div class="contact-info">
              Projektmanagement & Kundenbetreuung<br />
              📞 +{{ $store.state.offerPreview.sprach_partner.phone }} <br />
              📧
              {{ $store.state.offerPreview.sprach_partner.email }}
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
  name: 'OfferPreview',
  inject: ['formattedCustomerNumber'],
  data() {
    return {
      title: 'Angebot',
      previewData: {}
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
  },
  mounted() {
    this.getPreview()
  },
  methods: {
    async getPreview() {
      this.previewData = await this.$store.state.offerPreview
    }
  }
}
</script>
