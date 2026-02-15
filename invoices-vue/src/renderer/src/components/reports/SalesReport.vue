<template>
  <div>
    <select v-model="date_range" class="inputs" @change="rangeDateFilter">
      <option value="" disabled>Wähle Daten</option>
      <option value="1">Diesen Monat</option>
      <option value="3">Letzte 3 Monate</option>
      <option value="6">Letzte 6 Monate</option>
      <option value="12">Letztes Jahr</option>
    </select>

    <div class="sections mt-20">
      <div class="form-row">
        <div class="form-group">
          <label> Von</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input
              ref="date_box_start"
              v-model="date_box_start"
              type="date"
              class="inputs date"
              @change="flexDateFilter"
            />
          </div>
        </div>
        <div class="form-group">
          <label> Bis</label>
          <div class="date-wrapper">
            <i class="bi bi-calendar3 calendar-icon"></i>
            <input
              ref="date_box_end"
              v-model="date_box_end"
              type="date"
              class="inputs date"
              @change="flexDateFilter"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="is_ready" class="printable">
      <div class="report-header-2">
        <div>
          <h2><i class="bi bi-pie-chart-fill icons"></i>{{ title }}</h2>
          <p class="report-period">
            <i class="bi bi-clock-history icons"></i> Zeitraum: {{ selectedPeriod }}
          </p>
        </div>
      </div>

      <!-- Genel Özet Kartları -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon text-primary"><i class="bi bi-cash-stack"></i></div>
          <div class="card-content">
            <p class="card-label">Gesamtumsatz (Brutto)</p>
            <h3 class="card-value">{{ formatCurrency(summary.total.amount) }}</h3>
            <p class="card-detail">{{ summary.total.count }} Rechnungen</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon text-success"><i class="bi bi-check-all"></i></div>
          <div class="card-content">
            <p class="card-label">Bezahlt</p>
            <h3 class="card-value">{{ formatCurrency(summary.paid.amount) }}</h3>
            <p class="card-detail">
              {{ summary.paid.count }} Rechnungen ({{ summary.paid.percentage }}%)
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon text-warning"><i class="bi bi-hourglass-split"></i></div>
          <div class="card-content">
            <p class="card-label">Ausstehend</p>
            <h3 class="card-value">{{ formatCurrency(summary.unpaid.amount) }}</h3>
            <p class="card-detail">
              {{ summary.unpaid.count }} Rechnungen ({{ summary.unpaid.percentage }}%)
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon text-info"><i class="bi bi-calculator"></i></div>
          <div class="card-content">
            <p class="card-label">Durchschnitt pro Rechnung</p>
            <h3 class="card-value">{{ formatCurrency(summary.average) }}</h3>
            <p class="card-detail">Ø Wert</p>
          </div>
        </div>
      </div>

      <InvoiceChart :chartData="summary" />

      <!-- UStVA Zusammenfassung -->
      <div class="ustva-section mt-4">
        <h3>
          <i class="bi bi-clipboard-data icons"></i>Umsatzsteuervoranmeldung (UStVA)
          Zusammenfassung
        </h3>

        <div class="ustva-alert alert alert-info d-flex align-items-center">
          <i class="bi bi-info-circle-fill icons"></i>
          <div class="ustva-alert-text">
            Dies ist eine vereinfachte Zusammenfassung für die UStVA. Bitte konsultieren Sie Ihren
            Steuerberater für die vollständige Meldung.
          </div>
        </div>

        <table class="ustva-table">
          <thead>
            <tr>
              <th>Kennziffer</th>
              <th>Beschreibung</th>
              <th class="text-right">Bemessungsgrundlage (Netto)</th>
              <th class="text-right">Steuer</th>
            </tr>
          </thead>
          <tbody>
            <!-- Steuerpflichtige Umsätze -->
            <tr class="section-header">
              <td colspan="4"><strong>Steuerpflichtige Umsätze (Zeile 20-42)</strong></td>
            </tr>
            <tr>
              <td><strong>81</strong></td>
              <td>zu 19% (Zeile 20)</td>
              <td class="text-right">{{ formatCurrency(ustva.line81.base) }}</td>
              <td class="text-right">{{ formatCurrency(ustva.line81.tax) }}</td>
            </tr>
            <tr>
              <td><strong>86</strong></td>
              <td>zu 7% (Zeile 21)</td>
              <td class="text-right">{{ formatCurrency(ustva.line86.base) }}</td>
              <td class="text-right">{{ formatCurrency(ustva.line86.tax) }}</td>
            </tr>

            <!-- Steuerfreie Umsätze -->
            <tr class="section-header">
              <td colspan="4"><strong>Steuerfreie Umsätze (Zeile 43-48)</strong></td>
            </tr>
            <tr>
              <td><strong>43</strong></td>
              <td>Steuerfreie Umsätze mit Vorsteuerabzug (z.B. Ausfuhrlieferungen, § 4 Nr. 1a, § 6 UStG)</td>
              <td class="text-right">{{ formatCurrency(ustva.line43.base) }}</td>
              <td class="text-right">-</td>
            </tr>
            <tr>
              <td><strong>48</strong></td>
              <td>Steuerfreie Umsätze ohne Vorsteuerabzug (§ 4 Nr. 8-28 UStG)</td>
              <td class="text-right">{{ formatCurrency(ustva.line48.base) }}</td>
              <td class="text-right">-</td>
            </tr>

            <!-- Innergemeinschaftliche Lieferungen -->
            <tr class="section-header">
              <td colspan="4">
                <strong>Innergemeinschaftliche Lieferungen (Zeile 49-51)</strong>
              </td>
            </tr>
            <tr>
              <td><strong>41</strong></td>
              <td>Innergemeinschaftliche Lieferungen (§ 4 Nr. 1b, § 6a UStG)</td>
              <td class="text-right">{{ formatCurrency(ustva.line41.base) }}</td>
              <td class="text-right">-</td>
            </tr>

            <!-- Reverse Charge -->
            <tr class="section-header">
              <td colspan="4">
                <strong>Leistungsempfänger als Steuerschuldner (§ 13b UStG)</strong>
              </td>
            </tr>
            <tr>
              <td><strong>60</strong></td>
              <td>Steuerpflichtige Umsätze (Leistungsempfänger schuldet die Steuer)</td>
              <td class="text-right">{{ formatCurrency(ustva.line60.base) }}</td>
              <td class="text-right">-</td>
            </tr>

            <!-- Gesamtsummen -->
            <tr class="ustva-total">
              <td><strong>83</strong></td>
              <td><strong>Verbleibende Umsatzsteuer (Zeile 83)</strong></td>
              <td class="text-right">
                <strong>{{ formatCurrency(ustva.totalBase) }}</strong>
              </td>
              <td class="text-right">
                <strong>{{ formatCurrency(ustva.totalTax) }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Kundentyp Analyse -->
      <div class="customer-analysis mt-4">
        <h3><i class="bi bi-people-fill icons"></i>Umsatzanalyse nach Kundentyp</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>Kundentyp</th>
              <th class="text-right">Anzahl Rechnungen</th>
              <th class="text-right">Nettobetrag</th>
              <th class="text-right">MwSt</th>
              <th class="text-right">Bruttobetrag</th>
              <th class="text-right">Anteil</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>B2B Deutschland</strong></td>
              <td class="text-right">{{ customerAnalysis.b2b_de.count }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_de.net) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_de.tax) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_de.gross) }}</td>
              <td class="text-right">{{ customerAnalysis.b2b_de.percentage }}%</td>
            </tr>
            <tr>
              <td><strong>B2B EU (Innergemeinschaftlich)</strong></td>
              <td class="text-right">{{ customerAnalysis.b2b_eu.count }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_eu.net) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_eu.tax) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_eu.gross) }}</td>
              <td class="text-right">{{ customerAnalysis.b2b_eu.percentage }}%</td>
            </tr>
            <tr>
              <td><strong>B2B Drittland (Nicht-EU)</strong></td>
              <td class="text-right">{{ customerAnalysis.b2b_third.count }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_third.net) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_third.tax) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2b_third.gross) }}</td>
              <td class="text-right">{{ customerAnalysis.b2b_third.percentage }}%</td>
            </tr>
            <tr>
              <td><strong>B2C (Endverbraucher)</strong></td>
              <td class="text-right">{{ customerAnalysis.b2c.count }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2c.net) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2c.tax) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.b2c.gross) }}</td>
              <td class="text-right">{{ customerAnalysis.b2c.percentage }}%</td>
            </tr>
            <tr>
              <td><strong>Reverse Charge (§ 13b UStG)</strong></td>
              <td class="text-right">{{ customerAnalysis.reverse_charge.count }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.reverse_charge.net) }}</td>
              <td class="text-right">{{ formatCurrency(customerAnalysis.reverse_charge.tax) }}</td>
              <td class="text-right">
                {{ formatCurrency(customerAnalysis.reverse_charge.gross) }}
              </td>
              <td class="text-right">{{ customerAnalysis.reverse_charge.percentage }}%</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td><strong>GESAMT</strong></td>
              <td class="text-right"><strong>{{ summary.total.count }}</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(taxTotals.net) }}</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(taxTotals.tax) }}</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(taxTotals.gross) }}</strong></td>
              <td class="text-right"><strong>100%</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- MwSt-Aufschlüsselung -->
      <div class="tax-breakdown mt-4">
        <h3><i class="bi bi-receipt-cutoff icons"></i>MwSt-Aufschlüsselung nach Steuersatz</h3>
        <table class="tax-table">
          <thead>
            <tr>
              <th>MwSt-Satz</th>
              <th>Beschreibung</th>
              <th class="text-right">Nettobetrag</th>
              <th class="text-right">MwSt-Betrag</th>
              <th class="text-right">Bruttobetrag</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in taxBreakdown" :key="item.rate">
              <td><strong>{{ item.rate }}%</strong></td>
              <td>{{ item.description }}</td>
              <td class="amount text-right">{{ formatCurrency(item.net) }}</td>
              <td class="amount text-right">{{ formatCurrency(item.tax) }}</td>
              <td class="amount text-right">{{ formatCurrency(item.gross) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="2"><strong>SUMME</strong></td>
              <td class="amount text-right">
                <strong>{{ formatCurrency(taxTotals.net) }}</strong>
              </td>
              <td class="amount text-right">
                <strong>{{ formatCurrency(taxTotals.tax) }}</strong>
              </td>
              <td class="amount text-right">
                <strong>{{ formatCurrency(taxTotals.gross) }}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Kleinunternehmer Hinweis -->
      <div v-if="isKleinunternehmer" class="alert alert-warning mt-4">
        <i class="bi bi-exclamation-triangle-fill icons"></i>
        <strong>Kleinunternehmerregelung (§ 19 UStG):</strong> Wenn Sie die
        Kleinunternehmerregelung anwenden, müssen Sie keine Umsatzsteuer abführen. Dieser Bericht
        dient nur zur Information.
      </div>
    </div>
      <div class="sections btn-container">
      <button class="btn btn-pdf" @click="savePdf()">
        <i class="bi bi-file-earmark-pdf icons"></i>PDF Exportieren
      </button>
      <button class="btn btn-print" @click="printDocument()">
        <i class="bi bi-printer icons"></i>Drucken
      </button>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import InvoiceChart from '../chart/InvoiceChart.vue'

export default {
  name: 'SalesReport',
  components: {
    InvoiceChart
  },
  inject: ['formatDate', 'formatCurrency'],
  data() {
    return {
      title: 'Umsatzbericht (Deutscher Standard)',
      reports: [],
      date_range: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false,
      isKleinunternehmer: false // Bu değer ayarlardan gelmeli
    }
  },
  computed: {
    selectedPeriod() {
      if (!this.period.start || !this.period.end) return ''
      return this.formatDate(this.period.start) + ' - ' + this.formatDate(this.period.end)
    },

    summary() {
      if (!Array.isArray(this.reports) || this.reports.length === 0) {
        return {
          total: { amount: 0, count: 0 },
          paid: { amount: 0, count: 0, percentage: 0 },
          unpaid: { amount: 0, count: 0, percentage: 0 },
          average: 0
        }
      }

      const totalAmount = this.reports.reduce((sum, item) => sum + Number(item.gross_total || 0), 0)
      const totalCount = this.reports.length

      const paidItems = this.reports.filter((item) => item.payment_status === 'paid')
      const paidAmount = paidItems.reduce((sum, item) => sum + Number(item.gross_total || 0), 0)
      const paidCount = paidItems.length

      const unpaidItems = this.reports.filter((item) => item.payment_status === 'unpaid')
      const unpaidAmount = unpaidItems.reduce((sum, item) => sum + Number(item.gross_total || 0), 0)
      const unpaidCount = unpaidItems.length

      return {
        total: {
          amount: totalAmount,
          count: totalCount
        },
        paid: {
          amount: paidAmount,
          count: paidCount,
          percentage: totalAmount ? Math.round((paidAmount / totalAmount) * 100) : 0
        },
        unpaid: {
          amount: unpaidAmount,
          count: unpaidCount,
          percentage: totalAmount ? Math.round((unpaidAmount / totalAmount) * 100) : 0
        },
        average: totalCount ? totalAmount / totalCount : 0
      }
    },

    ustva() {
      const line81 = { base: 0, tax: 0 } // 19% MwSt
      const line86 = { base: 0, tax: 0 } // 7% MwSt
      const line43 = { base: 0 } // Steuerfreie Ausfuhrlieferungen
      const line48 = { base: 0 } // Steuerfreie Umsätze ohne Vorsteuerabzug
      const line41 = { base: 0 } // Innergemeinschaftliche Lieferungen
      const line60 = { base: 0 } // Reverse Charge

      if (!Array.isArray(this.reports)) {
        return { line81, line86, line43, line48, line41, line60, totalBase: 0, totalTax: 0 }
      }

      this.reports.forEach((invoice) => {
        if (!Array.isArray(invoice.positions)) return

        const customerType = this.getCustomerType(invoice)

        invoice.positions.forEach((pos) => {
          const rate = Number(pos.vat) || 0
          const quantity = Number(pos.quantity) || 0
          const price = Number(pos.price) || 0
          const net = price * quantity
          const tax = (net * rate) / 100

          // Normal steuerpflichtige Umsätze
          if (customerType === 'b2b_de' || customerType === 'b2c') {
            if (rate === 19) {
              line81.base += net
              line81.tax += tax
            } else if (rate === 7) {
              line86.base += net
              line86.tax += tax
            } else if (rate === 0) {
              // Kann verschiedene Gründe haben
              line48.base += net
            }
          }
          // Innergemeinschaftliche Lieferungen (EU B2B)
          else if (customerType === 'b2b_eu') {
            line41.base += net
          }
          // Ausfuhrlieferungen (Drittland)
          else if (customerType === 'b2b_third') {
            line43.base += net
          }
          // Reverse Charge
          else if (customerType === 'reverse_charge') {
            line60.base += net
          }
        })
      })

      return {
        line81,
        line86,
        line43,
        line48,
        line41,
        line60,
        totalBase: line81.base + line86.base + line43.base + line48.base + line41.base + line60.base,
        totalTax: line81.tax + line86.tax
      }
    },

    customerAnalysis() {
      const analysis = {
        b2b_de: { count: 0, net: 0, tax: 0, gross: 0, percentage: 0 },
        b2b_eu: { count: 0, net: 0, tax: 0, gross: 0, percentage: 0 },
        b2b_third: { count: 0, net: 0, tax: 0, gross: 0, percentage: 0 },
        b2c: { count: 0, net: 0, tax: 0, gross: 0, percentage: 0 },
        reverse_charge: { count: 0, net: 0, tax: 0, gross: 0, percentage: 0 }
      }

      if (!Array.isArray(this.reports)) return analysis

      this.reports.forEach((invoice) => {
        const customerType = this.getCustomerType(invoice)
        const net = Number(invoice.net_total) || 0
        const tax = Number(invoice.vat_total) || 0
        const gross = Number(invoice.gross_total) || 0

        if (analysis[customerType]) {
          analysis[customerType].count++
          analysis[customerType].net += net
          analysis[customerType].tax += tax
          analysis[customerType].gross += gross
        }
      })

      // Yüzde hesaplama
      const totalGross = this.summary.total.amount
      Object.keys(analysis).forEach((key) => {
        analysis[key].percentage = totalGross
          ? Math.round((analysis[key].gross / totalGross) * 100)
          : 0
      })

      return analysis
    },

    taxBreakdown() {
      if (!Array.isArray(this.reports) || this.reports.length === 0) return []

      const taxMap = {}

      this.reports.forEach((invoice) => {
        if (!Array.isArray(invoice.positions)) return

        invoice.positions.forEach((pos) => {
          const rate = Number(pos.vat) || 0
          const quantity = Number(pos.quantity) || 0
          const price = Number(pos.price) || 0
          const gross = price * quantity
          const net = gross / (1 + rate / 100)
          const tax = gross - net

          if (!taxMap[rate]) {
            taxMap[rate] = { net: 0, tax: 0, gross: 0 }
          }

          taxMap[rate].net += net
          taxMap[rate].tax += tax
          taxMap[rate].gross += gross
        })
      })

      return Object.keys(taxMap)
        .sort((a, b) => Number(b) - Number(a))
        .map((rate) => ({
          rate: Number(rate),
          description: this.getVatDescription(Number(rate)),
          net: taxMap[rate].net,
          tax: taxMap[rate].tax,
          gross: taxMap[rate].gross
        }))
    },

    taxTotals() {
      return this.taxBreakdown.reduce(
        (totals, item) => ({
          net: totals.net + item.net,
          tax: totals.tax + item.tax,
          gross: totals.gross + item.gross
        }),
        { net: 0, tax: 0, gross: 0 }
      )
    }
  },

  methods: {
    async rangeDateFilter() {
      if (!this.date_range) return

      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth() - this.date_range, 1)
      const endDate = new Date(today.getFullYear(), today.getMonth(), 0)

      this.date_box_start = startDate.toISOString().slice(0, 10)
      this.date_box_end = endDate.toISOString().slice(0, 10)

      this.getReport()
    },

    flexDateFilter() {
      if (!this.date_box_start) {
        this.$refs.date_box_start.focus()
        return
      }
      if (!this.date_box_end) {
        this.$refs.date_box_end.focus()
        return
      }
      if (this.date_box_start > this.date_box_end) {
        this.date_box_end = ''
        this.$refs.date_box_end.focus()
        return
      }

      this.getReport()
    },

    async getReport() {
      if (!this.date_box_start || !this.date_box_end) return

      const data = {
        start: this.date_box_start,
        end: this.date_box_end
      }

      const result = await window.api.reportSales(data)

      if (!result.success) return

      this.reports = result.rows.map((item) => ({
        ...item,
        positions: JSON.parse(item.positions || '[]'),
        customer: item.customer ? JSON.parse(item.customer) : null
      }))

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }

      this.is_ready = true
    },

    getCustomerType(invoice) {
      // Bu fonksiyon müşteri bilgisine göre türü belirler
      // Gerçek implementasyon customer verisine bağlı
      
      if (!invoice.customer) return 'b2c'

      const customer = invoice.customer
      const countryCode = customer.country_code || 'DE'
      const hasVatId = customer.vat_id && customer.vat_id.trim() !== ''
      const isReverseCharge = invoice.reverse_charge || false

      // Reverse Charge kontrolü
      if (isReverseCharge) return 'reverse_charge'

      // EU ülkeleri listesi (basitleştirilmiş)
      const euCountries = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
      ]

      // B2B mi B2C mi?
      const isB2B = hasVatId || customer.is_company

      if (countryCode === 'DE') {
        return isB2B ? 'b2b_de' : 'b2c'
      } else if (euCountries.includes(countryCode)) {
        return isB2B ? 'b2b_eu' : 'b2c'
      } else {
        return isB2B ? 'b2b_third' : 'b2c'
      }
    },

    getVatDescription(rate) {
      const descriptions = {
        19: 'Regelsteuersatz',
        7: 'Ermäßigter Steuersatz',
        0: 'Steuerfrei / Nicht steuerbar',
        5: 'Sondersteuersatz (z.B. Landwirtschaft)',
        16: 'Reduzierter Steuersatz (COVID-19 Zeitraum)',
        5: 'Reduzierter Steuersatz (COVID-19 Zeitraum)'
      }
      return descriptions[rate] || `${rate}% MwSt`
    },
    async savePdf() {
      await this.$nextTick()
      const element = document.querySelector('.printable')
      if (!element) return

      const fileName = `Umsatzberichte-${this.formatDate(this.period.start)} - ${this.formatDate(this.period.end)}`
      const options = {
        margin: 16,
        filename: fileName + '.jpeg',
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: { scale: 1, useCORS: true, logging: false, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      try {
        const pdf = await html2pdf().set(options).from(element).toPdf().output('blob')
        if (!pdf) return

        const url = URL.createObjectURL(pdf)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName + '.pdf'
        a.click()
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('PDF save error:', err)
      }
    },
     printDocument() {
      window.print()
    }
  }
}
</script>

<style scoped>
.section-header {
  background-color: #f8f9fa;
  font-weight: 600;
}

.ustva-alert {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.5rem;
}

.ustva-alert-text {
  margin-left: 0.5rem;
}
</style>