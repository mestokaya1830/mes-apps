<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <span class="form-btn">
      <router-link to="/customers/create" class="link">Add New Customer</router-link>
    </span>

    <template v-for="item in customers" :key="item.id">
      <div class="customer-list">
        <div class="customer-list-item">{{ item.customer_type ? item.customer_type : '' }}</div>
        <div class="customer-list-item">{{ item.first_name ? item.first_name : '' }}</div>
        <div class="customer-list-item">{{ item.last_name ? item.last_name : '' }}</div>
        <div class="customer-list-item">{{ item.is_active ? item.is_active : '' }}</div>
        <router-link :to="'/customers/details/' + item.id" class="details-btn">Details</router-link>
        <button class="delete-btn" @click="deleteCustomer(item.id)">Delete</button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Customers',
      customers: []
    }
  },
  mounted() {
    this.getCustomers()
  },
  methods: {
    async getCustomers() {
      try {
        const result = await window.api.getCustomers()
        this.customers = result.customers
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteCustomer(id) {
      try {
        const result = await window.api.deleteCustomer(id)
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
.customer-list {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.customer-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.details-btn,
.delete-btn {
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  color: white;
  background-color: cornflowerblue;
  cursor: pointer;
  margin: 0 10px;
}
.delete-btn {
  background-color: red;
  border: none;
}
.details:hover, .delete-btn:hover {
  filter: brightness(0.9);
}
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
}
</style>
