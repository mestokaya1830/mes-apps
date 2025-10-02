<template>
  <div>
    <h1>{{ title }}</h1>
    <form>
      <div>
        <label for="bank">Bank Name</label>
        <input id="bank" v-model="updateUser.bank_name" type="text" />
      </div>
      <div>
        <label for="iban">Iban</label>
        <input id="iban" v-model="updateUser.iban" type="text" />
      </div>
      <div>
        <label for="bank_account_holder">Bank Account Holder</label>
        <input id="bank_account_holder" v-model="updateUser.bank_account_holder" type="text" />
      </div>
      <div>
        <label for="bic">Bic</label>
        <input id="bic" v-model="updateUser.bic" type="text" />
      </div>
      <div>
        <label for="logo">Logo</label>
        <img ref="logo" class="profile-logo" :src="imageSrc" alt="" @click="triggerFile" />
        <input id="logo" ref="logoInput" type="file" @change="setLogo" />
      </div>
    </form>
    <button class="form-btn" @click="updateProfile()">Update</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Edit Profile',
      updateUser: {},
      imageSrc: ''
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser() {
      try {
        const response = await window.api.getUser()
        this.updateUser = {
          bank_name: response.user.bank_name,
          iban: response.user.iban,
          bank_account_holder: response.user.bank_account_holder,
          bic: response.user.bic,
          logo: response.user.logo,
          image_type: response.user.image_type
        }
        this.imageSrc = `data:${this.updateUser.image_type};base64,${this.updateUser.logo}`
      } catch (error) {
        console.error(error)
      }
    },
    async updateProfile() {
      console.log(this.updateUser)
    },
    triggerFile() {
      this.$refs.logoInput.click()
    },
    setLogo(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.$refs.logo.src = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style>
.form-btn {
  margin-top: 2rem;
}
.profile-logo {
  width: 100%;
  object-fit: contain;
  border-radius: 5px;
  cursor: pointer;
}
#logo {
  display: none;
}
.logo {
  cursor: pointer;
}
</style>
