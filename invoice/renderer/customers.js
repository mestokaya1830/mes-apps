const apiUrl = "http://localhost:3000/customers";

async function fetchCustomers() {
  const res = await fetch(apiUrl);
  const data = await res.json();
  const list = document.getElementById("customerList");
  list.innerHTML = "";

  data.forEach((c) => {
    const li = document.createElement("li");

    const text = document.createTextNode(`${c.name} - ${c.email} - ${c.phone}`);
    li.appendChild(text);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.addEventListener("click", () => deleteCustomer(c._id));
    li.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Düzenle";
    editBtn.addEventListener("click", () => editCustomer(c));
    li.appendChild(editBtn);

    list.appendChild(li);
  });
}

async function deleteCustomer(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchCustomers();
}

function editCustomer(c) {
  document.getElementById("name").value = c.name;
  document.getElementById("email").value = c.email;
  document.getElementById("phone").value = c.phone;
  document.getElementById("customerId").value = c._id;
}

document
  .getElementById("customerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("customerId").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (id) {
      await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
    } else {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
    }

    e.target.reset();
    document.getElementById("customerId").value = "";
    fetchCustomers();
  });

document.getElementById("btnBack").addEventListener("click", () => {
  window.location.href = "index.html";
});

fetchCustomers();
