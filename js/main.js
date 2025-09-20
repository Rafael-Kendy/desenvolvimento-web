document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data
      initModal();
    });

  fetch("assets/footer.html")
    .then(res => res.text())
    .then(data => document.getElementById("footer").innerHTML = data);
});


function initModal(){
  const openModalBtn = document.querySelectorAll('[data-modal-target]')
  const closeModalBtn = document.querySelectorAll('[data-close]')
  const overlay = document.getElementById('overlay');
  
  openModalBtn.forEach(button=>{
    button.addEventListener('click', ()=>{
      const modal = document.querySelector(button.dataset.modalTarget)
      openModal(modal)
    })
  })
  
  closeModalBtn.forEach(button=>{
    button.addEventListener('click', ()=>{
      const modal = button.closest('.modal')
      closeModal(modal)
    })
  })
  
  function openModal(modal){
    if(modal==null) return
    modal.classList.add('active')
    overlay.classList.add('active')
  }
  
  function closeModal(modal){
    if(modal==null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
  }
}