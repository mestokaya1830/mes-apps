<template>
  <div>
    <div class="editor-panel">
      <div class="printable">
        <!-- Header -->
        <h2>{{ title }}</h2>
        <!-- 
        Status and disable logic
        draft → only sent can be selected.
        sent → only accepted and rejected can be selected; draft and sent are disabled.
        accepted/rejected → all options are disabled; only the current status is shown. 
      -->
        <div class="form-section">
          <div class="form-group">
            <div v-if="offer.status === 'accepted' || offer.status === 'rejected'">
              <h4>Status: {{ offer.status }}</h4>
              <div class="form-input disabled">
                {{
                  offer.status === 'accepted'
                    ? 'Angenommen'
                    : offer.status === 'rejected'
                      ? 'Abgelehnt'
                      : offer.status
                }}

                <small class="text-muted d-block">Status kann nicht mehr geändert werden.</small>
              </div>
            </div>
            <div v-else>
              <label class="form-label">Status</label>
              <select v-model="offer.status" class="form-input">
                <option value="" disabled>Status auswählen</option>
                <option value="draft" :disabled="offer.status !== 'sent' ? true : true">
                  Entwurf
                </option>
                <option value="sent" :disabled="offer.status !== 'draft'">Gesendet</option>
                <option value="accepted" :disabled="offer.status !== 'sent'">Angenommen</option>
                <option value="rejected" :disabled="offer.status !== 'sent'">Abgelehnt</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Bearbeitet von:</label>
            <input
              v-model="offer.status_by"
              type="text"
              placeholder="Name der bearbeitenden Person eingeben"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Bearbeitet am:</label>
            <input v-model="offer.date" type="date" class="form-input date" />
          </div>

          <div class="form-group">
            <label class="form-label">Kommentare:</label>
            <textarea
              v-model="offer.status_comments"
              class="form-input"
              placeholder="Kommentare oder Notizen hier eingeben"
            ></textarea>
          </div>
        </div>
      </div>
      <button
        :disabled="original_status == 'accepted' || original_status == 'rejected'"
        class="btn btn-update"
        @click="updateOffer"
      >
        Speichern Status
      </button>
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
      offer: {
        date: '',
        status: '',
        status_by: '',
        status_comments: ''
      },
      original_status: ''
    }
  },
  mounted() {
    this.getOfferStatus()
  },
  methods: {
    async getOfferStatus() {
      const result = await window.api.getOfferByStatus(this.$route.params.id)
      if (!result.success) return
      console.log(result.rows)
      this.offer.status = result.rows.status
      this.offer.status_by = result.rows.status_by
      this.offer.date = result.rows.date
      this.offer.status_comments = result.rows.status_comments
      this.original_status = result.rows.status
    },
    async updateOffer() {
      const data = {
        id: this.$route.params.id,
        date: this.offer.date,
        status: this.offer.status,
        status_by: this.offer.status_by,
        status_comments: this.offer.status_comments
      }
      const result = await window.api.updateOfferById(data)
      if (result.success) {
        this.$router.push('/offers/details/' + this.$route.params.id)
      }
    }
  }
}
</script>
