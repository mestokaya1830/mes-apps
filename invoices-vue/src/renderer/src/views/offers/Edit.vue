<template>
  <div>
    <div v-if="offer" class="preview-panel">
      <div class="printable">
        <!-- Header -->
        <h2>{{ title }}</h2>

        <!-- status -->
        <div class="form-section">
          <label class="form-label">Akzeptierungsinformationen</label>
          <div>
            <strong>Angebotstatus:</strong>
            <div class="status-badge">
              {{
                offer.status === 'draft'
                  ? 'Ausstehend'
                  : offer.status === 'accept'
                    ? 'Akzeptiert'
                    : 'Nicht akzeptiert'
              }}
            </div>
          </div>

          <div>
            <strong>Angebotsnummer:</strong>
            <span class="form-label">{{ formatOfferId(offer.id) }}</span>
          </div>

          <div>
            <strong>Bearbeitet von:</strong>
            <span class="form-label">{{ offer.status_by }}</span>
          </div>

          <div>
            <strong>Bearbeitet am:</strong>
            <span class="form-label">{{ offer.status_date }}</span>
          </div>

          <div>
            <strong>Kommentare:</strong>
            <p class="form-label">{{ offer.status_comments }}</p>
          </div>
        </div>

        <div class="form-section">
          <!-- SELECTBOX -->
          <div class="form-group">
            <label>Status auswählen</label>
            <select v-model="status_selected">
              <option value="" disabled>Status auswahlen</option>
              <option value="draft">Entwurf</option>
              <option value="accept">Akzeptiert</option>
              <option value="not_accept">Nicht akzeptiert</option>
            </select>
          </div>

          <div class="status-box">
            <label>Informationen zum Status</label>

            <div>
              <strong>Angebotsnummer:</strong>
              <span>{{ formatOfferId(offer.id) }}</span>
            </div>

            <div>
              <strong>Bearbeitet von:</strong>
              <input
                v-model="status_by"
                type="text"
                placeholder="Name der bearbeitenden Person eingeben"
              />
            </div>

            <div>
              <strong>Bearbeitet am:</strong>
              <input v-model="status_date" type="date" />
            </div>

            <div>
              <strong>Kommentare:</strong>
              <textarea
                v-model="status_comments"
                class="form-input"
                placeholder="Kommentare oder Notizen hier eingeben"
              ></textarea>
            </div>
            <button class="btn" @click="updateOffer">Speichern Status</button>
          </div>
        </div>
      </div>
    </div>
    <router-link :to="`/offers/details/${$route.params.id}`" class="back-link">
      ← Zurück zur Angebotsdetails
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'OfferEdit',
  inject: ['formatOfferId'],
  data() {
    return {
      title: 'Angebot-Bearbeiten',
      offer: null,
      auth: null,
      status_selected: '',
      status_by: '',
      status_date: '',
      status_comments: ''
    }
  },
  mounted() {
    this.getOffer()
  },
  methods: {
    async getOffer() {
      try {
        const result = await window.api.getOfferById(this.$route.params.id)
        this.offer = {
          ...result.rows,
          customer: JSON.parse(result.rows.customer),
          positions: JSON.parse(result.rows.positions)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async updateOffer() {
      const data = {
        id: this.offer.id,
        status: this.status_selected,
        status_by: this.status_by,
        status_date: this.status_date,
        status_comments: this.status_comments
      }
      const result = await window.api.updateOfferById(data)
      if (result.success) {
        this.$router.push('/offers/details/' + this.offer.id)
      }
    }
  }
}
</script>
<style>
/* PREVIEW PANEL */
.preview-panel {
  width: 80%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: auto;
  padding: 20px;
  top: 20px;
}

/* RECIPIENT */
.recipient {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.recipient-address {
  font-weight: 600;
  color: var(--lightColor);
  font-size: 12px;
}

/* META INFO */
.meta-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  margin-bottom: 4px;
}

.meta-label {
  font-weight: 600;
  color: var(--lightColor);
  font-size: 12px;
}

.meta-value {
  color: var(--midColor);
  font-size: 12px;
}

/* INTRO */
.intro-text {
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 10px;
}

/* BANK + CONTACT BOX */
.bank-box {
  background: #f1f5f9;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid transparent;
}

.bank-info {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 4px;
  line-height: 1.6;
  font-size: 12px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.bank-label {
  color: #444;
}

.bank-value {
  font-weight: 600;
  color: #333;
}

/* BACK LINK */
.back-link {
  display: inline-block;
  cursor: pointer;
  margin: 40px 0;
  font-size: 18px;
  color: #3b82f6;
  text-decoration: none;
  border: 1px solid #3b82f6;
  padding: 4px 8px;
  border-radius: 4px;
}
.back-link:hover {
  text-decoration: underline;
}

/* Positions Table */
.positions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  font-size: 10pt;
}

.positions-table thead {
  background: #f8f9fa;
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
}

.positions-table th {
  padding: 10px 8px;
  text-align: left;
  font-size: 9pt;
  font-weight: 700;
  text-transform: uppercase;
  color: #333;
}

.positions-table th.center,
.positions-table td.center {
  text-align: center;
}

.positions-table th.right,
.positions-table td.right {
  text-align: right;
}

.positions-table tbody tr {
  border-bottom: 1px solid #e9ecef;
}

.positions-table td {
  padding: 12px 8px;
  vertical-align: top;
}

.position-title {
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
}

.position-description {
  font-size: 9pt;
  color: #666;
  margin-top: 4px;
}

.position-service-period {
  font-size: 8pt;
  color: #888;
  margin-top: 4px;
  font-style: italic;
}

/* Section Title */
.section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 16px;
}

/* Summary Section */
.summary-section {
  margin-left: auto;
  width: 300px;
  margin-bottom: 40px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 10pt;
}

.total-row.subtotal {
  font-size: 11pt;
  font-weight: 700;
}

.total-row.paid {
  color: #16a34a;
  font-weight: 700;
}

.total-row.outstanding {
  color: #dc2626;
  font-weight: 700;
}

.total-label {
  font-weight: 500;
}

.total-value {
  font-weight: 600;
  text-align: right;
}

/* Tax Notes */
.tax-note {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 9pt;
  line-height: 1.5;
}

.small-company {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
}

/* Subject Line */
.subject-line {
  margin: 20px 0;
  padding: 12px;
  background-color: #f8f9fa;
  border-left: 4px solid #0066cc;
  font-size: 14px;
}

/* Payment Terms */
.payment-terms-box {
  margin: 30px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.payment-terms-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #0066cc;
}

.payment-terms-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-term-item {
  font-size: 13px;
  line-height: 1.6;
  padding: 8px 0;
}

.payment-term-item strong {
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.skonto-highlight {
  background-color: #e7f3ff;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #0066cc;
}

.skonto-amount {
  margin-top: 8px;
  font-size: 12px;
  color: #0066cc;
  font-weight: 600;
}

.payment-conditions-text {
  margin-top: 6px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  white-space: pre-wrap;
  font-size: 12px;
  color: #666;
}
</style>
