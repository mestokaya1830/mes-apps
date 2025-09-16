window.addEventListener("DOMContentLoaded", () => {
  // edit customer
  async function editCustomer() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      const customer = await window.customerApi.editCustomer(id);

      document.getElementById("name").value = customer.name || "";
      document.getElementById("email").value = customer.email || "";
      document.getElementById("phone").value = customer.phone || "";
      document.getElementById("address").value = customer.address || "";
      document.getElementById("taxnumber").value = customer.taxnumber || "";

      // form submit handler
      const form = document.getElementById("editForm");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        customer.name = document.getElementById("name").value;
        customer.email = document.getElementById("email").value;
        customer.phone = document.getElementById("phone").value;
        customer.address = document.getElementById("address").value;
        customer.taxnumber = document.getElementById("taxnumber").value;

        try {
          await window.customerApi.updateCustomer(customer);
          console.log("Customer updated successfully!");
          window.location.href = "../../pages/customers/index.html"; // list sayfasına dön
        } catch (error) {
          console.error("Customer could not be updated:", error);
          console.log("Update failed!");
        }
      });
    } catch (error) {
      console.error("Could not fetch customer for editing:", error);
      console.log("Could not load customer!");
    }
  }

  editCustomer();

  // back to home
  document.getElementById("btnBack").addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
});
