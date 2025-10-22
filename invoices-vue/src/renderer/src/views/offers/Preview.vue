<template>
  <div>
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSidePreview :title="title" :color="'orange'" />

        <!-- Recipient & offer Details -->
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
            <div class="section-title">Auftragsdetails</div>
            <div class="meta-row">
              <span class="meta-label">Auftrag-Nr.:</span>
              <span class="meta-value">{{ formatAuftragId }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">{{ formatDate(offerPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(offerPreview.selected_customer.id)
              }}</span>
            </div>

            <!-- Optional tax fields -->
            <div v-if="offerPreview.selected_customer.tax_number" class="meta-row">
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ offerPreview.selected_customer.tax_number }}</span>
            </div>
            <div v-if="offerPreview.selected_customer.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ offerPreview.selected_customer.vat_id }}</span>
            </div>
          </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
          Aangebotbestätigung
          <span v-if="offerPreview.project_ref" class="project-badge">
            Projekt: {{ offerPreview.project_ref }}
          </span>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          Sehr geehrter Herr Weber,<br /><br />
          vielen Dank für Ihre Auftragserteilung. Hiermit bestätigen wir den Eingang Ihres Auftrags
          auf Grundlage unseres Angebots vom {{ formatDate(offerPreview.offer_date) }}.
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
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ formatCurrency(item.price, offerPreview.currency) }}</td>
              <td class="right">{{ item.vat ? item.vat + ' %' : '0 %' }}</td>
              <td class="right">{{ formatCurrency(item.unit_total, offerPreview.currency) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(offerPreview.subtotal, offerPreview.currency)
            }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(offerPreview.vat_amount, offerPreview.currency)
            }}</span>
          </div>
          <div class="total-row subtotal">
            <span class="total-label">Gesamtbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(offerPreview.total, offerPreview.currency)
            }}</span>
          </div>
        </div>

        <!-- Project Info -->
        <div class="delivery-box">
          <div class="delivery-title">📅 Geplanter Projektstart</div>
          <div>
            Projektstart: {{ formatDate(offerPreview.project_start) }}<br />
            Voraussichtliche Dauer: {{ offerPreview.project_duration }} Wochen
          </div>
        </div>

        <!-- Payment Terms -->
        <div class="conditions">
          <div class="condition-section">
            <div class="condition-title">💳 Zahlungsbedingungen</div>
            <div class="condition-text">
              50 % Anzahlung bei Auftragserteilung, Restzahlung nach Abschluss des Projekts. Zahlbar
              innerhalb von 14 Tagen netto ohne Abzug.
            </div>
          </div>

          <div class="condition-section">
            <div class="condition-title">⚙️ Leistungsumfang</div>
            <div class="condition-text">
              Der Leistungsumfang entspricht dem Angebot Nr. {{ offerPreview.offer_ref }} und den
              besprochenen Anforderungen.
            </div>
          </div>
        </div>

        <!-- Closing -->
        <div class="closing closing-pro">
          Wir bedanken uns für Ihr Vertrauen und freuen uns auf eine erfolgreiche Zusammenarbeit.<br /><br />
          Mit freundlichen Grüßen
        </div>

        <!-- Contact Person -->
        <ContactPersonPreview
          v-if="offerPreview.contact_person"
          :data="offerPreview.contact_person"
        />
        <FooterSidePreview />
      </div>

      <ActionsButtonPreview
        v-if="offerPreview.selected_customer"
        :email="offerPreview.selected_customer.email"
        :file-name="title + ' ' + formatAuftragId"
      />
    </div>

    <router-link to="/offers/create" class="back-link">
      ← Zurück zur Auftragserstellung
    </router-link>
  </div>
</template>

<script>
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import FooterSidePreview from '../../components/preview/FooterSidePreview.vue'
import ActionsButtonPreview from '../../components/preview/ActionsButtonPreview.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'

export default {
  name: 'OfferPreview',
  components: { HeaderSidePreview, FooterSidePreview, ActionsButtonPreview, ContactPersonPreview },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Angebotbestätigung',
      offerPreview: {}
    }
  },
  computed: {
    formatAuftragId() {
      if (!this.offerPreview.id) return ''
      const year = new Date().getFullYear()
      return `AUF-${year}-${String(this.offerPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getofferPreview()
  },
  methods: {
    getofferPreview() {
      this.offerPreview = this.$store.state.offerPreview
    }
  }
}
</script>
