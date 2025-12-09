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
.btn-pdf {
  background: #2263c5;
  color: white;
}

.btn-secondary {
  background: cornflowerblue;
  color: #fff;
  border: 1px solid #e2e8f0;
}

.btn-print {
  background: cadetblue;
  color: #fff;
  border: 1px solid #e2e8f0;
}
.btn-primary:hover,
.btn-secondary:hover,
.btn-print:hover {
  filter: brightness(0.9);
}
.nav-icon {
  margin-right: 8px;
}
</style>
