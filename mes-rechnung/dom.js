 document.getElementById('invoiceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const vat = parseFloat(document.getElementById('vat').value);

    const total = (amount * (1 + vat / 100)).toFixed(2);

    alert(`Rechnung für ${name} (${address}) wird erstellt.\nGesamtbetrag (inkl. MwSt): ${total} €`);
  });