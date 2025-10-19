<template lang="">
  <div>
    <div class="action-buttons">
      <button class="btn btn-secondary" @click="sendEmail">
        <span>📧</span>
        <span>E-Mail senden</span>
      </button>
      <button class="btn btn-primary" @click="exportPDF">
        <span>📄</span>
        <span>PDF erstellen</span>
      </button>
      <button class="btn btn-print" @click="printDocument">
        <span>🖨</span>
        <span>Drucken</span>
      </button>
    </div>
  </div>
</template>
<script>
import html2pdf from 'html2pdf.js'
export default {
  name: 'ActionsButton',
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    exportPDF() {
      const element = this.$el.querySelector('.printable')
      if (!element) return

      const options = {
        margin: 20,
        filename: `Rechnung.pdf`,
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().set(options).from(element).save()
    },
    printDocument() {
      window.print()
    },
    sendEmail() {
      console.log(this.email)
    }
  }
}
</script>
<style scoped>
.action-buttons {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.btn {
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
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}

.btn-secondary {
  background: cornflowerblue;
  color: #fff;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
.btn-print {
  background: cadetblue;
  color: #fff;
  border: 1px solid #e2e8f0;
}
.btn-print:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
</style>
