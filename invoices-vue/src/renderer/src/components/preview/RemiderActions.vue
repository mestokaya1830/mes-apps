<template lang="">
  <div>
    <div class="action-buttons">
      <button v-if="sourcePage === 'preview'" class="btn btn-primary" @click="saveReminder">
        <span class="nav-icon">💾</span>
        <span>Speichern</span>
      </button>
      <button class="btn btn-secondary" @click="sendEmail">
        <span class="nav-icon">📧</span>
        <span>E-Mail</span>
      </button>
      <button class="btn btn-pdf" @click="exportPDF">
        <span class="nav-icon">📄</span>
        <span>PDF</span>
      </button>
      <button class="btn btn-print" @click="printDocument">
        <span class="nav-icon">🖨</span>
        <span>Drucken</span>
      </button>
      <button
        v-if="tableData.id && sourcePage !== 'preview' && tableData.is_active"
        class="btn btn-edit"
      >
        <router-link
          :to="{
            path: '/reminders/edit/' + tableData.id,
            query: { id: tableData.id, invoice_id: tableData.invoice.id }
          }"
        >
          <span class="nav-icon">✏</span>
          <span>Bearbeiten</span>
        </router-link>
      </button>
    </div>
  </div>
</template>
<script>
import html2pdf from 'html2pdf.js'
import store from '../../store/store.js'
export default {
  name: 'ActionsButton',
  props: {
    tableData: {
      type: Object,
      required: true
    },
    sourcePage: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    async exportPDF() {
      await this.$nextTick() // Vue render bitti mi bekle
      const element = document.querySelector('.printable')
      if (!element) return

      const options = {
        margin: 16,
        filename: this.fileName + '.pdf',
        image: { type: 'png', quality: 0.95 },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          logging: false,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().set(options).from(element).save()
      this.clearStore()
    },
    async saveReminder() {
      if (this.tableData) {
        const result = await window.api.addReminder(JSON.parse(JSON.stringify(this.tableData)))
        if (!result.success) return
        this.clearStore()
        this.$router.push('/invoices/details/' + this.tableData.invoice_id)
      }
    },
    printDocument() {
      this.clearStore()
      window.print()
    },
    sendEmail() {
      this.clearStore()
      console.log(this.email)
    },
    async clearStore() {
      try {
        await store.clearStore('reminder')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
