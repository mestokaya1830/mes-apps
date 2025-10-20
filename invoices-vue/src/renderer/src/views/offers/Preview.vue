<template>
  <div>
    <h1>{{ title }}</h1>
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <div class="header">
          <div>
            <div class="company-name">{{ $store.state.auth.firm_name }}</div>
            <div class="company-details">
              {{ $store.state.auth.address }}<br />
              {{ $store.state.auth.postal_code }} {{ $store.state.auth.city }}<br />
              Tel: {{ $store.state.auth.phone }}<br />
              {{ $store.state.auth.email }}<br />
              {{ $store.state.auth.website }}
            </div>
          </div>
          <img :src="logoSrc" alt="Logo" class="preview-logo" />
        </div>

        <!-- Recipient & Invoice Details -->
        <div v-if="offerPreview?.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ offerPreview.selected_customer.company_name }}
            </div>
            <div>{{ offerPreview.selected_customer.address }}</div>
            <div>
              {{ offerPreview.selected_customer.postal_code }}
              {{ offerPreview.selected_customer.city }}
              {{ offerPreview.selected_customer.country }}
            </div>
          </div>

          <div class="invoice-details">
            <div class="section-title">Rechnungsdetails</div>
            <div class="meta-row">
              <span class="meta-label">AngebotNr.:</span>
              <span class="meta-value">{{ formatAngebotId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(offerPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">KundenNr:</span>
              <span class="meta-value">{{ formatCustomerId(offerPreview.selected_customer.id) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">SteuerNr.:</span>
              <span class="meta-value">{{ offerPreview.selected_customer.tax_number }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ offerPreview.selected_customer.vat_id }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Gültig bis:</span>
              <span class="meta-value">{{ validityDate(offerPreview.date, offerPreview.valid_days) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Rechtsgültigkeit:</span>
              <span class="meta-value">
                <span v-if="offerPreview.is_legal_validity">Verbindlich</span>
                <span v-else>Freibleibend</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Document Title -->
        <div v-if="$store.state.offerPreview" class="document-title">
          {{ $store.state.offerPreview.title || 'Angebot' }}
          <span class="validity-badge">Gültig {{ $store.state.offerPreview.valid_days }} Tage</span>
        </div>

        <!-- Reference Box -->
        <div class="reference-box">
          <div class="reference-label">📌 Bezug:</div>
          <div class="reference-text">
            Ihr Telefonat mit Frau Müller vom 01. Oktober 2024 • Projekt-ID: WEB-2024-042
          </div>
        </div>

        <!-- Intro Text -->
        <div v-if="offerPreview" class="intro-text intro-text-pro">
          Sehr geehrter Herr Weber,<br /><br />
          Wir freuen uns, Ihnen nachfolgend ein verbindliches Angebot auf Grundlage Ihrer Anfrage
          vom {{ formatDate(offerPreview.date) }} unterbreiten zu dürfen. Dieses Angebot umfasst die
          nachfolgend beschriebenen Leistungen/Produkte.
        </div>

        <!-- Positions Table -->
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
          <tbody v-if="offerPreview?.positions">
            <tr v-for="(item, index) in offerPreview.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">{{ item.description }}</div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ formatCurrency(item.price) }}</td>
              <td class="right">{{ item.vat != null ? item.vat + ' %' : '0 %' }}</td>
              <td class="right">{{ formatCurrency(item.unit_total) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Rabatt Info -->
        <div class="rabatt-info">
          <span class="rabatt-icon">🎉</span>
          <strong>Sonderrabatt für Neukunden: 10% auf die Gesamtsumme</strong>
        </div>

        <!-- Totals -->
        <div v-if="offerPreview" class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{ formatCurrency(offerPreview.subtotal) }}</span>
          </div>
          <div class="total-row rabatt">
            <span class="total-label">Rabatt 10%:</span>
            <span class="total-value">- {{ formatCurrency(offerPreview.discount) }}</span>
          </div>
          <div class="total-row subtotal">
            <span class="total-label">Summe nach Rabatt:</span>
            <span class="total-value">{{ formatCurrency(offerPreview.subtotal - offerPreview.discount) }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">MwSt. 19%:</span>
            <span class="total-value">{{ formatCurrency(offerPreview.vat_amount) }}</span>
          </div>
          <div class="total-row final">
            <span class="total-label">Gesamtbetrag (brutto):</span>
            <span class="total-value">{{ formatCurrency(offerPreview.total) }}</span>
          </div>
        </div>

        <!-- Delivery Info -->
        <div class="delivery-box">
          <div class="delivery-title">⏱️ Voraussichtliche Projektlaufzeit</div>
          <div>
            Die Fertigstellung erfolgt voraussichtlich 6-8 Wochen nach Angebotsannahme und Erhalt
            aller benötigten Inhalte (Texte, Bilder, Logos). Projektstart ist für den 15. Oktober 2024 geplant.
          </div>
        </div>

        <!-- Conditions -->
        <div class="conditions">
          <div class="condition-grid">
            <div class="condition-section">
              <div class="condition-title">💳 Zahlungsbedingungen</div>
              <div class="condition-text">
                • 50 % Anzahlung bei Auftragserteilung (sofern vereinbart).<br />
                • Restzahlung 50 % nach Abnahme.<br />
                • Zahlbar innerhalb von 14 Tagen nach Rechnungsdatum, netto ohne Abzug.
              </div>
            </div>

            <div class="condition-section">
              <div class="condition-title">📦 Leistungsumfang</div>
              <div class="condition-text">
                Die vereinbarten Leistungen/Produkte sind in diesem Angebot beschrieben. Hosting: Erstes Jahr inklusive, danach optional 15 €/Monat (sofern zutreffend).
              </div>
            </div>
          </div>

          <div class="condition-section">
            <div class="condition-title">📋 Gültigkeit des Angebots</div>
            <div class="condition-text legal-note-pro">
              Dieses Angebot ist bis einschließlich {{ validityDate(offerPreview.date, offerPreview.valid_days) }} gültig. Sämtliche Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer. Es gelten unsere Allgemeinen Geschäftsbedingungen (AGB).
            </div>
          </div>
        </div>

        <!-- Closing -->
        <div class="closing closing-pro">
          Für Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung. Wir freuen uns auf Ihre Auftragserteilung.<br /><br />
          Mit freundlichen Grüßen
        </div>

        <!-- Contact Person -->
        <div v-if="offerPreview.contact_person" class="contact-box">
          <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
          <div class="contact-person">
            <div class="contact-avatar">SM</div>
            <div class="contact-details">
              <div class="contact-name">{{ offerPreview.contact_person.full_name }}</div>
              <div class="contact-info">
                Projektmanagement & Kundenbetreuung<br />
                📞 +{{ offerPreview.contact_person.phone }} <br />
                📧 {{ offerPreview.contact_person.email }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer and Actions -->
      <FooterSide />
      <ActionsButton
        v-if="offerPreview.selected_customer"
        :email="offerPreview.selected_customer.email"
      />
    </div>

    <router-link to="/offers/create" class="back-link">
      ← Zurück zur Angebotserstellung
    </router-link>
  </div>
</template>

<script>
import FooterSide from '../../components/FooterSide.vue'
import ActionsButton from '../../components/ActionsButton.vue'

export default {
  name: 'OfferPreview',
  components: { FooterSide, ActionsButton },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate', 'validityDate'],
  data() {
    return {
      title: 'Angebot',
      offerPreview: {}
    }
  },
  computed: {
    logoSrc() {
      const logo = this.$store.state.auth.logo
      if (!logo) return null
      if (typeof logo === 'string') {
        if (logo.startsWith('data:image')) return logo
        return `data:image/png;base64,${logo}`
      }
      try {
        let binary = ''
        const bytes = new Uint8Array(Object.values(logo))
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
        return `data:image/png;base64,${window.btoa(binary)}`
      } catch (error) {
        console.error(error)
        return null
      }
    },
    formatAngebotId() {
      if (!this.offerPreview.id) return ''
      const year = new Date().getFullYear()
      return `ANG-${year}-${String(this.offerPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getOfferPreview()
  },
  methods: {
    getOfferPreview() {
      this.offerPreview = this.$store.state.offerPreview
    }
  }
}
</script>
