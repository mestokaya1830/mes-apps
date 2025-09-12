const apiUrl = "http://localhost:3000/customers";

//add customer
document.getElementById("customerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const customer = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
    };

    try { 
      await window.customerApi.addCustomer(customer);
      alert("New customer added successfully!");
      e.target.reset();
    } catch (error) {
      alert("New customer could not be added!");
    }
  });

// get customers
async function fetchCustomers() {
  const customers = await window.customerApi.getCustomers();
  const list = document.getElementById("customerList");
  list.innerHTML = "";

  customers.forEach((data) => {
    const li = document.createElement("li");
    const nameText = document.createElement("input");
    nameText.id = "nameEdit";
    nameText.value = data.name;
    li.appendChild(nameText);

    const emailText = document.createElement("input");
    emailText.id = "emailEdit";
    emailText.type = "email";
    emailText.value = data.email;
    li.appendChild(emailText);

    const phoneText = document.createElement("input");
    phoneText.id = "phoneEdit";
    phoneText.value = data.phone;
    li.appendChild(phoneText);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteCustomer(data._id));
    li.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editCustomer(data));
    li.appendChild(editBtn);

    list.appendChild(li);
  });
}
fetchCustomers();


// delete customer
async function deleteCustomer(id) {
  try {
    await window.customerApi.deleteCustomer(id);
    alert("Customer deleted successfully!");
  } catch (error) {
    alert("Customer could not be deleted!");
  }
  await fetchCustomers();
}


// edit customer
async function editCustomer(customer) {
  console.log(customer);
  customer.name = document.getElementById("nameEdit").value;
  customer.email = document.getElementById("emailEdit").value;
  customer.phone = document.getElementById("phoneEdit").value;

  try {
    await window.customerApi.editCustomer(customer);
    alert("Customer updated successfully!");
  } catch (error) {
    alert("Customer could not be updated!");
  }
  await fetchCustomers();
}

// back to home
document.getElementById("btnBack").addEventListener("click", () => {
  window.location.href = "index.html";
});
