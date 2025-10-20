<template lang="">
  <div>
    <div class="action-buttons">
      <button class="btn btn-secondary" @click="sendEmail">
        <span class="nav-icon">📧</span>
        <span>E-Mail</span>
      </button>
      <button class="btn btn-primary" @click="exportPDF">
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
export default {
  name: 'ActionsButton',
  props: {
    email: {
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
    exportPDF() {
      const element = document.querySelector('.printable')
      if (!element) return
      const options = {
        margin: 20,
        filename: this.fileName + '.pdf',
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
  display: flex;
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
  margin:0 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
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
