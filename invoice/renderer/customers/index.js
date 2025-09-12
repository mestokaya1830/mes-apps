window.addEventListener("DOMContentLoaded", () => {
  // get customers
  async function fetchCustomers() {
    const customers = await window.customerApi.getCustomers();
    const list = document.getElementById("customerList");
    if (!list) return;
    list.innerHTML = "";

    customers.forEach((data) => {
      const li = document.createElement("li");
      const nameText = document.createElement("input");
      nameText.id = "nameEdit";
      nameText.value = data.name;

      const emailText = document.createElement("input");
      emailText.id = "emailEdit";
      emailText.type = "email";
      emailText.value = data.email;

      const phoneText = document.createElement("input");
      phoneText.id = "phoneEdit";
      phoneText.value = data.phone;

      const addressText = document.createElement("input");
      addressText.id = "addressEdit";
      addressText.value = data.address;

      const taxNumberText = document.createElement("input");
      taxNumberText.id = "taxnumberEdit";
      taxNumberText.value = data.taxnumber;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteCustomer(data._id));

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => {
        window.location.href = `../../pages/customers/edit.html?id=${data._id}`;
      });

      li.appendChild(nameText);
      li.appendChild(emailText);
      li.appendChild(phoneText);
      li.appendChild(addressText);
      li.appendChild(taxNumberText);
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
