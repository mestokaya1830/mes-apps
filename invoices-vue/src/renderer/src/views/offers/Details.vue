<template>
  <main v-if="offer && auth" class="main-container">
    <header class="main-header-right">
      <router-link to="/offers" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle-fill icons" aria-hidden="true"></i>Zurück
      </router-link>
    </header>
    <div class="printable">
      <!-- Header -->
      <HeaderSidePreview :title="title" :auth="auth" />

      <!-- customers -->
      <section class="recipient">
        <div class="recipient-section">
          <div class="recipient-address">
            <div class="section-title">Empfänger</div>
            <div class="company-name-subtitle">
              {{ offer.customer.company_name }}
            </div>
            <div class="meta-label">{{ offer.customer.address }}</div>
            <div class="meta-label">
              {{ offer.customer.postal_code }}
              {{ offer.customer.city }}<br />
              {{ offer.customer.country }}
            </div>
          </div>
        </div>
        <dl class="invoice-details">
          <div class="section-title">Angebotsdetails</div>

          <div class="recipient-row">
            <dt class="meta-label">Angebots-Nr.:</dt>
            <dd class="meta-value">{{ formatOfferId(offer.id) }}</dd>
          </div>

          <div class="recipient-row">
            <dt class="meta-label">Datum:</dt>
            <dd class="meta-value">{{ formatDate(offer.date) }}</dd>
          </div>

          <!-- Leistungsdatum hinzugefügt -->
          <div v-if="offer.service_date" class="recipient-row">
            <dt class="meta-label">Leistungsdatum:</dt>
            <dd class="meta-value">{{ formatDate(offer.service_date) }}</dd>
          </div>

          <div class="recipient-row">
            <dt class="meta-label">Kunden-Nr.:</dt>
            <dd class="meta-value">{{ formatCustomerId(offer.customer.id) }}</dd>
          </div>

          <div class="recipient-row">
            <dt class="meta-label">Steuer-Nr.:</dt>
            <dd class="meta-value">{{ offer.customer.vat_id }}</dd>
          </div>

          <div v-if="offer.valid_until" class="recipient-row">
            <dt class="meta-label">Gültig bis:</dt>
            <dd class="meta-value">{{ formatDate(offer.valid_until) }}</dd>
          </div>
        </dl>
      </section>

      <!-- Document Title -->
      <section class="document-title">
        <h1>{{ offer.title || 'Angebot' }}</h1>
      </section>

      <!-- Subject / Description -->
      <section class="form-group">
        <label class="form-label">Betreff / Beschreibung</label>
        <div class="intro-text">
          {{ offer.subject }}
        </div>
      </section>

      <!-- Intro Text -->
      <div class="intro-text">
        Sehr geehrte Damen und Herren,<br /><br />
        vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen folgendes Angebot:
      </div>

      <div>
        <div class="section-title">introduction_text</div>
        <div class="intro-text">
          {{ offer.introduction_text }}
        </div>
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

        <tbody v-if="offer.positions && offer.positions.length > 0">
          <tr v-for="(item, index) in offer.positions" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="position-title">{{ item.title }}</div>
              <div v-if="item.description" class="position-description">
                {{ item.description }}
              </div>
              <div
                v-if="item.service_period_start && item.service_period_end"
                class="position-service-period"
              >
                Leistungszeitraum: {{ formatDate(item.service_period_start) }} -
                {{ formatDate(item.service_period_end) }}
              </div>
            </td>
            <td class="center">{{ item.quantity }}</td>
            <td class="center">{{ item.unit }}</td>
            <td class="right">{{ formatCurrency(item.price, offer.currency) }}</td>
            <td class="right">
              {{ offer.is_reverse_charge ? '0%' : item.vat + '%' }}
            </td>
            <td class="right">
              {{ formatCurrency(item.unit_total, offer.currency) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- summary -->
      <div class="summary-section">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">{{ formatCurrency(offer.net_total, offer.currency) }}</span>
        </div>

        <div class="total-row">
          <span class="total-label">MwSt.:</span>
          <span class="total-value">{{ formatCurrency(offer.vat_total, offer.currency) }}</span>
        </div>

        <div class="total-row subtotal">
          <span class="total-label">Rechnungsbetrag (brutto):</span>
          <span class="total-value">{{ formatCurrency(offer.gross_total, offer.currency) }}</span>
        </div>
      </div>

      <!-- Payment Terms -->
      <div class="payment-section">
        <div class="section-heading">Zahlungsbedingungen</div>
        <div class="payment-content">
          <p>
            Zahlbar innerhalb <strong>{{ offer.payment_terms }} Tagen</strong> netto nach
            Rechnungsdatum.
          </p>
        </div>
      </div>
      <!-- delivery Terms -->
      <div class="payment-section">
        <div class="section-heading">Lieferung terms</div>
        <div class="payment-content">
          <p>{{ offer.delivery_terms }}</p>
          <p>{{ offer.delivery_time }}</p>
        </div>
      </div>

      <!-- Closing -->
      <div class="closing">
        Wir freuen uns auf Ihre Rückmeldung und stehen für Rückfragen gerne zur Verfügung.<br /><br />
        Mit freundlichen Grüßen
      </div>

      <div>
        <h2 class="section-title">Notes</h2>
        <div class="intro-text">
          {{ offer.notes }}
        </div>
      </div>
      <div>
        <h2 class="section-title">closing_text</h2>
        <div class="intro-text">
          {{ offer.closing_text }}
        </div>
      </div>

      <!-- Contact Person -->
      <ContactPersonPreview v-if="auth.contact_person" :contactData="auth.contact_person" />

      <!-- leagal validity -->
      <section v-if="offer.is_legal" class="pdf-footer">
        <label style="display: flex; align-items: center; gap: 8px">
          <input type="checkbox" checked disabled style="width: 16px; height: 16px" />
          Rechtsgültige Unterschrift erforderlich
        </label>

        <div
          class="signature-box"
          style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px"
        >
          <div class="signature-line">
            <div>_____________________________</div>
            <div class="signature-label">Ort, Datum</div>
          </div>
          <div class="signature-line">
            <div>_____________________________</div>
            <div class="signature-label">Unterschrift</div>
          </div>
        </div>
      </section>
    </div>
    <!-- Action Buttons -->
    <OfferActions v-if="offer" :tableData="offer" :fileName="actionFileName" s />

    <router-link to="/offers" class="back-link"> ← Zurück zur Angebotsliste </router-link>
  </main>
</template>

<script>
import store from '../../store/store.js'
import HeaderSidePreview from '../../components/preview/HeaderSidePreview.vue'
import OfferActions from '../../components/preview/OfferActions.vue'
import ContactPersonPreview from '../../components/preview/ContactPersonPreview.vue'
export default {
  name: 'OfferDetails',
  components: {
    HeaderSidePreview,
    ContactPersonPreview,
    OfferActions
  },
  inject: ['formatOfferId', 'formatCustomerId', 'formatDate', 'formatValidDays', 'formatCurrency'],
  data() {
    return {
      title: 'Angebot-Details',
      offer: null,
      auth: null
    }
  },
  computed: {
    actionFileName() {
      if (!this.offer) return
      return this.formatOfferId(this.offer.id)
    }
  },
  mounted() {
    this.getOffer()
    this.getAuth()
  },
  methods: {
    async getOffer() {
      try {
        const result = await window.api.getOfferById(this.$route.params.id)
        this.offer = {
          ...result.rows,
          customer: JSON.parse(result.rows.customer),
          positions: JSON.parse(result.rows.positions)
        }
      } catch (error) {
        console.error(error)
      }
    },
    getAuth() {
      if (store.state.auth) {
        this.auth = store.state.auth
      }
    }
  }
}
</script>
