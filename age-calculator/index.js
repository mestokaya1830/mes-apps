document.getElementById("btn").addEventListener("click", () => {
  const input = document.getElementById("age");
  const result = document.getElementById("result");
  const birthDate = new Date(input.value);
  const today = new Date();

  if (!input.value) {
    alert("Lütfen bir doğum tarihi giriniz.");
    return;
  }

  if (birthDate > today) {
    alert("Doğum tarihi bugünden büyük olamaz!");
    return;
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  result.innerText = `${years} Yıl - ${months} Ay - ${days} Gün`;
});
