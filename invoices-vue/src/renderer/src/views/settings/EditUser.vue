<template>
  <div>
    <h1>{{ title }}</h1>
    <form>
      <div>
        <label for="bank">Bank Name</label>
        <input id="bank" v-model="user.bank_name" type="text" />
      </div>
      <div>
        <label for="iban">Iban</label>
        <input id="iban" v-model="user.iban" type="text" />
      </div>
      <div>
        <label for="bank_account_holder">Bank Account Holder</label>
        <input id="bank_account_holder" v-model="user.bank_account_holder" type="text" />
      </div>
      <div>
        <label for="bic">Bic</label>
        <input id="bic" v-model="user.bic" type="text" />
      </div>
      <div>
        <label for="logo">Logo</label>
        <img ref="logo" class="profile-logo" :src="imageSrc" alt="" @click="triggerFile" />
        <input id="logo" ref="logoInput" type="file" @change="setLogo" />
      </div>
    </form>
    <button class="form-btn" @click="updateUser()">Update</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Edit User',
      user: {},
      imageSrc: '',
      binaryImage: ''
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser() {
      try {
        const response = await window.api.getUser()
        this.user = {
          bank_name: response.user.bank_name,
          iban: response.user.iban,
          bank_account_holder: response.user.bank_account_holder,
          bic: response.user.bic,
          logo: response.user.logo,
          image_type: response.user.image_type
        }
        this.imageSrc = `data:${this.user.image_type};base64,${this.user.logo}`
      } catch (error) {
        console.error(error)
      }
    },
    async updateUser() {
      const res = await window.api.updateUser(
        Array.from(this.binaryImage),
        JSON.parse(JSON.stringify(this.user))
      )
      if (res.success) {
        this.$router.push('/profile')
      }
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

        //binary for db storage
        const binaryReader = new FileReader()
        binaryReader.onload = () => {
          this.binaryImage = new Uint8Array(binaryReader.result) // ArrayBuffer → Uint8Array
        }
        this.user.image_type = file.type
        binaryReader.readAsArrayBuffer(file)
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
