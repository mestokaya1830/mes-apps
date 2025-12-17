<template lang="">
  <div>
    <div class="action-buttons">
      <button v-if="sourcePage === 'preview'" class="btn btn-primary" @click="saveOffer">
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
        <router-link :to="`/offers/edit/${tableData.id}`">
          <span class="nav-icon">✏</span>
          <span>Bearbeiten</span>
        </router-link>
      </button>
      <button
        v-if="tableData.id && sourcePage !== 'preview' && tableData.is_active"
        class="btn btn-cancel"
      >
        <router-link :to="`/offers/edit-cancel/${tableData.id}`">
          <span class="nav-icon">✏</span>
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
    async saveOffer() {
      if (this.tableData) {
        const result = await window.api.addOffer(JSON.parse(JSON.stringify(this.tableData)))
        if (!result.success) return
        this.clearStore()
        this.$router.push('/offers')
      }
    },
    async cancelOffer(id) {
      console.log(id)
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
      console.log(this.email)
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
<style scoped>
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  height: auto;
  margin-top: 30px;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.btn-primary {
  background: #22c55e;
  color: white;
}

.btn-secondary {
  background: #3b82f6;
  color: white;
  border: 1px solid #e2e8f0;
}

.btn-pdf {
  background: #1e40af;
  color: white;
}

.btn-print {
  background: #0ea5e9;
  color: white;
  border: 1px solid #e2e8f0;
}

.btn-edit {
  background: #facc15;
  color: black; 
  border: 1px solid #e2e8f0;
}

.btn-cancel {
  background: #ef4444;
  color: white;
  border: 1px solid #e2e8f0;
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-pdf:hover,
.btn-print:hover,
.btn-edit:hover,
.btn-cancel:hover {
  filter: brightness(0.9);
}

.nav-icon {
  margin-right: 8px;
}
</style>
