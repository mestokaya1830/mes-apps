<template>
  <div>
    <div class="report-panel">
      <h2>{{ title }}</h2>
      <div class="form-section">
        <div class="form-group">
          <select v-model="report_type" class="form-input">
            <option value="" disabled>Waehle Bericht</option>
            <option value="Kundenbezogener">Kundenbezogener Bericht</option>
            <option value="Rechnungsliste">Rechnungsliste</option>
            <option value="Zahlungsstatus">Zahlungsstatus</option>
            <option value="Umsatzbericht">Umsatzbericht</option>
            <option value="Mehrwertsteuer">Mehrwertsteuer (MwSt) Bericht</option>
          </select>
        </div>
        <SalesReport v-if="report_type == 'Umsatzbericht'" />
        <PaymentsReport v-if="report_type == 'Zahlungsstatus'" />
        <CustomersReport v-if="report_type == 'Kundenbezogener'" />
        <TaxReport v-if="report_type == 'Mehrwertsteuer'" />
        <InvoicesListReport v-if="report_type == 'Rechnungsliste'" />
      </div>
      <div class="print-actions">
        <button class="btn-excel">📊 Excel Export</button>
        <button class="btn btn-print" @click="printDocument">🖨️ Drucken</button>
      </div>
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
  },
  methods: {
    printDocument() {
      window.print()
    }
  }
}
</script>
