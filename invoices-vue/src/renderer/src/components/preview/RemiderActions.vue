<template>
  <div>
    <div class="sections btn-container">
      <button class="btn btn-email" @click="sendEmail">
        <i class="bi bi-envelope form-title icons"></i>
        <span>E-Mail</span>
      </button>

      <button class="btn btn-pdf" @click="exportPDF">
        <i class="bi bi-file-earmark-pdf form-title icons"></i>
        <span>PDF</span>
      </button>

      <button class="btn btn-print" @click="printDocument">
        <i class="bi bi-printer form-title icons"></i>
        <span>Drucken</span>
      </button>

      <router-link :to="`/invoices/edit/${tableData.id}`">
        <button v-if="tableData.id !== 'preview' && tableData.is_active" class="btn btn-cancel">
          <i class="bi bi-pencil-square icons"></i>
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
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: {
          scale: 1,
          useCORS: true,
          logging: false,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().set(options).from(element).save()
      this.clearStore()
    },
    printDocument() {
      this.clearStore()
      window.print()
    },
    sendEmail() {
      this.clearStore()
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
