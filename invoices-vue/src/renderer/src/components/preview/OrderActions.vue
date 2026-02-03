<template lang="">
  <div>
    <div class="action-btn">
      <button v-if="sourcePage === 'preview'" class="btn btn-primary" @click="saveOrder">
        <i class="bi bi-floppy-fill icons"></i>
        <span>Speichern</span>
      </button>

      <button class="btn btn-secondary" @click="sendEmail">
        <i class="bi bi-envelope-fill icons"></i>
        <span>E-Mail</span>
      </button>

      <button class="btn btn-pdf" @click="exportPDF">
        <i class="bi bi-file-earmark-pdf-fill icons"></i>
        <span>PDF</span>
      </button>

      <button class="btn btn-print" @click="printDocument">
        <i class="bi bi-printer-fill icons"></i>
        <span>Drucken</span>
      </button>

      <button v-if="sourcePage !== 'preview'" class="btn btn-edit">
        <router-link :to="`/orders/edit/${tableData.id}`" class="text-decoration-none">
          <i class="bi bi-pencil-square icons"></i>
          <span>Bearbeiten</span>
        </router-link>
      </button>

      <button
        v-if="tableData.id && sourcePage !== 'preview' && tableData.is_active"
        class="btn btn-cancel"
      >
        <router-link :to="`/orders/edit-cancel/${tableData.id}`" class="text-decoration-none">
          <i class="bi bi-dash-circle-fill icons"></i>
          <span>Stornieren</span>
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
    async saveOrder() {
      if (this.tableData) {
        const result = await window.api.addOrder(JSON.parse(JSON.stringify(this.tableData)))
        if (!result.success) return
        // this.clearStore()
        this.$router.push('/orders')
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
        await store.clearStore('order')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
