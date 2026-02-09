<template>
  <div>
    <!-- Tarih Filtreleri -->
    <div class="filter-section">
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

      <!-- Export & Aktionen Buttons -->
      <div class="export-buttons mt-20" v-if="is_ready">
        <button @click="exportExcel" class="btn btn-success">
          <i class="bi bi-file-excel"></i> Excel Export
        </button>
        <button @click="exportCSV" class="btn btn-primary">
          <i class="bi bi-filetype-csv"></i> CSV Export
        </button>
        <button @click="exportPDF" class="btn btn-secondary">
          <i class="bi bi-file-pdf"></i> PDF Export
        </button>
        <button @click="createMahnungen" class="btn btn-warning" v-if="summary.overdue_count > 0">
          <i class="bi bi-envelope-exclamation"></i> Mahnungen erstellen
          ({{ summary.overdue_count }})
        </button>
        <button @click="window.print()" class="btn btn-outline">
          <i class="bi bi-printer"></i> Drucken
        </button>
      </div>
    </div>

    <div v-if="is_ready" class="printable">
      <!-- Header -->
      <div class="report-header-2">
        <div>
          <h2><i class="bi bi-file-earmark-bar-graph me-2"></i>{{ title }}</h2>
          <p class="report-period">
            <i class="bi bi-clock me-1 icons"></i> Zeitraum: {{ selectedPeriod }}
          </p>
          <p class="report-generated">
            Erstellt am: {{ formatDate(new Date().toISOString()) }} um {{ currentTime }}
          </p>
        </div>
      </div>

      <!-- Hauptkennzahlen -->
      <div class="report-summary-cards">
        <div class="report-summary-card">
          <div class="card-icon text-primary"><i class="bi bi-bar-chart-fill"></i></div>
          <div class="card-content">
            <p class="card-label">Gesamtumsatz</p>
            <h3 class="card-value">{{ formatCurrency(summary.all_total) }}</h3>
            <p class="card-detail">{{ summary.all_count }} Rechnungen</p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon text-success"><i class="bi bi-check-circle-fill"></i></div>
          <div class="card-content">
            <p class="card-label">Bezahlt</p>
            <h3 class="card-value">{{ formatCurrency(summary.paid_total) }}</h3>
            <p class="card-detail">
              {{ summary.paid_count }} Rechnungen ({{ setPercentage.paid_percentage }})
            </p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon text-info"><i class="bi bi-pie-chart-fill"></i></div>
          <div class="card-content">
            <p class="card-label">Teilweise Bezahlt</p>
            <h3 class="card-value">{{ formatCurrency(summary.partially_paid_total) }}</h3>
            <p class="card-detail">
              {{ summary.partially_paid_count }} Rechnungen ({{
                setPercentage.partially_paid_percentage
              }})
            </p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon text-secondary"><i class="bi bi-hourglass-split"></i></div>
          <div class="card-content">
            <p class="card-label">Offen (noch nicht fällig)</p>
            <h3 class="card-value">{{ formatCurrency(summary.unpaid_not_due_total) }}</h3>
            <p class="card-detail">
              {{ summary.unpaid_not_due_count }} Rechnungen
            </p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon text-danger"><i class="bi bi-exclamation-triangle-fill"></i></div>
          <div class="card-content">
            <p class="card-label">Überfällig</p>
            <h3 class="card-value">{{ formatCurrency(summary.overdue_total) }}</h3>
            <p class="card-detail">
              {{ summary.overdue_count }} Rechnungen ({{ setPercentage.overdue_percentage }})
            </p>
          </div>
        </div>
      </div>

      <!-- Erweiterte Kennzahlen -->
      <div class="extended-metrics mt-4">
        <h3><i class="bi bi-graph-up icons"></i>Debitorenbuchhaltung - Kennzahlen</h3>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-calendar-range"></i></div>
            <div class="metric-content">
              <p class="metric-label">DSO (Days Sales Outstanding)</p>
              <h4 class="metric-value">{{ dsoMetrics.dso }} Tage</h4>
              <p class="metric-detail">Ø Zahlungsziel</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-speedometer2"></i></div>
            <div class="metric-content">
              <p class="metric-label">Durchschn. Zahlungsdauer</p>
              <h4 class="metric-value">{{ paymentMetrics.avgPaymentDays }} Tage</h4>
              <p class="metric-detail">Bei bezahlten Rechnungen</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-percent"></i></div>
            <div class="metric-content">
              <p class="metric-label">Pünktliche Zahlungsquote</p>
              <h4 class="metric-value">{{ paymentMetrics.onTimePaymentRate }}%</h4>
              <p class="metric-detail">Bezahlt vor/am Fälligkeitsdatum</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-cash-coin"></i></div>
            <div class="metric-content">
              <p class="metric-label">Ø Rechnungsbetrag</p>
              <h4 class="metric-value">{{ formatCurrency(summary.avg_invoice_amount) }}</h4>
              <p class="metric-detail">Durchschnitt pro Rechnung</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-hourglass"></i></div>
            <div class="metric-content">
              <p class="metric-label">Älteste überfällige Rechnung</p>
              <h4 class="metric-value">{{ overdueMetrics.oldestOverdueDays }} Tage</h4>
              <p class="metric-detail">{{ overdueMetrics.oldestInvoiceNumber }}</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-currency-euro"></i></div>
            <div class="metric-content">
              <p class="metric-label">Verzugszinsen (gesamt)</p>
              <h4 class="metric-value">{{ formatCurrency(overdueMetrics.totalLateFees) }}</h4>
              <p class="metric-detail">Basiszins + 9% p.a.</p>
            </div>
          </div>
        </div>
      </div>

      <InvoiceChart :chartData="chartData" />

      <!-- Mahnstufen Übersicht -->
      <div class="dunning-overview mt-4" v-if="summary.overdue_count > 0">
        <h3><i class="bi bi-envelope-exclamation icons"></i>Mahnstufen-Übersicht</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>Mahnstufe</th>
              <th>Beschreibung</th>
              <th class="text-right">Anzahl</th>
              <th class="text-right">Gesamtbetrag</th>
              <th class="text-right">Mahngebühren</th>
              <th class="text-right">Verzugszinsen</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Keine Mahnung</strong></td>
              <td>Zahlungserinnerung versenden</td>
              <td class="text-right">{{ dunningLevels.level0.count }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level0.amount) }}</td>
              <td class="text-right">0,00 €</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level0.lateFees) }}</td>
              <td>
                <button class="btn-sm btn-info" @click="sendReminders('level0')">
                  <i class="bi bi-envelope"></i> Erinnerung
                </button>
              </td>
            </tr>
            <tr>
              <td><strong>1. Mahnung</strong></td>
              <td>1-14 Tage überfällig</td>
              <td class="text-right">{{ dunningLevels.level1.count }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level1.amount) }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level1.fees) }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level1.lateFees) }}</td>
              <td>
                <button class="btn-sm btn-warning" @click="sendDunning('level1')">
                  <i class="bi bi-send"></i> Versenden
                </button>
              </td>
            </tr>
            <tr>
              <td><strong>2. Mahnung</strong></td>
              <td>15-30 Tage überfällig</td>
              <td class="text-right">{{ dunningLevels.level2.count }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level2.amount) }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level2.fees) }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level2.lateFees) }}</td>
              <td>
                <button class="btn-sm btn-warning" @click="sendDunning('level2')">
                  <i class="bi bi-send-exclamation"></i> Versenden
                </button>
              </td>
            </tr>
            <tr>
              <td><strong>3. Mahnung / Inkasso</strong></td>
              <td>Über 30 Tage überfällig</td>
              <td class="text-right">{{ dunningLevels.level3.count }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level3.amount) }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level3.fees) }}</td>
              <td class="text-right">{{ formatCurrency(dunningLevels.level3.lateFees) }}</td>
              <td>
                <button class="btn-sm btn-danger" @click="sendDunning('level3')">
                  <i class="bi bi-exclamation-triangle"></i> Inkasso
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="2"><strong>GESAMT</strong></td>
              <td class="text-right"><strong>{{ summary.overdue_count }}</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(summary.overdue_total) }}</strong></td>
              <td class="text-right">
                <strong>{{ formatCurrency(dunningLevels.totalFees) }}</strong>
              </td>
              <td class="text-right">
                <strong>{{ formatCurrency(dunningLevels.totalLateFees) }}</strong>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div class="alert alert-info mt-3">
          <i class="bi bi-info-circle"></i>
          <strong>Hinweis zu Mahngebühren:</strong>
          <ul class="mb-0">
            <li>1. Mahnung: 5,00 € Mahngebühr</li>
            <li>2. Mahnung: 10,00 € Mahngebühr</li>
            <li>3. Mahnung: 15,00 € Mahngebühr + ggf. Inkassokosten</li>
            <li>
              Verzugszinsen: Basiszinssatz (aktuell -0,88%) + 9 Prozentpunkte = 8,12% p.a. (B2B) /
              5% p.a. (B2C)
            </li>
          </ul>
        </div>
      </div>

      <!-- Kundenanalyse -->
      <div class="customer-payment-analysis mt-4">
        <h3><i class="bi bi-people-fill icons"></i>Kundenanalyse - Zahlungsverhalten</h3>

        <!-- Top zahlende Kunden -->
        <h4 class="subsection-title">Top 10 Kunden nach Umsatz</h4>
        <table class="report-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Kunde</th>
              <th class="text-right">Rechnungen</th>
              <th class="text-right">Gesamtumsatz</th>
              <th class="text-right">Ø Zahlungsdauer</th>
              <th class="text-right">Überfällig</th>
              <th>Bewertung</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(customer, index) in topCustomers" :key="customer.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td>{{ customer.name }}</td>
              <td class="text-right">{{ customer.invoiceCount }}</td>
              <td class="text-right">{{ formatCurrency(customer.totalAmount) }}</td>
              <td class="text-right">{{ customer.avgPaymentDays }} Tage</td>
              <td class="text-right">{{ formatCurrency(customer.overdueAmount) }}</td>
              <td>
                <span :class="['payment-rating', customer.rating]">
                  {{ getRatingLabel(customer.rating) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Problematische Kunden -->
        <h4 class="subsection-title mt-4">Problematische Kunden (häufig verspätet)</h4>
        <table class="report-table">
          <thead>
            <tr>
              <th>Kunde</th>
              <th class="text-right">Rechnungen gesamt</th>
              <th class="text-right">Verspätet bezahlt</th>
              <th class="text-right">Aktuell überfällig</th>
              <th class="text-right">Ø Verspätung</th>
              <th class="text-right">Verzugszinsen</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in problematicCustomers" :key="customer.id">
              <td>{{ customer.name }}</td>
              <td class="text-right">{{ customer.totalInvoices }}</td>
              <td class="text-right text-warning">{{ customer.latePayments }}</td>
              <td class="text-right text-danger">
                {{ formatCurrency(customer.currentOverdue) }}
              </td>
              <td class="text-right">{{ customer.avgLateDays }} Tage</td>
              <td class="text-right">{{ formatCurrency(customer.lateFees) }}</td>
              <td>
                <span class="badge badge-danger">Risikokunde</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Zahlungsanalyse nach Zeitraum -->
      <div class="payment-timeline-analysis mt-4">
        <h3><i class="bi bi-calendar-range icons"></i>Zahlungsanalyse nach Zeitraum</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>Zahlungszeitraum</th>
              <th class="text-right">Anzahl</th>
              <th class="text-right">Betrag</th>
              <th class="text-right">Ø Zahlungsdauer</th>
              <th class="text-right">Anteil</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Innerhalb von 7 Tagen</strong></td>
              <td class="text-right">{{ paymentTimeline.within7Days.count }}</td>
              <td class="text-right">{{ formatCurrency(paymentTimeline.within7Days.amount) }}</td>
              <td class="text-right">{{ paymentTimeline.within7Days.avgDays }} Tage</td>
              <td class="text-right">{{ paymentTimeline.within7Days.percentage }}%</td>
            </tr>
            <tr>
              <td><strong>8-14 Tage</strong></td>
              <td class="text-right">{{ paymentTimeline.days8to14.count }}</td>
              <td class="text-right">{{ formatCurrency(paymentTimeline.days8to14.amount) }}</td>
              <td class="text-right">{{ paymentTimeline.days8to14.avgDays }} Tage</td>
              <td class="text-right">{{ paymentTimeline.days8to14.percentage }}%</td>
            </tr>
            <tr>
              <td><strong>15-30 Tage (typisches Zahlungsziel)</strong></td>
              <td class="text-right">{{ paymentTimeline.days15to30.count }}</td>
              <td class="text-right">{{ formatCurrency(paymentTimeline.days15to30.amount) }}</td>
              <td class="text-right">{{ paymentTimeline.days15to30.avgDays }} Tage</td>
              <td class="text-right">{{ paymentTimeline.days15to30.percentage }}%</td>
            </tr>
            <tr class="text-warning">
              <td><strong>31-60 Tage (verspätet)</strong></td>
              <td class="text-right">{{ paymentTimeline.days31to60.count }}</td>
              <td class="text-right">{{ formatCurrency(paymentTimeline.days31to60.amount) }}</td>
              <td class="text-right">{{ paymentTimeline.days31to60.avgDays }} Tage</td>
              <td class="text-right">{{ paymentTimeline.days31to60.percentage }}%</td>
            </tr>
            <tr class="text-danger">
              <td><strong>Über 60 Tage (kritisch)</strong></td>
              <td class="text-right">{{ paymentTimeline.over60Days.count }}</td>
              <td class="text-right">{{ formatCurrency(paymentTimeline.over60Days.amount) }}</td>
              <td class="text-right">{{ paymentTimeline.over60Days.avgDays }} Tage</td>
              <td class="text-right">{{ paymentTimeline.over60Days.percentage }}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Rechnungstabelle mit Filtern -->
      <div class="report-table-container mt-4">
        <h3><i class="bi bi-table icons"></i>Detaillierte Rechnungsübersicht</h3>

        <div class="report-filter-tabs">
          <button
            :class="['report-filter-tab', { active: activeTab === 'all' }]"
            @click="activeTab = 'all'"
          >
            Alle ({{ summary.all_count }})
          </button>
          <button
            :class="['report-filter-tab', { active: activeTab === 'paid' }]"
            @click="activeTab = 'paid'"
          >
            Bezahlt ({{ summary.paid_count }})
          </button>
          <button
            :class="['report-filter-tab', { active: activeTab === 'partially_paid' }]"
            @click="activeTab = 'partially_paid'"
          >
            Teilweise ({{ summary.partially_paid_count }})
          </button>
          <button
            :class="['report-filter-tab', { active: activeTab === 'unpaid' }]"
            @click="activeTab = 'unpaid'"
          >
            Offen ({{ summary.unpaid_count }})
          </button>
          <button
            :class="['report-filter-tab', { active: activeTab === 'overdue' }]"
            @click="activeTab = 'overdue'"
          >
            Überfällig ({{ summary.overdue_count }})
          </button>
        </div>

        <table class="report-table">
          <thead>
            <tr>
              <th class="sortable" @click="sorting('id')">
                Rechnungsnr. <i class="bi bi-caret-down-fill ms-1"></i>
              </th>
              <th class="sortable" @click="sorting('date')">
                Datum <i class="bi bi-caret-down-fill ms-1"></i>
              </th>
              <th>Kunde</th>
              <th class="sortable" @click="sorting('due_date')">
                Fällig am <i class="bi bi-caret-down-fill ms-1"></i>
              </th>
              <th class="text-right">Betrag</th>
              <th class="text-right">Offen</th>
              <th>Status</th>
              <th>Zahlungsdatum</th>
              <th class="text-right">Verzug</th>
              <th class="text-right">Verzugszinsen</th>
              <th>Mahnstufe</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredReports" :key="item.id">
              <td><span class="invoice-number">{{ formatInvoiceId(item.id) }}</span></td>
              <td>{{ formatDate(item.date) }}</td>
              <td><span class="customer-name">{{ item.customer_name }}</span></td>
              <td>{{ formatDate(item.due_date) }}</td>
              <td class="text-right">{{ formatCurrency(item.gross_total) }}</td>
              <td class="text-right">{{ formatCurrency(item.outstanding_amount) }}</td>
              <td>
                <span
                  :class="[
                    'report-table-status-badge',
                    item.isOverdue ? 'overdue' : item.payment_status
                  ]"
                >
                  {{ getStatusLabel(item) }}
                </span>
              </td>
              <td>{{ item.paid_at ? formatDate(item.paid_at) : '—' }}</td>
              <td class="text-right" :class="item.daysOverdue > 0 ? 'text-danger' : ''">
                {{ item.daysOverdue > 0 ? item.daysOverdue + ' Tage' : '—' }}
              </td>
              <td class="text-right">
                {{ item.lateFee > 0 ? formatCurrency(item.lateFee) : '—' }}
              </td>
              <td>
                <span v-if="item.dunning_level" :class="['dunning-badge', `level-${item.dunning_level}`]">
                  {{ getDunningLabel(item.dunning_level) }}
                </span>
                <span v-else>—</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" title="Details anzeigen">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    v-if="item.payment_status !== 'paid'"
                    class="btn-icon"
                    title="Zahlung erfassen"
                  >
                    <i class="bi bi-cash"></i>
                  </button>
                  <button
                    v-if="item.isOverdue"
                    class="btn-icon text-warning"
                    title="Mahnung versenden"
                  >
                    <i class="bi bi-envelope-exclamation"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="4"><strong>SUMME ({{ filteredReports.length }} Rechnungen)</strong></td>
              <td class="text-right">
                <strong>{{
                  formatCurrency(
                    filteredReports.reduce((sum, item) => sum + Number(item.gross_total), 0)
                  )
                }}</strong>
              </td>
              <td class="text-right">
                <strong>{{
                  formatCurrency(
                    filteredReports.reduce((sum, item) => sum + Number(item.outstanding_amount), 0)
                  )
                }}</strong>
              </td>
              <td colspan="6"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Rechtlicher Hinweis -->
      <div class="legal-notice mt-4 alert alert-secondary">
        <p class="mb-0">
          <i class="bi bi-info-circle"></i>
          <strong>Rechtlicher Hinweis:</strong> Die Berechnung der Verzugszinsen basiert auf dem
          aktuellen Basiszinssatz der Deutschen Bundesbank zuzüglich 9 Prozentpunkte für
          Geschäfte mit Unternehmern (§ 288 Abs. 2 BGB) bzw. 5 Prozentpunkte für Geschäfte mit
          Verbrauchern (§ 288 Abs. 1 BGB). Mahngebühren können nur erhoben werden, wenn diese
          vorab vereinbart wurden oder marktüblich sind. Für rechtlich bindende Mahnverfahren
          konsultieren Sie bitte einen Rechtsanwalt oder nutzen Sie das gerichtliche
          Mahnverfahren.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceChart from '../chart/InvoiceChart.vue'

export default {
  name: 'InvoiceReport',
  components: { InvoiceChart },
  inject: ['formatDate', 'formatCurrency', 'formatInvoiceId', 'formatPercentage'],
  data() {
    return {
      title: 'Vollständiger Rechnungsbericht (Deutscher Standard)',
      reports: [],
      date_range: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false,
      activeTab: 'all',
      is_sort: true,
      // Verzugszinsen Konfiguration
      baseInterestRate: -0.88, // Basiszinssatz (Deutsche Bundesbank)
      b2bInterestRate: 9, // Verzugszinsen B2B
      b2cInterestRate: 5, // Verzugszinsen B2C
      dunningFees: {
        level1: 5.0, // 1. Mahnung
        level2: 10.0, // 2. Mahnung
        level3: 15.0 // 3. Mahnung
      }
    }
  },
  computed: {
    currentTime() {
      return new Date().toLocaleTimeString('de-DE')
    },

    selectedPeriod() {
      if (!this.period.start || !this.period.end) return ''
      return this.formatDate(this.period.start) + ' - ' + this.formatDate(this.period.end)
    },

    returnReportWithOverdue() {
      if (!Array.isArray(this.reports)) return []

      return this.reports.map((item) => {
        const today = new Date()
        const dueDate = new Date(item.due_date)
        const isOverdue = item.payment_status !== 'paid' && today > dueDate

        let daysOverdue = 0
        if (isOverdue) {
          daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24))
        }

        // Verzugszinsen berechnen
        const lateFee = this.calculateLateFee(item, daysOverdue)

        // Mahnstufe bestimmen
        const dunningLevel = this.getDunningLevel(daysOverdue)

        // Ausstehender Betrag
        const outstandingAmount = Number(item.outstanding_amount || item.gross_total || 0)

        return {
          ...item,
          isOverdue,
          daysOverdue,
          lateFee,
          dunning_level: dunningLevel,
          outstanding_amount: outstandingAmount,
          customer_name: item.customer_name || 'Unbekannt'
        }
      })
    },

    summary() {
      const all = this.returnReportWithOverdue
      const paid = all.filter((item) => item.payment_status === 'paid')
      const partially_paid = all.filter((item) => item.payment_status === 'partially_paid')
      const unpaid = all.filter((item) => item.payment_status === 'unpaid')
      const overdue = all.filter((item) => item.isOverdue)
      const unpaid_not_due = unpaid.filter((item) => !item.isOverdue)

      const all_total = all.reduce((sum, item) => sum + Number(item.gross_total || 0), 0)

      return {
        all_count: all.length,
        paid_count: paid.length,
        partially_paid_count: partially_paid.length,
        unpaid_count: unpaid.length,
        overdue_count: overdue.length,
        unpaid_not_due_count: unpaid_not_due.length,

        all_total,
        paid_total: paid.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        partially_paid_total: partially_paid.reduce(
          (sum, item) => sum + Number(item.gross_total || 0),
          0
        ),
        unpaid_total: unpaid.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        overdue_total: overdue.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        unpaid_not_due_total: unpaid_not_due.reduce(
          (sum, item) => sum + Number(item.gross_total || 0),
          0
        ),

        avg_invoice_amount: all.length > 0 ? all_total / all.length : 0
      }
    },

    setPercentage() {
      const sum = this.summary
      return {
        paid_percentage: this.formatPercentage(sum.paid_total, sum.all_total),
        partially_paid_percentage: this.formatPercentage(sum.partially_paid_total, sum.all_total),
        unpaid_percentage: this.formatPercentage(sum.unpaid_total, sum.all_total),
        overdue_percentage: this.formatPercentage(sum.overdue_total, sum.all_total)
      }
    },

    chartData() {
      return {
        labels: ['Bezahlt', 'Teilweise', 'Offen', 'Überfällig'],
        datasets: [
          {
            data: [
              this.summary.paid_total,
              this.summary.partially_paid_total,
              this.summary.unpaid_not_due_total,
              this.summary.overdue_total
            ],
            backgroundColor: ['#28a745', '#17a2b8', '#6c757d', '#dc3545']
          }
        ]
      }
    },

    dsoMetrics() {
      // Days Sales Outstanding
      const paidInvoices = this.returnReportWithOverdue.filter(
        (item) => item.payment_status === 'paid'
      )

      if (paidInvoices.length === 0) return { dso: 0 }

      const totalReceivables = this.summary.unpaid_total + this.summary.overdue_total
      const totalSales = this.summary.all_total
      const daysInPeriod = this.getDaysInPeriod()

      const dso = totalSales > 0 ? Math.round((totalReceivables / totalSales) * daysInPeriod) : 0

      return { dso }
    },

    paymentMetrics() {
      const paidInvoices = this.returnReportWithOverdue.filter(
        (item) => item.payment_status === 'paid' && item.paid_at
      )

      if (paidInvoices.length === 0) {
        return {
          avgPaymentDays: 0,
          onTimePaymentRate: 0
        }
      }

      let totalPaymentDays = 0
      let onTimePayments = 0

      paidInvoices.forEach((invoice) => {
        const invoiceDate = new Date(invoice.date)
        const paidDate = new Date(invoice.paid_at)
        const dueDate = new Date(invoice.due_date)
        const paymentDays = Math.ceil((paidDate - invoiceDate) / (1000 * 60 * 60 * 24))

        totalPaymentDays += paymentDays

        if (paidDate <= dueDate) {
          onTimePayments++
        }
      })

      return {
        avgPaymentDays: Math.round(totalPaymentDays / paidInvoices.length),
        onTimePaymentRate: Math.round((onTimePayments / paidInvoices.length) * 100)
      }
    },

    overdueMetrics() {
      const overdueInvoices = this.returnReportWithOverdue.filter((item) => item.isOverdue)

      if (overdueInvoices.length === 0) {
        return {
          oldestOverdueDays: 0,
          oldestInvoiceNumber: '-',
          totalLateFees: 0
        }
      }

      const oldest = overdueInvoices.reduce((prev, current) =>
        prev.daysOverdue > current.daysOverdue ? prev : current
      )

      const totalLateFees = overdueInvoices.reduce((sum, item) => sum + item.lateFee, 0)

      return {
        oldestOverdueDays: oldest.daysOverdue,
        oldestInvoiceNumber: this.formatInvoiceId(oldest.id),
        totalLateFees
      }
    },

    dunningLevels() {
      const overdueInvoices = this.returnReportWithOverdue.filter((item) => item.isOverdue)

      const level0 = overdueInvoices.filter((item) => item.daysOverdue < 1) // Sollte nicht vorkommen
      const level1 = overdueInvoices.filter(
        (item) => item.daysOverdue >= 1 && item.daysOverdue <= 14
      )
      const level2 = overdueInvoices.filter(
        (item) => item.daysOverdue > 14 && item.daysOverdue <= 30
      )
      const level3 = overdueInvoices.filter((item) => item.daysOverdue > 30)

      const calculateLevelStats = (invoices, feeLevel) => ({
        count: invoices.length,
        amount: invoices.reduce((sum, item) => sum + Number(item.outstanding_amount || 0), 0),
        fees: invoices.length * (this.dunningFees[feeLevel] || 0),
        lateFees: invoices.reduce((sum, item) => sum + item.lateFee, 0)
      })

      return {
        level0: {
          count: level0.length,
          amount: level0.reduce((sum, item) => sum + Number(item.outstanding_amount || 0), 0),
          lateFees: level0.reduce((sum, item) => sum + item.lateFee, 0)
        },
        level1: calculateLevelStats(level1, 'level1'),
        level2: calculateLevelStats(level2, 'level2'),
        level3: calculateLevelStats(level3, 'level3'),
        totalFees:
          level1.length * this.dunningFees.level1 +
          level2.length * this.dunningFees.level2 +
          level3.length * this.dunningFees.level3,
        totalLateFees: overdueInvoices.reduce((sum, item) => sum + item.lateFee, 0)
      }
    },

    topCustomers() {
      const customerMap = {}

      this.returnReportWithOverdue.forEach((invoice) => {
        const customerId = invoice.customer_id
        const customerName = invoice.customer_name || 'Unbekannt'

        if (!customerMap[customerId]) {
          customerMap[customerId] = {
            id: customerId,
            name: customerName,
            invoiceCount: 0,
            totalAmount: 0,
            paidInvoices: 0,
            totalPaymentDays: 0,
            overdueAmount: 0
          }
        }

        customerMap[customerId].invoiceCount++
        customerMap[customerId].totalAmount += Number(invoice.gross_total || 0)

        if (invoice.payment_status === 'paid' && invoice.paid_at) {
          customerMap[customerId].paidInvoices++
          const invoiceDate = new Date(invoice.date)
          const paidDate = new Date(invoice.paid_at)
          const paymentDays = Math.ceil((paidDate - invoiceDate) / (1000 * 60 * 60 * 24))
          customerMap[customerId].totalPaymentDays += paymentDays
        }

        if (invoice.isOverdue) {
          customerMap[customerId].overdueAmount += Number(invoice.outstanding_amount || 0)
        }
      })

      const customers = Object.values(customerMap)
        .map((customer) => ({
          ...customer,
          avgPaymentDays:
            customer.paidInvoices > 0
              ? Math.round(customer.totalPaymentDays / customer.paidInvoices)
              : 0,
          rating: this.calculateCustomerRating(customer)
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 10)

      return customers
    },

    problematicCustomers() {
      const customerMap = {}

      this.returnReportWithOverdue.forEach((invoice) => {
        const customerId = invoice.customer_id
        const customerName = invoice.customer_name || 'Unbekannt'

        if (!customerMap[customerId]) {
          customerMap[customerId] = {
            id: customerId,
            name: customerName,
            totalInvoices: 0,
            latePayments: 0,
            currentOverdue: 0,
            totalLateDays: 0,
            lateFees: 0
          }
        }

        customerMap[customerId].totalInvoices++

        if (invoice.payment_status === 'paid' && invoice.paid_at) {
          const paidDate = new Date(invoice.paid_at)
          const dueDate = new Date(invoice.due_date)
          if (paidDate > dueDate) {
            customerMap[customerId].latePayments++
            const lateDays = Math.ceil((paidDate - dueDate) / (1000 * 60 * 60 * 24))
            customerMap[customerId].totalLateDays += lateDays
          }
        }

        if (invoice.isOverdue) {
          customerMap[customerId].currentOverdue += Number(invoice.outstanding_amount || 0)
          customerMap[customerId].lateFees += invoice.lateFee
        }
      })

      return Object.values(customerMap)
        .filter((customer) => {
          const latePaymentRate = customer.latePayments / customer.totalInvoices
          return latePaymentRate > 0.3 || customer.currentOverdue > 0
        })
        .map((customer) => ({
          ...customer,
          avgLateDays:
            customer.latePayments > 0
              ? Math.round(customer.totalLateDays / customer.latePayments)
              : 0
        }))
        .sort((a, b) => b.currentOverdue - a.currentOverdue)
        .slice(0, 10)
    },

    paymentTimeline() {
      const paidInvoices = this.returnReportWithOverdue.filter(
        (item) => item.payment_status === 'paid' && item.paid_at
      )

      const timeline = {
        within7Days: { count: 0, amount: 0, totalDays: 0, avgDays: 0, percentage: 0 },
        days8to14: { count: 0, amount: 0, totalDays: 0, avgDays: 0, percentage: 0 },
        days15to30: { count: 0, amount: 0, totalDays: 0, avgDays: 0, percentage: 0 },
        days31to60: { count: 0, amount: 0, totalDays: 0, avgDays: 0, percentage: 0 },
        over60Days: { count: 0, amount: 0, totalDays: 0, avgDays: 0, percentage: 0 }
      }

      paidInvoices.forEach((invoice) => {
        const invoiceDate = new Date(invoice.date)
        const paidDate = new Date(invoice.paid_at)
        const paymentDays = Math.ceil((paidDate - invoiceDate) / (1000 * 60 * 60 * 24))
        const amount = Number(invoice.gross_total || 0)

        let category
        if (paymentDays <= 7) category = 'within7Days'
        else if (paymentDays <= 14) category = 'days8to14'
        else if (paymentDays <= 30) category = 'days15to30'
        else if (paymentDays <= 60) category = 'days31to60'
        else category = 'over60Days'

        timeline[category].count++
        timeline[category].amount += amount
        timeline[category].totalDays += paymentDays
      })

      const totalAmount = this.summary.paid_total

      Object.keys(timeline).forEach((key) => {
        if (timeline[key].count > 0) {
          timeline[key].avgDays = Math.round(timeline[key].totalDays / timeline[key].count)
        }
        timeline[key].percentage = totalAmount
          ? Math.round((timeline[key].amount / totalAmount) * 100)
          : 0
      })

      return timeline
    },

    filteredReports() {
      if (!this.returnReportWithOverdue) return []

      switch (this.activeTab) {
        case 'all':
          return this.returnReportWithOverdue
        case 'paid':
          return this.returnReportWithOverdue.filter((item) => item.payment_status === 'paid')
        case 'partially_paid':
          return this.returnReportWithOverdue.filter(
            (item) => item.payment_status === 'partially_paid'
          )
        case 'unpaid':
          return this.returnReportWithOverdue.filter((item) => item.payment_status === 'unpaid')
        case 'overdue':
          return this.returnReportWithOverdue.filter((item) => item.isOverdue)
        default:
          return this.returnReportWithOverdue
      }
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

      const result = await window.api.reportInvoices(data)
      if (!result.success) return

      this.reports = result.rows

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }

      this.is_ready = true
    },

    sorting(key) {
      if (!key) return
      this.reports.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.is_sort ? res : -res
      })
      this.is_sort = !this.is_sort
    },

    calculateLateFee(invoice, daysOverdue) {
      if (daysOverdue <= 0) return 0

      const principal = Number(invoice.outstanding_amount || invoice.gross_total || 0)
      const isB2B = invoice.is_b2b !== false // Default B2B

      // Verzugszinssatz: Basiszins + 9% (B2B) oder + 5% (B2C)
      const interestRate = this.baseInterestRate + (isB2B ? this.b2bInterestRate : this.b2cInterestRate)

      // Zinsberechnung: (Betrag * Zinssatz * Tage) / (100 * 365)
      const lateFee = (principal * interestRate * daysOverdue) / (100 * 365)

      return Math.max(0, lateFee)
    },

    getDunningLevel(daysOverdue) {
      if (daysOverdue <= 0) return 0
      if (daysOverdue <= 14) return 1
      if (daysOverdue <= 30) return 2
      return 3
    },

    getDaysInPeriod() {
      if (!this.period.start || !this.period.end) return 30
      const start = new Date(this.period.start)
      const end = new Date(this.period.end)
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    },

    calculateCustomerRating(customer) {
      // Rating basierend auf Zahlungsverhalten
      const overdueRate = customer.overdueAmount / customer.totalAmount
      const avgPaymentDays = customer.avgPaymentDays

      if (overdueRate > 0.3 || avgPaymentDays > 45) return 'bad'
      if (overdueRate > 0.1 || avgPaymentDays > 30) return 'medium'
      return 'good'
    },

    getRatingLabel(rating) {
      const labels = {
        good: '✓ Zuverlässig',
        medium: '~ Durchschnittlich',
        bad: '✗ Risikokunde'
      }
      return labels[rating] || '-'
    },

    getStatusLabel(item) {
      if (item.isOverdue) return 'Überfällig'
      const labels = {
        paid: 'Bezahlt',
        partially_paid: 'Teilweise',
        unpaid: 'Offen'
      }
      return labels[item.payment_status] || item.payment_status
    },

    getDunningLabel(level) {
      const labels = {
        0: 'Keine',
        1: '1. Mahnung',
        2: '2. Mahnung',
        3: '3. Mahnung'
      }
      return labels[level] || '-'
    },

    async sendReminders(level) {
      console.log('Sending payment reminders for level:', level)
      // Implement API call to send reminders
    },

    async sendDunning(level) {
      console.log('Sending dunning letters for level:', level)
      // Implement API call to send dunning letters
    },

    async createMahnungen() {
      console.log('Creating dunning letters for all overdue invoices')
      // Implement batch dunning creation
    },

    exportExcel() {
      console.log('Exporting to Excel')
      // Implement Excel export
    },

    exportCSV() {
      const csv = this.generateCSV()
      this.downloadFile(csv, 'Rechnungsbericht.csv', 'text/csv')
    },

    generateCSV() {
      let csv =
        'Rechnungsnr.;Datum;Kunde;Fällig am;Betrag;Offen;Status;Zahlungsdatum;Verzug (Tage);Verzugszinsen;Mahnstufe\n'

      this.returnReportWithOverdue.forEach((item) => {
        csv += `${this.formatInvoiceId(item.id)};${this.formatDate(item.date)};${item.customer_name};${this.formatDate(item.due_date)};${item.gross_total};${item.outstanding_amount};${this.getStatusLabel(item)};${item.paid_at ? this.formatDate(item.paid_at) : '-'};${item.daysOverdue || 0};${item.lateFee.toFixed(2)};${this.getDunningLabel(item.dunning_level)}\n`
      })

      return csv
    },

    exportPDF() {
      window.print()
    },

    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 2rem;
}

