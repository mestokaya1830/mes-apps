<template>
  <div>
    <div class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <HeaderSide :title="title" :color="'orange'" />

        <!-- Recipient & Order Details -->
        <div v-if="orderPreview?.selected_customer" class="recipient">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ orderPreview.selected_customer.company_name }}
            </div>
            <div>{{ orderPreview.selected_customer.address }}</div>
            <div>
              {{ orderPreview.selected_customer.postal_code }}
              {{ orderPreview.selected_customer.city }}
              {{ orderPreview.selected_customer.country }}
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
              <span class="meta-value">{{ formatDate(orderPreview.date) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kunden-Nr.:</span>
              <span class="meta-value">{{
                formatCustomerId(orderPreview.selected_customer.id)
              }}</span>
            </div>

            <!-- Optional tax fields -->
            <div v-if="orderPreview.selected_customer.tax_number" class="meta-row">
              <span class="meta-label">Steuer-Nr.:</span>
              <span class="meta-value">{{ orderPreview.selected_customer.tax_number }}</span>
            </div>
            <div v-if="orderPreview.selected_customer.vat_id" class="meta-row">
              <span class="meta-label">USt-IdNr.:</span>
              <span class="meta-value">{{ orderPreview.selected_customer.vat_id }}</span>
            </div>
          </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
          Auftragsbestätigung
          <span v-if="orderPreview.project_ref" class="project-badge">
            Projekt: {{ orderPreview.project_ref }}
          </span>
        </div>

        <!-- Intro Text -->
        <div class="intro-text">
          Sehr geehrter Herr Weber,<br /><br />
          vielen Dank für Ihre Auftragserteilung. Hiermit bestätigen wir den Eingang Ihres Auftrags
          auf Grundlage unseres Angebots vom {{ formatDate(orderPreview.offer_date) }}.
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
          <tbody v-if="orderPreview?.positions">
            <tr v-for="(item, index) in orderPreview.positions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="position-title">{{ item.title }}</div>
                <div v-if="item.description" class="position-description">
                  {{ item.description }}
                </div>
              </td>
              <td class="center">{{ item.quantity }}</td>
              <td class="center">{{ item.unit }}</td>
              <td class="right">{{ formatCurrency(item.price, item.currency) }}</td>
              <td class="right">{{ item.vat ? item.vat + ' %' : '0 %' }}</td>
              <td class="right">{{ formatCurrency(item.unit_total, item.currency) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{
              formatCurrency(orderPreview.subtotal, orderPreview.currency)
            }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{
              formatCurrency(orderPreview.vat_amount, orderPreview.currency)
            }}</span>
          </div>
          <div class="total-row subtotal">
            <span class="total-label">Gesamtbetrag (brutto):</span>
            <span class="total-value">{{
              formatCurrency(orderPreview.total, orderPreview.currency)
            }}</span>
          </div>
        </div>

        <!-- Project Info -->
        <div class="delivery-box">
          <div class="delivery-title">📅 Geplanter Projektstart</div>
          <div>
            Projektstart: {{ formatDate(orderPreview.project_start) }}<br />
            Voraussichtliche Dauer: {{ orderPreview.project_duration }} Wochen
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
              Der Leistungsumfang entspricht dem Angebot Nr. {{ orderPreview.offer_ref }} und den
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
        <ContactPerson :data="orderPreview" />
        <FooterSide />
      </div>

      <ActionsButton
        v-if="orderPreview.selected_customer"
        :email="orderPreview.selected_customer.email"
        :file-name="title + ' ' + formatAuftragId"
      />
    </div>

    <router-link to="/orders/create" class="back-link">
      ← Zurück zur Auftragserstellung
    </router-link>
  </div>
</template>

<script>
import HeaderSide from '../../components/HeaderSide.vue'
import FooterSide from '../../components/FooterSide.vue'
import ActionsButton from '../../components/ActionsButton.vue'
import ContactPerson from '../../components/ContactPerson.vue'

export default {
  name: 'OrderPreview',
  components: { HeaderSide, FooterSide, ActionsButton, ContactPerson },
  inject: ['formatCustomerId', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Auftragsbestätigung',
      orderPreview: {}
    }
  },
  computed: {
    formatAuftragId() {
      if (!this.orderPreview.id) return ''
      const year = new Date().getFullYear()
      return `AUF-${year}-${String(this.orderPreview.id).padStart(5, '0')}`
    }
  },
  mounted() {
    this.getOrderPreview()
  },
  methods: {
    getOrderPreview() {
      this.orderPreview = this.$store.state.orderPreview
      console.log(this.orderPreview)
    }
  }
}
</script>
