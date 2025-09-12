window.addEventListener("DOMContentLoaded", () => {
  //add customer
  const form = document.getElementById("customerForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const customer = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        taxnumber: document.getElementById("taxnumber").value,
      };
  
      try {
        await window.customerApi.addCustomer(customer);
        alert("New customer added successfully!");
        e.target.reset();
      } catch (error) {
        alert("New customer could not be added!");
      }
    });
  }
});