.export-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.export-buttons .btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: #000;
}

.btn-outline {
  background-color: white;
  color: #333;
  border: 1px solid #dee2e6;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.extended-metrics {
  margin-top: 2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.metric-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

.metric-icon {
  font-size: 2rem;
  color: #007bff;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.75rem;
  color: #6c757d;
  margin: 0;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.25rem 0;
}

.metric-detail {
  font-size: 0.75rem;
  color: #6c757d;
  margin: 0;
}

.subsection-title {
  font-size: 1.1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #333;
}

.payment-rating {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.payment-rating.good {
  background-color: #d4edda;
  color: #155724;
}

.payment-rating.medium {
  background-color: #fff3cd;
  color: #856404;
}

.payment-rating.bad {
  background-color: #f8d7da;
  color: #721c24;
}

.dunning-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.dunning-badge.level-1 {
  background-color: #fff3cd;
  color: #856404;
}

.dunning-badge.level-2 {
  background-color: #ffeaa7;
  color: #d63031;
}

.dunning-badge.level-3 {
  background-color: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  color: #007bff;
}

.btn-icon:hover {
  color: #0056b3;
}

.report-generated {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.legal-notice {
  font-size: 0.875rem;
  color: #6c757d;
}

@media print {
  .export-buttons,
  .filter-section,
  .action-buttons,
  .report-filter-tabs {
    display: none !important;
  }
}
</style>