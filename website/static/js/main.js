const swup = new Swup();

const navbarToggler = document.getElementsByClassName('navbar-toggler')
const navbarMenu = document.querySelector('.navbar-collapse')

document.addEventListener('swup:clickLink', event => {
  if (screen.width < 576 && navbarMenu.classList.contains('show')) {
    navbarToggler[0].click()
  }
});