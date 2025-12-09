<template>
  <div>
    <div class="editor-panel">
      <h1>{{ title }}</h1>
      <div class="form-row">
        <select v-model="report_type" class="form-input">
          <option value="" disabled>Waehle Bericht</option>
          <option value="Umsatzbericht">Umsatzbericht</option>
          <option value="Zahlungsstatus">Zahlungsstatus</option>
          <option value="Kundenbezogener">Kundenbezogener Bericht</option>
          <option value="Mehrwertsteuer">Mehrwertsteuer (MwSt) Bericht</option>
          <option value="Rechnungsliste">Rechnungsliste</option>
        </select>
      </div>

      <SalesReport v-if="report_type == 'Umsatzbericht'" />
      <PaymentsReport v-if="report_type == 'Zahlungsstatus'" />
      <CustomersReport v-if="report_type == 'Kundenbezogener'" />
      <TaxReport v-if="report_type == 'Mehrwertsteuer'" />
      <InvoicesListReport v-if="report_type == 'Rechnungsliste'" />
    </div>
  </div>
</template>

<script>
import SalesReport from '../../components/reports/SalesReport.vue'
import PaymentsReport from '../../components/reports/PaymentsReport.vue'
import CustomersReport from '../../components/reports/CustomersReport.vue'
import TaxReport from '../../components/reports/TaxReport.vue'
import InvoicesListReport from '../../components/reports/InvoicesListReport.vue'

export default {
  name: 'InvoicesReport',
  components: {
    SalesReport,
    PaymentsReport,
    CustomersReport,
    TaxReport,
    InvoicesListReport
  },
  data() {
    return {
      title: 'Berichte',
      report_type: ''
    }
  }
}
</script>
<style>
.editor-panel {
  max-width: 1400px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
}

.report-container {
  margin-top: 30px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.report-header h2 {
  font-size: 24px;
  color: #1f2937;
}

.report-period {
  color: #6b7280;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.btn-export {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-export:hover {
  background: #2563eb;
}

.summary-section {
  display: flex;
  margin-bottom: 30px;
}
/* SUMMARY CARDS */
.summary-container {
  width: 50%;
  gap: 20px;
}
.chart-container {
  display: flex;
  justify-content: center;
  width: 50%;
}
.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  color: white;
  display: flex;
  gap: 16px;
  align-items: center;
  margin: 10px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-card:nth-child(2) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.summary-card:nth-child(3) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.summary-card:nth-child(4) {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.card-icon {
  font-size: 36px;
  opacity: 0.9;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 13px;
  opacity: 0.9;
  margin: 0 0 4px 0;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.card-detail {
  font-size: 12px;
  opacity: 0.85;
  margin: 4px 0 0 0;
}

/* CHART SECTION */
.chart-section {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.chart-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.bar-chart {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 200px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-wrapper {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
}

.bar-value {
  font-size: 10px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.bar-label {
  font-size: 11px;
  font-weight: 500;
  color: #4b5563;
  margin: 8px 0 2px 0;
}

.bar-count {
  font-size: 10px;
  color: #9ca3af;
  margin: 0;
}

/* TABLE SECTION */
.table-section {
  margin-bottom: 30px;
}

.table-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.report-table thead {
  background: #f9fafb;
}

.report-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.report-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.report-table tbody tr:hover {
  background: #f9fafb;
}

.report-table .amount {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.paid {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.unpaid {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.overdue {
  background: #fee2e2;
  color: #991b1b;
}

.total-row {
  background: #f3f4f6;
  font-weight: 600;
}

.total-row td {
  border-top: 2px solid #d1d5db;
  padding: 14px 12px;
}

/* TAX BREAKDOWN */
.tax-breakdown {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
}

.tax-breakdown h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.tax-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.tax-table thead {
  background: #f3f4f6;
}

.tax-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.tax-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.tax-table .amount {
  text-align: right;
  font-family: 'Courier New', monospace;
}

/* PRINT STYLES */
@media print {
  body * {
    visibility: hidden;
  }
  .printable,
  .printable * {
    visibility: visible;
    -webkit-print-color-adjust: exact; /* Chrome, Safari */
    print-color-adjust: exact; /* Firefox */
  }
  .printable {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #fff; /* istediğin arka plan */
  }
  @page {
    margin: 1.5cm;
    @bottom-right {
      content: 'Seite ' counter(page) ' von ' counter(pages);
    }
  }
}
</style>
