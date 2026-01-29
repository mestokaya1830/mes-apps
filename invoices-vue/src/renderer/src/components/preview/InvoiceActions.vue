<template>
  <div>
    <div class="form-section container-2">
      <button v-if="sourcePage === 'preview'" class="btn btn-primary" @click="saveInvoice">
        <i class="bi bi-save me-1 form-title"></i>
        <span>Speichern</span>
      </button>

      <button class="btn btn-secondary" @click="sendEmail">
        <i class="bi bi-envelope me-1 form-title"></i>
        <span>E-Mail</span>
      </button>

      <button class="btn btn-pdf" @click="exportPDF">
        <i class="bi bi-file-earmark-pdf me-1 form-title"></i>
        <span>PDF</span>
      </button>

      <button class="btn btn-print" @click="printDocument">
        <i class="bi bi-printer me-1 form-title"></i>
        <span>Drucken</span>
      </button>

      <router-link :to="`/invoices/edit/${tableData.id}`">
        <button
          v-if="tableData.id && sourcePage !== 'preview' && tableData.is_active"
          class="btn btn-cancel"
        >
          <i class="bi bi-pencil-square me-1 form-title"></i>
          <span>Stornieren</span>
        </button>
      </router-link>
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
    },
    fileName: {
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
      this.savePdf()
    },
    async saveInvoice() {
      if (this.tableData) {
        const result = await window.api.addInvoice(JSON.parse(JSON.stringify(this.tableData)))
        if (!result.success) return
        this.savePdf()
        this.$router.push('/invoices')
      }
    },
    printDocument() {
      this.savePdf()
      window.print()
    },
    sendEmail() {
      console.log(this.email)
    },
    async clearStore() {
      try {
        await store.clearStore('invoice')
      } catch (error) {
        console.error(error)
      }
    },
    async savePdf() {
      await this.$nextTick()
      const element = document.querySelector('.printable')
      if (!element) return

      const options = {
        margin: 16,
        filename: this.fileName + '.pdf',
        image: { type: 'png', quality: 0.95 },
        html2canvas: { scale: 1.5, useCORS: true, logging: false, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf()
        .set(options)
        .from(element)
        .outputPdf('blob')
        .then((blob) => {
          window.api.saveInvoicePDF(blob, this.fileName)
          this.clearStore()
        })
    }
  }
}
</script>
