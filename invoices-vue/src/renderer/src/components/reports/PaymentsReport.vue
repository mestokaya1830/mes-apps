<template>
  <div class="editor-panel">
    <select v-model="date_range" class="form-input" @change="rangeDateFilter">
      <option value="" disabled>Wähle Daten</option>
      <option value="1">Diesen Monat</option>
      <option value="3">Letzte 3 Monate</option>
      <option value="6">Letzte 6 Monate</option>
      <option value="12">Letztes Jahr</option>
    </select>

    <div class="form-section">
      <div class="form-row">
        <div class="form-group">
          <label>Von</label>
          <input type="date" class="form-input" value="2025-08-01" />
        </div>
        <div class="form-group">
          <label>Bis</label>
          <input type="date" class="form-input" value="2025-11-18" />
        </div>
      </div>
    </div>

    <select class="form-input">
      <option value="" disabled>Wähle Bericht</option>
      <option value="umsatz">Umsatzbericht</option>
      <option value="zahlungsstatus" selected>Zahlungsstatus</option>
      <option value="kunden">Kundenbezogener Bericht</option>
      <option value="mwst">Mehrwertsteuer (MwSt) Bericht</option>
      <option value="rechnungsListe">Rechnungsliste</option>
      <option value="prognose">Umsatzprognose</option>
    </select>

    <!-- REPORT STARTS -->
    <div class="report-container">
      <div class="report-header">
        <div>
          <h2>Zahlungsstatus Bericht</h2>
          <p class="report-period">Zeitraum: {{ selectedPeriod }}</p>
        </div>
        <!-- <button class="btn-export" onclick="window.print()">🖨️ Drucken</button> -->
      </div>

      <!-- Summary Cards -->
      <div class="report-summary-cards">
        <div class="report-summary-card">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <p class="card-label">Pünktlich Bezahlt</p>
            <h3 class="card-value">€38.200,00</h3>
            <p class="card-detail">18 Rechnungen (75%)</p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon">⏳</div>
          <div class="card-content">
            <p class="card-label">Ausstehend (fällig)</p>
            <h3 class="card-value">€4.850,00</h3>
            <p class="card-detail">4 Rechnungen (17%)</p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon">⚠️</div>
          <div class="card-content">
            <p class="card-label">Überfällig</p>
            <h3 class="card-value">€2.800,00</h3>
            <p class="card-detail">2 Rechnungen (8%)</p>
          </div>
        </div>

        <div class="report-summary-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <p class="card-label">Zahlungsziel Ø</p>
            <h3 class="card-value">14 Tage</h3>
            <p class="card-detail">Durchschnitt</p>
          </div>
        </div>
      </div>

      <!-- Donut Chart & Aging -->
      <div class="chart-row">
        <div class="donut-section">
          <h3>Zahlungsverteilung</h3>
          <div class="donut-container">
            <div class="donut-chart">
              <div class="donut-ring">
                <div class="donut-hole">
                  <div class="donut-total">24</div>
                  <div class="donut-label">Rechnungen</div>
                </div>
              </div>
            </div>
            <div class="donut-legend">
              <div class="legend-item">
                <div class="legend-color paid"></div>
                <div class="legend-text">
                  <div class="legend-title">Bezahlt</div>
                  <div class="legend-value">€38.200</div>
                  <div class="legend-detail">18 Rg. (75%)</div>
                </div>
              </div>
              <div class="legend-item">
                <div class="legend-color pending"></div>
                <div class="legend-text">
                  <div class="legend-title">Ausstehend</div>
                  <div class="legend-value">€4.850</div>
                  <div class="legend-detail">4 Rg. (17%)</div>
                </div>
              </div>
              <div class="legend-item">
                <div class="legend-color overdue"></div>
                <div class="legend-text">
                  <div class="legend-title">Überfällig</div>
                  <div class="legend-value">€2.800</div>
                  <div class="legend-detail">2 Rg. (8%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="aging-section">
          <h3>Forderungsaltersstruktur</h3>
          <table class="aging-table">
            <thead>
              <tr>
                <th>Zeitraum</th>
                <th>Betrag</th>
                <th>Anzahl</th>
                <th class="percent">Anteil</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>0-30 Tage</strong></td>
                <td class="amount">€38.200,00</td>
                <td>18</td>
                <td class="percent">83%</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 83%"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>31-60 Tage</strong></td>
                <td class="amount">€4.850,00</td>
                <td>4</td>
                <td class="percent">11%</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill warning" style="width: 11%"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>61-90 Tage</strong></td>
                <td class="amount">€1.900,00</td>
                <td>1</td>
                <td class="percent">4%</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill danger" style="width: 4%"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>> 90 Tage</strong></td>
                <td class="amount">€900,00</td>
                <td>1</td>
                <td class="percent">2%</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill danger" style="width: 2%"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detailed Table -->
      <div class="table-section">
        <h3>Detaillierte Übersicht</h3>

        <div class="filter-tabs">
          <button class="filter-tab active">Alle (24)</button>
          <button class="filter-tab">Bezahlt (18)</button>
          <button class="filter-tab">Ausstehend (4)</button>
          <button class="filter-tab">Überfällig (2)</button>
        </div>

        <input
          type="text"
          placeholder="Suche nach Rechnungsnummer oder Kunde..."
          class="search-input"
        />

        <table class="report-table">
          <thead>
            <tr>
              <th>Rechnungsnr.</th>
              <th>Kunde</th>
              <th>Rechnungsdatum</th>
              <th>Fälligkeitsdatum</th>
              <th>Betrag</th>
              <th>Status</th>
              <th>Tage seit Fälligkeit</th>
              <th>Zahlungsdatum</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>RE-2025-0124</strong></td>
              <td>Müller GmbH</td>
              <td>15.11.2025</td>
              <td>29.11.2025</td>
              <td class="amount">€2.499,00</td>
              <td><span class="status-badge paid">Bezahlt</span></td>
              <td><span class="days-badge ok">-12</span></td>
              <td>17.11.2025</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0123</strong></td>
              <td>Schmidt AG</td>
              <td>12.11.2025</td>
              <td>26.11.2025</td>
              <td class="amount">€1.785,00</td>
              <td><span class="status-badge pending">Ausstehend</span></td>
              <td><span class="days-badge ok">-8</span></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0122</strong></td>
              <td>Weber & Co</td>
              <td>08.11.2025</td>
              <td>22.11.2025</td>
              <td class="amount">€3.808,00</td>
              <td><span class="status-badge paid">Bezahlt</span></td>
              <td><span class="days-badge ok">-12</span></td>
              <td>10.11.2025</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0121</strong></td>
              <td>Fischer KG</td>
              <td>05.11.2025</td>
              <td>19.11.2025</td>
              <td class="amount">€1.059,10</td>
              <td><span class="status-badge overdue">Überfällig</span></td>
              <td><span class="days-badge warning">+1</span></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0120</strong></td>
              <td>Becker GmbH</td>
              <td>02.11.2025</td>
              <td>16.11.2025</td>
              <td class="amount">€2.082,50</td>
              <td><span class="status-badge paid">Bezahlt</span></td>
              <td><span class="days-badge ok">-12</span></td>
              <td>04.11.2025</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0119</strong></td>
              <td>Hoffmann Industries</td>
              <td>28.10.2025</td>
              <td>11.11.2025</td>
              <td class="amount">€4.998,00</td>
              <td><span class="status-badge paid">Bezahlt</span></td>
              <td><span class="days-badge ok">-19</span></td>
              <td>30.10.2025</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0115</strong></td>
              <td>Schulz Gruppe</td>
              <td>15.10.2025</td>
              <td>29.10.2025</td>
              <td class="amount">€3.065,00</td>
              <td><span class="status-badge pending">Ausstehend</span></td>
              <td><span class="days-badge warning">+20</span></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0108</strong></td>
              <td>Krause & Partner</td>
              <td>28.09.2025</td>
              <td>12.10.2025</td>
              <td class="amount">€1.900,00</td>
              <td><span class="status-badge overdue">Überfällig</span></td>
              <td><span class="days-badge danger">+37</span></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>RE-2025-0101</strong></td>
              <td>Neumann GmbH</td>
              <td>05.08.2025</td>
              <td>19.08.2025</td>
              <td class="amount">€900,00</td>
              <td><span class="status-badge overdue">Überfällig</span></td>
              <td><span class="days-badge danger">+91</span></td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentReport',
  data() {
    return {
      title: 'Zahlungsbericht',
      reports: null,
      date_range: '',
      date_box_start: '',
      date_box_end: '',
      period: { start: '', end: '' },
      is_ready: false,
      activeTab: 'all',
      is_sort: true
    }
  },
  computed: {
  selectedPeriod() {
      if (!this.period) return
      return this.formatDate(this.period.start) + ' - ' + this.formatDate(this.period.end)
    },
    returnReportWithOverdue() {
      if (!this.reports) return []
      return this.reports.map((item) => {
        return {
          ...item,
          isOverdue: item.payment_status === 'unpaid' && this.checkDueDate(item.due_date)
        }
      })
    },
    summary() {
      //shorthand
      const all = this.returnReportWithOverdue //new reports for isOverdue
      const paid = all.filter((item) => item.payment_status === 'paid')
      const partially_paid = all.filter((item) => item.payment_status === 'partially_paid')
      const unpaid = all.filter((item) => item.payment_status === 'unpaid')
      const overdue = all.filter((item) => item.isOverdue)

      return {
        //all counts
        all_count: all.length,
        paid_count: paid.length,
        partially_paid_count: partially_paid.length,
        unpaid_count: unpaid.length,
        overdue_count: overdue.length,

        //all totals
        all_total: all.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        paid_total: paid.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        partially_paid_total: partially_paid.reduce(
          (sum, item) => sum + Number(item.gross_total || 0),
          0
        ),
        unpaid_total: unpaid.reduce((sum, item) => sum + Number(item.gross_total || 0), 0),
        overdue_total: overdue.reduce((sum, item) => sum + Number(item.gross_total || 0), 0)
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
    },
    tabs() {
      return [
        { key: 'all', label: 'Alle', count: this.summary.all_count },
        { key: 'paid', label: 'Bezahlt', count: this.summary.paid_count },
        { key: 'unpaid', label: 'Ausstehend', count: this.summary.unpaid_count },
        {
          key: 'partially_paid',
          label: 'Teilweise Bezahlt',
          count: this.summary.partially_paid_count
        },
        { key: 'overdue', label: 'Überfällig', count: this.summary.overdue_count }
      ]
    }
  },
  methods: {
    async rangeDateFilter() {
      if (!this.date_range) return
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth() - this.date_range, 1)
      const endDate = new Date(today.getFullYear(), today.getMonth() + 0, 0)
      this.date_box_start = startDate.toISOString().slice(0, 10)
      this.date_box_end = endDate.toISOString().slice(0, 10)
      this.getReport()
    },
    flexDateFilter() {
      if (!this.date_box_start) return this.$refs.date_box_start.focus()
      if (!this.date_box_end) return this.$refs.date_box_end.focus()
      if (this.date_box_start > this.date_box_end) {
        this.date_box_end = ''
        return this.$refs.date_box_end.focus()
      }
      this.getReport()
    },
    async getReport() {
      if (!this.date_box_start || !this.date_box_end) return
      const data = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      const result = await window.api.reportPayments(data)
      if (!result.success) return
      this.reports = result.rows

      this.period = {
        start: this.date_box_start,
        end: this.date_box_end
      }
      this.is_ready = true
      // console.log(result)
    },
    sorting(key) {
      if (!key) return
      this.reports.sort((a, b) => {
        const res = a[key] > b[key] ? 1 : -1
        return this.isSort ? res : -res
      })
      this.isSort = !this.isSort
    }
  }
}
</script>
