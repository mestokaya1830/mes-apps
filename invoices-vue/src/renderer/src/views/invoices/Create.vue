<template>
  <div>
    <!-- EDITOR PANEL -->
    <div class="editor-panel">
      <div class="editor-header">
        <router-link to="/invoices-preview" class="back-btn">Preview</router-link>
        <div class="editor-title">📝 Rechnung bearbeiten</div>
        <div class="editor-subtitle">
          Bearbeiten Sie die Rechnung und sehen Sie die Vorschau live
        </div>
      </div>

      <!-- GRUND DATEN -->
      <div class="form-section">
        <div class="form-section-title">📌 Grunddaten</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Rechnungsnummer</label>
            <input type="text" class="form-input" v-model="invoiceNumber" />
          </div>
          <div class="form-group">
            <label class="form-label">Rechnungsdatum</label>
            <input type="date" class="form-input" v-model="invoiceDate" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Kundennummer</label>
            <input type="text" class="form-input" v-model="customerNumber" />
          </div>
          <div class="form-group">
            <label class="form-label">Leistungszeitraum</label>
            <input type="text" class="form-input" v-model="servicePeriod" />
          </div>
        </div>
      </div>

      <!-- KUNDE -->
      <div class="form-section">
        <div class="form-section-title">👤 Kunde</div>
        <div class="form-group">
          <label class="form-label">Kundenname</label>
          <input type="text" class="form-input" v-model="customerName" />
        </div>
        <div class="form-group">
          <label class="form-label">Firma</label>
          <input type="text" class="form-input" v-model="customerCompany" />
        </div>
        <div class="form-group">
          <label class="form-label">Adresse</label>
          <input type="text" class="form-input" v-model="customerAddress" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">PLZ</label>
            <input type="text" class="form-input" v-model="customerZip" />
          </div>
          <div class="form-group">
            <label class="form-label">Stadt</label>
            <input type="text" class="form-input" v-model="customerCity" />
          </div>
        </div>
      </div>

      <!-- POSITIONEN -->
      <div class="form-section">
        <div class="form-section-title">📦 Positionen</div>

        <div class="positions-editor">
          <div class="position-item" v-for="(pos, index) in positions" :key="index">
            <div class="position-header">
              <span class="position-number">Position {{ index + 1 }}</span>
              <button class="delete-btn" @click="deletePosition(index)">🗑️ Löschen</button>
            </div>
            <div class="form-group">
              <label class="form-label">Bezeichnung</label>
              <input type="text" class="form-input" v-model="pos.title" />
            </div>
            <div class="form-group">
              <label class="form-label">Beschreibung</label>
              <input type="text" class="form-input" v-model="pos.description" />
            </div>
            <div class="position-inputs">
              <div class="form-group">
                <label class="form-label">Einheit</label>
                <select class="form-input" v-model="pos.unit">
                  <option>Stk</option>
                  <option>Std</option>
                  <option>Tag</option>
                  <option>Pauschal</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Menge</label>
                <input type="number" class="form-input" v-model.number="pos.quantity" />
              </div>
              <div class="form-group">
                <label class="form-label">Preis (€)</label>
                <input type="number" class="form-input" v-model.number="pos.price" step="0.01" />
              </div>
              <div class="form-group">
                <label class="form-label">MwSt. (%)</label>
                <select class="form-input" v-model.number="pos.vat">
                  <option :value="0">0</option>
                  <option :value="7">7</option>
                  <option :value="19">19</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button class="add-position-btn" @click="addPosition">➕ Position hinzufügen</button>
      </div>

      <!-- ZAHLUNGSINFORMATIONEN -->
      <div class="form-section">
        <div class="form-section-title">💳 Zahlungsinformationen</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Anzahlung (bereits bezahlt)</label>
            <input type="number" class="form-input" v-model.number="paidAmount" step="0.01" />
          </div>
          <div class="form-group">
            <label class="form-label">Zahlungsziel (Tage)</label>
            <input type="number" class="form-input" v-model.number="paymentTerms" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      invoiceNumber: 'RE-2024-001',
      invoiceDate: '2024-12-15',
      customerNumber: 'KU-2024-042',
      servicePeriod: 'Okt - Dez 2024',
      customerName: 'Herrn Maximilian Weber',
      customerCompany: 'Weber Consulting GmbH',
      customerAddress: 'Friedrichstraße 158',
      customerZip: '10117',
      customerCity: 'Berlin',
      paidAmount: 2647.75,
      paymentTerms: 14,
      positions: [
        {
          title: 'Responsive Webdesign',
          description: 'Professionelles Webdesign mit responsivem Layout',
          quantity: 1,
          unit: 'Pauschal',
          price: 2500,
          vat: 19
        }
      ],
      preview: false
    }
  },
  computed: {
    subtotal() {
      return this.positions.reduce((sum, p) => sum + p.quantity * p.price, 0)
    },
    vatAmount() {
      return this.positions.reduce((sum, p) => sum + (p.quantity * p.price * p.vat) / 100, 0)
    },
    grandTotal() {
      return this.subtotal + this.vatAmount
    },
    outstanding() {
      return this.grandTotal - this.paidAmount
    },
    formattedDate() {
      const date = new Date(this.invoiceDate)
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    },
    previewHTML() {
      let positionsHTML = ''
      this.positions.forEach((pos, index) => {
        const total = +pos.quantity * pos.price
        positionsHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>
              <div class="position-title">${pos.title}</div>
              <div class="position-description">${pos.description}</div>
            </td>
            <td class="center">${pos.quantity}</td>
            <td class="center">${pos.unit}</td>
            <td class="right">${this.formatCurrency(pos.price)}</td>
            <td class="right">${pos.vat}%</td>
            <td class="right">${this.formatCurrency(total)}</td>
          </tr>
        `
      })

      return `
        <div class="header">
          <div>
            <div class="company-name">Ihre Firma GmbH</div>
            <div class="company-details">
              Musterstraße 123 • 10115 Berlin<br>
              Tel: +49 30 1234567 • info@ihre-firma.de
            </div>
          </div>
          <div class="logo-placeholder">LOGO</div>
        </div>

        <div class="recipient">
          <div class="sender-line">Ihre Firma GmbH • Musterstraße 123 • 10115 Berlin</div>
          <div class="recipient-address">
            <div class="recipient-name">${this.customerName}</div>
            <div>${this.customerCompany}</div>
            <div>${this.customerAddress}</div>
            <div>${this.customerZip} ${this.customerCity}</div>
          </div>
        </div>

        <div class="meta-info">
          <div>
            <div class="meta-row">
              <span class="meta-label">Ansprechpartnerin:</span>
              <span class="meta-value">Frau Müller</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Telefon:</span>
              <span class="meta-value">+49 30 1234-567</span>
            </div>
          </div>
          <div>
            <div class="meta-row">
              <span class="meta-label">Rechnungsnr.:</span>
              <span class="meta-value">${this.invoiceNumber}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Datum:</span>
              <span class="meta-value">${this.formattedDate}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Kundennr.:</span>
              <span class="meta-value">${this.customerNumber}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Leistung:</span>
              <span class="meta-value">${this.servicePeriod}</span>
            </div>
          </div>
        </div>

        <div class="document-title">
          Rechnung
          <span class="status-badge">⏱️ Teilweise bezahlt</span>
        </div>

        <div class="intro-text">
          Sehr geehrter Herr Weber,<br><br>
          für die erbrachten Leistungen erlauben wir uns, Ihnen wie folgt in Rechnung zu stellen:
        </div>

        <table class="positions-table">
          <thead>
            <tr>
              <th style="width:5%;">Pos.</th>
              <th style="width:40%;">Bezeichnung</th>
              <th class="center" style="width:8%;">Menge</th>
              <th class="center" style="width:10%;">Einheit</th>
              <th class="right" style="width:12%;">Einzelpreis</th>
              <th class="right" style="width:10%;">MwSt.</th>
              <th class="right" style="width:15%;">Gesamtpreis</th>
            </tr>
          </thead>
          <tbody>${positionsHTML}</tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span class="total-label">Zwischensumme (netto):</span>
            <span class="total-value">{{ formatCurrency(netTotal) }}</span>
          </div>
          <div class="total-row">
            <span class="total-label">MwSt.:</span>
            <span class="total-value">{{ formatCurrency(vatAmount) }}</span>
          </div>
          <div class="total-row subtotal">
            <span class="total-label">Rechnungsbetrag (brutto):</span>
            <span class="total-value">{{ formatCurrency(grandTotal) }}</span>
          </div>
          <div class="total-row paid">
            <span class="total-label">✓ Bereits bezahlt:</span>
            <span class="total-value">- {{ formatCurrency(paidAmount) }}</span>
          </div>
          <div class="total-row final outstanding">
            <span class="total-label">⚠️ Offener Betrag:</span>
            <span class="total-value">{{ formatCurrency(outstanding) }}</span>
          </div>
        </div>


        <div class="bank-box">
          <div class="bank-title">🏦 Bankverbindung</div>
          <div class="bank-info">
            <span class="bank-label">Bank:</span>
            <span class="bank-value">Berliner Sparkasse</span>
            <span class="bank-label">IBAN:</span>
            <span class="bank-value">DE89 1005 0000 0123 4567 89</span>
            <span class="bank-label">BIC:</span>
            <span class="bank-value">BELADEBEXXX</span>
            <span class="bank-label">Verwendung:</span>
            <span class="bank-value">${this.invoiceNumber}</span>
          </div>
        </div>

        <div class="footer">
          <div class="footer-row">
            <strong>Ihre Firma GmbH</strong> • Geschäftsführer: Max Mustermann • HRB 12345 B
          </div>
          <div class="footer-row">
            <strong>Bank:</strong> Berliner Sparkasse • IBAN: DE89 1005 0000 0123 4567 89
          </div>
          <div class="footer-row">
            <strong>Steuernr.:</strong> 12/345/67890 • <strong>USt-IdNr.:</strong> DE123456789
          </div>
        </div>
      `
    }
  },
  methods: {
    addPosition() {
      this.positions.push({
        title: 'Neue Position',
        description: 'Beschreibung',
        quantity: 1,
        unit: 'Stk',
        price: 0,
        vat: 19
      })
      console.log(this.subtotal)
    },
    deletePosition(index) {
      if (this.positions.length > 1) {
        this.positions.splice(index, 1)
      } else {
        alert('Mindestens eine Position muss vorhanden sein!')
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
    },
    handlePreview() {
      this.preview = !this.preview
    }
  }
}
</script>
<style>

/* EDITOR PANEL */
.editor-panel {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 40px);
}

.editor-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.editor-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* FORM GROUPS */
.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* POSITIONS EDITOR */
.positions-editor {
  margin-top: 24px;
}

.position-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 2px solid #e5e7eb;
  position: relative;
}

.position-item:hover {
  border-color: #10b981;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.position-number {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fecaca;
}

.position-inputs {
  display: grid;
  grid-template-columns: 2fr 80px 100px 120px;
  gap: 8px;
  margin-bottom: 8px;
}

.add-position-btn {
  width: 100%;
  padding: 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-position-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}
</style>
