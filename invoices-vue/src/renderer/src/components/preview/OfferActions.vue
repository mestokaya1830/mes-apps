<template lang="">
  <div>
    <div class="sections btn-container">
      <button class="btn btn-email" @click="sendEmail">
        <i class="bi bi-envelope-at-fill icons"></i>
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

      <button
        v-if="tableData.id && sourcePage !== 'preview' && tableData.is_active"
        class="btn btn-edit"
      >
        <router-link :to="`/offers/edit/${tableData.id}`" class="text-white text-decoration-none">
          <i class="bi bi-pencil-square icons"></i>
          <span>Bearbeiten</span>
        </router-link>
      </button>

      <button
        v-if="tableData.id && sourcePage !== 'preview' && tableData.is_active"
        class="btn btn-cancel"
      >
        <router-link :to="`/offers/edit-cancel/${tableData.id}`" class="text-white text-decoration-none">
          <i class="bi bi-x-circle-fill icons"></i>
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
    async cancelOffer(id) {
      if (confirm('Sind Sie sicher, dass Sie dieses Angebot löschen möchten?')) {
        try {
          const result = await window.api.cancelOfferById(id)
          if (result.success) this.getOffers()
          this.$router.push('/offers')
        } catch (error) {
          console.error(error)
        }
      }
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
        await store.clearStore('offer')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
