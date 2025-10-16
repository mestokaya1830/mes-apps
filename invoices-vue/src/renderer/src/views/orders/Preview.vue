<template>
  <div>
    <h1>{{ title }}</h1>
    <!-- PREVIEW PANEL -->
    <div class="preview-panel">
      <div class="header">
        <div>
          <div class="company-name">{{ $store.state.auth.firm_name }}</div>
          <div class="company-details">
            {{ $store.state.auth.address }} {{ $store.state.auth.postal_code }},
            {{ $store.state.auth.city }}<br />
            Tel: {{ $store.state.auth.phone }} <br />{{ $store.state.auth.email }} <br />{{
              $store.state.auth.website
            }}
          </div>
        </div>
        <img :src="logoSrc" alt="" class="preview-logo" />
      </div>

      <div class="recipient">
        <div v-if="previewData && previewData.customer" class="recipient-address">
          <div>{{ previewData.customer.company_name }}</div>
          <div>{{ previewData.customer.address }}</div>
          <div>
            {{ previewData.customer.postal_code }} <br />{{ previewData.customer.city }} <br />
            {{ previewData.customer.country }}
          </div>
        </div>
        <div v-if="previewData && previewData.customer">
          <div class="meta-row">
            <span class="meta-label">Auftrags-Nr.:</span>
            <span class="meta-value">Auf-2025-00001</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Datum:</span>
            <span class="meta-value">{{ formatDate(previewData.order_grund.date) }} </span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Kunden-Nr.:</span>
            <span class="meta-value">{{ formattedCustomerNumber(previewData.customer.id) }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Leistung:</span>
            <span class="meta-value">{{ previewData.order_grund.service_period }}</span>
          </div>
        </div>
      </div>

      <div v-if="previewData && previewData.customer" class="intro-text">
        Sehr geehrte{{ previewData.customer?.gender === 'f' ? ' Frau' : 'r Herr' }}
        {{ previewData.customer?.last_name }},
        <br />
        vielen Dank für Ihre Auftragserteilung. Wir bestätigen Ihnen hiermit folgenden Auftrag:
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
        <tbody v-if="previewData?.order_grund?.positions?.length">
          <tr v-for="(item, index) in previewData.order_grund.positions" :key="index">
            <td>{{ index + 1 }}</td>

            <td>
              <div class="position-title">{{ item.title || '–' }}</div>
              <div v-if="item.description" class="position-description">
                {{ item.description }}
              </div>
            </td>

            <td class="center">{{ item.quantity ?? 0 }}</td>
            <td class="center">{{ item.unit || '' }}</td>

            <td class="right">
              {{ formatCurrency(item.price) }}
            </td>

            <td class="right">
              {{ item.vat != null ? item.vat + ' %' : '0 %' }}
            </td>

            <td class="right">
              {{ formatCurrency(item.unitTotal) }}
            </td>
          </tr>
        </tbody>

        <!-- Eğer hiç pozisyon yoksa -->
        <tbody v-else>
          <tr>
            <td colspan="7" class="center text-gray-500">Keine Positionen vorhanden</td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span class="total-label">Zwischensumme (netto):</span>
          <span class="total-value">{{
            formatCurrency($store.state.orderPreview.order_grund.subtotal)
          }}</span>
        </div>
        <div class="total-row">
          <span class="total-label">MwSt.:</span>
          <span class="total-value">{{
            formatCurrency($store.state.orderPreview.order_grund.vatAmount)
          }}</span>
        </div>
        <div class="total-row subtotal">
          <span class="total-label">Auftragsbetrag (brutto):</span>
          <span class="total-value">{{
            formatCurrency($store.state.orderPreview.order_grund.grandTotal)
          }}</span>
        </div>
      </div>
      <!-- KONTAKT BOX (PREMIUM FEATURE) -->
      <div v-if="$store.state.orderPreview.sprach_partner" class="contact-box">
        <div class="contact-title">👤 Ihre persönliche Ansprechpartnerin</div>
        <div class="contact-person">
          <div class="contact-avatar">SM</div>
          <div class="contact-details">
            <div class="contact-name">
              {{ $store.state.orderPreview.sprach_partner.fullname }}
            </div>
            <div class="contact-info">
              Projektmanagement & Kundenbetreuung<br />
              📞 +{{ $store.state.orderPreview.sprach_partner.phone }} <br />
              📧
              {{ $store.state.orderPreview.sprach_partner.email }}
            </div>
          </div>
        </div>
      </div>
      <div class="bank-box">
        <div class="bank-title">🏦 Bankverbindung</div>
        <div v-if="previewData && previewData.order_grund" class="bank-info">
          <span class="bank-label">Bank:</span>
          <span class="bank-value">{{ $store.state.auth.bank_name }}</span>
          <span class="bank-label">IBAN:</span>
          <span class="bank-value">{{ $store.state.auth.iban }}</span>
          <span class="bank-label">BIC:</span>
          <span class="bank-value">{{ $store.state.auth.bic }}</span>
          <span class="bank-label">Steuernummer:</span>
          <span class="bank-value">{{ $store.state.auth.tax_number }}</span>
          <span class="bank-label">USt-IdNr.:</span>
          <span class="bank-value">{{ $store.state.auth.vat_id }}</span>
        </div>
      </div>

      <div class="footer">
        <div>
          <strong>{{ $store.state.auth.firm_name }}</strong> • Geschäftsführer:
          {{ $store.state.auth.ceo }} • Amtsgericht {{ $store.state.auth.register_court }} HRB
          {{ $store.state.auth.register_number }}<br />
          USt-IdNr.: {{ $store.state.auth.vat_id }} • Steuer-Nr.: {{ $store.state.auth.tax_number }}
        </div>
        <router-link to="/orders/create" class="back-link">
          ← Zurück zur Auftragserstellung
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderPreview',
  inject: ['formattedCustomerNumber', 'formatCurrency', 'formatDate'],
  data() {
    return {
      title: 'Auftrag',
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
    getPreview() {
      this.previewData = this.$store.state.orderPreview
    }
  }
}
</script>
