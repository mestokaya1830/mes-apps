<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/customer-new" class="link">Add New Customer</router-link>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Customer List',
      customer: {}
    }
  },
  mounted() {
    this.customerDetails()
  },
  methods: {
    async customerDetails() {
      try {
        const result = await window.api.customerDetails(this.$route.params.id)
        this.customer = result
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.customer-card {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.customer-card h2 {
  margin-bottom: 15px;
  color: #333;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4caf50;
  outline: none;
}

.form-btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: fit-content;
  align-self: flex-end;
}
.link {
  text-decoration: none;
  color: white;
}
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
}
</style>
