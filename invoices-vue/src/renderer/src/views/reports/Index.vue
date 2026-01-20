<template>
  <div>
    <div class="report-panel">
      <h2>{{ title }}</h2>
      <div class="form-section">
        <div class="form-group">
          <select v-model="report_type" class="inputs">
            <option value="" disabled>Waehle Bericht</option>
            <option value="Kundenbezogener">Kundenbezogener Bericht</option>
            <option value="Rechnungsliste">Rechnungsliste</option>
            <option value="Umsatzbericht">Umsatzbericht</option>
            <option value="Mehrwertsteuer">Mehrwertsteuer (MwSt) Bericht</option>
          </select>
        </div>
        <CustomersReport v-if="report_type == 'Kundenbezogener'" />
        <InvoicesListReport v-if="report_type == 'Rechnungsliste'" />
        <SalesReport v-if="report_type == 'Umsatzbericht'" />
        <TaxReport v-if="report_type == 'Mehrwertsteuer'" />
      </div>
      <div class="print-actions">
        <button class="btn-excel">📊 Excel Export</button>
        <button class="btn btn-print" @click="printDocument">🖨️ Drucken</button>
      </div>
    </div>
  </div>
</template>

<script>
import CustomersReport from '../../components/reports/CustomersReport.vue'
import InvoicesListReport from '../../components/reports/InvoicesListReport.vue'
import SalesReport from '../../components/reports/SalesReport.vue'
import TaxReport from '../../components/reports/TaxReport.vue'

export default {
  name: 'InvoicesReport',
  components: {
    CustomersReport,
    InvoicesListReport,
    SalesReport,
    TaxReport
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
