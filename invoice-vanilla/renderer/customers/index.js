window.addEventListener("DOMContentLoaded", () => {
  // get customers
  async function fetchCustomers() {
    const customers = await window.customerApi.getCustomers();
    const list = document.getElementById("customerList");
    if (!list) return;
    list.innerHTML = "";

    customers.forEach((data) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${data.name}</span> <span>${data.email}</span> <span>${data.phone}</span> <span>${data.address}</span> <span>${data.taxnumber}</span>`;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteCustomer(data._id));

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => {
        window.location.href = `../../pages/customers/edit.html?id=${data._id}`;
      });

      li.appendChild(deleteBtn);
      li.appendChild(editBtn);
      list.appendChild(li);
    });
  }
  fetchCustomers();

  // delete customer
  async function deleteCustomer(id) {
    try {
      await window.customerApi.deleteCustomer(id);
      console.log("Customer deleted successfully!");
    } catch (error) {
      console.log("Customer could not be deleted!");
    }
    await fetchCustomers();
  }

  // back to home
  document.getElementById("btnBack").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
