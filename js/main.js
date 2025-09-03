document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/header.html")
    .then(res => res.text())
    .then(data => document.getElementById("header").innerHTML = data);

  fetch("assets/footer.html")
    .then(res => res.text())
    .then(data => document.getElementById("footer").innerHTML = data);
});